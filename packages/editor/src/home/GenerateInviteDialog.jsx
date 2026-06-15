import React, { useState, useRef, useEffect } from 'react'
import { Modal, Form, Toast, Typography, Space } from '@douyinfe/semi-ui'
import axios from 'axios'

const GenerateInviteDialog = ({
  visible,
  onCancel
}) => {
  const formApiRef = useRef(null)
  const [loading, setLoading] = useState(false)
  const [inviteCode, setInviteCode] = useState('')

  // 关闭弹窗重置数据
  useEffect(() => {
    if (!visible) {
      setInviteCode('')
      setLoading(false)
      if (formApiRef.current) {
        formApiRef.current.resetFields()
      }
    }
  }, [visible])

  const getFormApi = (api) => {
    formApiRef.current = api
  }

  // 生成邀请码
  const handleOk = async () => {
    try {
      await formApiRef.current.validate()
      const { mobile } = formApiRef.current.getFormValues()
      setLoading(true)

      const res = await axios.post('/user/generate-invite', { mobile })
      if (res.data.code === 0) {
        setInviteCode(res.data.inviteCode)
        Toast.success('邀请码生成成功，有效期1天')
      } else {
        Toast.error(res.data.msg || '生成失败')
      }
    } catch (err) {
      const msg = err?.response?.data?.msg || '请求异常'
      Toast.error(msg)
      console.error('生成邀请码报错：', err)
    } finally {
      setLoading(false)
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

      {/* 展示生成结果 */}
      {inviteCode && (
        <div style={{ marginTop: 20, padding: 16, background: '#f5f7fa', borderRadius: 6 }}>
          <Space vertical>
            <Typography.Text strong>当前邀请码（有效期1天）：</Typography.Text>
            <Typography.Title heading={4} style={{ margin: 0, color: '#1890ff' }}>
              {inviteCode}
            </Typography.Title>
            <Typography.Text type='secondary'>
              该邀请码可被任意手机号用于账号注册
            </Typography.Text>
          </Space>
        </div>
      )}
    </Modal>
  )
}

export default GenerateInviteDialog
