import axios from 'axios'

// 会话存储 key，前后统一
const SESS_KEY = 'user_sess'

// 创建实例
const http = axios.create({
  baseURL: '/api',
  timeout: 10000
})

// 请求拦截器：自动携带登录凭证
http.interceptors.request.use(config => {
  const sess = localStorage.getItem(SESS_KEY)
  if (sess) {
    // 标准小写header，后端完全匹配
    config.headers['x-ridge-cloud-sess'] = sess
  }
  return config
})

// 响应拦截器：统一业务错误处理
http.interceptors.response.use(
  res => {
    return res.data
  },
  err => {
    const msg = err.response?.data?.msg || err.message || '网络请求异常'
    throw new Error(msg)
  }
)

/**
 * 构造上传用 FormData
 * @param {File} mainFile 主应用包
 * @param {File|null} iconFile 图标文件
 * @param {Object} extraData 业务信息
 * @returns FormData
 */
function buildShareFormData (mainFile, iconFile, extraData) {
  const fd = new FormData()
  fd.append('file', mainFile)
  if (iconFile) fd.append('icon', iconFile)
  fd.append('extraData', JSON.stringify(extraData))
  return fd
}

export const ShareEditApi = {
  // 检查当前用户该应用页面是否已分享（修复参数：appId 替换 appName）
  checkShareExist (appId, pageName) {
    return http.get('/app/share/check-exist', {
      params: { appId, pageName }
    })
  },

  // 普通上传分享
  uploadShare (mainFile, iconFile, extraData) {
    const formData = buildShareFormData(mainFile, iconFile, extraData)
    // 移除手动 Content-Type，axios 自动携带带 boundary 的 multipart/form-data
    return http.post('/app/share', formData)
  },

  // 覆盖上传分享
  coverUploadShare (mainFile, iconFile, extraData) {
    const formData = buildShareFormData(mainFile, iconFile, extraData)
    // 移除手动 Content-Type
    return http.post('/app/share/cover', formData)
  },

  // 获取当前用户全部分享列表
  getMyShareList () {
    return http.get('/app/share/list')
  },

  // 撤销分享
  cancelShare (inviteCode) {
    return http.delete(`/app/share/${inviteCode}`)
  },

  // 预留模糊搜索（暂未实现）
  fuzzySearch (appName = '', pageDesc = '') {
    return http.get('/app/share/search', {
      params: { appName, pageDesc }
    })
  },

  // 下载文件（axios blob 方案）
  downloadFile (inviteCode) {
    return http.get(`/app/share/${inviteCode}`, {
      responseType: 'blob'
    })
  }
}
