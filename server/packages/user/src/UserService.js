const { BadRequestError, ConflictError, UnauthorizedError, ForBiddenError } = require('ridge-http')
const path = require('path')
const debug = require('debug')('ridge:user')
const bootlog = require('debug')('ridge:boot')
const fse = require('fs-extra')
const crypto = require('crypto')
const CodeRelationService = require('ridge-coder/src/CodeRelationService.js')

// 内存缓存：用户会话
const userCache = new Map() // { sess: { user, expire } }
const USER_CACHE_FILE = path.join(__dirname, 'user_cache.json')

// 密码哈希配置
const PASSWORD_SALT = 'ridge-user-salt-2026'
const PASSWORD_HASH_ALG = 'sha256'

// 邀请码全局配置
const INVITE_CODE_LEN = 6
const INVITE_CODE_EXPIRE_DAY = 1 // 固定有效期：1天
// 白名单：允许生成邀请码的特定手机号，自行修改
const ALLOW_GENERATE_MOBILE = new Set([
  '15011245191'
])

/**
 * 密码加密
 * @param {string} pwd 明文密码
 * @returns {string} 哈希密文
 */
function encryptPassword (pwd) {
  return crypto.createHmac(PASSWORD_HASH_ALG, PASSWORD_SALT)
    .update(pwd)
    .digest('hex')
}

/**
 * 校验密码强度：8位以上，包含字母 + 数字
 * @param {string} pwd
 */
function checkPasswordRule (pwd) {
  if (!pwd || pwd.length < 8) {
    throw new BadRequestError('密码长度至少8位')
  }
  const hasNum = /\d/.test(pwd)
  const hasLetter = /[a-zA-Z]/.test(pwd)
  if (!hasNum || !hasLetter) {
    throw new BadRequestError('密码必须同时包含字母和数字')
  }
}

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

class UserService {
  constructor (app) {
    this.app = app
    this.router = app.router
    this.config = app.config
    this.dbservice = app.dataBaseProducer
    // 初始化邀请码集合
    this.coderService = new CodeRelationService(app, 'invite_code')

    // 会话时效：30天免登
    this.sessionExpire = 30 * 24 * 60 * 60 * 1000

    // 恢复会话缓存
    restoreUserCache().catch(e => bootlog('Restore cache fail', e))

    // 定时持久化会话（5分钟）
    setInterval(() => {
      persitanceUserCache().catch(e => bootlog('Auto persist cache fail', e))
    }, 5 * 60 * 1000)
  }

  /**
   * 初始化所有路由
   */
  async initRoutes () {
    // 生成邀请码（仅白名单手机号可调用）
    this.router.post('/user/generate-invite', this.generateInviteCode.bind(this))
    // 注册（必须填写有效邀请码）
    this.router.post('/user/register', this.register.bind(this))
    // 登录
    this.router.post('/user/login', this.login.bind(this))
    // 登出
    this.router.post('/user/logout', this.logout.bind(this))
    // 获取当前用户
    this.router.get('/user/current', this.getCurrentUserInfo.bind(this))
  }

  /**
   * 生成6位邀请码接口
   * Body: mobile 调用者手机号
   * 限制：仅白名单手机号可生成，编码固定1天有效期
   */
  async generateInviteCode (ctx) {
    const { mobile, expire } = ctx.request.body

    // 手机号校验
    if (!mobile || !/^1[3-9]\d{9}$/.test(mobile)) {
      throw new BadRequestError('手机号格式不正确')
    }

    // 校验是否在白名单
    if (!ALLOW_GENERATE_MOBILE.has(mobile)) {
      throw new ForBiddenError('当前账号无权限生成邀请码')
    }

    // 生成6位邀请码，固定1天有效期，不绑定业务数据
    const inviteCode = await this.coderService.createCodeRelation(
      { creator: mobile },
      INVITE_CODE_LEN,
      expire || INVITE_CODE_EXPIRE_DAY
    )

    ctx.body = {
      code: 0,
      msg: '邀请码生成成功，有效期1天',
      inviteCode
    }
  }

  /**
   * 注册：mobile + password + inviteCode
   * 任意手机号均可使用有效邀请码注册
   */
  async register (ctx) {
    const { mobile, password, inviteCode } = ctx.request.body

    // 非空校验
    if (!mobile || !password || !inviteCode) {
      throw new BadRequestError('手机号、密码、邀请码不能为空')
    }

    // 手机号格式校验
    if (!/^1[3-9]\d{9}$/.test(mobile)) {
      throw new BadRequestError('手机号格式不正确')
    }

    // 校验邀请码（不存在/已过期直接拦截）
    const codeInfo = await this.coderService.getCodeRelaction(inviteCode)
    if (!codeInfo) {
      // throw new BadRequestError('邀请码不存在或已过期，请使用有效邀请码')
    }

    // 密码规则校验
    checkPasswordRule(password)

    // 校验账号是否已注册
    const userColl = await this.getUserCollection()
    const existUser = await userColl.findOne({ id: mobile })
    if (existUser) {
      throw new ConflictError('该手机号已注册，请直接登录')
    }

    // 密码加密入库
    const pwdHash = encryptPassword(password)
    const userInfo = {
      id: mobile,
      password: pwdHash,
      registerTime: new Date(),
      lastLoginTime: new Date(),
      useInviteCode: inviteCode
    }
    await userColl.insert(userInfo)

    // 创建会话
    const sess = this.createSession(userInfo)

    ctx.body = {
      code: 0,
      msg: '注册成功',
      sess,
      user: {
        id: mobile,
        registerTime: userInfo.registerTime,
        lastLoginTime: userInfo.lastLoginTime,
        useInviteCode: inviteCode
      }
    }
  }

  /**
   * 登录
   */
  async login (ctx) {
    const { mobile, password } = ctx.request.body

    if (!mobile || !password) {
      throw new BadRequestError('手机号和密码不能为空')
    }
    if (!/^1[3-9]\d{9}$/.test(mobile)) {
      throw new BadRequestError('手机号格式不正确')
    }

    const userColl = await this.getUserCollection()
    const userInfo = await userColl.findOne({ id: mobile })
    if (!userInfo) {
      throw new UnauthorizedError('该手机号未注册，请先完成注册')
    }

    const inputHash = encryptPassword(password)
    if (inputHash !== userInfo.password) {
      throw new UnauthorizedError('手机号或密码错误')
    }

    // 更新最后登录时间
    await userColl.updateOne(
      { id: mobile },
      { $set: { lastLoginTime: new Date() } }
    )
    userInfo.lastLoginTime = new Date()

    const sess = this.createSession(userInfo)
    ctx.body = {
      code: 0,
      msg: '登录成功',
      sess,
      user: {
        id: mobile,
        registerTime: userInfo.registerTime,
        lastLoginTime: userInfo.lastLoginTime
      }
    }
  }

  /**
   * 登出
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
   */
  async getCurrentUserInfo (ctx) {
    const sess = ctx.query.sess || ctx.headers['x-ridge-cloud-sess']
    const user = this.getUserFromCache(sess)
    const resUser = user
      ? {
          id: user.id,
          registerTime: user.registerTime,
          lastLoginTime: user.lastLoginTime,
          useInviteCode: user.useInviteCode
        }
      : null

    ctx.body = {
      code: 0,
      user: resUser
    }
  }

  createSession (user) {
    const sess = generateToken()
    userCache.set(sess, {
      user,
      expire: Date.now() + this.sessionExpire
    })
    return sess
  }

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

  async getUserById (mobile) {
    const userColl = await this.getUserCollection()
    return userColl.findOne({ id: mobile })
  }

  async getUserCollection () {
    const db = await this.dbservice.getDb('user')
    return db.getCollection('register')
  }
}

module.exports = UserService
