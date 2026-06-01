import React, { useState } from 'react'
import { Modal, Steps, TextArea, Button, Space, Typography, Card } from '@douyinfe/semi-ui'
import ComponentMultiSelectPanel from '../../components/ComponentMultiSelect/ComponentMultiSelectPanel.jsx'

const { Title, Text } = Typography

export default function AIGenerateModal (props) {
  const { visible, onClose, onFinish } = props

  const [selectedComponents, setSelectedComponents] = useState([])

  const [current, setCurrent] = useState(0)
  const [prompt, setPrompt] = useState('')
  const [copyText, setCopyText] = useState('')
  const [pageJson, setPageJson] = useState('')
  const [scriptJson, setScriptJson] = useState('')

  const handleClose = () => {
    setCurrent(0)
    setCopyText('')
    setPageJson('')
    setScriptJson('')
    onClose()
  }

  const handleFinish = () => {
    onFinish({
      userPrompt: prompt,
      pageJson,
      scriptJson
    })
    handleClose()
  }

  // 复制到剪贴板
  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(copyText)
    } catch (err) {
      console.log('复制失败', err)
    }
  }

  // 从剪贴板粘贴
  const handlePaste = async (setter) => {
    try {
      const text = await navigator.clipboard.readText()
      setter(text)
    } catch (err) {
      console.log('粘贴失败', err)
    }
  }

  // 进入第二步自动生成提示词
  React.useEffect(() => {
    if (current === 1) {
      const fullText = `根据需求生成前端JSON配置：${prompt || '暂无提示词'}`
      setCopyText(fullText)
    }
  }, [current, prompt])

  return (
    <Modal
      title='AI 应用生成向导'
      visible={visible}
      onCancel={handleClose}
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
              <div style={{
                display: 'flex',
                gap: '20px',
                alignItems: 'bottom'
              }}
              >
                <Title heading={6}>第一步：输入应用提示词</Title>
                <Text type='tertiary' style={{ marginBottom: 16, display: 'block' }}>
                  描述你想要生成的应用，下方可选择组件库
                </Text>
              </div>

              <TextArea
                placeholder='请输入提示词，例如：生成一个数据可视化大屏'
                value={prompt}
                onChange={setPrompt}
                rows={5}
                style={{ marginBottom: 20 }}
              />

              <div style={{
                display: 'flex',
                gap: '20px',
                alignItems: 'bottom'
              }}
              >
                <Title heading={6} style={{ marginBottom: 12 }}>
                  选择组件库
                </Title>
              </div>

              <div
                style={{
                  height: 320,
                  border: '1px dashed #ccc',
                  borderRadius: 8,
                  marginBottom: 20
                }}
              >
                <ComponentMultiSelectPanel
                  defaultSelected={selectedComponents} onSelectionChange={selected => {
                    setSelectedComponents(selected)
                  }}
                />
              </div>
              <Space>
                <Button onClick={handleClose}>取消</Button>
                <Button type='primary' onClick={() => setCurrent(1)}>
                  下一步
                </Button>
              </Space>
            </div>
          )}

          {/* ========== 第二步：统一样式 ========== */}
          {current === 1 && (
            <div>
              <Title heading={6}>第二步：复制提示词前往AI平台生成</Title>
              <Text type='tertiary' style={{ marginBottom: 16, display: 'block' }}>
                复制下方全部文本，到豆包等AI平台提问获取结果
              </Text>

              <div style={{ marginBottom: 16 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                  <Text strong>AI 提示词</Text>
                  <Button size='small' onClick={handleCopy}>
                    复制到剪贴板
                  </Button>
                </div>
                <TextArea
                  readOnly
                  value={copyText}
                  rows={20}
                  style={{
                    fontFamily: 'Consolas, Monaco, monospace',
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

          {/* ========== 第三步：和第二步完全一致 ========== */}
          {current === 2 && (
            <div>
              <Title heading={6}>第三步：粘贴AI返回的JSON内容</Title>
              <Text type='tertiary' style={{ marginBottom: 16, display: 'block' }}>
                将AI生成的内容分别粘贴至对应配置框
              </Text>

              <div style={{ marginBottom: 16 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
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
                    fontFamily: 'Consolas, Monaco, monospace',
                    fontSize: 13,
                    backgroundColor: '#f7f8fa'
                  }}
                />
              </div>

              <div style={{ marginBottom: 20 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                  <Text strong>页面脚本(JS)</Text>
                  <Button size='small' onClick={() => handlePaste(scriptJson)}>
                    粘贴剪贴板
                  </Button>
                </div>
                <TextArea
                  value={scriptJson}
                  onChange={setScriptJson}
                  rows={8}
                  placeholder='粘贴脚本配置 JSON'
                  style={{
                    fontFamily: 'Consolas, Monaco, monospace',
                    fontSize: 13,
                    backgroundColor: '#f7f8fa'
                  }}
                />
              </div>

              <Space>
                <Button onClick={() => setCurrent(1)}>上一步</Button>
                <Button type='primary' onClick={handleFinish}>
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
