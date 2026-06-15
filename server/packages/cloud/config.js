const path = require('path')
process.env.DEBUG = 'ridge:boot,ridge:user,ridge:store,ridge:npm'

module.exports = {
  port: 80,
  httpsPort: 443,
  public: path.resolve(__dirname, '../public'), // 静态资源目录：选择服务器目录同级的public
  bootPath: path.resolve(__dirname), // config文件所在路径， 为避免麻烦 后续存储都以此为基准
  userRepoDir: path.resolve(__dirname, '../data/user'), // 用户repo目录，存放用户上传应用数据
  dbDataDir: path.resolve(__dirname, '../data/database'), // cloud 用户、注册、发布等库数据
  cors: {
    credentials: true,
    origin: '*'
  },
  session: null,
  dev: true,
  rateLimit: { // 访问限额配置
    driver: 'memory',
    enabled: true,
    db: new Map(),
    duration: 8 * 60 * 60 * 1000, // 8小时为单位
    whitelist: ctx => { // /api/user/current(获取当前用户)之外的其他api请求
      return !ctx.path.startsWith('/api') || ctx.path.startsWith('/api/user/current')
    },
    max: 2000 // 单IP200次
  },
  packages: [
    require('ridge-http'), // 基础http服务
    require('ridge-dao'), // dao 接口模块
    require('ridge-nedb'), // 使用nedb进行数据模块
    // require('ridge-delivery'),
    // require('ridge-npm-service'), // npm 发布模块
    require('ridge-cloud-user'), // 用户管理 - Cloud
    require('ridge-app-share') // 用户管理 - Cloud
    // require('ridge-cloud-storage') // 用户存储管理 - Cloud
    // require('ridge-cloud-tools') // 转换服务
  ]
}
