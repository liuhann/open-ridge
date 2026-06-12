const { BadRequestError, ConflictError, UnauthorizedError, ForBiddenError } = require('ridge-http')
const svgCaptcha = require('svg-captcha')
const path = require('path')
const debug = require('debug')('ridge:user')
const bootlog = require('debug')('ridge:boot')
const fse = require('fs-extra')
const fs = require('fs').promises
const crypto = require('crypto')

// 缓存替换为更专业的实现（如 Redis）
const captchaCache = new Map() // 存储验证码 { token: { code, expire } }
const userCache = new Map() // 存储用户会话 { sess: { user, expire } }
const USER_CACHE_FILE = path.join(__dirname, 'user_cache.json')

async function persitanceUserCache () {
  try {
    const now = Date.now()
    // 将 Map 转换为可序列化的对象
    const cacheData = Array.from(userCache.entries())
      .filter(([_, { expire }]) => expire > now)
      .map(([sess, { user, expire }]) => ({
        sess,
        user,
        expire
      }))
    bootlog(`Persisting ${cacheData.length} User Cache`)
    await fse.writeJSONSync(USER_CACHE_FILE, cacheData, {
      spaces: 2
    })

    // 写入 JSON 文件
    // await fs.writeFile(USER_CACHE_FILE, JSON.stringify(cacheData, null, 2))
    bootlog('Completed')
  } catch (error) {
    bootlog('Error persisting user cache:', error)
    throw error
  }
}

async function restoreUserCache () {
  bootlog('Restoring User Cache')
  try {
    const cacheData = await fse.readJSONSync(USER_CACHE_FILE)

    // 恢复 Map 数据
    cacheData.forEach(({ sess, user, expire }) => {
      userCache.set(sess, { user, expire })
    })

    bootlog(`Restored ${userCache.size} user sessions`)
  } catch (error) {
    if (error.code === 'ENOENT') {
      bootlog('User cache file not found, starting with empty cache')
    } else {
      bootlog('Error restoring user cache:', error)
    }
  }
}

// 生成随机 Token
function generateToken (length = 32) {
  return crypto.randomBytes(length).toString('hex')
}

function isPhoneNumber (phone) {
  const phoneRegex = /^1[3-9]\d{9}$/
  return phoneRegex.test(phone)
}
function getRemoteIp (req) {
  return req.headers['x-forwarded-for'] ||
    req.connection.remoteAddress ||
    req.socket.remoteAddress ||
    req.connection.socket.remoteAddress
}
function validatePassword (password) {
  // 正则表达式，匹配长度至少8位且同时包含字母和数字的字符串
  const regex = /^(?=.*[a-zA-Z])(?=.*\d).{8,}$/
  return regex.test(password)
}

class UserService {
  constructor (app) {
    this.app = app
    this.config = app.config
    this.dbservice = app.dataBaseProducer
    this.userRepoDir = this.app.config.userRepoDir || path.resolve(this.app.config.bootPath, './data/user')
    this.captchaExpire = 5 * 60 * 1000 // 验证码有效期5分钟
    this.sessionExpire = 30 * 24 * 60 * 60 * 1000 // 会话有效期30天
  }

  async initRoutes () {
    try {
      fse.ensureDir(this.userRepoDir)
    } catch (e) {
      console.error(e)
    }
    this.app.checkManage = ctx => {
      if (this.config.dev === true) {
        return true
      }
      const currentUser = this.getUserWithErrorThrown(ctx)

      if (currentUser.type !== 'admin') {
        throw new ForBiddenError('您无权限')
      }
      return true
    }

    this.app.router.get('/captcha', async (ctx, next) => {
      const captcha = svgCaptcha.create({
        charPreset: '23456789abcdefghjkmnpqrstuvwxyz'
      })

      const token = generateToken()
      captchaCache.set(token, {
        code: captcha.text,
        expire: Date.now() + this.captchaExpire
      })

      ctx.body = {
        token,
        svg: captcha.data
      }
      await next()
    })

    this.app.router.get('/user/current', async (ctx, next) => {
      const sess = ctx.query.sess
      const user = this.getUserFromCache(sess)
      ctx.body = {
        user
      }
      await next()
    })

    this.app.router.post('/user/register', async (ctx, next) => {
      const { token, captcha, ...user } = ctx.request.body
      user.ip = getRemoteIp(ctx.req)
      debug('register', user.name, user.ip)
      this.checkCaptcha(token, captcha)

      const result = await this.registerUser(user)
      const sess = this.createSession(user)

      ctx.body = { ...result, sess }
      await next()
    })

    this.app.router.post('/user/login', async (ctx, next) => {
      const { token, captcha, ...user } = ctx.request.body

      this.checkCaptcha(token, captcha)
      const result = await this.userLogin(user)
      const sess = this.createSession(result)

      ctx.body = { ...result, sess }
      await next()
    })

    this.app.router.post('/user/logout', async (ctx, next) => {
      userCache.delete(ctx.query.sess)
      ctx.body = {
        logout: true
      }
      await next()
    })

    this.app.router.post('/user/avatar/set', async (ctx, next) => {
      const user = this.getUserWithErrorThrown(ctx)
      const avatarFile = ctx.request.files.avatar
      if (!avatarFile) {
        throw new BadRequestError('头像文件未提供')
      }
      ctx.body = await this.setUserAvatar(user, avatarFile)
      await next()
    })

    this.app.router.post('/user/purchase/set', async (ctx, next) => {
      const user = this.getUserWithErrorThrown(ctx)
      ctx.body = await this.setUserPurchasement(user, ctx.request.body)
      await next()
    })

    this.app.router.post('/user/purchase/list', async (ctx, next) => {
      this.getUserWithErrorThrown(ctx)
      ctx.body = {
        id: ctx.query.id,
        skip: ctx.query.skip,
        limit: ctx.query.limit,
        purchases: await this.listPurchasements(ctx.query.id, ctx.query.skip, ctx.query.limit)
      }
      await next()
    })

    this.app.router.get('/user/purchase/get', async (ctx, next) => {
      this.getUserWithErrorThrown(ctx)
      ctx.body = await this.getUserPurchasement(ctx.query.id)
      await next()
    })

    // 确认用户支付信息
    this.app.router.post('/user/manage/confirm', async (ctx, next) => {
      this.getUserWithErrorThrown(ctx, 'admin')
      ctx.body = await this.confirmPurchase(ctx.request.body.id)
      await next()
    })

    this.app.router.post('/user/manage/update', async (ctx, next) => {
      if (this.app.operationToken !== ctx.query.token) {
        throw new ForBiddenError('禁止访问')
      }

      ctx.body = await this.updateUser(ctx.request.body)
      await next()
    })

    this.app.router.get('/user/manage/list', async (ctx, next) => {
      this.getUserWithErrorThrown(ctx, 'admin')
      ctx.body = {
        query: ctx.query,
        list: await this.getUserList(ctx.request.query)
      }
      await next()
    })
  }

  // 创建会话并返回 sess
  createSession (user) {
    const sess = generateToken()
    userCache.set(sess, {
      user,
      expire: Date.now() + this.sessionExpire
    })
    return sess
  }

  // 从缓存获取用户
  getUserFromCache (sess) {
    if (!sess) return null

    const cached = userCache.get(sess)
    if (!cached || cached.expire < Date.now()) {
      userCache.delete(sess)
      return null
    }

    return cached.user
  }

  checkCaptcha (token, captcha) {
    if (!token || !captcha) {
      throw new BadRequestError('验证码未提供')
    }

    const cached = captchaCache.get(token)
    if (!cached || cached.expire < Date.now()) {
      captchaCache.delete(token)
      throw new BadRequestError('验证码已过期')
    }

    if (cached.code !== captcha) {
      captchaCache.delete(token)
      throw new BadRequestError('验证码错误')
    }

    captchaCache.delete(token) // 验证后删除
  }

  // 获取用户，未找到则抛出异常、可以指定角色
  getUserWithErrorThrown (ctx, requireType) {
    const sess = ctx.query.token || ctx.headers['x-ridge-cloud-sess']
    const user = this.getUserFromCache(sess)

    if (!user) {
      throw new ForBiddenError('请登录完成后续操作')
    }

    if (requireType && user.type !== requireType) {
      throw new ForBiddenError('拒绝当前用户类型操作')
    }

    return user
  }

  // 获取当前用户信息
  getCurrentUser (ctx) {
    const sess = ctx.query.token || ctx.headers['x-ridge-cloud-sess']
    const user = this.getUserFromCache(sess)
    return user
  }

  /**
   * 根据查询条件查询用户
   * @param { id, skip, limit } query 查询条件
   * @returns
   */
  async getUserList (query) {
    const userColl = await this.getUserCollection()

    const userQuery = {}
    if (query.id) {
      userQuery.id = new RegExp(query.id)
    }
    return userColl.find(userQuery, {
      skip: query.skip || 0,
      limit: query.limit || 50
    })
  }

  /**
   * 管理员更新用户账号
   * @param {*} userObject
   * @returns
   */
  async updateUser (userObject) {
    const userColl = await this.getUserCollection()

    return userColl.update({
      id: userObject.id
    }, {
      $set: userObject
    })
  }

  /**
   * 用户注册
   * @param {*} user
   * @param {*} captcha 验证码
   * @returns
   */
  async registerUser (user) {
    const accountRegex = /^[A-Za-z0-9]{4,20}$/
    // 验证手机号码
    if (!accountRegex.test(user.id)) {
      return '注意：用户账号 4-20位数字+字母组合'
    }

    if (!validatePassword(user.password)) {
      throw new BadRequestError('密码至少8位且同时包含字母和数字')
    }
    const userColl = await this.getUserCollection()

    const one = await userColl.findOne({
      id: user.id
    })
    if (one) {
      throw new ConflictError('用户账号已经注册、请联系找回')
    }

    const userObject = {
      id: user.id,
      password: user.password,
      store: '1000', // TODO 存储区域：用户多了再分区
      type: user.type || 'free', // free|pay|advanced|admin
      confirmed: false, // 类型已确认
      registered: new Date()
    }

    if (userObject.type === 'free') {
      userObject.confirmed = true
    }
    const result = await userColl.insert(userObject)
    return { result }
  }

  async userLogin ({ id, password }) {
    const userColl = await this.getUserCollection()
    const one = await userColl.findOne({
      id,
      password
    })
    if (one) {
      const profile = await this.getUserProfile(id)
      return {
        id: one.id,
        store: one.store,
        type: one.type,
        confirmed: one.confirmed,
        profile,
        registered: one.registered
      }
    } else {
      throw new UnauthorizedError('用户名密码错误')
    }
  }

  // 获取用户的存储根目录
  async getUserStorage (user) {
    if (typeof user === 'string') {
      const userObject = await this.getUserById(user)
      if (userObject) {
        // return userObject.store
        return path.resolve(this.userRepoDir, userObject.store, user)
      } else {
        return null
      }
    } else if (user.store && user.id) {
      return path.resolve(this.userRepoDir, user.store, user.id)
    } else {
      return null
    }
  }

  /**
   * 获取用户的个人配置信息文件，未创建返回null
   * @param {*} userId
   * @returns
   */
  async getUserProfile (userId) {
    const profileCol = await this.getProfileCollection()
    const profileObject = await profileCol.findOne({
      userId
    })
    return profileObject || {}
  }

  // 根据手机号码获取用户对象
  async getUserById (mobile) {
    const userCol = await this.getUserCollection()

    const userObject = await userCol.findOne({
      id: mobile
    })
    return userObject
  }

  async setUserAvatar (user, avatar) {
    const profileCol = await this.getProfileCollection()

    const avatarId = user.id
    fse.ensureDirSync(path.resolve(this.config.public, 'avatar'))
    await fse.copyFileSync(avatar.filepath, path.resolve(this.config.public, 'avatar', avatarId + '.webp'))

    const avatarPath = `/avatar/${avatarId}.webp`

    const profileObject = await profileCol.findOne({
      userId: user.id
    })
    if (profileObject == null) {
      await profileCol.insert({
        userId: user.id,
        avatar: avatarId
      })
    } else {
      await profileCol.update({ userId: user.id }, {
        $set: {
          avatar: avatarPath
        }
      })
    }
    return {
      avatar
    }
  }

  // 获取当前用户购买信息
  async getUserPurchasement (id) {
    const purchaseColl = await this.getUserPurchaseCollection()

    return (await purchaseColl.findOne({
      id
    })) || {
    }
  }

  async listPurchasements (user, skip, limit) {
    const purchaseColl = await this.getUserPurchaseCollection()
    const userQuery = {}
    if (user) {
      userQuery.id = new RegExp('/' + user + '/')
    }
    const purchaseList = purchaseColl.find(userQuery, {
      skip: skip || 0,
      limit: limit || 50
    })

    return purchaseList
  }

  // 设置用户购买当前信息
  async setUserPurchasement (user, purchase) {
    const purchaseColl = await this.getUserPurchaseCollection()

    await purchaseColl.remove({
      id: user.id
    })

    return await purchaseColl.insert({
      id: user.id,
      type: purchase.type,
      code: purchase.code
    })
  }

  // 确认用户的购买信息
  async confirmPurchase (userId) {
    const userObject = await this.getUserById(userId)
    const purchaseColl = await this.getUserPurchaseCollection()

    const purchaseObject = await purchaseColl.findOne({
      id: userId
    })

    // 用户存在并且有购买对象
    if (userObject && purchaseObject) {
      const confirmColl = await this.getPurchageConfirmCollection()

      // 将购买进行确认
      await confirmColl.insert(Object.assign({}, purchaseObject, { _id: undefined }))
      const userCol = await this.getUserCollection()
      await userCol.update({
        id: userObject.id
      }, {
        $set: {
          confirmed: new Date(),
          expire: new Date((new Date().getTime() + 366 * 24 * 60 * 60 * 1000)), // 确认后一年
          type: purchaseObject.type
        }
      })

      await purchaseColl.remove({
        id: userId
      })
    } else {
      return {
        error: 'not-found'
      }
    }
  }

  async persitanceUserCache () {
    await persitanceUserCache()
  }

  async restoreUserCache () {
    await restoreUserCache()
  }

  // 获取用户库
  async getUserCollection () {
    const db = await this.dbservice.getDb('user')
    return db.getCollection('register')
  }

  // 获取用户付费期间库
  async getPurchageConfirmCollection () {
    const db = await this.dbservice.getDb('user')
    return db.getCollection('confirm')
  }

  // 获取用户购买提交信息库
  async getUserPurchaseCollection () {
    const db = await this.dbservice.getDb('user')
    return db.getCollection('purchase')
  }

  // 获取用户配置库
  async getProfileCollection () {
    const db = await this.dbservice.getDb('user')
    return db.getCollection('profile')
  }
}

module.exports = UserService
