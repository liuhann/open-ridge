import React, { useRef, useEffect } from 'react'
import { Modal, Form } from '@douyinfe/semi-ui'
import userStore from '../store/user.store.js'

const RegisterDialog = ({ visible, onCancel, onSuccess }) => {
  const formApiRef = useRef(null)
  const loading = userStore(state => state.loading)
  const register = userStore(state => state.register)

  useEffect(() => {
    if (!visible && formApiRef.current) {
      formApiRef.current.reset()
    }
  }, [visible])

  const getFormApi = (api) => {
    formApiRef.current = api
  }

  const handleOk = async () => {
    try {
      await formApiRef.current.validate()
      const values = formApiRef.current.getValues()
      const result = await register(values)
      if (result) {
        onSuccess?.()
        onCancel()
      }
    } catch (err) {
      console.log('表单校验失败', err)
    }
  }

  return (
    <Modal
      title='账号注册'
      visible={visible}
      onCancel={onCancel}
      onOk={handleOk}
      width={520}
      confirmLoading={loading}
      okText='立即注册'
      cancelText='取消'
    >
      <Form
        getFormApi={getFormApi}
        style={{ padding: '10px 0' }}
        labelPosition='left'
        labelWidth={100}
      >
        <Form.Input
          field='mobile'
          label='手机号'
          placeholder='请输入手机号'
          rules={[
            { required: true, message: '手机号不能为空' },
            { pattern: /^1[3-9]\d{9}$/, message: '手机号格式不正确' }
          ]}
        />
        <Form.Input
          field='inviteCode'
          label='邀请码'
          placeholder='请输入6位邀请码'
          rules={[
            { required: true, message: '邀请码不能为空' },
            { len: 6, message: '邀请码必须为6位数字' }
          ]}
        />
        <Form.Input
          field='password'
          label='登录密码'
          placeholder='密码至少8位，包含字母+数字'
          type='password'
          rules={[
            { required: true, message: '密码不能为空' },
            { min: 8, message: '密码长度至少8位' },
            {
              validator: (rule, value) => {
                if (!/\d/.test(value) || !/[a-zA-Z]/.test(value)) {
                  return new Error('密码必须同时包含字母和数字')
                }
                return true
              }
            }
          ]}
        />
      </Form>
    </Modal>
  )
}

export default RegisterDialog
