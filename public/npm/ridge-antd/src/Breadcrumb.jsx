import React from 'react'
import { Breadcrumb } from 'antd'

const RidgeBreadcrumb = ({ items = [], onClick }) => {
  // 处理点击
  const handleClick = (item, index) => {
    if (typeof onClick === 'function') {
      onClick({ ...item, index })
    }
  }

  return (
    <Breadcrumb>
      {items.map((item, index) => (
        <Breadcrumb.Item
          key={index}
          onClick={() => handleClick(item, index)}
          href={item.href}
        >
          {item.label}
        </Breadcrumb.Item>
      ))}
    </Breadcrumb>
  )
}

export default RidgeBreadcrumb
