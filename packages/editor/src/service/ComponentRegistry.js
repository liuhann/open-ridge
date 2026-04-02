// ComponentRegistry.js
import { loader } from 'ridgejs'

class ComponentRegistry {
  constructor () {
    if (ComponentRegistry.instance) {
      return ComponentRegistry.instance
    }

    this.registry = []
    this.loadedLibs = new Map() // 缓存已加载的库元数据
    this.loadedComponents = new Map() // 缓存组件定义
    this.initialized = false

    ComponentRegistry.instance = this
  }

  async init () {
    if (this.initialized) return

    await loader.confirmExternalsMemoized()
    this.registry = loader.getRegistry()
    this.initialized = true
  }

  async loadLib (libName) {
    // 如果已加载，直接返回缓存的元数据
    if (this.loadedLibs.has(libName)) {
      return this.loadedLibs.get(libName)
    }

    // 在注册表中查找库
    const libItem = this.registry.find(item => item.module === libName)
    if (!libItem) {
      throw new Error(`组件库 ${libName} 未在注册表中找到`)
    }

    if (!libItem.meta) {
      throw new Error(`组件库 ${libName} 没有定义元数据文件`)
    }

    // 加载元数据
    const meta = await loader.loadJSON(libItem.meta)

    // 缓存结果
    this.loadedLibs.set(libName, meta)

    // 预缓存所有组件定义
    if (meta.components && Array.isArray(meta.components)) {
      const componentCache = new Map()
      meta.components.forEach(component => {
        componentCache.set(component.name, component)
      })
      this.loadedComponents.set(libName, componentCache)
    }

    return meta
  }

  async getLibComponent (componentPath) {
    if (!componentPath || !componentPath.includes('/')) {
      throw new Error(`无效的组件路径格式: ${componentPath}`)
    }

    // 查找匹配的库
    let foundLib = null
    let libName = ''

    // 先尝试完全匹配
    for (const lib of this.registry) {
      if (componentPath.startsWith(lib.module + '/')) {
        foundLib = lib
        libName = lib.module
        break
      }
    }

    if (!foundLib) {
      throw new Error(`未找到匹配的组件库: ${componentPath}`)
    }

    const compName = componentPath.substring(libName.length + 1)

    if (!compName) {
      throw new Error(`无效的组件路径: ${componentPath}`)
    }

    // 尝试从缓存获取
    if (this.loadedComponents.has(libName)) {
      const libCache = this.loadedComponents.get(libName)
      if (libCache.has(compName)) {
        return libCache.get(compName)
      }
    }

    // 加载库
    await this.loadLib(libName)

    // 再次尝试从缓存获取
    const libCache = this.loadedComponents.get(libName)
    if (libCache && libCache.has(compName)) {
      return libCache.get(compName)
    }

    throw new Error(`组件 ${compName} 在库 ${libName} 中未找到`)
  }

  getCachedComponent (libName, compName) {
    const libCache = this.loadedComponents.get(libName)
    if (libCache) {
      return libCache.get(compName)
    }
    return null
  }

  clearCache () {
    this.loadedLibs.clear()
    this.loadedComponents.clear()
  }

  clearLibCache (libName) {
    this.loadedLibs.delete(libName)
    this.loadedComponents.delete(libName)
  }

  isLibLoaded (libName) {
    return this.loadedLibs.has(libName)
  }

  getRegistry () {
    return [...this.registry]
  }

  getLoadedLibs () {
    return Array.from(this.loadedLibs.keys())
  }
}

// 创建全局唯一实例
const componentRegistry = new ComponentRegistry()

// 导出实例
export default componentRegistry

// 也导出类，如果需要的话
export { ComponentRegistry }
