import React, { useEffect } from 'react'
import Editor from './Editor.jsx'
import Home from './home/RidgeHome.jsx'
import appStore from './store/app.store.js'
import componentStore from './store/component.store.js'

const App = () => {
  const initAppStore = appStore((state) => state.initAppStore)
  const currentAppId = appStore((state) => state.currentAppId)
  const initRegistry = componentStore((state) => state.initRegistry)

  useEffect(() => {
    initAppStore()
    initRegistry()
  }, [])

  if (!currentAppId) {
    return <Home key='home' />
  } else {
    return <Editor key={currentAppId} />
  }
}

export default App
