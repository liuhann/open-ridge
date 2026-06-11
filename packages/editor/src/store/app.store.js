import { create } from 'zustand'
import { Modal } from '@douyinfe/semi-ui'
import { alphabetid, trim, camelCase } from '../utils/string'
import LocalRepoService from '../service/LocalRepoService'
import ApplicationService from '../service/ApplicationService'
import { stringToBlob } from '../utils/blob'
import { getByMimeType } from '../utils/mimeTypes.js'
import { addStringPrefix } from 'ridgejs/src/utils/string.js'

import helloZipApp from '../ridge-app-hello-1.0.0.zip'

// 单例（关键！不再 new 多次）
const localRepoService = new LocalRepoService()

const useStore = create((set, get) => ({
  // 初始化状态（修复空值语义）
  appList: [],
  aiModalVisible: false,
  recentAppList: [],
  currentAppInfo: null,
  currentAppName: null,
  currentAppIcon: null,
  currentAppId: null,
  currentAppFilesTree: [],
  isReady: false,
  appService: null,

  initAppStore: async () => {
    try {
      const appList = await localRepoService.getLocalAppList()
      const recentAppList = await localRepoService.getRecentlyOpenedAppList()

      // 无应用时自动导入 hello 模板
      // if (appList.length === 0) {
      //   if (!localRepoService.importedHello()) {
      //     await importAppFile(helloZipApp)
      //     window.localStorage.setItem('ridge-imported-hello', 'true')
      //   }
      // }

      // const currentAppId = localRepoService.getCurrentAppId()
      // if (currentAppId) {
      //   await openApp(currentAppId)
      // }
      set({
        recentAppList,
        isReady: true,
        appList
      })
    } catch (err) {
      console.error('initAppStore 失败:', err)
      set({ isReady: true })
    }
  },

  openApp: async (id) => {
    if (!id) return
    try {
      const appInfo = await localRepoService.getApp(id)
      if (!appInfo) return

      const appService = localRepoService.getAppService(id)
      await appService.updateAppFileTree()
      const iconUrl = await localRepoService.getAppIcon(id)
      appService.setIconUrl(iconUrl)
      const appPackageJSON = await appService.getAppPackageJSON()
      await localRepoService.setCurrentApp(id, appService)

      const recentAppList = await localRepoService.getRecentlyOpenedAppList()
      set({
        recentAppList,
        currentAppInfo: appPackageJSON,
        appService,
        currentAppId: id,
        currentAppName: appPackageJSON?.description || '',
        currentAppIcon: iconUrl,
        currentAppFilesTree: appService.getFileTree()
      })
    } catch (err) {
      console.error('openApp 失败:', err)
    }
  },

  removeApp: async (id) => {
    if (!id) return

    try {
      await localRepoService.removeApp(id)
      const appList = await localRepoService.getLocalAppList()

      // 若删除的是当前应用，清空状态
      const currentId = localRepoService.getCurrentAppId()
      if (currentId === id) {
        set({
          currentAppId: null,
          currentAppName: null,
          currentAppInfo: null,
          appService: null,
          currentAppFilesTree: []
        })
      }

      set({ appList })
    } catch (err) {
      console.error('removeApp 失败:', err)
    }
  },

  importAppFile: async (file) => {
    try {
      const newAppId = alphabetid(8)
      const appService = new ApplicationService(newAppId)

      const response = await fetch(file)
      const blob = await response.blob()

      await appService.importAppArchive(blob)

      const pkg = await appService.getAppPackageJSON()

      let iconUrl = null
      if (pkg.icon) {
        iconUrl = await appService.getFileUrl(addStringPrefix('/', pkg.icon))
      }
      await localRepoService.persistApp(newAppId, pkg.description, iconUrl)
      const appList = await localRepoService.getLocalAppList()
      set({ appList })
      return newAppId
    } catch (err) {
      console.error('importAppFile 失败:', err)
    }
  },

  createEmptyApp: async () => {
    const { importAppFile, openApp } = get()

    const newAppId = await importAppFile(helloZipApp)

    await openApp(newAppId)
  },

  createEmptyAppAndStartAiWizard: async () => {
    const { createEmptyApp } = get()

    await createEmptyApp()

    set({
      aiModalVisible: true
    })
  },

  setCurrentAppName: (name) => {
    set({ currentAppName: name })
  },

  exitToAppList: () => {
    localRepoService.setCurrentApp(null)
    set({
      currentAppFilesTree: [],
      currentAppName: null,
      currentAppId: null,
      currentAppInfo: null,
      appService: null
    })
  },

  // 修复：必须 await，原来是异步变同步大BUG
  updateAppList: async () => {
    try {
      const appList = await localRepoService.getLocalAppList()
      set({ appList })
    } catch (err) {
      console.error('updateAppList 失败:', err)
    }
  },

  createFolder: async (parentId, name) => {
    const { appService } = get()
    if (!appService) return false

    try {
      await appService.createDirectory(parentId, name)
      set({
        currentAppFilesTree: appService.getFileTree()
      })
      return true
    } catch (e) {
      console.error('createFolder 失败:', e)
      return false
    }
  },

  uploadFile: async (parentId, file) => {
    const appService = localRepoService.getCurrentAppService()
    if (!appService) return false

    try {
      await appService.createFile(parentId, file.name, file)
      set({
        currentAppFilesTree: appService.getFileTree()
      })
      return true
    } catch (e) {
      console.error('uploadFile 失败:', e)
      return false
    }
  },

  finishAI: async (pageJSONContent, scriptContent, userPrompt) => {
    try {
      const { createFile, deleteFile } = get()
      const appService = localRepoService.getCurrentAppService()

      // 安全获取页面名称
      const title = pageJSONContent?.title || 'AI-Generated'
      const pageName = `${title}.json`
      const scriptFileName = pageJSONContent?.jsFiles?.[0]

      // 绑定用户提示词
      if (userPrompt) {
        pageJSONContent.userPrompt = userPrompt
      }

      // 检查文件是否冲突
      const pageConflict = appService.getFile('/' + pageName)
      const scriptConflict = scriptFileName ? appService.getFile('/' + scriptFileName) : null

      // 如果有冲突，弹出确认框
      if (pageConflict || scriptConflict) {
        const confirmed = await new Promise((resolve) => {
          Modal.confirm({
            title: '文件已经存在',
            content: '冲突文件：' + (pageConflict ? pageName : '') + ' ' + (scriptConflict ? scriptFileName : '') + ' 点击确定将覆盖到现有文件',
            onOk: () => resolve(true),
            onCancel: () => resolve(false)
          })
        })

        // 用户取消 → 终止操作
        if (!confirmed) {
          return null
        }

        // 删除冲突文件
        if (pageConflict) await deleteFile(pageConflict.id)
        if (scriptConflict) await deleteFile(scriptConflict.id)
      }

      // ======================
      // 按你原有格式创建文件 ✅
      // ======================
      const createdPage = await createFile(
        -1,
        pageName,
        JSON.stringify(pageJSONContent, null, 2), // 直接传文本
        getByMimeType('json')
      )

      // 如果有脚本才创建
      if (scriptFileName && scriptContent) {
        await createFile(
          -1,
          scriptFileName,
          scriptContent, // 直接传文本
          getByMimeType('js')
        )
      }

      return createdPage
    } catch (err) {
      console.error('AI生成页面失败：', err)
      throw err
    }
  },
  createFile: async (parentId, name, fileContent, mimeType, renameOnConflict) => {
    const appService = localRepoService.getCurrentAppService()
    if (!appService) return

    try {
      const createdFile = await appService.createFile(
        parentId,
        name,
        stringToBlob(fileContent, mimeType),
        mimeType,
        renameOnConflict
      )
      set({
        currentAppFilesTree: appService.getFileTree()
      })
      return createdFile
    } catch (err) {
      console.error('createFile 失败:', err)
    }
  },

  deleteFile: async (fileId) => {
    const appService = localRepoService.getCurrentAppService()
    if (!appService) return null

    try {
      await appService.deleteFile(fileId)
      set({
        currentAppFilesTree: appService.getFileTree()
      })
    } catch (err) {
      console.error('deleteFile 失败:', err)
    }
  },

  exportFile: async fileId => {
    const appService = localRepoService.getCurrentAppService()
    if (!appService) return null
    appService.exportFile(fileId)
  },

  getFilePath: (fileId) => {
    const appService = localRepoService.getCurrentAppService()
    if (!appService) return null
    const file = appService.getFile(fileId)
    return file?.path || null
  },

  checkNewNameValid: (id, newName) => {
    const appService = localRepoService.getCurrentAppService()
    if (!appService) return false
    return appService.checkNewNameValid(id, newName)
  },

  checkCreateNameValid: (pid, name) => {
    const appService = localRepoService.getCurrentAppService()
    if (!appService) return true

    const list = appService.filterFiles(
      file => file.parent === pid &&
        camelCase(trim(name)) === camelCase(trim(file.name))
    )
    return list.length === 0
  },

  renameFile: async (fileId, name) => {
    const appService = localRepoService.getCurrentAppService()
    if (!appService) return 0

    try {
      const renamed = await appService.rename(fileId, name)
      if (renamed === 1) {
        await appService.updateAppFileTree()
        set({ currentAppFilesTree: appService.getFileTree() })
      }
      return renamed
    } catch (err) {
      console.error('renameFile 失败:', err)
      return 0
    }
  },

  moveFile: async (fileId, parentId) => {
    const appService = localRepoService.getCurrentAppService()
    if (!appService) return false

    try {
      const moved = await appService.move(fileId, parentId)
      if (moved) {
        set({ currentAppFilesTree: appService.getFileTree() })
      }
      return moved
    } catch (err) {
      console.error('moveFile 失败:', err)
      return false
    }
  },
  updateAppInfo: async (updateObject) => {
    if (!updateObject || !updateObject.name) return // 👈 只加这一行防呆

    const pkgJsonObject = JSON.parse(JSON.stringify(updateObject))

    const appService = localRepoService.getCurrentAppService()

    let iconUrl = null
    if (updateObject.icon) {
      iconUrl = await appService.getFileUrl(addStringPrefix('/', updateObject.icon))
    }
    if (!appService) return
    const currentAppId = localRepoService.getCurrentAppId() // 👈 这个才是真正ID
    try {
    // 1. 更新应用内部 package.json
      await appService.updateAppPackageJSON(pkgJsonObject)

      // 2. 更新本地应用列表（用真正的本地ID）
      await localRepoService.persistApp(
        currentAppId,
        pkgJsonObject.description,
        iconUrl
      )

      const appList = await localRepoService.getLocalAppList()
      set({
        appList,
        currentAppInfo: pkgJsonObject,
        currentAppIcon: await localRepoService.getAppIcon(currentAppId),
        currentAppName: pkgJsonObject.description
      })
    } catch (err) {
      console.error('updateAppInfo 失败:', err)
    }
  },

  trashApp: async (appId) => {
    await localRepoService.removeApp(appId)
    const appList = await localRepoService.getLocalAppList()

    set({
      appList
    })
  },

  exportApp: async (appid) => {
    const appService = localRepoService.getAppService(appid)

    await appService.exportAppArchive()
  },

  seyAiModalVisible: visible => {
    set({
      aiModalVisible: visible
    })
  }
}))

export { localRepoService }
export default useStore
