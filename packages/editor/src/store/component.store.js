import { create } from 'zustand'
import { loader } from 'ridgejs'

const componentStore = create((set, get) => ({
  registry: [],
  // 缓存已加载的库元数据
  loadedLibs: new Map(),
  // 缓存组件定义
  loadedComponents: new Map(),

  init: async () => {
    await loader.confirmExternalsMemoized()
    set({
      registry: loader.getRegistry()
    })
  },

  loadLib: async libName => {
    const { loadedLibs, registry } = get()

    // 如果已加载，直接返回缓存的元数据
    if (loadedLibs.has(libName)) {
      return loadedLibs.get(libName)
    }

    // 在注册表中查找库
    const libItem = registry.find(item => item.module === libName)
    if (!libItem) {
      throw new Error(`组件库 ${libName} 未在注册表中找到`)
    }

    if (!libItem.meta) {
      throw new Error(`组件库 ${libName} 没有定义元数据文件`)
    }

    // 加载元数据
    const meta = await loader.loadJSON(libItem.meta)

    // 缓存结果
    loadedLibs.set(libName, meta)

    // 预缓存所有组件定义
    if (meta.components && Array.isArray(meta.components)) {
      const componentCache = new Map()
      meta.components.forEach(component => {
        componentCache.set(component.name, component)
      })
      get().loadedComponents.set(libName, componentCache)
    }

    set({ loadedLibs })
    return meta
  },

  getLibComponent: async (componentPath) => {
    const { loadedComponents, loadLib, registry } = get()

    if (!componentPath || !componentPath.includes('/')) {
      throw new Error(`无效的组件路径格式: ${componentPath}`)
    }

    // 查找匹配的库
    let foundLib = null
    let libName = ''

    // 先尝试完全匹配
    for (const lib of registry) {
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
    if (loadedComponents.has(libName)) {
      const libCache = loadedComponents.get(libName)
      if (libCache.has(compName)) {
        return libCache.get(compName)
      }
    }

    // 加载库
    await loadLib(libName)

    // 再次尝试从缓存获取
    const libCache = loadedComponents.get(libName)
    if (libCache && libCache.has(compName)) {
      return libCache.get(compName)
    }

    throw new Error(`组件 ${compName} 在库 ${libName} 中未找到`)
  }
}))

export default componentStore
