const debug = require('debug')('ridge:dao')
const path = require('path')
const fse = require('fs-extra')

/**
 * 数据库生成器类,这里封装了所有数据库获取相关操作，对于使用者通过数据库、数据集合接口屏蔽了具体数据库的差异性
 */
class DatabaseProducer {
  constructor (app) {
    this.DataBase = null
    this.dbOptions = {
      store: app.config.dbDataDir || path.resolve(app.config.bootPath, './data/database')
    }
    this.instances = {}
    this.instancesByFilePath = {}
  }

  /**
     * 挂载相关默认方法到koa app
     * @param {Object} app
     */
  async ready (app) {
    // 设置到默认数据库
    app.context.db = app.db = await this.getDb()

    // 实现获取db实例方法
    app.context.getDb = app.getDb = this.getDb.bind(this)

    // 获取数据库列表
    app.context.getDbs = app.getDbs = this.getDbs.bind(this)

    // 直接获取coll的方法
    app.context.getCollection = app.getCollection = this.getCollection.bind(this)

    fse.ensureDirSync(this.dbOptions.store)
    debug('DB Provider OK: ', this.dbOptions.store)
  }

  async setDatabaseImpl (DataBase, options) {
    this.DataBase = DataBase
    Object.assign(this.dbOptions, options)
  }

  /**
     * 获取指定路径下的数据库列表
     * @param {String} path 指定的路径位置
     * @returns
     */
  async getDbs (storePath) {
    if (storePath) {
      return this.DataBase.getDbs(storePath)
    } else {
      return Object.keys(this.instances)
    }
  }

  /**
     * 根据数据库名称或路径获取数据库实例，如不存在则自动创建
     * @param {String} name 数据库名称或路径 例如路径为/opt/dbname 下面每个coll会存到分别的文件   /opt/{db}.{coll}.db
     * @returns DataBase 数据库实例
     */
  async getDb (name = 'db') {
    const { DataBase } = this

    if (this.instances[name]) {
      return this.instances[name]
    } else if (this.instancesByFilePath[name]) {
      return this.instancesByFilePath[name]
    } else {
      const dbPath = this.getDbPathByName(name)

      this.instances[name] = new DataBase(dbPath, this.dbOptions)
      if (this.instances[name].connect) {
        await this.instances[name].connect()
      }
      this.instancesByFilePath[dbPath] = this.instances[name]
      return this.instances[name]
    }
  }

  /**
     * 判断数据库是否存在
     * @param {*} name
     */
  async dbExist (name = 'db') {
    const db = await this.getDb(name)

    if (await db.exist()) {
      return true
    } else {
      delete this.instances[name]
      return false
    }
  }

  async getDbInstance (dbInstance) {
    if (typeof dbInstance === 'string') {
      return this.getDb(dbInstance)
    } else {
      return dbInstance
    }
  }

  /**
     * 复制数据库集合表到另外一个文件位置
     * @param {DataBase|String} dbInstance 待复制的数据库实例
     * @param {String} destPath 数据库路径
     */
  async cloneDb (dbInstance, destPath, overwrite) {
    return (await this.getDbInstance(dbInstance)).clone(await this.getDbInstance(destPath), overwrite)
  }

  /**
     * 删除数据库
     * @param {DataBase|String} dbInstance 数据库实例或路径
     */
  async dropDb (dbInstance) {
    return (await this.getDbInstance(dbInstance)).drop()
  }

  /**
     * 导入数据库
     * @param {String} file 导入的文件路径
     * @param {DataBase|String} dbInstance 数据库实例或路径
     */
  async importDb (destPath, file, overwrite = true) {
    return (await this.getDbInstance(destPath)).import(file, overwrite)
  }

  /**
     * 导出数据库
     * @param {DataBase|String} dbInstance 数据库实例或路径
     * @returns 导出数据库，返回导出文件流
     */
  async exportDb (dbInstance) {
    return (await this.getDbInstance(dbInstance)).export()
  }

  getDbPathByName (name = 'db') {
    if (name.match(/^[a-z][a-z0-9]*$/)) {
      // 只传数据库名称，则按照配置路径放置
      return path.resolve(this.dbOptions.store, name)
    } else {
      // 认为名称就是数据库全路径
      return name
    }
  }

  /**
     * 关闭数据库
     * @param {*} name
     */
  async closeDb (name = 'db') {
    debug('Close DB:', name)
    if (this.instances[name]) {
      if (this.instances[name].close) {
        await this.instances[name].close()
      }
      this.instances[name] = null
    }
  }

  /**
     * 获取数据的的数据集
     * @param {string} dbname  数据库路径或名称
     * @param {string} collname  数据集名称
     * @param {Boolean} autoCreate 是否默认创建、默认为true
     **/
  async getCollection (dbname, collname, autoCreate = true) {
    if (dbname) {
      if (collname) {
        return (await this.getDb(dbname)).getCollection(collname, autoCreate)
      } else {
        return (await this.getDb()).getCollection(collname, autoCreate)
      }
    } else {
      throw new Error('db or collection name required')
    }
  }
}

module.exports = DatabaseProducer
