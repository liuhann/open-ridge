const packageInfo = require('../package.json')
const Producer = require('./producer')
const Collection = require('./collection')
const DBRestify = require('./rest')
const DataBase = require('./database')

module.exports = {
  name: packageInfo.name,
  version: packageInfo.version,
  description: packageInfo.description,
  Collection,
  DataBase,
  Producer,
  DBRestify,
  // 模块初始化动作，对于核心模块可以进行koa相关插件注册
  // 业务模块可以进行服务创建
  async created (app) {
    app.dataBaseProducer = new Producer(app)

    app.dbProvider = app.dataBaseProducer
  },

  // 模块路由注册，对外提供API可在此写api相关地址
  async ready (app) {
    await app.dbProvider.ready(app)

    app.dbRestfy = new DBRestify(app.dbProvider, '/nedb')
    app.dbRestfy.initRoute(app)
  },

  // 启动收尾工作，可以在此执行建库、建索引等一些全局的具体业务操作
  async bootComplete (app) { }
}
