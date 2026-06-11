process.env.DEBUG = 'ridge:*'
process.env.NODE_TLS_REJECT_UNAUTHORIZED = 0
const config = require('./config.js')
const Boostrap = require('ridge-boot') // 启动器
const bootApp = new Boostrap({
  // 组件包请按次序放置，一些依赖是要求次序的
  ...config,
  dev: false,
  httpsKey: '/opt/cert/ridgeui.com.key',
  httpsCert: '/opt/cert/ridgeui.com_public.crt'
})

bootApp.start()
