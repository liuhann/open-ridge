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

    // 静态文件根目录
    this.fileRootDir = path.resolve(__dirname, '../../static/app-share-files')
    // 静态访问前缀，用于接口返回完整URL
    this.staticPrefix = '/static/app-share-files'
    this.maxFileSize = 1 * 1024 * 1024
    this.codeLen = 6
    this.codeExpireDay = 1

    fse.ensureDirSync(this.fileRootDir)
  }

  async initRoutes () {
    this.router.post('/app/share', this.uploadAndGenShareCode.bind(this))
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
    // 绝对目录，用于文件写入
    const absDir = path.join(this.fileRootDir, `${year}/${month}/${day}`)
    fse.ensureDirSync(absDir)
    // 返回相对路径（存入数据库）
    return `${year}/${month}/${day}`
  }

  // 根据库中存储的相对路径拼接真实绝对路径
  getAbsFilePath (relativePath) {
    return path.join(this.fileRootDir, relativePath)
  }

  // 根据相对路径拼接前端可访问静态URL
  getStaticUrl (relativePath) {
    return `${this.staticPrefix}/${relativePath.replace(/\\/g, '/')}`
  }

  async checkLogin (ctx) {
    const sess = ctx.headers['x-ridge-cloud-sess'] || ctx.request.body.sess || ctx.query.sess
    const user = this.userService.getUserFromCache(sess)
    if (!user) {
      const err = new UnauthorizedError('请先登录后再进行分享操作')
      err.code = '100401'
      throw err
    }
    return user
  }

  async removeShareRecordAndFile (inviteCode) {
    const record = await this.coderService.getCodeRelaction(inviteCode)
    if (!record) return
    const { filePath, iconFilePath } = record

    // 拼接绝对路径删除文件
    if (filePath) {
      const absPath = this.getAbsFilePath(filePath)
      if (await fse.pathExists(absPath)) {
        await fse.remove(absPath)
      }
    }
    if (iconFilePath) {
      const absIconPath = this.getAbsFilePath(iconFilePath)
      if (await fse.pathExists(absIconPath)) {
        await fse.remove(absIconPath)
      }
    }

    const coll = await this.coderService.getCRCollection()
    await coll.remove({ code: String(inviteCode) })
  }

  async getExactMatchShareByUser (userId, appId, pageName) {
    const queryCondition = {
      uploadMobile: userId,
      appId,
      pageName
    }
    const matchList = await this.coderService.query(queryCondition)
    return matchList
  }

  async checkShareExist (ctx) {
    const loginUser = await this.checkLogin(ctx)
    const { appId, pageName } = ctx.query
    if (!appId || !pageName) {
      throw new BadRequestError('appId、pageName 不能为空')
    }
    const records = await this.getExactMatchShareByUser(loginUser.id, appId, pageName)
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

    if (!extraData.appId || !extraData.pageName) {
      throw new BadRequestError('extraData 必须包含 appId、pageName')
    }

    // 自动清理同用户+appId+pageName旧记录
    const oldMatchRecords = await this.getExactMatchShareByUser(loginUser.id, extraData.appId, extraData.pageName)
    for (const record of oldMatchRecords) {
      await this.removeShareRecordAndFile(record.code)
    }

    const dateRelativeDir = this.getDateDirPath()
    const mainSaveName = `${Date.now()}_${originalname}`
    // 存入数据库的相对路径
    const mainRelativePath = path.join(dateRelativeDir, mainSaveName)
    // 真实绝对路径用于写入文件
    const mainAbsPath = this.getAbsFilePath(mainRelativePath)
    await fse.move(filepath, mainAbsPath, { overwrite: true })

    let iconSaveName = ''
    let iconRelativePath = ''
    if (iconFile) {
      const iconOriginName = iconFile.originalname
      iconSaveName = `icon_${Date.now()}_${iconOriginName}`
      iconRelativePath = path.join(dateRelativeDir, iconSaveName)
      const iconAbsPath = this.getAbsFilePath(iconRelativePath)
      await fse.move(iconFile.filepath, iconAbsPath, { overwrite: true })
    }
    extraData.iconFile = iconSaveName

    // 数据库只存相对路径
    const flatInfo = {
      filePath: mainRelativePath,
      fileName: originalname,
      iconFilePath: iconRelativePath,
      iconFileName: iconSaveName,
      uploadMobile: loginUser.id,
      uploadTime: new Date(),
      ...extraData
    }
    const shareCode = await this.coderService.createCodeRelation(flatInfo, this.codeLen, this.codeExpireDay)

    ctx.body = {
      code: 0,
      msg: '应用分享成功，旧分享记录已自动覆盖清理',
      data: {
        shareCode,
        fileName: originalname,
        iconFileName: iconSaveName,
        expireDay: this.codeExpireDay,
        extraData
      }
    }
  }

  async queryUserAllShare (ctx) {
    const loginUser = await this.checkLogin(ctx)
    const userRecords = await this.coderService.query({
      uploadMobile: loginUser.id
    })

    const list = userRecords.map(item => ({
      shareCode: item.code,
      uploadMobile: item.uploadMobile,
      uploadTime: item.uploadTime,
      fileName: item.fileName,
      iconFileName: item.iconFileName || '',
      // 原始相对路径
      filePath: item.filePath,
      iconFilePath: item.iconFilePath || '',
      // 前端可用完整静态地址
      fileUrl: this.getStaticUrl(item.filePath),
      iconUrl: item.iconFilePath ? this.getStaticUrl(item.iconFilePath) : '',
      extraData: {
        appId: item.appId,
        appName: item.appName,
        pageName: item.pageName,
        pageDesc: item.pageDesc || '',
        iconFile: item.iconFile || ''
      }
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
    if (record.uploadMobile !== loginUser.id) {
      throw new UnauthorizedError('仅上传本人可撤销该分享')
    }

    await this.removeShareRecordAndFile(inviteCode)
    ctx.body = { code: 0, msg: '撤销分享成功，应用包与图标文件已删除' }
  }

  async getFileByShareCode (ctx) {
    const { inviteCode } = ctx.params
    const codeRecord = await this.coderService.getCodeRelaction(inviteCode)
    if (!codeRecord) throw new BadRequestError('分享码不存在或已过期')

    const absPath = this.getAbsFilePath(codeRecord.filePath)
    const isExist = await fse.pathExists(absPath)
    if (!isExist) throw new BadRequestError('文件已丢失')

    ctx.set('Content-Disposition', `attachment; filename=${encodeURIComponent(codeRecord.fileName)}`)
    ctx.set('Content-Type', 'application/octet-stream')
    ctx.body = fse.createReadStream(absPath)
  }

  async getShareInfoByCode (ctx) {
    const { inviteCode } = ctx.params
    const codeRecord = await this.coderService.getCodeRelaction(inviteCode)
    if (!codeRecord) throw new BadRequestError('分享码不存在或已过期')

    const fileAbsPath = this.getAbsFilePath(codeRecord.filePath)
    const fileExist = await fse.pathExists(fileAbsPath)
    let iconExist = false
    if (codeRecord.iconFilePath) {
      const iconAbsPath = this.getAbsFilePath(codeRecord.iconFilePath)
      iconExist = await fse.pathExists(iconAbsPath)
    }

    ctx.body = {
      code: 0,
      msg: '查询成功',
      data: {
        shareCode: inviteCode,
        fileName: codeRecord.fileName,
        iconFileName: codeRecord.iconFileName || '',
        uploadMobile: codeRecord.uploadMobile,
        uploadTime: codeRecord.uploadTime,
        extraData: {
          appId: codeRecord.appId,
          appName: codeRecord.appName,
          pageName: codeRecord.pageName,
          pageDesc: codeRecord.pageDesc || '',
          iconFile: codeRecord.iconFile || ''
        },
        fileExist,
        iconExist,
        // 前端展示完整访问地址
        fileUrl: this.getStaticUrl(codeRecord.filePath),
        iconUrl: codeRecord.iconFilePath ? this.getStaticUrl(codeRecord.iconFilePath) : ''
      }
    }
  }
}

module.exports = AppShareService
