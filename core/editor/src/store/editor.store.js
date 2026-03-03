import { create } from 'zustand'
import { localRepoService } from './app.store'

import { cloneDeep } from 'ridgejs/src/utils/object'

const editorStore = create((set, get) => ({
  isPreview: false,
  currentOpenPageId: null,
  zoom: 100,
  openedPages: [],
  unsavedPages: [],
  pageOpened: false,
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

  editorComposite: null,
  openedFileContentMap: new Map(),
  pageTransformMap: new Map(),
  codeEditorRef: null,
  workspaceControl: null,

  setWorkspaceControl: workspaceControl => {
    set({
      workspaceControl
    })
  },

  selectElement: async element => {
    set({
      currentEditNodeId: element.getId()
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

  },

  updateNodeRect: (rect) => {
    const { currentOpenPageId, unsavedPages } = get()
    set({
      unsavedPages: [...unsavedPages, currentOpenPageId]
    })
    set({
      currentEditNodeRect: rect
    })
  },
  openFile: async id => {
    const appService = localRepoService.getCurrentAppService()

    if (appService) {
      const file = await appService.getFile(id)
      if (file) {
        if (file.type === 'page') {
          get().openPage(file)
        } else if (file.mimeType.startsWith('text/')) {
          get().openCode(file)
        } else if (file.mimeType.startsWith('image/')) {
          get().openImage(file)
        }
      }
    }
  },

  openPage: async page => {
    const { currentOpenPageId, closeCurrentPage, openedFileContentMap, pageTransformMap, workspaceControl, openedPages } = get()
    if (currentOpenPageId === page.id) {
      return
    }

    if (currentOpenPageId) {
      closeCurrentPage(true)
    }

    openedFileContentMap.set(page.id, page.content)

    const editorComposite = await workspaceControl.loadPage(cloneDeep(page.json))
    const transform = pageTransformMap.get(page.id)
    if (transform) {
      workspaceControl.setTransform(transform)
    } else {
      workspaceControl.setTransform({})
    }

    set({
      currentOpenPageId: page.id,
      openedPages: openedPages.find(p => p.id === page.id)
        ? openedPages
        : [...openedPages, {
            id: page.id,
            name: page.name
          }],
      pageOpened: true,
      editorComposite
    })
  },

  saveCurrentPage: async () => {
    const { currentOpenPageId, editorComposite, unsavedPages } = get()

    if (currentOpenPageId && editorComposite) {
      const appService = localRepoService.getCurrentAppService()
      appService.updateFileContent(currentOpenPageId, JSON.stringify(editorComposite.exportPageJSON(), null, 2))
      set({
        unsavedPages: unsavedPages.filter(pid => pid !== currentOpenPageId)
      })
    }
  },

  closeCurrentPage: (keep) => {
    const { currentOpenPageId, openedFileContentMap, editorComposite, pageTransformMap, setPageOpened, workspaceControl } = get()
    if (keep) {
      openedFileContentMap.set(currentOpenPageId, editorComposite.exportPageJSON())
      pageTransformMap.set(currentOpenPageId, workspaceControl.getTransform())
    } else {
      openedFileContentMap.delete(currentOpenPageId)
    }
    if (editorComposite) {
      editorComposite.unmount()
    }

    set({
      currentOpenPageId: null,
      editorComposite: null
    })
    workspaceControl.disable()

    if (openedFileContentMap.length === 0) {
      setPageOpened(false)
    }
  },

  closePage: (id) => {
    
  },

  openCode: async file => {

  },

  zoomChange: () => {

  }

}))

export default editorStore
