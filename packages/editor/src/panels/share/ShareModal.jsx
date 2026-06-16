import React, { useState, useEffect, useCallback } from 'react'
import { Modal, Button, Input, Checkbox, Space, Typography, Toast, Avatar, TextArea } from '@douyinfe/semi-ui'
import { IconUpload, IconCopy } from '@douyinfe/semi-icons'
import { ShareEditApi } from '../../api/share-api.js'
import editorStore from '../../store/editor.store.js'

const { Text, Title } = Typography
const BASE_VISIT_URL = window.location.origin + '/app/share/info/'
const MAX_SIZE = 1 * 1024 * 1024

export default function AppShareModal ({ visible, onClose }) {
  // Zustand 标准写法，必须放在组件顶层
  const getCurrentShareInfo = editorStore(state => state.getCurrentShareInfo)

  // 稳定关闭回调
  const stableOnClose = useCallback(() => {
    onClose?.()
  }, [onClose])

  // 弹窗内部业务状态
  const [loading, setLoading] = useState(false)
  const [shareCode, setShareCode] = useState('')
  const [showResult, setShowResult] = useState(false)
  const [checkLoading, setCheckLoading] = useState(false)
  // 初始化锁，防止快速开关弹窗重复执行逻辑造成死循环
  const [isInitLock, setIsInitLock] = useState(false)
  // 标记是否未登录
  const [isNoLogin, setIsNoLogin] = useState(false)

  // 页面基础分享信息
  const [shareInfo, setShareInfo] = useState({
    appName: '',
    appId: '',
    pageName: '',
    pageDesc: '',
    iconUrl: '',
    fileSize: 0,
    appFile: null,
    iconFile: null
  })
  // 页面描述本地编辑缓存
  const [editDesc, setEditDesc] = useState('')
  const [realIsShared, setRealIsShared] = useState(false)

  useEffect(() => {
    // 弹窗关闭：重置所有状态，释放锁
    if (!visible) {
      setLoading(false)
      setShareCode('')
      setShowResult(false)
      setCheckLoading(false)
      setRealIsShared(false)
      setIsInitLock(false)
      setIsNoLogin(false)
      setShareInfo({
        appName: '',
        appId: '',
        pageName: '',
        pageDesc: '',
        iconUrl: '',
        fileSize: 0,
        appFile: null,
        iconFile: null
      })
      setEditDesc('')
      return
    }

    // 已有初始化正在执行，直接拦截，防止并发死循环
    if (isInitLock || checkLoading) return

    const initModalData = async () => {
      setIsInitLock(true)
      try {
        // 1. 从store获取当前页面完整分享信息
        const info = await getCurrentShareInfo()
        if (!info) {
          Toast.error('获取页面分享信息失败')
          return
        }
        setShareInfo(info)
        // 初始化可编辑描述
        setEditDesc(info.pageDesc || '')
        const { appId, pageName } = info

        // 2. 调用接口校验是否存在历史分享
        setCheckLoading(true)
        const res = await ShareEditApi.checkShareExist(appId, pageName)

        if (res.code === '100401') {
          // 未登录标记，不关闭弹窗
          setIsNoLogin(true)
          setRealIsShared(false)
          return
        }
        setIsNoLogin(false)
        setRealIsShared(res.isShared)
      } catch (err) {
        Toast.warning('初始化分享弹窗失败：' + err.message)
      } finally {
        setCheckLoading(false)
        setIsInitLock(false)
      }
    }

    initModalData()
  }, [visible])

  const { appName, pageName, iconUrl, fileSize, appFile, iconFile } = shareInfo
  const isOverLimit = fileSize > MAX_SIZE
  // 分享按钮综合禁用条件：未登录 / 文件超限 / 无文件 / 校验加载中
  const submitDisabled = isNoLogin || isOverLimit || !appFile || checkLoading

  // 格式化文件大小
  const formatSize = (byte) => {
    if (byte < 1024) return byte + 'B'
    if (byte < 1024 * 1024) return (byte / 1024).toFixed(2) + 'KB'
    return (byte / 1024 / 1024).toFixed(2) + 'MB'
  }

  // 提交分享
  const handleSubmitShare = async () => {
    if (isNoLogin) return
    if (!appFile) {
      Toast.warning('应用包文件不存在')
      return
    }
    if (isOverLimit) {
      Toast.error(`文件大小${formatSize(fileSize)}，超过1MB限制，无法分享`)
      return
    }

    if (editDesc.length > 1000) {
      Toast.error('页面描述不能超过1000个字符')
      return
    }

    setLoading(true)
    try {
      const extraData = {
        appId: shareInfo.appId,
        pageName,
        pageDesc: editDesc
      }
      // 后端上传接口自动覆盖旧数据，统一只调用 uploadShare
      const res = await ShareEditApi.uploadShare(appFile, iconFile, extraData)
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
      onCancel={stableOnClose}
      maskClosable={false}
      width={600}
      footer={
        showResult
          ? (
            <Button onClick={stableOnClose}>关闭</Button>
            )
          : (
            <Space>
              <Button onClick={stableOnClose}>取消</Button>
              <Button
                type='primary'
                loading={loading || checkLoading}
                onClick={handleSubmitShare}
                disabled={submitDisabled}
              >
                生成分享
              </Button>
            </Space>
            )
      }
    >
      {!showResult
        ? (
          <>
            <div style={{ marginTop: 12 }}>
              {/* 应用图标 */}
              <div style={{ display: 'flex', alignItems: 'center', marginBottom: 16 }}>
                <div style={{ width: 100, flexShrink: 0 }}>
                  <Text strong>应用图标</Text>
                </div>
                <Avatar
                  src={iconUrl}
                  size={64}
                  shape='square'
                  fallback={<IconUpload size={32} />}
                />
              </div>

              {/* 应用名称 */}
              <div style={{ display: 'flex', alignItems: 'center', marginBottom: 8 }}>
                <div style={{ width: 100, flexShrink: 0 }}>
                  <Text strong>应用名称</Text>
                </div>
                <Text>{appName}</Text>
              </div>
              {/* 提示：图标和名称修改位置 */}
              <div style={{ marginLeft: 100, marginBottom: 16 }}>
                <Text type='quaternary'>图标、应用名称可在应用配置页面修改</Text>
              </div>

              {/* 页面名称 */}
              <div style={{ display: 'flex', alignItems: 'center', marginBottom: 16 }}>
                <div style={{ width: 100, flexShrink: 0 }}>
                  <Text strong>页面名称</Text>
                </div>
                <Text>{pageName}</Text>
              </div>

              {/* 页面描述 改为可编辑输入框 */}
              <div style={{ display: 'flex', alignItems: 'flex-start', marginBottom: 16 }}>
                <div style={{ width: 100, flexShrink: 0, paddingTop: 6 }}>
                  <Text strong>页面描述</Text>
                </div>
                <TextArea
                  value={editDesc}
                  maxCount={1000}
                  onChange={(v) => setEditDesc(v)}
                  placeholder='请输入页面描述'
                  style={{ flex: 1 }}
                />
              </div>

              {/* 应用包大小 */}
              <div style={{ display: 'flex', alignItems: 'center', marginBottom: 16 }}>
                <div style={{ width: 100, flexShrink: 0 }}>
                  <Text strong>应用包大小</Text>
                </div>
                <Text type={isOverLimit ? 'danger' : 'primary'}>
                  {formatSize(fileSize)}
                  {isOverLimit && <Text type='danger'>（超过1MB，无法分享）</Text>}
                </Text>
              </div>
            </div>

            {checkLoading
              ? (
                <Text type='secondary'>正在校验是否已有分享记录...</Text>
                )
              : realIsShared
                ? (
                  <div style={{ marginTop: 16 }}>
                    <Text type='warning'>
                      该页面已存在历史分享记录，提交后旧文件与记录将自动覆盖替换
                    </Text>
                  </div>
                  )
                : null}

            {/* 未登录底部红色提示文字 */}
            {isNoLogin && (
              <div style={{ marginTop: 20 }}>
                <Text type='danger'>当前未登录，无法进行分享操作，请先登录</Text>
              </div>
            )}
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
