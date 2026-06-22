import React, { useState, useRef } from 'react'
import { createRoot } from 'react-dom/client'
import { loadPage } from './index.js'
import Localforge from 'localforage'

// 独立 IndexedDB 存储实例
const store = Localforge.createInstance({ name: 'ridge-runtime-apps' })

// 缓存工具：按邀请码隔离多应用缓存
const fileCache = {
  // 获取当前编码对应的缓存键前缀
  getKeyPrefix: (code) => `share_${code}_`,
  // 读取对应编码的文件hash
  getHash: async (code) => {
    const key = `${fileCache.getKeyPrefix(code)}hash`
    return store.getItem(key)
  },
  // 读取对应编码的Blob包
  getBlob: async (code) => {
    const key = `${fileCache.getKeyPrefix(code)}blob`
    return store.getItem(key)
  },
  // 保存当前编码的hash与blob
  setCache: async (code, hash, blob) => {
    const prefix = fileCache.getKeyPrefix(code)
    await Promise.all([
      store.setItem(`${prefix}hash`, hash),
      store.setItem(`${prefix}blob`, blob)
    ])
  },
  // 清空单个编码缓存
  clearSingleCache: async (code) => {
    const prefix = fileCache.getKeyPrefix(code)
    await Promise.all([
      store.removeItem(`${prefix}hash`),
      store.removeItem(`${prefix}blob`)
    ])
  },
  // 清空全部分享缓存（可选全局清理）
  clearAllShareCache: async () => {
    const keys = await store.keys()
    const shareKeys = keys.filter(k => k.startsWith('share_'))
    await Promise.all(shareKeys.map(k => store.removeItem(k)))
  }
}

// 全局接口方法，对接后端 /app/share/info/:inviteCode
const getShareInfoByCode = async (code) => {
  const res = await fetch(`/api/app/share/info/${code}`)
  return res.json()
}

// 工具：下载文件二进制流返回Blob
const downloadFileBlob = async (url) => {
  const response = await fetch(url)
  if (!response.ok) throw new Error(`文件下载失败，状态码：${response.status}`)
  return response.blob()
}

const ShareQueryPage = () => {
  // 输入值、加载、分享详情、错误提示
  const [code, setCode] = useState('')
  const [loading, setLoading] = useState(false)
  const [fileLoading, setFileLoading] = useState(false)
  const [info, setInfo] = useState(null)
  const [errorMsg, setErrorMsg] = useState('')
  const inputRef = useRef(null)

  const enterDisabled = loading || code.length !== 6 || info == null

  const searchBtn = {
    width: '100%',
    height: '52px',
    fontSize: '18px',
    borderRadius: '10px',
    border: 'none',
    background: enterDisabled ? '#6b7785' : '#00b42a',
    color: '#fff',
    cursor: 'pointer'
  }

  // 仅允许数字，限制6位
  const handleInputChange = (e) => {
    let val = e.target.value.replace(/\D/g, '') // 过滤非数字
    if (val.length > 6) val = val.slice(0, 6)
    setCode(val)
    setErrorMsg('')
    // 输满6位自动查询
    if (val.length === 6) {
      fetchInfo(val)
    }
  }

  // 请求分享详情
  const fetchInfo = async (inviteCode) => {
    setLoading(true)
    setInfo(null)
    setErrorMsg('')
    try {
      const res = await getShareInfoByCode(inviteCode)
      if (res.code !== 0 || !res.data) {
        setErrorMsg('分享页面不存在或已过期')
        return
      }
      setInfo(res.data)
    } catch (err) {
      setErrorMsg('网络请求失败，请稍后重试')
    } finally {
      setLoading(false)
    }
  }

  // 手动点击查询按钮
  const handleSearch = () => {
    if (code.length !== 6) {
      setErrorMsg('请输入完整6位校验码')
      return
    }
    fetchInfo(code)
  }

  // 打开应用：按当前code独立读取缓存，多应用互不冲突
  const openApp = async () => {
    if (!info || !code) {
      setErrorMsg('未查询到分享信息，请先查询')
      return
    }
    const { fileHash, fileUrl, pageName } = info
    if (!fileUrl) {
      setErrorMsg('该分享无配套页面文件，无法进入应用')
      return
    }

    if (fileLoading) return
    setFileLoading(true)
    setErrorMsg('')

    try {
      // 读取当前编码专属缓存
      const cachedHash = await fileCache.getHash(code)
      let fileZipBlob = null

      if (cachedHash === fileHash) {
        console.log(`编码${code}：哈希匹配，读取本地缓存Blob`)
        fileZipBlob = await fileCache.getBlob(code)
        // hash存在但blob丢失，清理当前编码缓存重新下载
        if (!fileZipBlob) {
          await fileCache.clearSingleCache(code)
        }
      }

      // 无缓存/哈希变更/blob损坏，重新下载
      if (!fileZipBlob) {
        console.log(`编码${code}：资源更新或无缓存，重新下载`)
        fileZipBlob = await downloadFileBlob(fileUrl)
        // 存入当前编码独立缓存
        await fileCache.setCache(code, fileHash, fileZipBlob)
      }

      const pagePath = `/${pageName}.json`
      await loadPage('#app', fileZipBlob, pagePath)

      document.getElementById('app').style.display = ''
      document.getElementById('root').style.display = 'none'
      console.log('页面加载完成，应用已打开', info)
    } catch (err) {
      console.error('打开应用失败：', err)
      setErrorMsg(`资源加载失败：${err.message || '未知错误'}`)
      // 异常仅清理当前编码缓存，不影响其他应用缓存
      await fileCache.clearSingleCache(code)
    } finally {
      setFileLoading(false)
    }
  }

  // 复制链接
  const copyUrl = async () => {
    const url = window.location.origin + '/app/share/info/' + code
    try {
      await navigator.clipboard.writeText(url)
      alert('链接已复制到剪贴板')
    } catch (err) {
      setErrorMsg('复制失败，请手动复制链接')
      console.error('复制链接异常', err)
    }
  }

  // 清理当前编码缓存按钮方法
  const clearCurrentCodeCache = async () => {
    if (!code) return
    await fileCache.clearSingleCache(code)
    alert(`编码${code}本地缓存已清空`)
  }

  // 全局清空所有分享缓存（可选）
  const clearAllShareCache = async () => {
    await fileCache.clearAllShareCache()
    alert('全部分享应用本地缓存已清空')
  }

  return (
    <div style={pageWrap}>
      <div style={container}>
        <h1 style={title}>输入6位分享校验码</h1>
        {/* 超大输入框 */}
        <input
          ref={inputRef}
          type='text'
          value={code}
          onChange={handleInputChange}
          placeholder='------'
          style={bigInput}
          maxLength={6}
          autoFocus
        />

        {/* 错误提示 */}
        {errorMsg && <p style={errorText}>{errorMsg}</p>}
        {/* 查询按钮 */}
        <button
          onClick={openApp}
          disabled={enterDisabled}
          style={searchBtn}
        >
          {loading ? '查询中...' : '进入应用'}
        </button>

        {/* 分享详情卡片 */}
        {info && (
          <div style={cardWrap}>
            {/* 图标 */}
            {info.iconUrl
              ? (
                <img src={info.iconUrl} alt='icon' style={iconImg} />
                )
              : (
                <div style={emptyIcon}>无图标</div>
                )}

            <div style={infoRow}>
              <span style={label}>分享编码：</span>
              <span style={codeText}>{info.shareCode}</span>
            </div>
            <div style={infoRow}>
              <span style={label}>应用名称：</span>
              <span>{info.appName}</span>
            </div>
            <div style={infoRow}>
              <span style={label}>页面描述：</span>
              <p style={descText}>{info.pageDesc || '无'}</p>
            </div>
          </div>
        )}

        {/* 底部编辑器入口 */}
        <div style={footerLinkWrap}>
          <a href='/editor' style={linkText}>前往编辑器编辑页面</a>
        </div>
      </div>
    </div>
  )
}

// 全局样式 行内style，无css文件，极小打包体积
const pageWrap = {
  minHeight: '100vh',
  padding: '40px 16px',
  boxSizing: 'border-box',
  background: '#f7f8fa',
  fontFamily: 'system-ui, -apple-system, sans-serif'
}
const container = {
  display: 'flex',
  alignItems: 'stretch',
  flexDirection: 'column',
  gap: '20px',
  maxWidth: '600px',
  margin: '0 auto',
  width: '100%'
}
const title = {
  fontSize: '26px',
  textAlign: 'center',
  color: '#1d2129',
  margin: '0 0 32px'
}
// 超大输入框核心样式
const bigInput = {
  width: '100%',
  height: '80px',
  fontSize: '40px',
  textAlign: 'center',
  borderRadius: '12px',
  border: '2px solid #dcdfe6',
  outline: 'none',
  padding: '0 12px',
  boxSizing: 'border-box',
  letterSpacing: '8px'
}
const errorText = {
  color: '#f53f3f',
  textAlign: 'center',
  margin: '12px 0',
  fontSize: '16px'
}

const cardWrap = {
  marginTop: '32px',
  background: '#fff',
  borderRadius: '14px',
  padding: '24px',
  boxSizing: 'border-box'
}
const iconImg = {
  width: '64px',
  height: '64px',
  objectFit: 'contain',
  borderRadius: '8px',
  marginBottom: '16px'
}
const emptyIcon = {
  width: '120px',
  height: '120px',
  background: '#e5e6eb',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  borderRadius: '8px',
  marginBottom: '16px',
  color: '#86909c'
}
const infoRow = {
  marginBottom: '12px',
  fontSize: '16px'
}
const label = {
  fontWeight: 600,
  color: '#4e5969',
  display: 'inline-block',
  minWidth: '100px'
}
const codeText = {
  fontFamily: 'monospace',
  background: '#f2f3f5',
  padding: '2px 8px',
  borderRadius: '4px'
}
const hashText = {
  fontSize: '13px',
  wordBreak: 'break-all',
  fontFamily: 'monospace'
}
const descText = {
  margin: '4px 0 0',
  color: '#6b7785',
  lineHeight: 1.5
}
const btnGroup = {
  display: 'flex',
  gap: '12px',
  marginTop: '24px',
  flexWrap: 'wrap'
}
const primaryBtn = {
  flex: 1,
  minHeight: '44px',
  border: 'none',
  borderRadius: '8px',
  background: '#00b42a',
  color: '#fff',
  fontSize: '16px',
  cursor: 'pointer'
}
const lightBtn = {
  flex: 1,
  minHeight: '44px',
  border: '1px solid #dcdfe6',
  borderRadius: '8px',
  background: '#fff',
  fontSize: '16px',
  cursor: 'pointer'
}
const footerLinkWrap = {
  marginTop: '40px',
  textAlign: 'center'
}
const linkText = {
  fontSize: '16px',
  color: '#4080ff'
}

// 渲染挂载
const root = createRoot(document.getElementById('root'))
root.render(<ShareQueryPage />)
