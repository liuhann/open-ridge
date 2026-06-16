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

    this.coderService = new CodeRelationService(app, 'app_share_code')

    // 配置项
    this.fileRootDir = path.resolve(__dirname, '../../static/app-share-files')
    this.maxFileSize = 1 * 1024 * 1024
    this.codeLen = 6
    this.codeExpireDay = 1

    fse.ensureDirSync(this.fileRootDir)
  }

  async initRoutes () {
    this.router.post('/app/share', this.uploadAndGenShareCode.bind(this))
    this.router.post('/app/share/cover', this.coverUploadShare.bind(this))
    // 新增：查询当前用户该应用页面是否已分享
    this.router.get('/app/share/check-exist', this.checkShareExist.bind(this))
    this.router.get('/app/share/:inviteCode', this.getFileByShareCode.bind(this))
    this.router.get('/app/share/info/:inviteCode', this.getShareInfoByCode.bind(this))
    this.router.get('/app/share/list', this.queryUserAllShare.bind(this))
    this.router.get('/app/share/search', this.searchShareFuzzy.bind(this))
    this.router.delete('/app/share/:inviteCode', this.cancelShare.bind(this))
  }

  getDateDirPath () {
    const now = new Date()
    const year = now.getFullYear()
    const month = String(now.getMonth() + 1).padStart(2, '0')
    const day = String(now.getDate()).padStart(2, '0')
    const dateDir = path.join(this.fileRootDir, `${year}/${month}/${day}`)
    fse.ensureDirSync(dateDir)
    return dateDir
  }

  async checkLogin (ctx) {
    const sess = ctx.headers['x-ridge-cloud-sess'] || ctx.request.body.sess || ctx.query.sess
    const user = this.userService.getUserFromCache(sess)
    if (!user) throw new UnauthorizedError('请先登录后再进行分享操作')
    return user
  }

  /**
   * 同步删除：主文件 + 图标文件
   */
  async removeShareRecordAndFile (inviteCode) {
    const record = await this.coderService.getCodeRelaction(inviteCode)
    if (!record) return
    const { filePath, iconFilePath } = record.info || {}

    // 删除主包文件
    if (filePath && await fse.pathExists(filePath)) {
      await fse.remove(filePath)
    }
    // 删除图标文件（存在才删）
    if (iconFilePath && await fse.pathExists(iconFilePath)) {
      await fse.remove(iconFilePath)
    }
    await this.coderService.deleteCodeRelation(inviteCode)
  }

  async getExactMatchShareByUser (userId, appName, pageName) {
    const allRecords = await this.coderService.queryByFilter(item => {
      const info = item.info || {}
      const extra = info.extraData || {}
      return info.uploadMobile === userId && extra.appName === appName && extra.pageName === pageName
    })
    return allRecords
  }

  /**
   * 新增接口：GET /app/share/check-exist
   * query参数：appName、pageName
   * 返回是否存在该用户下同名应用页面分享
   */
  async checkShareExist (ctx) {
    const loginUser = await this.checkLogin(ctx)
    const { appName, pageName } = ctx.query
    if (!appName || !pageName) {
      throw new BadRequestError('appName、pageName 不能为空')
    }
    const records = await this.getExactMatchShareByUser(loginUser.id, appName, pageName)
    ctx.body = {
      code: 0,
      msg: '查询成功',
      data: {
        isShared: records.length > 0,
        shareCount: records.length
      }
    }
  }

  async uploadAndGenShareCode (ctx) {
    const loginUser = await this.checkLogin(ctx)
    const files = ctx.request.files || {}
    // 主文件必填
    const mainFile = files.file || ctx.request.body?.file
    if (!mainFile) throw new BadRequestError('请上传应用包文件')
    // 图标可选
    const iconFile = files.icon

    const { size, filepath, originalname } = mainFile
    if (size > this.maxFileSize) {
      throw new BadRequestError(`文件过大，最大支持 ${(this.maxFileSize / 1024 / 1024).toFixed(0)}MB`)
    }

    // 解析extraData
    let extraData = ctx.request.body.extraData || {}
    if (typeof extraData === 'string') {
      try {
        extraData = JSON.parse(extraData)
      } catch {
        throw new BadRequestError('extraData 参数必须为合法JSON')
      }
    }
    if (!extraData.appName || !extraData.pageName) {
      throw new BadRequestError('extraData 必须包含 appName、pageName')
    }

    const targetDir = this.getDateDirPath()
    // 保存主文件
    const mainSaveName = `${Date.now()}_${originalname}`
    const mainFilePath = path.join(targetDir, mainSaveName)
    await fse.move(filepath, mainFilePath, { overwrite: true })

    // 处理图标文件
    let iconSaveName = ''
    let iconAbsPath = ''
    if (iconFile) {
      const iconOriginName = iconFile.originalname
      iconSaveName = `icon_${Date.now()}_${iconOriginName}`
      iconAbsPath = path.join(targetDir, iconSaveName)
      await fse.move(iconFile.filepath, iconAbsPath, { overwrite: true })
    }
    // 将图标文件名存入extraData
    extraData.iconFile = iconSaveName

    // 入库信息增加图标绝对路径
    const codeInfo = {
      filePath: mainFilePath,
      fileName: originalname,
      iconFilePath: iconAbsPath,
      iconFileName: iconSaveName,
      uploadMobile: loginUser.id,
      uploadTime: new Date(),
      extraData
    }
    const shareCode = await this.coderService.createCodeRelation(codeInfo, this.codeLen, this.codeExpireDay)

    ctx.body = {
      code: 0,
      msg: '应用分享成功',
      data: {
        shareCode,
        fileName: originalname,
        iconFileName: iconSaveName,
        expireDay: this.codeExpireDay,
        extraData
      }
    }
  }

  async coverUploadShare (ctx) {
    const loginUser = await this.checkLogin(ctx)
    const files = ctx.request.files || {}
    const mainFile = files.file || ctx.request.body?.file
    if (!mainFile) throw new BadRequestError('请上传应用包文件')
    const iconFile = files.icon

    const { size, filepath, originalname } = mainFile
    if (size > this.maxFileSize) {
      throw new BadRequestError(`文件过大，最大支持 ${(this.maxFileSize / 1024 / 1024).toFixed(0)}MB`)
    }

    let extraData = ctx.request.body.extraData || {}
    if (typeof extraData === 'string') {
      try {
        extraData = JSON.parse(extraData)
      } catch {
        throw new BadRequestError('extraData 参数必须为合法JSON')
      }
    }
    const { appName, pageName } = extraData
    if (!appName || !pageName) {
      throw new BadRequestError('extraData 必须提供 appName、pageName 用于精准匹配覆盖')
    }

    // 精准查询并清理旧记录（同步删除旧主包+旧图标）
    const oldMatchRecords = await this.getExactMatchShareByUser(loginUser.id, appName, pageName)
    for (const record of oldMatchRecords) {
      await this.removeShareRecordAndFile(record.code)
    }

    const targetDir = this.getDateDirPath()
    // 保存新主文件
    const mainSaveName = `${Date.now()}_${originalname}`
    const mainFilePath = path.join(targetDir, mainSaveName)
    await fse.move(filepath, mainFilePath, { overwrite: true })

    // 处理新图标
    let iconSaveName = ''
    let iconAbsPath = ''
    if (iconFile) {
      const iconOriginName = iconFile.originalname
      iconSaveName = `icon_${Date.now()}_${iconOriginName}`
      iconAbsPath = path.join(targetDir, iconSaveName)
      await fse.move(iconFile.filepath, iconAbsPath, { overwrite: true })
    }
    extraData.iconFile = iconSaveName

    const codeInfo = {
      filePath: mainFilePath,
      fileName: originalname,
      iconFilePath: iconAbsPath,
      iconFileName: iconSaveName,
      uploadMobile: loginUser.id,
      uploadTime: new Date(),
      extraData
    }
    const shareCode = await this.coderService.createCodeRelation(codeInfo, this.codeLen, this.codeExpireDay)

    ctx.body = {
      code: 0,
      msg: '覆盖分享成功，匹配旧分享及图标已清理',
      data: {
        shareCode,
        fileName: originalname,
        iconFileName: iconSaveName,
        expireDay: this.codeExpireDay,
        extraData,
        clearedCount: oldMatchRecords.length
      }
    }
  }

  async queryUserAllShare (ctx) {
    const loginUser = await this.checkLogin(ctx)
    const allRecords = await this.coderService.queryByFilter(item => {
      return item.info?.uploadMobile === loginUser.id
    })

    const list = allRecords.map(item => ({
      shareCode: item.code,
      uploadMobile: item.info.uploadMobile,
      uploadTime: item.info.uploadTime,
      fileName: item.info.fileName,
      iconFileName: item.info.iconFileName || '',
      filePath: item.info.filePath,
      iconFilePath: item.info.iconFilePath || '',
      extraData: item.info.extraData || {}
    }))

    ctx.body = {
      code: 0,
      msg: '查询本人分享列表成功',
      data: list
    }
  }

  async searchShareFuzzy (ctx) {
    const { appName, pageDesc } = ctx.query
    ctx.body = {
      code: -1,
      msg: '模糊检索功能待性能优化后开发，暂未实现',
      data: {
        inputAppName: appName || '',
        inputPageDesc: pageDesc || ''
      }
    }
  }

  async cancelShare (ctx) {
    const loginUser = await this.checkLogin(ctx)
    const { inviteCode } = ctx.params
    const record = await this.coderService.getCodeRelaction(inviteCode)

    if (!record) throw new BadRequestError('分享码不存在或已过期')
    if (record.info.uploadMobile !== loginUser.id) {
      throw new UnauthorizedError('仅上传本人可撤销该分享')
    }

    await this.removeShareRecordAndFile(inviteCode)
    ctx.body = { code: 0, msg: '撤销分享成功，应用包与图标文件已删除' }
  }

  async getFileByShareCode (ctx) {
    const { inviteCode } = ctx.params
    const codeRecord = await this.coderService.getCodeRelaction(inviteCode)
    if (!codeRecord) throw new BadRequestError('分享码不存在或已过期')

    const { filePath, fileName } = codeRecord.info
    const isExist = await fse.pathExists(filePath)
    if (!isExist) throw new BadRequestError('文件已丢失')

    ctx.set('Content-Disposition', `attachment; filename=${encodeURIComponent(fileName)}`)
    ctx.set('Content-Type', 'application/octet-stream')
    ctx.body = fse.createReadStream(filePath)
  }

  async getShareInfoByCode (ctx) {
    const { inviteCode } = ctx.params
    const codeRecord = await this.coderService.getCodeRelaction(inviteCode)
    if (!codeRecord) throw new BadRequestError('分享码不存在或已过期')

    const info = codeRecord.info
    const fileExist = await fse.pathExists(info.filePath)
    const iconExist = info.iconFilePath ? await fse.pathExists(info.iconFilePath) : false

    ctx.body = {
      code: 0,
      msg: '查询成功',
      data: {
        shareCode: inviteCode,
        fileName: info.fileName,
        iconFileName: info.iconFileName || '',
        uploadMobile: info.uploadMobile,
        uploadTime: info.uploadTime,
        extraData: info.extraData || {},
        fileExist,
        iconExist
      }
    }
  }
}

module.exports = AppShareService
