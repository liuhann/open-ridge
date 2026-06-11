import React, { useState } from 'react'
import { Modal, Input, Button, Typography, Space, PinCode } from '@douyinfe/semi-ui'
// import { IconLaptop, IconPlus } from '@douyinfe/semi-icons'
import { ICON_AI_PEN } from '../icons/icons.js'
import CardList from '../components/CardList/CardList.jsx'
// import styles from './CreateAppDialog.module.less' // 如果你有样式文件

const { Title, Text } = Typography

const CreateAppDialog = ({
  visible,
  onCancel,
  onConfirm
}) => {
  // 8位应用编码
  const [appCode, setAppCode] = useState('')

  // 关闭
  const handleCancel = () => {
    setAppCode('')
    onCancel()
  }

  return (
    <Modal
      footer={false}
      title='新增应用'
      visible={visible}
      width={860}
      height='80%'
      onCancel={handleCancel}
      className='new-app-dialog'
    >
      <div style={{ padding: '16px 0' }}>

        {/* ==================================
         *  1. 顶部两个按钮：AI向导 / 普通空白应用
         * ================================== */}
        <div style={{ marginBottom: 32 }}>
          <Space spacing={32} align='center'>
            {/* AI 向导（彩色按钮） */}
            <Button
              block colorful theme='solid' type='primary'
              icon={ICON_AI_PEN}
              size='large'
              style={{ width: 300, height: 64, fontSize: 16 }}
              onClick={() => onConfirm?.('ai_wizard')}
            >
              新增空白应用并打开AI向导
            </Button>

            {/* 普通空白应用 */}
            <Button
              size='large'
              style={{ width: 220, height: 64, fontSize: 16 }}
              onClick={() => onConfirm?.('empty')}
            >
              新增空白应用
            </Button>
          </Space>
        </div>

        {/* ==================================
         *  2. 输入8位编码 开始创建
         * ================================== */}
        <div style={{ marginBottom: 32 }}>
          <Text strong style={{ fontSize: 15, marginBottom: 12, display: 'block' }}>
            通过应用编码创建
          </Text>

          <PinCode
            count={6}
            size='large'
            value={appCode}
            onChange={setAppCode}
          />
          <Button
            style={{ marginLeft: 12, height: 44 }}
            disabled={appCode.length !== 8}
            onClick={() => onConfirm?.('code', appCode)}
          >
            从编码开始
          </Button>
        </div>

        {/* ==================================
         *  3. 从模板开始（模板列表）
         * ================================== */}
        <div>
          <Title
            heading={6}
            style={{
              marginBottom: 16,
              fontSize: 16,
              borderBottom: '1px var(--semi-color-border) solid',
              paddingBottom: 8
            }}
          >
            从模板开始
          </Title>

          <CardList
            onItemClick={(key) => {
              onConfirm?.('template', key)
            }}
            list={[
              {
                key: 'template_admin',
                label: '后台管理模板',
                cover: '🖥️',
                desc: '通用管理系统模板'
              },
              {
                key: 'template_dashboard',
                label: '数据大屏模板',
                cover: '📊',
                desc: '可视化数据展示'
              },
              {
                key: 'template_form',
                label: '表单应用模板',
                cover: '📋',
                desc: '表单流程类应用'
              },
              {
                key: 'template_portal',
                label: '门户官网模板',
                cover: '🏢',
                desc: '企业门户展示页'
              }
            ]}
          />
        </div>
      </div>
    </Modal>
  )
}

export default CreateAppDialog
