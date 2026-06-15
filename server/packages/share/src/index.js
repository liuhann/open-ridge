const AppShareService = require('./AppShareService.js')
const name = require('../package.json').name
const version = require('../package.json').version
const description = require('../package.json').description

module.exports = {
  name,
  description,
  version,

  async ready (app) {
    app.services.appShareService = new AppShareService(app)
    await app.services.appShareService.initRoutes()
  },

  async bootComplete (app) {
  },

  async shutdown (app) {
  }
}
