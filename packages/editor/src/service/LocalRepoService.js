import ApplicationService from './ApplicationService.js'
import NeCollection from './NeCollection.js'
import Localforge from 'localforage'

export default class LocalRepoService {
  constructor () {
    this.collection = new NeCollection('ridge.repo.db')
    this.appServices = {}
    this.store = Localforge.createInstance({ name: 'ridge-app-icons' })
    this.currentAppId = null

    // ====================== 最近打开应用（持久化 localStorage） ======================
    this.MAX_RECENT_APPS = 10 // 最大保存数量
    this.RECENT_KEY = 'ridge-recently-opened-apps' // 存储key
    // 初始化：从 localStorage 读取最近打开列表
    this.recentlyOpenedApps = this.loadRecentAppsFromStorage()
  }

  // ====================== 从本地存储加载最近打开列表 ======================
  loadRecentAppsFromStorage () {
    try {
      const data = localStorage.getItem(this.RECENT_KEY)
      return data ? JSON.parse(data) : []
    } catch (e) {
      console.warn('加载最近打开列表失败', e)
      return []
    }
  }

  // ====================== 保存最近打开列表到本地存储 ======================
  saveRecentAppsToStorage () {
    try {
      localStorage.setItem(this.RECENT_KEY, JSON.stringify(this.recentlyOpenedApps))
    } catch (e) {
      console.warn('保存最近打开列表失败', e)
    }
  }

  async persistApp (id, name, icon) {
    if (!id || !name) return

    try {
      const existed = await this.collection.findOne({ id })
      if (!existed) {
        await this.collection.insert({ id, name })
      } else {
        // 保持你要求的全量更新，不做任何修改
        await this.collection.update({ id }, { id, name })
      }
      if (icon) {
        await this.store.setItem(id, icon)
      }
    } catch (e) {
      console.error('persistApp 失败:', e)
    }
  }

  async setCurrentApp (id, appService) {
    this.currentAppId = id

    if (appService) {
      this.appServices[id] = appService
    }

    // 设置当前应用时 → 加入最近打开列表（自动持久化）
    if (id) {
      this.addToRecentlyOpened(id)
    }
  }

  getCurrentAppId () {
    return this.currentAppId
  }

  getCurrentAppService () {
    if (this.currentAppId) {
      return this.getAppService(this.currentAppId)
    }
    return null
  }

  getAppService (id) {
    // 增加空值保护
    if (!id) {
      console.warn('getAppService: id 不能为空')
      return null
    }

    if (!this.appServices[id]) {
      this.appServices[id] = new ApplicationService(id)
    }
    return this.appServices[id]
  }

  async removeApp (id) {
    if (id == null) return
    try {
      await this.collection.remove({ id })
      await this.store.removeItem(id)

      const appService = this.getAppService(id)
      await appService.clear()
      delete this.appServices[id]

      if (this.currentAppId === id) {
        this.currentAppId = null
      }

      // 删除应用时，同时从最近打开列表移除
      this.removeFromRecentlyOpened(id)
    } catch (e) {
      console.error('removeApp 失败:', e)
    }
  }

  async renameApp (id, newName) {
    try {
      const existed = await this.collection.findOne({ id })
      if (existed) {
        await this.collection.patch({ id }, { name: newName })
      }
    } catch (e) {
      console.error('renameApp 失败:', e)
    }
  }

  async getApp (id) {
    try {
      return await this.collection.findOne({ id }) || null
    } catch (e) {
      console.error('getApp 失败:', e)
      return null
    }
  }

  async getAppIcon (id) {
    const iconUrl = await this.store.getItem(id)

    if (typeof iconUrl === 'string') {
      return <img src={iconUrl} />
    } else {
      return <img src='/ridge-logo.svg' />
    }
  }

  async getLocalAppList () {
    try {
      const appList = await this.collection.find({})

      for (const app of appList) {
        app.iconUrl = await this.getAppIcon(app.id)
      }

      return appList
    } catch (e) {
      console.error('getLocalAppList 失败:', e)
      return []
    }
  }

  clearAppService (id) {
    if (this.appServices[id]) {
      delete this.appServices[id]
    }
  }

  addToRecentlyOpened (appId) {
    if (!appId) return

    // 去重
    this.recentlyOpenedApps = this.recentlyOpenedApps.filter(id => id !== appId)
    // 最新的放在最前面
    this.recentlyOpenedApps.unshift(appId)
    // 限制数量
    if (this.recentlyOpenedApps.length > this.MAX_RECENT_APPS) {
      this.recentlyOpenedApps = this.recentlyOpenedApps.slice(0, this.MAX_RECENT_APPS)
    }

    // 保存到 localStorage
    this.saveRecentAppsToStorage()
  }

  // ====================== 从最近打开移除（并持久化） ======================
  removeFromRecentlyOpened (appId) {
    this.recentlyOpenedApps = this.recentlyOpenedApps.filter(id => id !== appId)
    this.saveRecentAppsToStorage()
  }

  // ====================== 获取最近打开应用列表（完整信息：名称+图标） ======================
  async getRecentlyOpenedAppList () {
    try {
      const validApps = []
      for (const appId of this.recentlyOpenedApps) {
        const app = await this.getApp(appId)
        if (!app) continue

        app.iconUrl = await this.getAppIcon(appId)
        validApps.push(app)
      }
      return validApps
    } catch (e) {
      console.error('getRecentlyOpenedAppList 失败:', e)
      return []
    }
  }

  // ====================== 清空最近打开列表 ======================
  clearRecentlyOpenedApps () {
    this.recentlyOpenedApps = []
    this.saveRecentAppsToStorage()
  }
}
