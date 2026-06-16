import React, { useState, useEffect } from 'react'
import { Modal, Form, Button, Input, Checkbox, Space, Typography, Toast, Avatar } from '@douyinfe/semi-ui'
import { IconUpload, IconCopy } from '@douyinfe/semi-icons'
import { ShareEditApi } from '../../api/share-api.js'
import editorStore from '../../store/editor.store.js'

const { Text, Title } = Typography
const BASE_VISIT_URL = window.location.origin + '/app/share/info/'
const MAX_SIZE = 1 * 1024 * 1024

export default function AppShareModal ({ visible, onClose }) {
  // 全局store取值函数
  const getCurrentShareInfo = editorStore(state => state.getCurrentShareInfo)

  // 弹窗内部业务状态
  const [loading, setLoading] = useState(false)
  const [coverOld, setCoverOld] = useState(true)
  const [shareCode, setShareCode] = useState('')
  const [showResult, setShowResult] = useState(false)
  const [checkLoading, setCheckLoading] = useState(false)

  // 页面基础分享信息（内部维护，不再由父组件传入）
  const [shareInfo, setShareInfo] = useState({
    appName: '',
    pageName: '',
    pageDesc: '',
    iconUrl: '',
    fileSize: 0,
    appFile: null,
    iconFile: null
  })
  const [realIsShared, setRealIsShared] = useState(false)

  // 弹窗打开时：拉取当前页面数据 + 校验是否已分享
  useEffect(() => {
    if (!visible) {
      // 关闭重置所有状态
      setLoading(false)
      setCoverOld(true)
      setShareCode('')
      setShowResult(false)
      setCheckLoading(false)
      setRealIsShared(false)
      setShareInfo({
        appName: '',
        pageName: '',
        pageDesc: '',
        iconUrl: '',
        fileSize: 0,
        appFile: null,
        iconFile: null
      })
      return
    }

    const initModalData = async () => {
      try {
        // 1. 从store获取当前页面完整分享信息
        const info = await getCurrentShareInfo()
        if (!info) {
          Toast.error('获取页面分享信息失败')
          onClose()
          return
        }
        setShareInfo(info)
        const { appName, pageName } = info

        // 2. 调用接口校验是否存在历史分享
        setCheckLoading(true)
        const res = await ShareEditApi.checkShareExist(appName, pageName)
        setRealIsShared(res.isShared)
      } catch (err) {
        Toast.warning('初始化分享弹窗失败：' + err.message)
      } finally {
        setCheckLoading(false)
      }
    }

    initModalData()
  }, [visible, getCurrentShareInfo, onClose])

  const { appName, pageName, pageDesc, iconUrl, fileSize, appFile, iconFile } = shareInfo
  const isOverLimit = fileSize > MAX_SIZE

  // 格式化文件大小
  const formatSize = (byte) => {
    if (byte < 1024) return byte + 'B'
    if (byte < 1024 * 1024) return (byte / 1024).toFixed(2) + 'KB'
    return (byte / 1024 / 1024).toFixed(2) + 'MB'
  }

  // 提交分享
  const handleSubmitShare = async () => {
    if (!appFile) {
      Toast.warning('应用包文件不存在')
      return
    }
    if (isOverLimit) {
      Toast.error(`文件大小${formatSize(fileSize)}，超过1MB限制，无法分享`)
      return
    }

    setLoading(true)
    try {
      const extraData = {
        appName,
        pageName,
        pageDesc,
        iconFile: ''
      }
      let res
      if (realIsShared && coverOld) {
        res = await ShareEditApi.coverUploadShare(appFile, iconFile, extraData)
      } else {
        res = await ShareEditApi.uploadShare(appFile, iconFile, extraData)
      }
      setShareCode(res.shareCode)
      setShowResult(true)
      Toast.success('分享操作完成')
    } catch (err) {
      Toast.error(err.message || '分享失败')
    } finally {
      setLoading(false)
    }
  }

  // 复制链接
  const copyLink = async () => {
    const link = BASE_VISIT_URL + shareCode
    await navigator.clipboard.writeText(link)
    Toast.success('链接复制成功')
  }

  const visitUrl = BASE_VISIT_URL + shareCode

  return (
    <Modal
      title='应用分享配置'
      visible={visible}
      onCancel={onClose}
      maskClosable={false}
      width={600}
      footer={
        showResult
          ? (
            <Button onClick={onClose}>关闭</Button>
            )
          : (
            <Space>
              <Button onClick={onClose}>取消</Button>
              <Button
                type='primary'
                loading={loading || checkLoading}
                onClick={handleSubmitShare}
                disabled={isOverLimit || !appFile || checkLoading}
              >
                {realIsShared && coverOld ? '覆盖分享' : '生成分享'}
              </Button>
            </Space>
            )
      }
    >
      {!showResult
        ? (
          <>
            <Form labelPosition='left' labelWidth={100}>
              <Form.Item label='应用图标'>
                <Avatar
                  src={iconUrl}
                  size={64}
                  shape='square'
                  fallback={<IconUpload size={32} />}
                />
              </Form.Item>
              <Form.Item label='应用名称'>
                <Text>{appName}</Text>
              </Form.Item>
              <Form.Item label='页面名称'>
                <Text>{pageName}</Text>
              </Form.Item>
              <Form.Item label='页面描述'>
                <Text>{pageDesc || '无'}</Text>
              </Form.Item>
              <Form.Item label='应用包大小'>
                <Text type={isOverLimit ? 'danger' : 'primary'}>
                  {formatSize(fileSize)}
                  {isOverLimit && <Text type='danger'>（超过1MB，无法分享）</Text>}
                </Text>
              </Form.Item>
            </Form>

            {checkLoading
              ? (
                <Text type='secondary'>正在校验是否已有分享记录...</Text>
                )
              : realIsShared
                ? (
                  <div style={{ marginTop: 16 }}>
                    <Checkbox
                      checked={coverOld}
                      onChange={(e) => setCoverOld(e.target.checked)}
                    >
                      覆盖该应用页面之前所有分享记录
                    </Checkbox>
                    <div>
                      <Text type='secondary'>覆盖后旧分享码与文件将被删除，生成全新6位分享码</Text>
                    </div>
                  </div>
                  )
                : null}
          </>
          )
        : (
          <Space vertical style={{ width: '100%' }}>
            <Title heading={5}>分享创建成功</Title>
            <div>
              <Text strong>6位分享编码：</Text>
              <Text code>{shareCode}</Text>
            </div>
            <div style={{ width: '100%' }}>
              <Text strong>访问地址：</Text>
              <Input
                value={visitUrl}
                readOnly
                suffix={
                  <Button icon={<IconCopy />} onClick={copyLink} size='small'>复制</Button>
              }
              />
            </div>
            <Text type='secondary'>其他人可通过该地址查看应用信息</Text>
          </Space>
          )}
    </Modal>
  )
}
