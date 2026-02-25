// src/store/useStore.js
import { create } from 'zustand'

import { localRepoService } from './app.store'

const useStore = create((set, get) => ({
  openFile: async id => {
    
  },

  createFolder: async (parentId, name) => {
    try {
      await appService.createDirectory(parentId, name)
      await get().initAppStore()
      return true
    } catch (e) {
      return false
    }
  },

  fileRename: async (fileId, name) => {
    const renamed = await appService.rename(fileId, name)
    if (renamed === 1) {
      await get().initAppStore()
    }
    return renamed
  }
}))

export default useStore
