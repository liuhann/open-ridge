import React, { useState, useRef, useEffect } from 'react'
import { Modal, Form, Toast } from '@douyinfe/semi-ui'
import axios from 'axios'

const LoginDialog = ({
  visible,
  onCancel,
  onSuccess
}) => {
  const formApiRef = useRef(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (!visible && formApiRef.current) {
      formApiRef.current.resetFields()
      setLoading(false)
    }
  }, [visible])

  const getFormApi = (api) => {
    formApiRef.current = api
  }

  // 提交登录
  const handleOk = async () => {
    try {
      await formApiRef.current.validate()
      const values = formApiRef.current.getFormValues()
      setLoading(true)

      const res = await axios.post('/user/login', values)
      if (res.data.code === 0) {
        Toast.success('登录成功')
        onSuccess?.(res.data)
        onCancel()
      } else {
        Toast.error(res.data.msg || '登录失败')
      }
    } catch (err) {
      const msg = err?.response?.data?.msg || '请求异常'
      Toast.error(msg)
      console.error('登录报错：', err)
    } finally {
      setLoading(false)
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
          rules={[
            { required: true, message: '密码不能为空' }
          ]}
        />
      </Form>
    </Modal>
  )
}

export default LoginDialog
