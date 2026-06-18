import React, { useRef, useState, forwardRef, useEffect, useImperativeHandle } from 'react'
import { SideSheet, Spin, Tabs, TabPane, Modal, Toast, Typography, Button } from '@douyinfe/semi-ui'
import editorStore from '../../store/editor.store.js'
import { ICON_COMMON_CLOSE, ICON_COMMON_SAVE, ICON_COMMON_DOWNLOAD } from '../../icons/icons.js'
import CodeMirror from '@uiw/react-codemirror'

const { Text } = Typography

// ---------- 工具函数：剪贴板、文件下载 ----------
async function getTextFromClipboard () {
  try {
    // 方式1：使用现代剪贴板 API（推荐）
    if (navigator.clipboard && window.isSecureContext) {
      const text = await navigator.clipboard.readText()
      return text
    }
  } catch (err) {
    return false
  }
}

/**
 * 将文本复制到剪贴板
 * @param {string} text 要复制的文本内容
 * @returns {Promise<boolean>} 复制成功返回 true，失败返回 false
 */
async function copyTextToClipboard (text) {
  if (typeof text !== 'string') {
    console.error('复制失败：传入的内容不是字符串')
    return false
  }
  try {
    // 方式1：现代剪贴板 API（推荐）
    if (navigator.clipboard && window.isSecureContext) {
      await navigator.clipboard.writeText(text)
      return true
    }
    return true
  } catch (err) {
    console.error(`复制到剪贴板失败：${err.message}`)
    return false
  }
}

/**
 * 下载文本为 .txt 文件
 * @param {string} text 要下载的文本内容
 * @param {string} filename 自定义文件名（默认：download.txt）
 * @param {string} charset 文件编码（默认：utf-8）
 */
function downloadTextAsFile (text, filename = 'download.txt', charset = 'utf-8') {
  try {
    // 创建 Blob 对象（二进制数据）
    const blob = new Blob([text], {
      type: `text/plain; charset=${charset}`
    })

    // 创建下载链接
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    // 处理文件名特殊字符（避免乱码）
    link.download = encodeURIComponent(filename).replace(/%20/g, ' ')

    // 模拟点击下载
    document.body.appendChild(link)
    link.click()

    // 清理资源
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
  } catch (err) {
    console.error(`文件下载失败：${err.message}`)
  }
}

// ---------- 轻量 JS 语法检测（无额外依赖，仅检测语法错误） ----------
function checkJsSyntax (code) {
  try {
    // 预处理兼容 ES Module 语法：移除 import/export 关键字后再做语法校验
    const processedCode = code
      .replace(/^import\s+.*?;?$/gm, '') // 移除 import 整行
      .replace(/^export\s+default\s+/gm, 'return ') // 替换 export default 为 return
      .replace(/^export\s+/gm, '') // 移除普通 export 前缀
    new Function(processedCode)
    return null
  } catch (error) {
    return error.message
  }
}

// CodeMirror 自定义 JS 语法 linter（仅抛语法错误）
const simpleJsLinter = (view) => {
  const code = view.state.doc.toString()
  const errorMsg = checkJsSyntax(code)
  if (!errorMsg) return []
  return [
    {
      from: 0,
      to: view.state.doc.length,
      severity: 'error',
      message: `语法错误: ${errorMsg}`
    }
  ]
}

// ---------- 组件主体 ----------
export default forwardRef((props, ref) => {
  const [tabs, setTabs] = useState([])
  const [currentTab, setCurrentTab] = useState('')
  // 仅存储保存函数，不绑定DOM，避免引用冲突
  const saveFnRef = useRef(null)

  const [currentEditText, setCurrentEditText] = useState('')
  const [loading, setLoading] = useState(true)
  const [visible, setVisible] = useState(false)

  // 多Tab内容缓存、修改标记
  const [contents, setContents] = useState({})
  const [changes, setChanges] = useState({})

  const saveFile = editorStore(state => state.saveFile)
  const extensionsRef = useRef({})

  // 加载 CodeMirror 扩展（仅首次执行一次）
  const loadExtensions = async () => {
    const { tooltips, keymap } = await import(/* webpackChunkName: "codemirror-common" */ '@codemirror/view')
    const { indentWithTab } = await import(/* webpackChunkName: "codemirror-common" */ '@codemirror/commands')
    const { javascript } = await import(/* webpackChunkName: "codemirror-js" */ '@codemirror/lang-javascript')
    const { json, jsonParseLinter } = await import(/* webpackChunkName: "codemirror-json" */ '@codemirror/lang-json')
    const { markdown } = await import(/* webpackChunkName: "codemirror-md" */ '@codemirror/lang-markdown')
    const { linter, lintGutter } = await import(/* webpackChunkName: "codemirror-linter" */ '@codemirror/lint')

    // 基础通用扩展
    const baseExtensions = [
      keymap.of([
        { key: 'Mod-s', run: () => saveFnRef.current?.(), preventDefault: true },
        indentWithTab
      ]),
      tooltips({ position: 'absolute' }),
      lintGutter()
    ]

    extensionsRef.current = {
      // JS：语法高亮 + 轻量语法错误检测
      js: [...baseExtensions, javascript(), linter(simpleJsLinter)],
      // JSON：语法高亮 + 官方原生语法检测
      json: [...baseExtensions, json(), linter(jsonParseLinter())],
      // MD：仅语法高亮
      md: [...baseExtensions, markdown()]
    }
  }

  // 保存文件
  const handleSave = async () => {
    if (!currentTab) return
    await saveFile(currentTab, currentEditText)
    // 函数式更新，避免闭包旧值
    setChanges(prev => ({ ...prev, [currentTab]: null }))
    Toast.success('保存成功')
  }

  // 保持保存函数引用始终为最新
  useEffect(() => {
    saveFnRef.current = handleSave
  }, [handleSave])

  // 外部调用：打开文件
  const openFile = async (file) => {
    setVisible(true)

    // 识别文件类型
    let type = 'js'
    if (file.name.endsWith('.json')) type = 'json'
    else if (file.name.endsWith('.md')) type = 'md'

    // 函数式更新Tab：避免连续打开文件时闭包旧值覆盖
    setTabs(prevTabs => {
      const existed = prevTabs.find(tab => tab.id === file.id)
      if (!existed) {
        return [...prevTabs, { id: file.id, name: file.name, file, type }]
      }
      return prevTabs
    })

    setCurrentTab(file.id)

    // 仅首次加载编辑器扩展
    if (loading) {
      await loadExtensions()
      setLoading(false)
    }

    // 统一规则：本地缓存优先，无缓存才用原始文件内容（全类型兼容）
    setContents(prevContents => {
      if (prevContents[file.id] !== undefined) {
        setCurrentEditText(prevContents[file.id])
        return prevContents
      }
      setCurrentEditText(file.textContent)
      return { ...prevContents, [file.id]: file.textContent }
    })
  }

  // 暴露给父组件的方法
  useImperativeHandle(ref, () => ({
    openFile
  }))

  // 执行关闭Tab
  const doOnTabClose = (key) => {
    setTabs(prevTabs => {
      const leftTabs = prevTabs.filter(tab => tab.id !== key)
      // 关闭当前Tab时自动切换到最后一个
      if (key === currentTab) {
        if (leftTabs.length === 0) {
          setCurrentEditText(null)
          setCurrentTab('')
        } else {
          const targetTab = leftTabs[leftTabs.length - 1]
          setCurrentTab(targetTab.id)
          setContents(prev => {
            setCurrentEditText(prev[targetTab.id])
            return prev
          })
        }
      }
      return leftTabs
    })

    // 清理对应缓存
    setContents(prev => ({ ...prev, [key]: null }))
    setChanges(prev => ({ ...prev, [key]: null }))
  }

  // Tab关闭前确认
  const onTabClose = (key) => {
    if (changes[key]) {
      Modal.confirm({
        title: '当前代码有未保存修改，关闭后将丢失，是否继续？',
        onOk: () => doOnTabClose(key)
      })
    } else {
      doOnTabClose(key)
    }
  }

  // 切换Tab
  const onTabChange = (key) => {
    setCurrentTab(key)
    // 从缓存恢复内容，函数式写法确保取到最新值
    setContents(prev => {
      setCurrentEditText(prev[key])
      return prev
    })
  }

  // 渲染Tab标题（带修改标记）
  const renderTab = (tab) => {
    return changes[tab.id] ? `${tab.name} *` : tab.name
  }

  const hasOpenFile = tabs.length > 0

  // 代码变更回调
  const onCodeChange = (val) => {
    setCurrentEditText(val)
    // 函数式更新：彻底解决频繁输入时的闭包覆盖问题
    setChanges(prev => ({ ...prev, [currentTab]: true }))
    setContents(prev => ({ ...prev, [currentTab]: val }))
  }

  // 顶部标题栏
  const RenderTitle = () => {
    return (
      <div className='code-edit-title'>
        <Text className='flex-1'>代码编辑</Text>
        <Button
          disabled={!hasOpenFile}
          icon={ICON_COMMON_SAVE}
          onClick={handleSave}
        >
          保存
        </Button>
        <Button
          disabled={!hasOpenFile}
          icon={<i className='bi bi-copy' />}
          onClick={async () => {
            const result = await copyTextToClipboard(currentEditText)
            if (result) Toast.success('已经将代码复制到剪切板')
          }}
        >
          复制
        </Button>
        <Button
          disabled={!hasOpenFile}
          type='tertiary'
          icon={<i className='bi bi-clipboard-check' />}
          onClick={async () => {
            const text = await getTextFromClipboard()
            if (text) {
              setCurrentEditText(text)
              setChanges(prev => ({ ...prev, [currentTab]: true }))
              setContents(prev => ({ ...prev, [currentTab]: text }))
            }
          }}
        >
          粘贴
        </Button>
        <Button
          disabled={!hasOpenFile}
          type='tertiary'
          icon={ICON_COMMON_DOWNLOAD}
          onClick={() => {
            const currentTabInfo = tabs.find(tab => tab.id === currentTab)
            if (currentTabInfo) downloadTextAsFile(currentEditText, currentTabInfo.name)
          }}
        />
        <Button
          type='tertiary'
          icon={ICON_COMMON_CLOSE}
          onClick={() => setVisible(false)}
        />
      </div>
    )
  }

  // 获取当前文件对应的编辑器扩展
  const getCurrentExtensions = () => {
    const currentTabInfo = tabs.find(t => t.id === currentTab)
    return extensionsRef.current[currentTabInfo?.type || 'js'] || []
  }

  return (
    <SideSheet
      className='code-edit-sheet'
      keepDOM
      width={1200}
      closeOnEsc={false}
      size='large'
      mask={false}
      closable={false}
      maskClosable={false}
      title={<RenderTitle />}
      onClose={() => setVisible(false)}
      visible={visible}
      footer={<div />}
      bodyStyle={{
        zIndex: 1001,
        overflow: 'hidden'
      }}
    >
      <Spin
        tip='正在加载代码编辑模块，请稍候..'
        spinning={loading}
        style={{ height: '100%', width: '100%' }}
      >
        <Tabs
          type='card'
          collapsible
          activeKey={currentTab}
          onTabClose={onTabClose}
          onChange={onTabChange}
        >
          {tabs.map(tab => (
            <TabPane
              closable
              tab={renderTab(tab)}
              itemKey={tab.id}
              key={tab.id}
            />
          ))}
        </Tabs>

        <div
          style={{
            height: 'calc(100% - 40px)',
            overflow: 'auto',
            display: 'flex',
            flexDirection: 'column'
          }}
        >
          {!loading && currentEditText != null && (
            <CodeMirror
              value={currentEditText}
              basicSetup
              extensions={getCurrentExtensions()}
              onChange={onCodeChange}
              style={{ flex: 1 }}
            />
          )}
        </div>

        <div
          style={{
            visibility: hasOpenFile ? 'hidden' : 'visible',
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            color: '#999'
          }}
          className='no-open-script-file'
        >
          暂无打开的脚本文件
        </div>
      </Spin>
    </SideSheet>
  )
})
