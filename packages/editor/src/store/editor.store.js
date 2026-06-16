import { create } from 'zustand'
import { localRepoService } from './app.store'

import { cloneDeep } from 'ridgejs/src/utils/object'
import { Composite, loader } from 'ridgejs'
import { dataURLtoBlob } from '../utils/blob'
import { ShareEditApi } from '../api/share-api.js'

const editorStore = create((set, get) => ({
  // 页面编辑状态
  isPreview: false,
  currentOpenPageId: null,
  currentPanel: 'app',
  zoom: 1,
  openedPages: [],
  unsavedPages: [],

  collapseLeft: false,
  imagePreviewVisible: false,
  imagePreviewSrc: '',

  currentEditNodeId: '',
  currentEditNodeRect: {
    x: 0,
    y: 0,
    width: 0,
    height: 0
  },

  componentTreeData: [],
  compositeStoreModules: [],

  // 非状态 作为服务
  editorComposite: null,
  previewComposite: null,

  openedFileContentMap: new Map(),
  pageTransformMap: new Map(),
  pageZoomMap: new Map(),
  codeEditorRef: null,
  workspaceControl: null,

  initStore: ({
    codeEditorRef
  }) => {
    set({
      codeEditorRef
    })
  },
  setCurrentPanel: (panel) => {
    set({
      currentPanel: panel
    })
  },

  getCurrentComposite: () => {
    const { editorComposite } = get()
    return editorComposite
  },

  updateTreeData: () => {
    const { editorComposite } = get()
    if (editorComposite) {
      const componentTreeData = editorComposite.getCompositeElementTree?.() || []
      set({ componentTreeData })
    } else {
      set({ componentTreeData: [] })
    }
  },

  setWorkspaceControl: workspaceControl => {
    set({
      workspaceControl
    })
  },

  selectElement: async element => {
    set({
      currentEditNodeId: element.getId(),
      currentEditNodeRect: { ...element.config.style }
    })
  },

  selectPage: async () => {
    set({
      currentEditNodeId: ''
    })
  },

  updateElementConfig: (config, fieldUpdate) => {
    const clonedConfig = cloneDeep(config)

    const { editorComposite, currentEditNodeId, currentOpenPageId, workspaceControl, unsavedPages } = get()

    const targetElement = editorComposite.getNode(currentEditNodeId)
    targetElement.updateConfig(clonedConfig, fieldUpdate)

    set({
      unsavedPages: [...unsavedPages, currentOpenPageId]
    })
    workspaceControl && workspaceControl.updateMovable()
  },

  updatePageConfig: config => {
    const { editorComposite, unsavedPages, currentOpenPageId } = get()
    editorComposite.updatePageConfig(config)
    set({
      unsavedPages: [...unsavedPages, currentOpenPageId]
    })
  },

  updateOutLine: () => {

  },

  setCurrentPageChanged: (changed) => {
    const { unsavedPages, currentOpenPageId, updateTreeData } = get()
    if (changed) {
      set({
        unsavedPages: [...unsavedPages, currentOpenPageId]
      })
      updateTreeData()
    } else {
      set({
        unsavedPages: unsavedPages.filter(id => id !== currentOpenPageId)
      })
    }
  },

  updateNodeRect: (rect) => {
    const { currentOpenPageId, unsavedPages, currentEditNodeRect } = get()
    set({
      unsavedPages: [...unsavedPages, currentOpenPageId]
    })
    set({
      currentEditNodeRect: { ...currentEditNodeRect, ...rect }
    })
  },

  openFile: async id => {
    const { openPage, openCode, openImage } = get()
    const appService = localRepoService.getCurrentAppService()

    if (appService) {
      const file = await appService.getFile(id)
      if (file && file.mimeType) {
        if (file.type === 'page') {
          openPage(id, file)
        } else if (file.mimeType.startsWith('text/')) {
          openCode(file)
        } else if (file.mimeType.startsWith('image/')) {
          openImage(file)
        }
      }
    }
  },

  // 打开页面
  openPage: async (id, page) => {
    const { currentOpenPageId, unmountWorkspace, openedFileContentMap, pageTransformMap, workspaceControl, openedPages, updateTreeData } = get()
    const appService = localRepoService.getCurrentAppService()
    if (currentOpenPageId === id) {
      return
    }
    // 关闭之前打开的页面 （非当前页面）
    if (currentOpenPageId) {
      unmountWorkspace(true)
    }
    const pageName = page.name.replace(/\.json$/, '')

    let pageObject = null

    if (openedPages.find(p => p.id === id) && openedFileContentMap.get(id)) { // 之前打开过
      pageObject = openedFileContentMap.get(id)
    } else if (page) {
      pageObject = cloneDeep(page.json)
    }
    pageObject.name = pageName

    const editorComposite = await workspaceControl.loadPage(pageObject, page.path, appService)

    const transform = pageTransformMap.get(id)
    if (transform) {
      workspaceControl.setTransform(transform)
    } else {
      const zoom = workspaceControl.fitToCenter()
      set({
        zoom
      })
    }

    set({
      currentOpenPageId: id,
      openedPages: openedPages.find(p => p.id === id)
        ? openedPages
        : [...openedPages, {
            id: page.id,
            name: pageName
          }],
      editorComposite
    })
    updateTreeData()
  },

  openCurrentPageJSONEdit: async () => {
    const { currentOpenPageId, openedFileContentMap, openCode } = get()
    const appService = localRepoService.getCurrentAppService()

    if (!currentOpenPageId) return

    const file = await appService.getFile(currentOpenPageId)

    // 优先使用内存中未保存的页面 JSON
    if (openedFileContentMap.has(currentOpenPageId)) {
      const pageJson = openedFileContentMap.get(currentOpenPageId)
      // 转成字符串给编辑器（关键修复）
      file.textContent = JSON.stringify(pageJson, null, 2)
    }

    openCode(file)
  },

  saveCurrentPage: async () => {
    const { currentOpenPageId, editorComposite, saveFile } = get()

    if (currentOpenPageId && editorComposite) {
      await saveFile(currentOpenPageId, JSON.stringify(editorComposite.exportPageJSON(), null, 2))
    }
  },

  unmountWorkspace: (cache) => {
    const { editorComposite, workspaceControl, openedFileContentMap, pageTransformMap, currentOpenPageId } = get()

    if (cache) {
      // 缓存当前图纸
      openedFileContentMap.set(currentOpenPageId, editorComposite.exportPageJSON())
      pageTransformMap.set(currentOpenPageId, workspaceControl.getTransform())
    }
    editorComposite.unmount()
    workspaceControl.disable()

    set({
      editorComposite: null,
      componentTreeData: []
    })
  },

  // 关闭所有页面
  closeAllPages: async () => {
    const { openedFileContentMap, pageZoomMap, unmountWorkspace, pageTransformMap } = get()
    unmountWorkspace(false)
    openedFileContentMap.clear()
    pageZoomMap.clear()
    pageTransformMap.clear()
    set({
      editorComposite: null,
      currentEditNodeId: '',
      currentOpenPageId: null,
      zoom: 1,
      unsavedPages: [],
      openedPages: []
    })
  },

  // 切换到另一页面
  switchPage: async id => {
    const { currentOpenPageId, unmountWorkspace, openedFileContentMap, pageZoomMap, pageTransformMap, workspaceControl, setZoom, updateTreeData } = get()
    if (currentOpenPageId === id) {
      return
    }

    // 关闭之前打开的页面 （非当前页面）
    if (currentOpenPageId) {
      unmountWorkspace(true)
    }

    if (openedFileContentMap.get(id)) { // 之前打开过
      const pageObject = openedFileContentMap.get(id)
      const editorComposite = await workspaceControl.loadPage(pageObject)
      const transform = pageTransformMap.get(id)
      if (transform) {
        workspaceControl.setTransform(transform)
      } else {
        workspaceControl.setTransform({})
      }
      set({
        currentOpenPageId: id,
        editorComposite
      })

      updateTreeData()
    }
  },

  // 关闭页面
  closePage: async (id) => {
    const { openedFileContentMap, pageZoomMap, openedPages, currentOpenPageId, unmountWorkspace, openPage } = get()

    const leftOpenedPages = openedPages.filter(p => p.id !== id)
    openedFileContentMap.delete(id)
    pageZoomMap.delete(id)
    if (currentOpenPageId === id) { // 关闭当前页
      unmountWorkspace(false)
      set({
        currentOpenPageId: null
      })
      if (leftOpenedPages.length > 0) {
        await openPage(leftOpenedPages[0].id, openedFileContentMap.get(leftOpenedPages[0].id))
      } else {

      }
    }
    set({
      openedPages: leftOpenedPages
    })
  },

  openCode: async file => {
    const { codeEditorRef } = get()
    codeEditorRef?.current?.openFile(file)
  },

  openImage: file => {
    set({
      imagePreviewSrc: file.url,
      imagePreviewVisible: true
    })
  },

  closeImagePreview: () => {
    set({
      imagePreviewSrc: '',
      imagePreviewVisible: false
    })
  },

  saveCode: async (id, code) => {
    const appService = localRepoService.getCurrentAppService()

    await appService.updateFileContent(id, code)
  },

  setZoom: (zoom) => {
    const { workspaceControl } = get()
    if (zoom === 'fit') {
      const fitZoom = workspaceControl.fitToCenter(20)
      set({
        zoom: fitZoom
      })
    } else {
      workspaceControl.setZoom(zoom)
      set({
        zoom
      })
    }
  },

  saveFile: async (fileId, content, doRefresh = true) => {
    const appService = localRepoService.getCurrentAppService()
    const { editorComposite, openedFileContentMap, currentOpenPageId, unsavedPages } = get()

    // 1. 获取文件信息
    const file = await appService.getFile(fileId)

    // ==============================================
    // 【页面 JSON】：保存时更新内存 & 页面
    // ==============================================
    if (file.type === 'page' || file.name.endsWith('.json')) {
      try {
        const jsonConfig = JSON.parse(content)

        // 更新内存未保存缓存
        openedFileContentMap.set(fileId, jsonConfig)

        // 保存时才刷新设计器
        if (doRefresh && editorComposite && currentOpenPageId === fileId) {
          editorComposite.loadPageJSON(jsonConfig)
        }
      } catch (err) {
        console.error('JSON 格式错误', err)
        throw new Error('JSON 格式不正确：' + err.message)
      }
    }

    // ==============================================
    // 统一写入磁盘
    // ==============================================
    await appService.updateFileContent(fileId, content)

    // ==============================================
    // ✅ 关键：保存成功后，清除未保存页面标记
    // ==============================================
    set({
      unsavedPages: unsavedPages.filter(id => id !== fileId)
    })
  },

  getCurrentShareInfo: async () => {
    const { currentOpenPageId, saveCurrentPage } = get()
    // 先自动保存当前页面，保证导出包为最新内容
    await saveCurrentPage()

    const appService = localRepoService.getCurrentAppService()
    // 无打开页面直接返回空
    if (!currentOpenPageId) return null

    const shareInfo = {}
    // 获取当前页面json配置
    const pageFile = await appService.getFile(currentOpenPageId)
    if (!pageFile?.json) return null

    // 应用包基础信息
    const packageJSON = await appService.getAppPackageJSON()
    // 打包后的完整应用包Blob（上传主文件）
    const exportedFileBlob = await appService.getAppArchiveFileBlob()
    if (!exportedFileBlob) return null

    // 图标处理
    shareInfo.iconUrl = ''
    shareInfo.iconFile = null
    if (packageJSON.icon) {
      const iconFile = await appService.getFile(packageJSON.icon)
      if (iconFile) {
        shareInfo.iconUrl = iconFile.url
        // 转Blob用于formData上传
        shareInfo.iconFile = await dataURLtoBlob(iconFile.url)
      }
    }

    // 对齐弹窗所需字段
    shareInfo.appName = packageJSON.description || '未命名应用'
    shareInfo.pageName = pageFile.json.title || '未命名页面'
    shareInfo.pageDesc = pageFile.json.userPrompt || ''
    shareInfo.fileSize = exportedFileBlob.size
    // 此字段废弃，弹窗内部走接口实时查询 realIsShared
    shareInfo.isShared = false
    // 主上传文件Blob
    shareInfo.appFile = exportedFileBlob

    return shareInfo
  },
  backToEdit: async (id) => {
    set({
      currentPanel: 'app'
    })
  },

  previewPage: async (id) => {
    const appService = localRepoService.getCurrentAppService()
    const { workspaceControl, saveCurrentPage } = get()

    workspaceControl.selectElements([])

    await saveCurrentPage()

    const file = await appService.getFile(id)
    set({
      currentPanel: 'preview'
    })

    if (file) {
      const previewComposite = new Composite({
        loader,
        appService: localRepoService.getCurrentAppService(),
        appName: 'local',
        config: cloneDeep(file.json)
      })
      await previewComposite.mount(document.querySelector('.preview-view-port'))
      set({
        previewComposite
      })
    }
  },
  closePreviewPage: async () => {
    const { previewComposite } = get()

    if (previewComposite) {
      previewComposite.unmount()
    }
  },
  refreshPreviewPage: async () => {
    const { previewComposite } = get()

    if (previewComposite) {
      previewComposite.unmount()
      await previewComposite.mount(document.querySelector('.preview-view-port'))
    }
  }
}))

export default editorStore
