const fsp = require('fs').promises
const os = require('os')
const path = require('path')

/**
 * 实现database相关Rest接口服务
 */
module.exports = class DBRestify {
  constructor (provider, prefix) {
    this.provider = provider
    this.prefix = prefix
  }

  async initRoute (app) {
    this.rootPath = path.resolve(app.config.dbDataDir, '../')
    const { router, logger } = app
    this.logger = logger

    router.get(this.prefix + '/list', async (ctx, next) => {
      await ctx.app.checkManage()
      await this.handleBackUpList(ctx)
      await next()
    })

    // 获取coll下文档列表
    router.get(this.prefix + '/documents', async (ctx, next) => {
      await ctx.app.checkManage()
      const query = ctx.request.query
      const { dbPath, collName } = query
      const dbQuery = Object.assign({}, query)
      delete dbQuery.dbPath
      delete dbQuery.collName
      ctx.body = await this.getCollectionDocs(dbPath, collName, dbQuery)
      await next()
    })

    router.post(this.prefix + '/document', async (ctx, next) => {
      await ctx.app.checkManage()
      const { dbPath, collName } = ctx.request.query
      const body = ctx.request.body

      ctx.body = await this.updateCollectionDoc(dbPath, collName, body)
      await next()
    })

    // 删除文档
    router.delete(this.prefix + '/document', async (ctx, next) => {
      await ctx.app.checkManage()
      const query = ctx.request.query
      const { dbPath, collName, id } = query

      ctx.body = {
        removed: await this.removeCollectionDoc(dbPath, collName, id)
      }
      await next()
    })

    // 增加文档
    router.put(this.prefix + '/documents/:dbPath+/:collName', async (ctx, next) => {
      const { dbPath, collName } = ctx.params
      const document = ctx.request.body

      ctx.body = await this.insertDoc(this.store + '/' + dbPath, collName, document)
      await next()
    })
  }

  async getCollections (dbName) {
    const db = await this.provider.getDb(dbName)

    return db.getCollections()
  }

  async getCollection (dbName, collName) {
    const db = await this.provider.getDb(path.resolve(this.rootPath, dbName))
    const coll = await db.getCollection(collName, false)
    return coll
  }

  async getCollectionDocs (dbPath, collName, options) {
    const db = await this.provider.getDb(path.resolve(this.rootPath, dbPath))
    const coll = await db.getCollection(collName, false)

    const query = options

    const result = {
      list: [],
      total: 0,
      query: Object.assign({}, query)
    }
    const opts = {}

    if (query.skip) {
      opts.skip = query.skip
      delete query.skip
    }

    if (query.limit) {
      opts.limit = query.limit
      delete query.limit
    }

    if (coll) {
      result.list = await coll.find(query, opts)
      result.total = await coll.count(query)
    }
    return result
  }

  async updateCollectionDoc (dbPath, collName, doc) {
    const db = await this.provider.getDb(path.resolve(this.rootPath, dbPath))
    const coll = await db.getCollection(collName, false)
    return await coll.update({ _id: doc._id }, doc)
  }

  async handleBackUpList (ctx) {
    const resolvedPath = ctx.query.dir || ''
    const finalPath = path.resolve(this.rootPath, resolvedPath)
    try {
      // 读取目录内容
      const entries = await fsp.readdir(finalPath, { withFileTypes: true })

      // 获取每个文件的详细信息
      const files = await Promise.all(entries.map(async entry => {
        const entryPath = path.join(finalPath, entry.name)
        const stat = await fsp.stat(entryPath)

        // 获取文件所有者信息（在POSIX系统上）
        let owner = 'unknown'
        try {
          if (process.platform !== 'win32') {
            const userInfo = await os.userInfo()
            owner = userInfo.username
          }
        } catch (err) {
          // console.error('获取文件所有者失败:', err);
        }

        return {
          name: entry.name,
          isDirectory: entry.isDirectory(),
          size: entry.isFile() ? stat.size : 0,
          modifiedAt: stat.mtime.toISOString(),
          owner
        }
      }))

      ctx.body = { files }
    } catch (err) {
      console.error('handleBackUpList', err)
      ctx.status = 500
      ctx.body = { error: '读取目录失败' }
    }
  }

  async removeCollectionDoc (dbName, collName, id) {
    const coll = await this.getCollection(dbName, collName)

    return coll.remove(id)
  }

  async cloneDb (dbPathFrom, dbPathTo, overwrite) {
    const db = await this.provider.getDb(dbPathFrom)

    return db.clone(dbPathTo, overwrite)
  }

  async insertDoc (dbPath, collName, docJson) {
    const db = await this.provider.getDb(dbPath)

    const col = await db.getCollection(collName)

    const result = await col.insert(docJson)

    return result
  }
}
