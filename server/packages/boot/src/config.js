const path = require('path')
const sessionConfig = require('./session')

// 全局默认配置， 所有模块都补充到这里，避免模块自己给默认值，以便统一管理

module.exports = {
  serverRootDir: path.resolve(__dirname, '../../../'),
  api: '/api',
  port: 7080,
  httpsPort: 8083,
  httpsKey: path.resolve(__dirname, './ssl/localhost.key'),
  httpsCert: path.resolve(__dirname, './ssl/localhost.crt'),
  proxy: {},
  // 启用CORS 默认启用
  cors: {
    credentials: true,
    origin: 'https://ridgeui.com/'
  },
  notfounds: [{
    test: ctx => {
      return ctx.path.startsWith('/avatar')
    },
    handle: async ctx => {
      ctx.redirect('/avatar.svg')
    }
  }], // 未找到配置

  rateLimit: { // 访问限额配置
    driver: 'memory',
    enabled: false,
    duration: 8 * 60 * 60 * 1000, // 8小时为单位
    whitelist: ctx => { // /api/user/current(获取当前用户)之外的其他api请求
      return !ctx.path.startsWith('/api') || ctx.path.startsWith('/api/user/current')
    },
    max: 200 // 单IP200次
  },
  session: sessionConfig,
  npmRegistry: 'https://registry.npmmirror.com', // NPM 镜像站, 因为官方经常无法连接，所以这里读取信息时，更多走这个站点
  npmDeliveryUrl: 'https://unpkg.com', // NPM 分发站地址, 下载npm包内文件使用
  npmAutoDelivery: false, // 当拉取npm文件本地不存在时，是否自动走 npmDeliveryUrl 进行拉取
  public: path.resolve(__dirname, '../../../public'), // 当前文件位于 node_modules/ridge-boot/src/之下，找到node_modules同一级public目录
  npmHomeDir: 'npm', // 安装npm包的目录,目录相对于public的路径
  fetchNpmOnEmpty: false, // 当npm文件未找到时，是否预加载
  packages: [] // 模块列表，按序启动
}
