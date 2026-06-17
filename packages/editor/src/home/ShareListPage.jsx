import React, { useState, useEffect } from 'react'
import {
  Table,
  Button,
  Space,
  Typography,
  Toast,
  Popconfirm,
  Modal,
  Tooltip,
  Tag
} from '@douyinfe/semi-ui'
import { IconCopy, IconDelete, IconEyeOpened } from '@douyinfe/semi-icons'
import { ShareEditApi } from '../api/share-api.js'

const { Text, Title } = Typography
const SHARE_INFO_BASE = window.location.origin + '/app/share/info/'

const ShareListPage = () => {
  // 表格数据、分页、加载
  const [loading, setLoading] = useState(false)
  const [dataSource, setDataSource] = useState([])
  const [page, setPage] = useState(1)
  const [pageSize] = useState(10)
  const [total, setTotal] = useState(0)

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

  // 加载列表
  const fetchList = async (current = 1) => {
    setLoading(true)
    try {
      const res = await ShareEditApi.getMyShareList()
      setDataSource(res.data)
      setTotal(res.data.length)
      setPage(current)
    } catch (err) {
      Toast.error(err.message || '获取分享列表失败')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchList(1)
  }, [])

  // 复制访问链接
  const copyLink = async (code) => {
    const url = SHARE_INFO_BASE + code
    await navigator.clipboard.writeText(url)
    Toast.success('分享链接已复制')
  }

  // 打开预览弹窗
  const openPreview = (record) => {
    setPreviewRecord(record)
    setPreviewVisible(true)
  }

  // 删除分享记录
  const handleDelete = async (code) => {
    try {
      await ShareEditApi.cancelShare(code)
      Toast.success('分享已撤销，文件已清理')
      fetchList(page)
    } catch (err) {
      Toast.error(err.message || '撤销失败')
    }
  }

  // 表格列配置
  const columns = [
    {
      title: '分享编码',
      dataIndex: 'shareCode',
      width: 120,
      render: (val) => <Text code>{val}</Text>
    },
    {
      title: '应用名称',
      dataIndex: 'extraData',
      width: 180,
      render: (extra) => extra?.appName || '-'
    },
    {
      title: '页面名称',
      dataIndex: 'extraData',
      width: 180,
      render: (extra) => extra?.pageName || '-'
    },
    {
      title: '页面描述',
      dataIndex: 'extraData',
      ellipsis: true,
      render: (extra) => extra?.pageDesc || <Text type='secondary'>无</Text>
    },
    {
      title: '包大小',
      dataIndex: 'fileSize',
      width: 110,
      render: (_, record) => formatSize(record.fileSize)
    },
    {
      title: '创建时间',
      dataIndex: 'uploadTime',
      width: 180,
      render: (time) => new Date(time).toLocaleString()
    },
    {
      title: '链接',
      dataIndex: 'shareCode',
      width: 120,
      render: (code) => (
        <Tooltip content='复制访问链接'>
          <Button
            icon={<IconCopy />}
            size='small'
            type='tertiary'
            onClick={() => copyLink(code)}
          >
            复制链接
          </Button>
        </Tooltip>
      )
    },
    {
      title: '操作',
      dataIndex: 'shareCode',
      width: 160,
      render: (_, record) => (
        <Space size='small'>
          <Button
            icon={<IconEyeOpened />}
            size='small'
            type='tertiary'
            onClick={() => openPreview(record)}
          >
            预览
          </Button>
          <Popconfirm
            title='确认撤销该分享？'
            content='撤销后对应文件与分享编码将永久删除，无法恢复'
            onConfirm={() => handleDelete(record.shareCode)}
          >
            <Button icon={<IconDelete />} size='small' type='danger' tertiary>
              撤销
            </Button>
          </Popconfirm>
        </Space>
      )
    }
  ]

  return (
    <div style={{ padding: 24 }}>
      <Title heading={4} style={{ marginBottom: 16 }}>我的应用分享记录</Title>

      <Table
        loading={loading}
        columns={columns}
        dataSource={dataSource}
        rowKey='shareCode'
        pagination={{
          current: page,
          pageSize,
          total,
          onChange: (p) => fetchList(p)
        }}
        emptyText='暂无任何分享记录'
      />

      {/* 详情预览弹窗 */}
      <Modal
        title='分享详情预览'
        visible={previewVisible}
        onCancel={() => setPreviewVisible(false)}
        footer={<Button onClick={() => setPreviewVisible(false)}>关闭</Button>}
        width={520}
      >
        {previewRecord && (
          <Space vertical style={{ width: '100%' }}>
            <div>
              <Text strong>分享编码：</Text>
              <Text code>{previewRecord.shareCode}</Text>
            </div>
            <div>
              <Text strong>应用名称：</Text>
              <Text>{previewRecord.extraData?.appName || '-'}</Text>
            </div>
            <div>
              <Text strong>页面名称：</Text>
              <Text>{previewRecord.extraData?.pageName || '-'}</Text>
            </div>
            <div>
              <Text strong>页面描述：</Text>
              <div style={{ marginTop: 4 }}>
                <Text>{previewRecord.extraData?.pageDesc || '无'}</Text>
              </div>
            </div>
            <div>
              <Text strong>文件大小：</Text>
              <Text>{formatSize(previewRecord.fileSize)}</Text>
            </div>
            <div>
              <Text strong>创建时间：</Text>
              <Text>{new Date(previewRecord.uploadTime).toLocaleString()}</Text>
            </div>
            <div>
              <Text strong>访问地址：</Text>
              <div style={{ marginTop: 4 }}>
                <Tag color='cyan'>{SHARE_INFO_BASE + previewRecord.shareCode}</Tag>
              </div>
            </div>
            <div style={{ marginTop: 8 }}>
              <Text type='secondary'>
                文件状态：
                {previewRecord.fileExist
                  ? (
                    <Text type='success'> 文件正常存在</Text>
                    )
                  : (
                    <Text type='danger'> 文件已丢失</Text>
                    )}
              </Text>
            </div>
          </Space>
        )}
      </Modal>
    </div>
  )
}

export default ShareListPage
