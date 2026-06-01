import { create } from 'zustand'
import { loader } from 'ridgejs'
import componentRegistry from '../service/ComponentRegistry'

const componentStore = create((set, get) => ({
  registry: [],
  componentLibList: [], // 组件库列表信息

  initRegistry: async () => {
    await componentRegistry.init()

    const registryPackages = componentRegistry.getRegistryPackages()
    const filteredRegistry = registryPackages.filter(item => item.category !== 'base')

    set({
      componentLibList: filteredRegistry
    })
  },

  getComponentLibMeta: async componentLib => {
    const libMeta = await componentRegistry.getComponentLibMeta(componentLib)

    return libMeta
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
