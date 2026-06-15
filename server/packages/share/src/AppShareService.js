const path = require('path')
const fse = require('fs-extra')
const { BadRequestError, UnauthorizedError } = require('ridge-http')
const CodeRelationService = require('ridge-coder/src/CodeRelationService.js')

class AppShareService {
  constructor (app) {
    this.app = app
    this.router = app.router
    this.userService = app.services.userService
    this.config = app.config
    this.dbservice = app.dataBaseProducer

    // 初始化分享码集合：集合名 app_share_code
    this.coderService = new CodeRelationService(app, 'app_share_code')

    // ========== 可配置项 ==========
    // 应用包存储根目录
    this.fileRootDir = path.resolve(__dirname, '../../static/app-share-files')
    // 单文件最大限制 单位：byte (示例 50MB = 50 * 1024 * 1024)
    this.maxFileSize = 1 * 1024 * 1024
    // 分享码位数 & 有效期（1天，同之前规则）
    this.codeLen = 6
    this.codeExpireDay = 1

    // 初始化根目录
    fse.ensureDirSync(this.fileRootDir)
  }

  /**
   * 初始化所有路由
   */
  async initRoutes () {
    // 上传应用包 + 生成分享码（需登录）
    this.router.post('/app/share', this.uploadAndGenShareCode.bind(this))
    // 通过分享码获取/下载应用包（无需登录）
    this.router.get('/app/share/:inviteCode', this.getFileByShareCode.bind(this))
  }

  /**
   * 工具方法：根据当前时间生成 年/月/日 目录路径
   * @returns {string} 拼接后的目录绝对路径
   */
  getDateDirPath () {
    const now = new Date()
    const year = now.getFullYear()
    const month = String(now.getMonth() + 1).padStart(2, '0')
    const day = String(now.getDate()).padStart(2, '0')
    const dateDir = path.join(this.fileRootDir, `${year}/${month}/${day}`)
    // 确保目录存在
    fse.ensureDirSync(dateDir)
    return dateDir
  }

  /**
   * 工具方法：校验当前请求是否登录
   * @param {import('koa').Context} ctx
   * @returns {object} 登录用户信息
   */
  async checkLogin (ctx) {
    const sess = ctx.headers['x-ridge-cloud-sess'] || ctx.request.body.sess || ctx.query.sess
    const user = this.userService.getUserFromCache(sess)
    if (!user) {
      throw new UnauthorizedError('请先登录后再进行分享操作')
    }
    return user
  }

  /**
   * POST /app/share
   * 登录用户上传应用包，校验大小、保存文件、生成分享码
   * 接收：file 字段为文件流
   */
  async uploadAndGenShareCode (ctx) {
    // 1. 校验登录
    const loginUser = await this.checkLogin(ctx)

    // 2. 获取上传文件 (koa-multipart / koa-body 解析后文件对象)
    const file = ctx.request.files?.file || ctx.request.body?.file
    if (!file) {
      throw new BadRequestError('请上传应用包文件')
    }

    // 兼容不同中间件文件结构
    const { size, filepath, originalname } = file
    if (size > this.maxFileSize) {
      throw new BadRequestError(`文件过大，最大支持 ${(this.maxFileSize / 1024 / 1024).toFixed(0)}MB`)
    }

    // 3. 按年月日生成存储目录 & 目标文件路径
    const targetDir = this.getDateDirPath()
    // 文件名拼接：时间戳+原文件名，避免重名覆盖
    const saveFileName = `${Date.now()}_${originalname}`
    const targetFilePath = path.join(targetDir, saveFileName)

    // 4. 移动/写入文件（避免临时文件残留）
    await fse.move(filepath, targetFilePath, { overwrite: true })

    // 5. 生成分享码，绑定文件路径、上传用户信息
    const codeInfo = {
      filePath: targetFilePath,
      fileName: originalname,
      uploadMobile: loginUser.id,
      uploadTime: new Date()
    }
    const shareCode = await this.coderService.createCodeRelation(
      codeInfo,
      this.codeLen,
      this.codeExpireDay
    )

    // 6. 返回结果
    ctx.body = {
      code: 0,
      msg: '应用分享成功',
      data: {
        shareCode,
        fileName: originalname,
        expireDay: this.codeExpireDay
      }
    }
  }

  /**
   * GET /app/share/:inviteCode
   * 根据分享码获取并返回应用包，匿名可访问
   */
  async getFileByShareCode (ctx) {
    const { inviteCode } = ctx.params

    // 1. 查询分享码（自动校验是否过期）
    const codeRecord = await this.coderService.getCodeRelaction(inviteCode)
    if (!codeRecord) {
      throw new BadRequestError('分享码不存在或已过期')
    }

    const { filePath, fileName } = codeRecord.info

    // 2. 校验文件是否真实存在
    const isExist = await fse.pathExists(filePath)
    if (!isExist) {
      throw new BadRequestError('文件已丢失')
    }

    // 3. 设置响应头，浏览器触发下载
    ctx.set('Content-Disposition', `attachment; filename=${encodeURIComponent(fileName)}`)
    ctx.set('Content-Type', 'application/octet-stream')
    // 4. 返回文件流
    ctx.body = fse.createReadStream(filePath)
  }
}

module.exports = AppShareService
