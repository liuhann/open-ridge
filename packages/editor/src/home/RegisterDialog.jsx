import React, { useState, useRef, useEffect } from 'react'
import { Modal, Form, Toast } from '@douyinfe/semi-ui'
import axios from 'axios'

const RegisterDialog = ({
  visible,
  onCancel,
  onSuccess
}) => {
  const formApiRef = useRef(null)
  const [loading, setLoading] = useState(false)

  // 弹窗关闭重置状态
  useEffect(() => {
    if (!visible && formApiRef.current) {
      formApiRef.current.reset()
      setLoading(false)
    }
  }, [visible])

  const getFormApi = (api) => {
    formApiRef.current = api
  }

  // 提交注册
  const handleOk = async () => {
    try {
      await formApiRef.current.validate()
      const values = formApiRef.current.getValues()
      setLoading(true)

      const res = await axios.post('/api/user/register', values)
      if (res.data.code === 0) {
        Toast.success('注册成功')
        onSuccess?.(res.data)
        onCancel()
      } else {
        Toast.error(res.data.msg || '注册失败')
      }
    } catch (err) {
      const msg = err?.response?.data?.msg || '请求异常'
      Toast.error(msg)
      console.error('注册报错：', err)
    } finally {
      setLoading(false)
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
