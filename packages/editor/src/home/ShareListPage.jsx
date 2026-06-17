import React, { useState, useEffect } from 'react'
import {
  List,
  Avatar,
  ButtonGroup,
  Button,
  Space,
  Typography,
  Toast,
  Popconfirm,
  Modal,
  Tag
} from '@douyinfe/semi-ui'
import { IconCopy, IconDelete, IconImage } from '@douyinfe/semi-icons'
import { ShareEditApi } from '../api/share-api.js'

const { Text, Title } = Typography
const SHARE_INFO_BASE = window.location.origin + '/app/share/info/'

const ShareListPage = () => {
  // 列表数据、加载态
  const [loading, setLoading] = useState(false)
  const [dataSource, setDataSource] = useState([])

  // 预览弹窗
  const [previewVisible, setPreviewVisible] = useState(false)
  const [previewRecord, setPreviewRecord] = useState(null)

  // 格式化文件尺寸
  const formatSize = (byte) => {
    if (!byte) return '-'
    if (byte < 1024) return `${byte}B`
    if (byte < 1024 * 1024) return (byte / 1024).toFixed(2) + 'KB'
    return (byte / 1024 / 1024).toFixed(2) + 'MB'
  }

  // 格式化日期
  const formatDate = (timeStr) => {
    if (!timeStr) return '-'
    return new Date(timeStr).toLocaleString()
  }

  // 判断是否过期
  const isExpired = (expireTs) => {
    if (!expireTs || expireTs === 0) return false
    return Date.now() > expireTs
  }

  // 加载列表
  const fetchList = async () => {
    setLoading(true)
    try {
      const res = await ShareEditApi.getMyShareList()
      setDataSource(res.data || [])
    } catch (err) {
      Toast.error(err.message || '获取分享列表失败')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchList()
  }, [])

  // 复制完整信息：访问链接、分享码、应用名、页面描述
  const copyAllInfo = async (record) => {
    const visitUrl = SHARE_INFO_BASE + record.shareCode
    const copyText = `
分享编码：${record.shareCode}
访问地址：${visitUrl}
应用名称：${record.appName}
页面描述：${record.pageDesc || '无'}
    `.trim()
    await navigator.clipboard.writeText(copyText)
    Toast.success('分享信息已全部复制')
  }

  // 打开详情预览弹窗
  const openPreview = (record) => {
    setPreviewRecord(record)
    setPreviewVisible(true)
  }

  // 删除分享
  const handleDelete = async (code) => {
    try {
      await ShareEditApi.cancelShare(code)
      Toast.success('分享已撤销，文件同步清理完成')
      fetchList()
    } catch (err) {
      Toast.error(err.message || '撤销失败')
    }
  }

  return (
    <div style={{ padding: 24 }}>
      <Title heading={4} style={{ marginBottom: 16 }}>我的应用分享记录</Title>

      <List
        loading={loading}
        dataSource={dataSource}
        emptyText='暂无任何分享记录'
        renderItem={(record) => {
          const expired = isExpired(record.expireTime)
          const visitUrl = SHARE_INFO_BASE + record.shareCode
          return (
            <List.Item
              // 左侧图标/预览图
              header={
                record.iconUrl
                  ? (
                    <Avatar
                      size={64}
                      shape='square'
                      src={record.iconUrl}
                      onClick={() => openPreview(record)}
                      style={{ cursor: 'pointer' }}
                    />
                    )
                  : (
                    <Avatar size={64} shape='square' icon={<IconImage size={32} />} />
                    )
              }
              // 中间主体内容
              main={
                <Space vertical align='start'>
                  <Space>
                    <Text strong style={{ fontSize: 16 }}>{record.appName}</Text>
                    <Tag color={expired ? 'red' : 'cyan'}>
                      {expired ? '已过期' : '有效'}
                    </Tag>
                    <Text code style={{ fontSize: 14 }}>编码：{record.shareCode}</Text>
                  </Space>
                  <Text type='secondary' ellipsis={{ rows: 2, expandable: true }} style={{ maxWidth: 700 }}>
                    {record.pageDesc || '暂无页面描述'}
                  </Text>
                  <Space size='large'>
                    <Text>包大小：{formatSize(record.size)}</Text>
                    {record.expireTime > 0 && (
                      <Text type={expired ? 'danger' : 'secondary'}>
                        过期时间：{formatDate(record.expireTime)}
                      </Text>
                    )}
                  </Space>
                </Space>
              }
              // 右侧操作按钮组
              extra={
                <ButtonGroup theme='borderless'>
                  <Button icon={<IconCopy />} onClick={() => copyAllInfo(record)}>复制信息</Button>
                  <Button onClick={() => openPreview(record)}>查看详情</Button>
                  <Popconfirm
                    title='确认撤销该分享？'
                    content='撤销后文件与分享编码永久删除，无法恢复'
                    onConfirm={() => handleDelete(record.shareCode)}
                  >
                    <Button icon={<IconDelete />} type='danger' tertiary>撤销</Button>
                  </Popconfirm>
                </ButtonGroup>
              }
            />
          )
        }}
      />

      {/* 详情预览弹窗 */}
      <Modal
        title='分享完整详情'
        visible={previewVisible}
        onCancel={() => setPreviewVisible(false)}
        footer={<Button onClick={() => setPreviewVisible(false)}>关闭</Button>}
        width={600}
      >
        {previewRecord && (
          <Space vertical style={{ width: '100%' }}>
            {previewRecord.iconUrl && (
              <div>
                <Text strong>应用图标：</Text>
                <div style={{ marginTop: 6 }}>
                  <img src={previewRecord.iconUrl} alt='icon' style={{ width: 120, height: 120, objectFit: 'contain' }} />
                </div>
              </div>
            )}
            <div>
              <Text strong>分享编码：</Text>
              <Text code style={{ fontSize: 16 }}>{previewRecord.shareCode}</Text>
            </div>
            <div>
              <Text strong>访问链接：</Text>
              <Tag color='cyan'>{SHARE_INFO_BASE + previewRecord.shareCode}</Tag>
            </div>
            <div>
              <Text strong>应用名称：</Text>
              <Text>{previewRecord.appName}</Text>
            </div>
            <div>
              <Text strong>页面名称：</Text>
              <Text>{previewRecord.pageName}</Text>
            </div>
            <div>
              <Text strong>页面描述：</Text>
              <div style={{ marginTop: 4 }}>
                <Text>{previewRecord.pageDesc || '无'}</Text>
              </div>
            </div>
            <div>
              <Text strong>文件大小：</Text>
              <Text>{formatSize(previewRecord.size)}</Text>
            </div>
            <div>
              <Text strong>创建时间：</Text>
              <Text>{formatDate(previewRecord.uploadTime)}</Text>
            </div>
            {previewRecord.expireTime > 0 && (
              <div>
                <Text strong>过期时间：</Text>
                <Text type={isExpired(previewRecord.expireTime) ? 'danger' : undefined}>
                  {formatDate(previewRecord.expireTime)}
                </Text>
              </div>
            )}
            <div style={{ marginTop: 10 }}>
              <Button icon={<IconCopy />} onClick={() => copyAllInfo(previewRecord)}>一键复制全部分享信息</Button>
            </div>
          </Space>
        )}
      </Modal>
    </div>
  )
}

export default ShareListPage
