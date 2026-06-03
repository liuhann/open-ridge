const baseUrl = '/npm'
window.baseUrl = baseUrl

// 进度条
const progressEl = document.querySelector('progress')
const setProgress = (val) => {
  if (progressEl) {
    progressEl.setAttribute('value', Math.min(val, 100))
  }
}

// 主加载逻辑
async function loadApp () {
  try {
    // ------------------------------
    // 加载业务代码
    // ------------------------------
    const { init } = await import('./main.jsx')
    init()

    // 关闭 loading
    document.body.removeChild(document.querySelector('#loading-overview'))

    // HMR 热更新
    if (module.hot) {
      module.hot.accept('./main.jsx', () => {
        const { init: newInit } = require('./main.jsx')
        newInit()
      })
    }
  } catch (err) {
    console.error('加载失败', err)
    setProgress(100)
  }
}

loadApp()
