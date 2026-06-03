import React, { useState, useEffect } from 'react'
import { Modal, Steps, TextArea, Button, Space, Typography, Card, Toast } from '@douyinfe/semi-ui'
import ComponentMultiSelectPanel from '../../components/ComponentMultiSelect/ComponentMultiSelectPanel.jsx'
import { generateAIPrompt } from './utils.js'

const { Title, Text } = Typography

export default function AIGenerateModal (props) {
  const { visible, onClose, onFinish } = props

  const [selectedComponents, setSelectedComponents] = useState([])

  const [current, setCurrent] = useState(0)
  const [prompt, setPrompt] = useState('')
  const [copyText, setCopyText] = useState('')
  const [pageJson, setPageJson] = useState('')
  const [scriptContent, setScriptContent] = useState('') // 重命名

  const [generating, setGenerating] = useState(false)

  // 校验错误信息
  const [jsonError, setJsonError] = useState('')
  const [scriptError, setScriptError] = useState('')

  // 关闭时重置所有
  const handleClose = () => {
    setCurrent(0)
    setCopyText('')
    setPageJson('')
    setSelectedComponents([])
    setScriptContent('')
    setJsonError('')
    setScriptError('')
    onClose()
  }

  const handleFinish = async () => {
    if (jsonError || scriptError) return
    const result = await onFinish({
      userPrompt: prompt,
      pageJson: JSON.parse(pageJson),
      scriptContent
    })
    // 对于重名等情况， 可以让用户继续修改以便完成后续步骤
    if (result === true) {
      handleClose()
    }
  }

  // 复制
  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(copyText)
      Toast.success('复制成功')
    } catch (err) {
      Toast.error('复制失败')
    }
  }

  // 粘贴
  const handlePaste = async (setter) => {
    try {
      const text = await navigator.clipboard.readText()
      setter(text)
      Toast.success('粘贴成功')
    } catch (err) {
      Toast.error('粘贴失败')
    }
  }

  // 生成提示词
  const onStep1Click = async () => {
    try {
      setGenerating(true)
      const aiPrompt = await generateAIPrompt(selectedComponents)
      setCopyText(aiPrompt + '\n\n' + prompt)
      setCurrent(1)
    } catch (err) {
      console.error(err)
      Toast.error('生成提示词失败')
    } finally {
      setGenerating(false)
    }
  }

  // ==========================
  /// 🔥 核心：实时校验 JSON / JS
  // ==========================
  useEffect(() => {
    // 校验 pageJson
    if (pageJson.trim() === '') {
      setJsonError('')
      return
    }
    try {
      JSON.parse(pageJson)
      setJsonError('')
    } catch (e) {
      setJsonError('JSON 格式不合法：' + e.message)
    }
  }, [pageJson])
  // =========================
  // 校验 JS 脚本（专门适配 RidgeUI 格式）
  // =========================
  useEffect(() => {
    if (!scriptContent) {
      setScriptError('')
      return
    }

    try {
    // 创建 script 标签校验 JS 模块语法
      const script = document.createElement('script')
      script.type = 'module'
      script.textContent = scriptContent

      // 只要不抛异常就是语法正确
      setScriptError('')
    } catch (e) {
      setScriptError('JS 语法错误：' + e.message)
    }
  }, [scriptContent])

  return (
    <Modal
      title='AI 应用生成向导'
      visible={visible}
      onCancel={onClose}
      style={{ marginTop: 20 }}
      footer={null}
      width={1080}
      destroyOnClose
    >
      <div style={{ padding: '8px 0 20px' }}>
        <Steps
          type='basic'
          size='small'
          current={current}
          onChange={(i) => setCurrent(i)}
          style={{ marginBottom: 28 }}
        >
          <Steps.Step title='输入提示词 + 选择组件' description='配置生成要求' />
          <Steps.Step title='复制提示词' description='复制内容前往AI平台提问' />
          <Steps.Step title='粘贴JSON结果' description='填入页面与脚本配置' />
        </Steps>

        <Card bodyStyle={{ padding: '24px' }}>
          {/* ========== 第一步 ========== */}
          {current === 0 && (
            <div>
              <Title heading={6}>第一步：输入应用提示词</Title>
              <Text type='tertiary' style={{ marginBottom: 16, display: 'block' }}>
                描述你想要生成的应用，下方可选择组件库
              </Text>

              <TextArea
                placeholder='请输入提示词，例如：生成一个数据可视化大屏'
                value={prompt}
                onChange={setPrompt}
                rows={5}
                style={{ marginBottom: 20 }}
              />

              <Title heading={6} style={{ marginBottom: 12 }}>选择组件库</Title>
              <div
                style={{
                  height: 320,
                  border: '1px dashed #ccc',
                  borderRadius: 8,
                  marginBottom: 20
                }}
              >
                <ComponentMultiSelectPanel
                  defaultSelected={selectedComponents}
                  onSelectionChange={setSelectedComponents}
                />
              </div>

              <Space>
                <Button onClick={handleClose}>取消</Button>
                <Button type='primary' loading={generating} onClick={onStep1Click}>
                  下一步
                </Button>
              </Space>
            </div>
          )}

          {/* ========== 第二步 ========== */}
          {current === 1 && (
            <div>
              <Title heading={6}>第二步：复制提示词前往AI平台生成</Title>
              <Text type='tertiary' style={{ marginBottom: 16 }}>
                复制下方全部文本，到豆包等AI平台提问获取结果
              </Text>

              <div style={{ marginBottom: 16 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                  <Text strong>AI 提示词</Text>
                  <Button size='small' onClick={handleCopy}>复制到剪贴板</Button>
                </div>
                <TextArea
                  readOnly
                  value={copyText}
                  rows={20}
                  style={{
                    fontFamily: 'Consolas, monospace',
                    fontSize: 13,
                    backgroundColor: '#f7f8fa'
                  }}
                />
              </div>

              <Space>
                <Button onClick={() => setCurrent(0)}>上一步</Button>
                <Button type='primary' onClick={() => setCurrent(2)}>
                  已获取结果，前往粘贴
                </Button>
              </Space>
            </div>
          )}

          {/* ========== 第三步：带实时校验 ========== */}
          {current === 2 && (
            <div>
              <Title heading={6}>第三步：粘贴AI返回的内容</Title>
              <Text type='tertiary' style={{ marginBottom: 16 }}>
                系统会自动校验 JSON 格式与 JS 语法
              </Text>

              {/* === 页面 JSON === */}
              <div style={{ marginBottom: 16 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                  <Text strong>页面JSON</Text>
                  <Button size='small' onClick={() => handlePaste(setPageJson)}>
                    粘贴剪贴板
                  </Button>
                </div>
                <TextArea
                  value={pageJson}
                  onChange={setPageJson}
                  rows={8}
                  placeholder='粘贴页面配置 JSON'
                  style={{
                    fontFamily: 'Consolas, monospace',
                    fontSize: 13,
                    border: jsonError ? '1px solid red' : '1px solid #d0d0d0',
                    backgroundColor: '#f7f8fa'
                  }}
                />
                {jsonError && (
                  <Text type='danger' size='small' style={{ marginTop: 4, display: 'block' }}>
                    {jsonError}
                  </Text>
                )}
              </div>

              {/* === JS 脚本 === */}
              <div style={{ marginBottom: 20 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                  <Text strong>页面脚本(JS)</Text>
                  <Button size='small' onClick={() => handlePaste(setScriptContent)}>
                    粘贴剪贴板
                  </Button>
                </div>
                <TextArea
                  value={scriptContent}
                  onChange={setScriptContent}
                  rows={8}
                  placeholder='粘贴脚本 JS'
                  style={{
                    fontFamily: 'Consolas, monospace',
                    fontSize: 13,
                    border: scriptError ? '1px solid red' : '1px solid #d0d0d0',
                    backgroundColor: '#f7f8fa'
                  }}
                />
                {scriptError && (
                  <Text type='danger' size='small' style={{ marginTop: 4, display: 'block' }}>
                    {scriptError}
                  </Text>
                )}
              </div>

              <Space>
                <Button onClick={() => setCurrent(1)}>上一步</Button>
                <Button
                  type='primary'
                  onClick={handleFinish}
                  disabled={!!jsonError || !!scriptError}
                >
                  完成并导入
                </Button>
              </Space>
            </div>
          )}
        </Card>
      </div>
    </Modal>
  )
}
