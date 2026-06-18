import React from 'react'
import { List } from 'antd'

const StringTextList = ({
  // antd List 基础属性
  bordered = false,
  dataSource = [],
  footer,
  header,
  itemLayout,
  loading = false,
  loadMore,
  locale,
  pagination = false,
  size = 'default',
  split = true,
  rowKey,
  onSelect,
  // 自定义扩展属性
  showIndex = false, // 是否显示序号 1、2、3
  selectedIndex = -1 // 当前选中项下标，-1代表无选中
}) => {
  // 列表项渲染
  const renderItem = (item, index) => {
    const isActive = selectedIndex === index
    return (
      <List.Item
        onClick={() => {
          // 触发选中事件，传出下标+文本
          if (typeof onSelect === 'function') {
            onSelect(index, item)
          }
        }}
        style={{
          cursor: 'pointer',
          backgroundColor: isActive ? '#e6f7ff' : 'transparent',
          ...(isActive ? { borderLeft: '3px solid #1890ff' } : {})
        }}
      >
        {showIndex && <span style={{ marginRight: 8, color: '#666' }}>{index + 1}.</span>}
        {item}
      </List.Item>
    )
  }

  return (
    <List
      bordered={bordered}
      dataSource={dataSource}
      footer={footer}
      header={header}
      itemLayout={itemLayout}
      loading={loading}
      loadMore={loadMore}
      locale={locale}
      pagination={pagination}
      size={size}
      split={split}
      style={{
        height: '100%',
        overflow: 'auto'
      }}
      renderItem={renderItem}
    />
  )
}

export default StringTextList
