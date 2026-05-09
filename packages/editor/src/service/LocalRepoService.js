import ApplicationService from './ApplicationService.js'
import NeCollection from './NeCollection.js'

// 常量集中管理
const STORAGE_KEYS = {
  CURRENT_APP_ID: 'ridge-current-app-id',
  IMPORTED_HELLO: 'ridge-imported-hello'
}

export default class LocalRepoService {
  constructor () {
    this.collection = new NeCollection('ridge.repo.db')
    this.appServices = {}

    // 安全获取当前应用 ID
    const storedId = window.localStorage.getItem(STORAGE_KEYS.CURRENT_APP_ID)
    this.currentAppId = storedId && storedId !== 'null' && storedId !== 'undefined'
      ? storedId
      : null
  }

  importedHello () {
    return window.localStorage.getItem(STORAGE_KEYS.IMPORTED_HELLO) != null
  }

  // 修复拼写错误
  async persistApp (id, name) {
    try {
      const existed = await this.collection.findOne({ id })
      if (!existed) {
        await this.collection.insert({ id, name })
      } else {
        await this.collection.update({ id }, { name })
      }
    } catch (e) {
      console.error('persistApp 失败:', e)
    }
  }

  async setCurrentApp (id, appService) {
    if (id === null) {
      window.localStorage.setItem(STORAGE_KEYS.CURRENT_APP_ID, null)
      this.currentAppId = null
      return
    }

    // 不需要校验是否存在，因为新建应用会先插入
    window.localStorage.setItem(STORAGE_KEYS.CURRENT_APP_ID, id)
    this.currentAppId = id

    if (appService) {
      this.appServices[id] = appService
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
      delete this.appServices[id]

      // 如果删除的是当前应用，清空当前ID
      if (this.currentAppId === id) {
        this.currentAppId = null
        window.localStorage.removeItem(STORAGE_KEYS.CURRENT_APP_ID)
      }
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

  async getLocalAppList () {
    try {
      return await this.collection.find({})
    } catch (e) {
      console.error('getLocalAppList 失败:', e)
      return []
    }
  }

  // 新增：清理缓存
  clearAppService (id) {
    if (this.appServices[id]) {
      delete this.appServices[id]
    }
  }
}
