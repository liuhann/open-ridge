const NeCollection = require('./ne_collection.js')
const glob = require('glob')
const fs = require('fs')
const tar = require('tar')
const path = require('path')
const debug = require('debug')('db:nedb')
const mkdirp = require('mkdirp')
const os = require('os')
const DB_EXT = 'db'
const promiseGlob = async (pattern, opts) => {
  return new Promise((resolve, reject) => {
    glob(pattern, opts, (er, files) => {
      if (er) {
        reject(er)
      } else {
        resolve(files)
      }
    })
  })
}

class NeDB {
  constructor (dbFilePath) {
    this.dbFilePath = dbFilePath
    this.collections = {}
  }

  /**
     * 获取指定路径下包含的数据库
     * @param {String} storePath 指定的数据库存储路径
     * @returns 数据库名称列表
     */
  static async getDbs (storePath) {
    if (!fs.existsSync(storePath)) {
      return null
    }
    if (!fs.statSync(storePath).isDirectory()) {
      return null
    }
    const collFiles = await promiseGlob(storePath + '/**/*.*.' + DB_EXT)

    const reg = new RegExp(storePath + '/(.*/[a-zA-Z0-9]+).([a-zA-Z0-9]+).' + DB_EXT)
    const regDirect = new RegExp(storePath + '/([a-zA-Z0-9]+).([a-zA-Z0-9]+).' + DB_EXT)

    const dbsNames = collFiles.map(filePath => {
      const matched = filePath.match(reg) || filePath.match(regDirect)

      if (matched) {
        return matched[1]
      } else {
        return null
      }
    }).filter(name => name)

    // 去重
    return Array.from(new Set(dbsNames))
  }

  /**
     * 判断指定的数据库是否存在
     * @param {*} dbPath 指定的数据库路径
     * @returns
     */
  static async checkExist (dbPath) {
    const collFiles = await promiseGlob(dbPath + '.*.' + DB_EXT)

    if (collFiles.length) {
      return true
    } else {
      return false
    }
  }

  async exist () {
    const collFiles = await promiseGlob(this.dbFilePath + '.*.' + DB_EXT)

    if (collFiles.length) {
      return true
    } else {
      return false
    }
  }

  /**
     * 按照名称获取所有coll
     * @override
     */
  async getCollections () {
    const collFiles = await promiseGlob(this.dbFilePath + '.*.' + DB_EXT)
    const collNames = collFiles.map(filePath => {
      const splited = filePath.split('.')

      return splited[splited.length - 2]
    })

    return collNames
  }

  /**
     * @override
     */
  getCollection (name, autoCreate = true) {
    if (!this.collections[name]) {
      if (fs.existsSync(`${this.dbFilePath}.${name}.` + DB_EXT) || autoCreate) {
        this.collections[name] = new NeCollection(`${this.dbFilePath}.${name}.` + DB_EXT)
      }
    }
    return this.collections[name]
  }

  async clone (targetDb, overwrite) {
    debug('Cloning DB:', this.dbFilePath, targetDb, overwrite)
    // const targetDb = new NeDB(destPath);
    if (await targetDb.exist()) {
      if (overwrite) {
        debug('TargetDB Exist overwrite/dropped')
        await targetDb.drop()
      } else {
        debug('TargetDB Exist No overwrite')
        return null
      }
    }

    const colls = await this.getCollections()
    const cloneResult = {}

    debug('Cloning collections', colls)
    for (const collName of colls) {
      const coll = this.getCollection(collName)
      const targetColl = await targetDb.getCollection(collName)

      const allDocuments = await coll.find({})

      for (const document of allDocuments) {
        await targetColl.insert(document)
      }
      cloneResult[collName] = allDocuments.length
    }
    return cloneResult
  }

  close () {
    this.collections = {}
  }

  /**
     * 导出数据库到一个文件流
     */
  async export () {
    const collNames = await this.getCollections()

    const exportFile = os.tmpdir() + '/db-exports-' + new Date().getTime() + '.gz.tar'

    const files = []

    for (const collName of collNames) {
      const coll = this.getCollection(collName)

      files.push(path.basename(coll.filename))
    }

    await tar.c({
      gzip: false,
      cwd: path.dirname(this.dbFilePath),
      file: exportFile
    }, files)

    return fs.createReadStream(exportFile)
  }

  /**
     * 从导出文件导入一个库
     * @param {*} tarFile 上传的导出资源包
     * @param {*} overwrite 是否覆盖
     * @returns
     */
  async import (tarFile, overwrite) {
    if (await this.exist()) {
      if (overwrite) {
        await this.drop()
      } else {
        return
      }
    }

    this.collections = {}

    await mkdirp(path.dirname(this.dbFilePath))

    await tar.x({
      file: tarFile,
      cwd: path.dirname(this.dbFilePath)
    })
  }

  /**
     * 删除数据库
     */
  async drop () {
    const collsNames = await this.getCollections()
    const result = {}

    for (const collName of collsNames) {
      const coll = await this.getCollection(collName)

      result[collName] = await coll.clean()
    }
    this.collections = {}
    return result
  }
}

module.exports = NeDB
