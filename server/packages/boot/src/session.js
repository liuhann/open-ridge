const path = require('path')
const fse = require('fs-extra')
const map = new Map()

const sess_file = path.resolve(__dirname, 'session_storage.json')

const sessonConfig = {
  key: 'ridge.sess', /** (string) cookie key (default is koa.sess) */
  /** (number || 'session') maxAge in ms (default is 1 days) */
  /** 'session' will result in a cookie that expires when session/browser is closed */
  /** Warning: If a session cookie is stolen, this cookie will never expire */
  maxAge: 86400000,
  autoCommit: true, /** (boolean) automatically commit headers (default true) */
  overwrite: true, /** (boolean) can overwrite or not (default true) */
  httpOnly: true, /** (boolean) httpOnly or not (default true) */
  signed: false, /** (boolean) signed or not (default true) */
  rolling: false, /** (boolean) Force a session identifier cookie to be set on every response. The expiration is reset to the original maxAge, resetting the expiration countdown. (default is false) */
  renew: true, /** (boolean) renew session when session is nearly expired, so we can always keep user logged in. (default is false) */
  secure: false, /** (boolean) secure cookie */
  sameSite: null, /** (string) session cookie sameSite options (default null, don't set it) */
  store: {
    async get (key, maxAge, { rolling, ctx }) {
      console.log('session get', key)
      return map.get(key) || {}
    },

    async set (key, sess, maxAge, { rolling, changed, ctx }) {
      console.log('session set', key, sess)
      map.set(key, sess)
    },
    async destroy (key, { ctx }) {

    }
  },

  restore () {
    if (fse.existsSync(sess_file)) {
      const jsonRead = fse.readJSONSync(sess_file)
      for (const [key, value] of jsonRead) {
        map.set(key, value)
      }
    }
  },
  persistance () {
    // 将 Map 转换为数组，数组中的每个元素是一个包含 [key, value] 的子数组
    const mapToArray = Array.from(map)

    fse.writeJSONSync(sess_file, mapToArray)
  }
}

module.exports = sessonConfig
