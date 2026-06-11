const NodeCache = require('node-cache')
const fs = require('fs')
const name = require('../package.json').name
const version = require('../package.json').version
const description = require('../package.json').description

module.exports = {
  name,
  version,
  description,

  async created (app) {
    app.cacheRules = []
    app.services.nodeCache = new NodeCache(Object.assign({
      stdTTL: 0,
      checkperiod: 600,
      deleteOnExpire: true,
      useClones: false,
      enableLegacyCallbacks: false,
      maxKeys: -1
    }, app.config.cache))

    app.services.nodeCache.set('test', 'Cache Test')
  },

  // 模块路由注册，对外提供API可在此写api相关地址
  async ready (app) {
    app.use(async (ctx, next) => {
      let matchRule = null

      for (const rule of app.cacheRules) {
        if (rule.match(ctx)) {
          matchRule = rule
          break
        }
      }

      if (matchRule) {
        const key = await matchRule.getCacheKey(ctx)
        const cacheResult = app.services.nodeCache.get(key)

        if (cacheResult) {
          ctx.body = cacheResult
        } else {
          await next()
          app.services.nodeCache.set(key, ctx.body)
        }
      } else {
        await next()
      }
    })
  },

  // 启动收尾工作，可以在此执行建库、建索引等一些全局的具体业务操作
  async bootComplete (app) {
    if (app.config.loadCache === true) {
      const storeRoot = app.config.basicStoreRoot || './'
      const storeFile = storeRoot + '/node-cache-restart.json'

      try {
        if (fs.existsSync(storeFile) && fs.readFileSync) {
          const content = fs.readFileSync(storeFile)
          const persistanceObject = JSON.parse(content)

          for (const key of Object.keys(persistanceObject)) {
            app.services.nodeCache.set(key, persistanceObject[key])
          }
        }
      } catch (e) {
        // 恢复失败 忽略
      }
    }
  },

  shutdown (app) {
    const keys = app.services.nodeCache.keys()
    const nodeCachePersistanceKeys = app.config.cache ? app.config.cache.persistanceKeys : ''
    const persistanceObject = {}

    for (const key of keys) {
      if (key.match(nodeCachePersistanceKeys)) {
        persistanceObject[key] = app.services.nodeCache.get(key)
      }
    }
    const storeRoot = app.config.basicStoreRoot || './'
    const storeFile = storeRoot + '/node-cache-restart.json'

    if (fs.existsSync(storeFile) && fs.writeFileSync) {
      fs.writeFileSync(storeFile, JSON.stringify(persistanceObject))
    }
  }
}
