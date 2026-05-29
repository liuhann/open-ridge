import React, { useEffect } from 'react'
import Editor from './Editor.jsx'
import Home from './home/RidgeHome.jsx'
import appStore from './store/app.store.js'

const App = () => {
  const initAppStore = appStore((state) => state.initAppStore)
  const currentAppId = appStore((state) => state.currentAppId)

  useEffect(() => {
    initAppStore()
  }, [])

  if (!currentAppId) {
    return <Home key='home' />
  } else {
    return <Editor key={currentAppId} />
  }
}

export default App
