const { BadRequestError, ConflictError, UnauthorizedError, ForBiddenError } = require('ridge-http')
const svgCaptcha = require('svg-captcha')
const path = require('path')
const debug = require('debug')('ridge:user')
const bootlog = require('debug')('ridge:boot')
const fse = require('fs-extra')
const crypto = require('crypto')

// 内存缓存：图形验证码、用户会话
const captchaCache = new Map() // { token: { code, expire, ip } }
const userCache = new Map() // { sess: { user, expire } }
const USER_CACHE_FILE = path.join(__dirname, 'user_cache.json')

/**
 * 持久化用户会话缓存到JSON文件
 */
async function persitanceUserCache () {
  try {
    const now = Date.now()
    const cacheData = Array.from(userCache.entries())
      .filter(([_, { expire }]) => expire > now)
      .map(([sess, { user, expire }]) => ({ sess, user, expire }))

    bootlog(`Persisting ${cacheData.length} User Cache`)
    fse.writeJSONSync(USER_CACHE_FILE, cacheData, { spaces: 2 })
    bootlog('User cache persisted completed')
  } catch (error) {
    bootlog('Error persisting user cache:', error)
    throw error
  }
}

/**
 * 从JSON文件恢复会话缓存
 */
async function restoreUserCache () {
  bootlog('Restoring User Cache')
  try {
    const cacheData = fse.readJSONSync(USER_CACHE_FILE)
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

/**
 * 生成随机Token / SessionId
 * @param {number} length 长度
 * @returns {string}
 */
function generateToken (length = 32) {
  return crypto.randomBytes(length).toString('hex')
}

/**
 * 获取客户端真实IP
 * @param {import('koa').Request} req
 * @returns {string}
 */
function getRemoteIp (req) {
  return req.headers['x-forwarded-for'] ||
    req.connection.remoteAddress ||
    req.socket.remoteAddress ||
    req.connection.socket.remoteAddress
}

/**
 * 简单数字验证码（模拟短信接口，可替换为真实短信SDK）
 * @param {string} mobile 手机号
 * @returns {string} 6位验证码
 */
function createSmsCode (mobile) {
  // 正式环境替换为 阿里云/腾讯云短信SDK 发送逻辑
  const code = Math.floor(100000 + Math.random() * 900000).toString()
  debug(`[模拟短信] 手机号:${mobile}, 验证码:${code}`)
  return code
}

class UserService {
  constructor (app) {
    this.app = app
    this.router = app.router // Koa-Router 实例
    this.config = app.config
    this.dbservice = app.dataBaseProducer

    // 时效配置
    this.captchaExpire = 5 * 60 * 1000 // 图形验证码 5分钟
    this.smsExpire = 5 * 60 * 1000 // 短信验证码 5分钟
    this.sessionExpire = 30 * 24 * 60 * 60 * 1000 // 会话 30天免登

    // 短信验证码临时缓存
    this.smsCache = new Map() // { mobile: { code, expire } }

    // 服务启动恢复会话缓存
    restoreUserCache().catch(e => bootlog('Restore cache fail', e))

    // 定时持久化会话（5分钟一次）
    setInterval(() => {
      persitanceUserCache().catch(e => bootlog('Auto persist cache fail', e))
    }, 5 * 60 * 1000)
  }

  /**
   * 初始化所有路由
   */
  async initRoutes () {
    // 1. 获取图形验证码
    this.router.get('/captcha', this.getCaptcha.bind(this))

    // 2. 发送短信验证码（前置校验图形验证码）
    this.router.get('/user/send/sms', this.sendSmsCode.bind(this))

    // 3. 手机号+短信码 注册
    this.router.post('/user/register', this.register.bind(this))

    // 4. 手机号+短信码 登录
    this.router.post('/user/login', this.login.bind(this))

    // 5. 登出
    this.router.post('/user/logout', this.logout.bind(this))

    // 6. 获取当前登录用户
    this.router.get('/user/current', this.getCurrentUserInfo.bind(this))
  }

  /**
   * 获取图形验证码
   */
  async getCaptcha (ctx) {
    const ip = getRemoteIp(ctx.req)
    const captcha = svgCaptcha.create({
      charPreset: '23456789abcdefghjkmnpqrstuvwxyz',
      size: 4,
      noise: 2
    })

    const token = generateToken()
    captchaCache.set(token, {
      code: captcha.text.toLowerCase(),
      expire: Date.now() + this.captchaExpire,
      ip
    })

    ctx.type = 'image/svg+xml'
    ctx.body = {
      token,
      svg: captcha.data
    }
  }

  /**
   * 校验图形验证码
   * @param {string} token
   * @param {string} code
   * @param {string} clientIp
   */
  checkCaptcha (token, code, clientIp) {
    if (!token || !code) {
      throw new BadRequestError('图形验证码不能为空')
    }
    const cache = captchaCache.get(token)
    const now = Date.now()

    if (!cache) {
      throw new BadRequestError('验证码已失效，请重新获取')
    }
    if (cache.expire < now) {
      captchaCache.delete(token)
      throw new BadRequestError('验证码已过期，请重新获取')
    }
    // 简单IP校验，防跨站使用验证码
    if (cache.ip !== clientIp) {
      throw new ForBiddenError('验证码校验异常')
    }
    if (cache.code !== code.toLowerCase()) {
      captchaCache.delete(token)
      throw new BadRequestError('图形验证码错误')
    }
    // 校验通过立即删除，防止重复利用
    captchaCache.delete(token)
  }

  /**
   * 发送短信验证码（必须先过图形验证码）
   * Query: token, captcha, mobile
   */
  async sendSmsCode (ctx) {
    const { token, captcha, mobile } = ctx.query
    const clientIp = getRemoteIp(ctx.req)

    // 1. 校验手机号格式
    if (!/^1[3-9]\d{9}$/.test(mobile)) {
      throw new BadRequestError('手机号格式不正确')
    }

    // 2. 校验图形验证码
    this.checkCaptcha(token, captcha, clientIp)

    // 3. 限制频率：60秒内同一手机号只能发一次
    const smsItem = this.smsCache.get(mobile)
    const now = Date.now()
    if (smsItem && smsItem.expire > now - 60 * 1000) {
      throw new BadRequestError('发送过于频繁，请稍后再试')
    }

    // 4. 生成&缓存短信验证码
    const smsCode = createSmsCode(mobile)
    this.smsCache.set(mobile, {
      code: smsCode,
      expire: now + this.smsExpire
    })

    ctx.body = {
      code: 0,
      msg: '短信验证码发送成功'
    }
  }

  /**
   * 用户注册：mobile + smsCode
   * Body: mobile, smsCode
   */
  async register (ctx) {
    const { mobile, smsCode } = ctx.request.body
    const now = Date.now()

    // 基础校验
    if (!mobile || !smsCode) {
      throw new BadRequestError('手机号和短信验证码不能为空')
    }
    if (!/^1[3-9]\d{9}$/.test(mobile)) {
      throw new BadRequestError('手机号格式不正确')
    }

    // 校验短信验证码
    const smsItem = this.smsCache.get(mobile)
    if (!smsItem || smsItem.expire < now || smsItem.code !== smsCode) {
      throw new BadRequestError('短信验证码错误或已过期')
    }

    // 校验账号是否已存在
    const userColl = await this.getUserCollection()
    const existUser = await userColl.findOne({ id: mobile })
    if (existUser) {
      throw new ConflictError('该手机号已注册，请直接登录')
    }

    // 写入文档库
    const userInfo = {
      id: mobile,
      registerTime: new Date(),
      lastLoginTime: new Date()
    }
    await userColl.insert(userInfo)

    // 创建会话，实现30天免登
    const sess = this.createSession(userInfo)
    // 注册成功后销毁当前短信验证码
    this.smsCache.delete(mobile)

    ctx.body = {
      code: 0,
      msg: '注册成功',
      sess,
      user: userInfo
    }
  }

  /**
   * 用户登录：mobile + smsCode
   * Body: mobile, smsCode
   */
  async login (ctx) {
    const { mobile, smsCode } = ctx.request.body
    const now = Date.now()

    // 基础校验
    if (!mobile || !smsCode) {
      throw new BadRequestError('手机号和短信验证码不能为空')
    }
    if (!/^1[3-9]\d{9}$/.test(mobile)) {
      throw new BadRequestError('手机号格式不正确')
    }

    // 校验短信验证码
    const smsItem = this.smsCache.get(mobile)
    if (!smsItem || smsItem.expire < now || smsItem.code !== smsCode) {
      throw new BadRequestError('短信验证码错误或已过期')
    }

    // 查询用户
    const userColl = await this.getUserCollection()
    const userInfo = await userColl.findOne({ id: mobile })
    if (!userInfo) {
      throw new UnauthorizedError('该手机号未注册，请先完成注册')
    }

    // 更新最后登录时间
    await userColl.updateOne(
      { id: mobile },
      { $set: { lastLoginTime: new Date() } }
    )

    // 创建会话
    const sess = this.createSession(userInfo)
    // 销毁短信验证码
    this.smsCache.delete(mobile)

    ctx.body = {
      code: 0,
      msg: '登录成功',
      sess,
      user: userInfo
    }
  }

  /**
   * 登出：销毁当前会话
   * Header: x-ridge-cloud-sess 或 Body: sess
   */
  async logout (ctx) {
    const sess = ctx.headers['x-ridge-cloud-sess'] || ctx.request.body.sess
    if (sess) {
      userCache.delete(sess)
    }
    ctx.body = {
      code: 0,
      msg: '登出成功',
      logout: true
    }
  }

  /**
   * 获取当前登录用户
   * Header: x-ridge-cloud-sess  / Query: sess
   */
  async getCurrentUserInfo (ctx) {
    const sess = ctx.query.sess || ctx.headers['x-ridge-cloud-sess']
    const user = this.getUserFromCache(sess)
    ctx.body = {
      code: 0,
      user
    }
  }

  /**
   * 创建会话 Session（30天有效期）
   * @param {object} user 用户信息
   * @returns {string} sess
   */
  createSession (user) {
    const sess = generateToken()
    userCache.set(sess, {
      user,
      expire: Date.now() + this.sessionExpire
    })
    return sess
  }

  /**
   * 从缓存获取登录用户，过期自动清理
   * @param {string} sess
   * @returns {object|null}
   */
  getUserFromCache (sess) {
    if (!sess) return null
    const cacheItem = userCache.get(sess)
    const now = Date.now()

    if (!cacheItem || cacheItem.expire < now) {
      userCache.delete(sess)
      return null
    }
    return cacheItem.user
  }

  /**
   * 根据手机号查询用户（内部工具方法）
   * @param {string} mobile
   * @returns {object|null}
   */
  async getUserById (mobile) {
    const userColl = await this.getUserCollection()
    return userColl.findOne({ id: mobile })
  }

  /**
   * 获取用户集合（文档库）
   * @returns {object} collection
   */
  async getUserCollection () {
    const db = await this.dbservice.getDb('user')
    return db.getCollection('register')
  }
}

module.exports = UserService
