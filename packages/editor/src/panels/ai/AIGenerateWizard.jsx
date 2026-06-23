import React, { useState } from 'react'
import { Steps, Tabs, TextArea, Button, Space, Typography, Card } from '@douyinfe/semi-ui'

const { Title, Text } = Typography
const { TabPane } = Tabs

export default function AIGenerateWizard ({
  handleFinish
}) {
  // 当前步骤：0=第一步，1=第二步，2=第三步
  const [current, setCurrent] = useState(0)
  // 提示词
  const [prompt, setPrompt] = useState('')
  // 步骤标题
  const stepTitles = ['生成配置', 'AI 生成', '粘贴结果']

  return (
    <div style={{ maxWidth: 960, margin: '0 auto', padding: '24px' }}>
      {/* === 顶部步骤条 === */}
      <Steps
        type='basic'
        size='small'
        current={current}
        onChange={(i) => setCurrent(i)}
        style={{ marginBottom: 28 }}
      >
        <Steps.Step title='输入提示词 + 选择组件' description='配置生成要求' />
        <Steps.Step title='AI 生成' description='去豆包获取代码' />
        <Steps.Step title='粘贴并完成' description='导入生成结果' />
      </Steps>

      {/* === 标签切换 === */}
      <Tabs type='button' style={{ marginBottom: 20 }}>
        <TabPane tab='文档' itemKey='1' />
        <TabPane tab='快速起步' itemKey='2' />
        <TabPane tab='帮助' itemKey='3' />
      </Tabs>

      {/* === 内容区域：根据步骤显示不同内容 === */}
      <Card bodyStyle={{ padding: '24px' }}>
        {current === 0 && (
          <div>
            <Title heading={6} style={{ marginBottom: 12 }}>
              第一步：输入应用提示词
            </Title>
            <Text type='tertiary' style={{ marginBottom: 16, display: 'block' }}>
              描述你想要生成的应用功能，系统会自动生成完整 AI 提示词
            </Text>

            {/* 提示词输入框 */}
            <TextArea
              placeholder='例如：请生成一个数据大屏，包含折线图、饼图、数据卡片、实时刷新表格'
              value={prompt}
              onChange={setPrompt}
              rows={5}
              style={{ marginBottom: 20 }}
            />

            <Title heading={6} style={{ marginBottom: 12 }}>
              选择需要使用的组件库（留空待实现）
            </Title>
            <div style={{ height: 60, border: '1px dashed #e5e6eb', borderRadius: 8, marginBottom: 20 }} />

            <Space>
              <Button type='primary' onClick={() => setCurrent(1)}>
                下一步：生成 AI 提示词
              </Button>
            </Space>
          </div>
        )}

        {current === 1 && (
          <div>
            <Title heading={6} style={{ marginBottom: 12 }}>
              第二步：复制提示词去 AI 平台生成
            </Title>
            <Text type='tertiary' style={{ marginBottom: 16, display: 'block' }}>
              复制以下内容，去豆包 / 通义 / 讯飞等平台提问
            </Text>

            <TextArea
              readOnly
              value={`根据需求生成前端代码：${prompt}\n请返回完整可运行的代码`}
              rows={8}
              style={{ marginBottom: 20 }}
            />

            <Space>
              <Button onClick={() => setCurrent(0)}>上一步</Button>
              <Button type='primary' onClick={() => setCurrent(2)}>
                已获取结果，去粘贴
              </Button>
            </Space>
          </div>
        )}

        {current === 2 && (
          <div>
            <Title heading={6} style={{ marginBottom: 12 }}>
              第三步：粘贴 AI 生成的代码
            </Title>
            <Text type='tertiary' style={{ marginBottom: 16, display: 'block' }}>
              将生成后的代码粘贴到下方编辑器（留空待实现）
            </Text>

            <div style={{ marginBottom: 16 }}>
              <Text strong>代码编辑器 1</Text>
              <div style={{ height: 160, border: '1px solid #e5e6eb', borderRadius: 8, marginTop: 8 }} />
            </div>

            <div style={{ marginBottom: 20 }}>
              <Text strong>代码编辑器 2</Text>
              <div style={{ height: 160, border: '1px solid #e5e6eb', borderRadius: 8, marginTop: 8 }} />
            </div>

            <Space>
              <Button onClick={() => setCurrent(1)}>上一步</Button>
              <Button type='primary' onClick={handleFinish}>完成并导入</Button>
            </Space>
          </div>
        )}
      </Card>
    </div>
  )
}
