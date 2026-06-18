import React from 'react'
import { List, Checkbox, Tag, Skeleton } from 'antd'

const ComplexTextList = ({
  // antd List 原生通用属性
  bordered = false,
  dataSource = [],
  itemLayout = 'horizontal',
  loading = false,
  size = 'default',
  split = true,
  // 自定义多选配置
  multiple = false, // 是否开启多选框
  selectedKeys = [], // 已选中项 【下标数组】，受控

  // 事件回调
  onChangeSelect, // 选择变更：(selectedIndexs: number[]) => void
  onTagClick // 标签点击：(index: number, tagText: string) => void
}) => {
  // 处理选中状态（单选/多选通用）
  const handleSelect = (index) => {
    let nextKeys = selectedKeys

    if (multiple) {
      // 多选：切换选中状态
      const idx = nextKeys.indexOf(index)
      idx > -1 ? nextKeys.splice(idx, 1) : nextKeys.push(index)
    } else {
      // 单选：直接覆盖为当前下标
      nextKeys = [index]
    }

    onChangeSelect?.(nextKeys)
  }

  // 渲染右侧tags操作区域
  const renderActions = (item, index) => {
    const tagList = item.tags || []
    return tagList.map((tag, tagIdx) => (
      <Tag
        key={tagIdx}
        color='blue'
        style={{ cursor: 'pointer' }}
        // 事件参数：下标、标签文字
        onClick={(e) => {
          e.stopPropagation() // 阻止触发行点击
          onTagClick?.(index, tag)
        }}
      >
        {tag}
      </Tag>
    ))
  }

  // 渲染列表项
  const renderItem = (item, index) => {
    // 判断当前项是否选中（基于下标）
    const isChecked = selectedKeys.includes(index)

    return (
      <List.Item
        // 单选模式：点击整行触发选择；多选模式：仅checkbox触发
        onClick={!multiple ? () => handleSelect(index) : undefined}
        actions={renderActions(item, index)}
        style={!multiple ? { cursor: 'pointer' } : {}}
      >
        {/* 多选模式显示复选框 */}
        {multiple && (
          <Checkbox
            checked={isChecked}
            onChange={() => handleSelect(index)}
            style={{ marginRight: 12 }}
          />
        )}

        {/* 骨架屏 + 列表项元信息 */}
        <Skeleton
          avatar
          title={!!item.title}
          loading={item.loading || false}
          active
        >
          <List.Item.Meta
            title={<span style={{ color: isChecked ? '#1890ff' : '' }}>{item.title}</span>}
            description={item.description}
          />
        </Skeleton>
      </List.Item>
    )
  }

  return (
    <List
      bordered={bordered}
      dataSource={dataSource}
      itemLayout={itemLayout}
      loading={loading}
      size={size}
      split={split}
      renderItem={renderItem}
      style={{
        height: '100%',
        overflow: 'auto'
      }}
    />
  )
}

export default ComplexTextList
