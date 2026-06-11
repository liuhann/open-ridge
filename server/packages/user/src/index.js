const UserService = require('./UserService.js')
const name = require('../package.json').name
const version = require('../package.json').version
const description = require('../package.json').description

module.exports = {
  name,
  description,
  version,

  async ready (app) {
    app.services.userService = new UserService(app)
    await app.services.userService.initRoutes()
    await app.services.userService.restoreUserCache()
  },

  async bootComplete (app) {
  },

  async shutdown (app) {
    app.services.userService.persitanceUserCache()
  }
}
