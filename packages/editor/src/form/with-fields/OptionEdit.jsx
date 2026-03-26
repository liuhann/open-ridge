import React, { useState, useEffect } from 'react'
import {
  Table,
  Button,
  Input,
  Form,
  Modal,
  Space,
  Select,
  withField,
  message,
  Tooltip,
  Divider,
  Popover
} from '@douyinfe/semi-ui'

const OptionsEdit = ({
  value = [], // 默认空数组
  onChange,
  title = '选项配置',
  placement = 'right',
  trigger = 'click',
  popoverWidth = 600,
  buttonText = '编辑选项',
  buttonProps = {}
}) => {
  const [options, setOptions] = useState([...value])
  const [editingIndex, setEditingIndex] = useState(-1)
  const [isPopoverOpen, setIsPopoverOpen] = useState(false)

  // 监听外部value变化
  useEffect(() => {
    setOptions([...value])
  }, [value])

  // 创建新选项
  const createNewOption = () => ({
    label: '',
    value: '',
    icon: ''
  })

  // 立即更新选项并通过onChange传递
  const updateOptions = (newOptions) => {
    setOptions(newOptions)
    onChange(newOptions)
  }

  // 添加新选项
  const handleAddOption = () => {
    const newOption = createNewOption()
    const newOptions = [...options, newOption]
    updateOptions(newOptions)
    setEditingIndex(newOptions.length - 1)
  }

  // 更新选项
  const handleUpdateOption = (index, updatedOption) => {
    const newOptions = [...options]
    newOptions[index] = updatedOption
    updateOptions(newOptions)
  }

  // 删除选项
  const handleDelete = (index) => {
    Modal.confirm({
      title: '确认删除',
      content: '确定要删除这个选项吗？',
      onOk: () => {
        const newOptions = [...options]
        newOptions.splice(index, 1)
        updateOptions(newOptions)
        // 如果删除的是正在编辑的行，重置编辑状态
        if (index === editingIndex) {
          setEditingIndex(-1)
        }
        message.success('选项已删除')
      }
    })
  }

  // 开始编辑
  const handleEdit = (index) => {
    setEditingIndex(index)
  }

  // 取消编辑
  const handleCancelEdit = () => {
    setEditingIndex(-1)
  }

  // 处理标签变化
  const handleLabelChange = (index, value) => {
    const newOptions = [...options]
    newOptions[index] = { ...newOptions[index], label: value }
    updateOptions(newOptions)
  }

  // 处理值变化
  const handleValueChange = (index, value) => {
    const newOptions = [...options]
    newOptions[index] = { ...newOptions[index], value }
    updateOptions(newOptions)
  }

  // 上移选项
  const handleMoveUp = (index) => {
    if (index <= 0) return
    const newOptions = [...options];
    [newOptions[index], newOptions[index - 1]] = [newOptions[index - 1], newOptions[index]]
    updateOptions(newOptions)

    // 如果正在编辑，更新编辑索引
    if (editingIndex === index) {
      setEditingIndex(index - 1)
    } else if (editingIndex === index - 1) {
      setEditingIndex(index)
    }
  }

  // 下移选项
  const handleMoveDown = (index) => {
    if (index >= options.length - 1) return
    const newOptions = [...options];
    [newOptions[index], newOptions[index + 1]] = [newOptions[index + 1], newOptions[index]]
    updateOptions(newOptions)

    // 如果正在编辑，更新编辑索引
    if (editingIndex === index) {
      setEditingIndex(index + 1)
    } else if (editingIndex === index + 1) {
      setEditingIndex(index)
    }
  }

  // 渲染空状态
  const renderEmptyState = () => (
    <div className='semi-p-6 semi-text-center semi-text-gray-500'>
      <div style={{ fontSize: '48px', marginBottom: '16px' }}>∅</div>
      <div className='semi-mt-2'>暂无选项</div>
      <Button
        type='primary'
        size='small'
        className='semi-mt-3'
        onClick={() => {
          handleAddOption()
          // 确保Popover保持打开状态
          if (!isPopoverOpen) {
            setIsPopoverOpen(true)
          }
        }}
      >
        添加第一个选项
      </Button>
    </div>
  )

  // 表格列配置
  const columns = [
    {
      title: '标签',
      dataIndex: 'label',
      key: 'label',
      width: 150,
      render: (text, record, index) => {
        if (index === editingIndex) {
          return (
            <Input
              value={text}
              onChange={(e) => handleLabelChange(index, e)}
              placeholder='请输入标签'
              size='small'
            />
          )
        }
        return text || '-'
      }
    },
    {
      title: '值',
      dataIndex: 'value',
      key: 'value',
      width: 150,
      render: (text, record, index) => {
        if (index === editingIndex) {
          return (
            <Input
              value={text}
              onChange={(e) => handleValueChange(index, e)}
              placeholder='请输入值'
              size='small'
            />
          )
        }
        return text || '-'
      }
    },
    {
      title: '操作',
      key: 'actions',
      width: 200,
      render: (_, record, index) => {
        if (index === editingIndex) {
          return (
            <Space size='small'>
              <Button
                size='small'
                type='primary'
                onClick={() => setEditingIndex(-1)}
              >
                完成
              </Button>
              <Button
                size='small'
                onClick={() => {
                  // 恢复原始值
                  if (index < options.length) {
                    setOptions([...value])
                  }
                  setEditingIndex(-1)
                }}
              >
                取消
              </Button>
            </Space>
          )
        }

        return (
          <Space size='small'>
            <Button
              size='small'
              onClick={() => handleEdit(index)}
            >
              编辑
            </Button>
            <Button
              size='small'
              type='danger'
              onClick={() => handleDelete(index)}
            >
              删除
            </Button>
            <Button
              size='small'
              onClick={() => handleMoveUp(index)}
              disabled={index <= 0}
            >
              上移
            </Button>
            <Button
              size='small'
              onClick={() => handleMoveDown(index)}
              disabled={index >= options.length - 1}
            >
              下移
            </Button>
          </Space>
        )
      }
    }
  ]

  // 渲染Popover内容
  const renderPopoverContent = () => (
    <div className='semi-p-4' style={{ minWidth: popoverWidth, padding: 10 }}>
      <div className='semi-flex semi-justify-between semi-items-center semi-mb-4'>
        <h6 className='semi-text-lg semi-font-medium'>{title}</h6>
      </div>

      {/* 表格展示选项 */}
      {options.length > 0
        ? (
          <Table
            dataSource={options}
            columns={columns}
            size='small'
            pagination={false}
            bordered
          />
          )
        : (
            renderEmptyState()
          )}

      {/* 添加按钮 */}
      <div className='semi-mt-4'>
        <Button
          size='small'
          type='primary'
          onClick={() => {
            handleAddOption()
            // 确保Popover保持打开状态
            if (!isPopoverOpen) {
              setIsPopoverOpen(true)
            }
          }}
        >
          添加选项
        </Button>
      </div>
    </div>
  )

  return (
    <Popover
      content={renderPopoverContent()}
      placement={placement}
      trigger={trigger}
      visible={isPopoverOpen}
      onVisibleChange={setIsPopoverOpen}
      style={{ width: popoverWidth }}
    >
      <Button
        size='small'
        {...buttonProps}
      >
        {buttonText}
      </Button>
    </Popover>
  )
}

export default withField(OptionsEdit)
