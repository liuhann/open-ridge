import React, { useState, useRef, useEffect } from 'react'
import { Modal, Form, Typography, Space } from '@douyinfe/semi-ui'
import userStore from '../store/user.store.js'

const GenerateInviteDialog = ({ visible, onCancel }) => {
  const formApiRef = useRef(null)
  const loading = userStore(state => state.loading)
  const generateInviteCode = userStore(state => state.generateInviteCode)
  const [inviteCode, setInviteCode] = useState('')

  useEffect(() => {
    if (!visible) {
      setInviteCode('')
      if (formApiRef.current) formApiRef.current.resetFields()
    }
  }, [visible])

  const getFormApi = (api) => {
    formApiRef.current = api
  }

  const handleOk = async () => {
    try {
      await formApiRef.current.validate()
      const { mobile } = formApiRef.current.getFormValues()
      const code = await generateInviteCode(mobile)
      if (code) setInviteCode(code)
    } catch (err) {
      console.log('表单校验失败', err)
    }
  }

  return (
    <Modal
      title='生成邀请码'
      visible={visible}
      onCancel={onCancel}
      onOk={handleOk}
      width={520}
      confirmLoading={loading}
      okText='生成邀请码'
      cancelText='关闭'
    >
      <Form
        getFormApi={getFormApi}
        style={{ padding: '10px 0' }}
        labelPosition='left'
        labelWidth={100}
      >
        <Form.Input
          field='mobile'
          label='操作手机号'
          placeholder='请输入有权限的手机号'
          rules={[
            { required: true, message: '手机号不能为空' },
            { pattern: /^1[3-9]\d{9}$/, message: '手机号格式不正确' }
          ]}
        />
      </Form>

      {inviteCode && (
        <div style={{ marginTop: 20, padding: 16, background: '#f5f7fa', borderRadius: 6 }}>
          <Space vertical>
            <Typography.Text strong>当前邀请码（有效期1天）：</Typography.Text>
            <Typography.Title heading={4} style={{ margin: 0, color: '#1890ff' }}>
              {inviteCode}
            </Typography.Title>
            <Typography.Text type='secondary'>该邀请码可被任意手机号用于账号注册</Typography.Text>
          </Space>
        </div>
      )}
    </Modal>
  )
}

export default GenerateInviteDialog
