// src/store/useStore.js
import { create } from 'zustand'
const workSpaceStore = create((set, get) => {
  return {
    fileOpened: false,
    openFile: async id => {
      const file = await appService.getFile(id)
      if (file) {
        if (file.type === 'page') {
          await get().openPage(file)
        } else if (file.mimeType.startsWith('text/')) {
          await get().openInCodeEditor(file)
        } else if (file.mimeType.startsWith('image/')) {
          await get().openImage(file.content)
        }
      }
    },

    openPage: async file => {
      set({
        fileOpened: true
      })
    },

    openCode: async file => {

    },

    openImage: async file => {

    }
  }
})

export default workSpaceStore
