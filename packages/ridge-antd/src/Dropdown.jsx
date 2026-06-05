import React from 'react'
import { Dropdown, Button } from 'antd'

const RidgeDropdown = ({
  // 按钮
  buttonText = '下拉菜单',
  type = 'default',
  size = 'middle',

  // 下拉核心
  arrow = false,
  placement = 'bottomLeft',
  trigger = 'hover',
  items = [],

  // 事件
  onItemClick
}) => {
  // 菜单配置 + 点击
  const menuProps = {
    items,
    onClick: ({ key }) => {
      const currentItem = items.find((item) => item.key === key)
      if (currentItem && onItemClick) {
        onItemClick(currentItem) // 抛出完整项
      }
    }
  }

  return (
    <Dropdown
      menu={menuProps}
      arrow={arrow}
      placement={placement}
      trigger={trigger}
    >
      <Button type={type} size={size}>
        {buttonText}
      </Button>
    </Dropdown>
  )
}

export default RidgeDropdown
