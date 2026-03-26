import RidgeContext from './RidgeContext'

window.RidgeContext = RidgeContext

/**
 * 在应用根目录放入 index.html, 使用 ../ridgejs/build/webstart.min.js 路径引入当前类.
 * @returns
 */
// '/npm/ridge-website/'
// '/npm/ridge-website/'
// '/deliver/@ridge/website/'
// '/ridge-website/'
// '/@ridge/website/'
// '/any/extra/npm/ridge-website/'
function getBaseUrlAndAppName (pathname) {
  const pathParts = pathname.split('/').filter(n => n)

  let baseUrl = '/'
  let appName = ''
  if (pathParts.length >= 2) {
    if (pathParts[pathParts.length - 2].startsWith('@')) {
      appName = pathParts.join('/')
      baseUrl = '/' + pathParts.slice(0, -2).join('/')
    } else {
      appName = pathParts[pathParts.length - 1]
      baseUrl = '/' + pathParts.slice(0, -1).join('/')
    }
  } else {
    appName = pathParts[0] || ''
  }

  return {
    baseUrl,
    appName
  }
}
const getDeviceType = () => {
  const width = window.innerWidth
  return width < 768 ? 'mobile' : width < 1200 ? 'tablet' : 'desktop'
}

const emptyFn = () => {}
const showError = window.showError || emptyFn

const start = async () => {
  try {
    // 获取基础 URL 和应用名称
    const { baseUrl, appName } = getBaseUrlAndAppName(window.location.pathname)
    // 解析 URL 参数
    const usp = new URLSearchParams(window.location.search)

    // 确定仓库 URL
    const repoUrl = window.RIDGE_NPM_REPO || baseUrl || '/'
    // 确定应用包名称
    const appPkgName = window.RIDGE_HOME_APP || appName

    // 获取根元素
    const root = document.getElementById('app')
    if (!root) {
      showError('页面未包含 <div id="app" /> ')
      return
    }

    // 检查应用包名称是否存在
    if (!appPkgName) {
      showError('访问地址或RIDGE_HOME_APP未定义应用名称')
      return
    }

    // 初始化 RidgeContext
    window.ridge = new RidgeContext({
      baseUrl: repoUrl
    })

    // 加载应用包的 JSON 数据
    const appPackageJSONObject = await window.ridge.loadAppPackageJSON(appPkgName)
    if (!appPackageJSONObject) {
      window.showError && window.showError(`当前应用(${appPkgName})未找到`)
      return
    }

    // 获取设备类型
    const deviceType = getDeviceType()
    // 确定页面路径
    const pagePath = window.RIDGE_HOME_PATH || window.location.hash.substring(2) || usp.get('path') || (appPackageJSONObject.ridgeEntries?.[deviceType]) || 'index'

    console.log('pagePath', pagePath)
    // 设置根元素的 composite-hash 属性
    root.setAttribute('composite-hash', pagePath)
    // 创建并挂载组件
    const composite = window.ridge.createComposite(appPkgName, pagePath, {})
    await composite.mount(root, true)

    // 监听哈希值变化
    window.addEventListener('hashchange', () => {
      const hashPath = window.location.hash.substring(2) || (appPackageJSONObject.ridgeEntries?.[deviceType]) || 'index'
      if (root.getAttribute('composite-hash') === hashPath) {
        return
      }
      root.setAttribute('composite-hash', hashPath)
      const newComposite = window.ridge.createComposite(appPkgName, hashPath, {})
      newComposite.mount(root, true)
    })
  } catch (error) {
    // 捕获并处理其他未知错误
    showError(`发生未知错误: ${error.message}  堆栈跟踪： ${error} ${error.stack}`)
  }
}

window.addEventListener('load', function () {
  start()
})
