import React, { useState, useRef } from 'react'
import { createRoot } from 'react-dom/client'

// 全局接口方法，对接后端 /app/share/info/:inviteCode
const getShareInfoByCode = async (code) => {
  const res = await fetch(`/api/app/share/info/${code}`)
  return res.json()
}

const ShareQueryPage = () => {
  // 输入值、加载、分享详情、错误提示
  const [code, setCode] = useState('')
  const [loading, setLoading] = useState(false)
  const [info, setInfo] = useState(null)
  const [errorMsg, setErrorMsg] = useState('')
  const inputRef = useRef(null)

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

  // 打开应用（预留空方法）
  const openApp = () => {
    // 业务逻辑自行填充
    console.log('打开应用', info)
  }

  // 复制链接
  const copyUrl = async () => {
    const url = window.location.origin + '/app/share/info/' + code
    await navigator.clipboard.writeText(url)
    alert('链接已复制')
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
          onClick={handleSearch}
          disabled={loading || code.length !== 6}
          style={searchBtn}
        >
          {loading ? '查询中...' : '查询分享'}
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
              <span style={codeText}>{code}</span>
            </div>
            <div style={infoRow}>
              <span style={label}>应用名称：</span>
              <span>{info.extraData.appName}</span>
            </div>
            <div style={infoRow}>
              <span style={label}>页面名称：</span>
              <span>{info.extraData.pageName}</span>
            </div>
            <div style={infoRow}>
              <span style={label}>页面描述：</span>
              <p style={descText}>{info.extraData.pageDesc || '无'}</p>
            </div>
            <div style={infoRow}>
              <span style={label}>文件哈希：</span>
              <span style={hashText}>{info.fileHash || '-'}</span>
            </div>

            <div style={btnGroup}>
              <button onClick={openApp} style={primaryBtn}>进入应用</button>
              <button onClick={copyUrl} style={lightBtn}>复制访问链接</button>
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
const searchBtn = {
  width: '100%',
  height: '52px',
  fontSize: '18px',
  borderRadius: '10px',
  border: 'none',
  background: '#4080ff',
  color: '#fff',
  cursor: 'pointer',
  marginTop: '8px'
}
const cardWrap = {
  marginTop: '32px',
  background: '#fff',
  borderRadius: '14px',
  padding: '24px',
  boxSizing: 'border-box'
}
const iconImg = {
  width: '120px',
  height: '120px',
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
