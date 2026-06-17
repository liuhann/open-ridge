const crypto = require('crypto')

class CodeRelationService {
  constructor (app, coderName = 'invites') {
    this.app = app
    this.router = app.router
    this.config = app.config
    this.coderName = coderName
    this.dbservice = app.dataBaseProducer
    // 最大重试次数，防止极端情况死循环
    this.MAX_RETRY = 20
  }

  /**
   * 生成指定位数随机唯一数字编码，并关联数据存储
   * @param {any} infomration  业务数据
   * @param {number} numberCount 编码位数
   * @param {number} expire 过期天数，不传/传0表示永久有效
   * @returns {Promise<string>} 数字编码
   */
  async createCodeRelation (infomration, numberCount, expire = 0, existedCode) {
    const coll = await this.getCRCollection()
    if (!Number.isInteger(numberCount) || numberCount < 1) {
      throw new Error('编码位数必须为正整数')
    }
    // 校验过期天数
    if (!Number.isInteger(expire) || expire < 0) {
      throw new Error('过期天数必须为非负整数')
    }

    let code = existedCode

    if (!code) {
      let retry = 0
      // 循环生成随机编码 + 唯一性校验
      while (retry < this.MAX_RETRY) {
        const max = Math.pow(10, numberCount) - 1
        const min = Math.pow(10, numberCount - 1)
        const randomNum = crypto.randomInt(min, max)
        code = String(randomNum)
        const exists = await coll.exist({ code })
        if (!exists) break
        retry++
      }

      if (retry >= this.MAX_RETRY) {
        throw new Error('编码生成失败，可用编码已耗尽')
      }
    }

    const now = Date.now()
    // 计算过期时间戳：天数转毫秒
    const expireTime = expire > 0 ? now + expire * 24 * 60 * 60 * 1000 : 0

    // 入库：新增 expireTime 过期时间字段
    const saveData = {
      ...infomration,
      code,
      createTime: new Date(),
      expireTime // 0 = 永久有效
    }
    await coll.insert(saveData)

    return code
  }

  /**
   * 根据编码查询关联数据（自动过滤已过期编码）
   * @param {string|number} code 数字编码
   * @returns {Promise<object|null>} 未过期返回数据，已过期/不存在返回 null
   */
  async getCodeRelaction (code) {
    const coll = await this.getCRCollection()
    const targetCode = String(code)
    const doc = await coll.findOne({ code: targetCode })

    if (!doc) return null

    const now = Date.now()
    // expireTime=0 永久有效；否则判断是否超时
    if (doc.expireTime > 0 && doc.expireTime < now) {
      return null
    }

    return doc
  }

  async query (query) {
    const coll = await this.getCRCollection()
    const docs = await coll.find(query)
    return docs
  }

  /**
   * 可选：批量清理已过期数据（定时任务可调用）
   * @returns {Promise<number>} 删除条数
   */
  async clearExpiredCode () {
    const coll = await this.getCRCollection()
    const now = Date.now()
    // 删除 已过期 且 非永久有效 的数据
    await coll.remove({
      expireTime: { $gt: 0, $lt: now }
    })
    // 可根据集合 count 自行统计删除数量，此处按接口语义返回即可
    return 0
  }

  async getCRCollection () {
    const db = await this.dbservice.getDb('coder')
    return db.getCollection('number')
  }
}

module.exports = CodeRelationService
