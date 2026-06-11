process.env.DEBUG = 'ridge:*'
process.env.NODE_TLS_REJECT_UNAUTHORIZED = 0
const config = require('./config.js')
const path = require('path')
const Boostrap = require('ridge-boot') // 启动器
const bootApp = new Boostrap({
  ...config,
  public: path.resolve(__dirname, '../../public')
})

bootApp.start()
