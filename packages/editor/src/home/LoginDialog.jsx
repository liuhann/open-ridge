import React, { useState, useRef, useEffect } from 'react'
import { Modal, Form, Toast } from '@douyinfe/semi-ui'
import userStore from '../store/user.store.js'

const LoginDialog = ({ visible, onCancel, onSuccess }) => {
  const formApiRef = useRef(null)
  const loading = userStore(state => state.loading)
  const login = userStore(state => state.login)

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
      const result = await login(values)
      if (result) {
        onSuccess?.()
        onCancel()
      }
    } catch (err) {
      console.error('登录报错：', err)
    }
  }

  return (
    <Modal
      title='账号登录'
      visible={visible}
      onCancel={onCancel}
      onOk={handleOk}
      width={520}
      confirmLoading={loading}
      okText='立即登录'
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
          field='password'
          label='登录密码'
          placeholder='请输入密码'
          type='password'
          rules={[{ required: true, message: '密码不能为空' }]}
        />
      </Form>
    </Modal>
  )
}

export default LoginDialog
