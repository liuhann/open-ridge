/**
 * 实现database相关Rest接口服务
 */
module.exports = class DBRestify {
  constructor (provider, prefix) {
    this.provider = provider
    this.prefix = prefix
  }

  async initRoute (app) {
    const { router, logger } = app

    this.logger = logger

    // 获取数据库列表
    router.get(this.prefix + '/:path+', async (ctx, next) => {
      ctx.app.checkManage(ctx)
      await next()
    })

    // 获取数据库下的coll列表
    router.get(this.prefix + '/db/:dbname/collections', async (ctx, next) => {
      const dbname = ctx.params.dbname

      ctx.body = await this.getCollections(dbname)
      await next()
    })

    // 获取coll下文档列表
    router.get(this.prefix + '/documents/:dbName/:collName', async (ctx, next) => {
      const { dbName, collName } = ctx.params
      const query = ctx.request.query

      ctx.body = await this.getCollectionDocs(dbName, collName, query)
      await next()
    })

    // 删除文档
    router.delete(this.prefix + '/document/:dbName/:collName/:id', async (ctx, next) => {
      const { dbName, collName, id } = ctx.params

      ctx.body = {
        removed: await this.removeCollectionDoc(dbName, collName, id)
      }
    })

    // 删除数据库
    router.delete(this.prefix + '/dbs/:dbPath+', async (ctx, next) => {
      const { dbPath } = ctx.params

      await this.provider.dropDb(this.store + '/' + dbPath)
      ctx.body = {
        completed: true
      }
      await next()
    })

    // 导出数据库
    router.post(this.prefix + '/dbs/export', async (ctx, next) => {
      const dbPath = ctx.query.path

      ctx.type = 'tar'
      ctx.attachment('db-export.tar')
      ctx.body = await this.provider.exportDb(this.store + '/' + dbPath)
      await next()
    })

    // 导入数据库
    router.post(this.prefix + '/dbs/import', async (ctx, next) => {
      const { path, overwrite } = ctx.query
      const { file } = ctx.request.files

      await this.provider.importDb(this.store + '/' + path, file.path, overwrite)

      ctx.body = {
        completed: true
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
    const db = await this.provider.getDb(dbName)
    const coll = await db.getCollection(collName, false)
    return coll
  }

  async getCollectionDocs (dbPath, collName, options) {
    const db = await this.provider.getDb(dbPath)
    const coll = await db.getCollection(collName, false)

    const query = options

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
      return coll.find(query, opts)
    } else {
      return []
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
