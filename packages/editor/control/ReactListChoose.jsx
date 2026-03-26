import React from 'react'
import { Button, List } from '@douyinfe/semi-ui'

export default ({
  list = [],
  opts = {}
}) => {
  return ({
    value,
    onChange
  }) => {
    const SelectedComponent = list.filter(item => item.key === value)[0]

    return (
      <div style={{
        padding: '12px'
      }}
      >
        <Button
          icon={<SelectedComponent />} onClick={() => {
            onChange(null)
          }}
        >取消选择
        </Button>
        <List
          width={960}
          height={720}
          style={{
            overflowY: 'auto',
            overflowX: 'hidden',
            width: '740px',
            height: '640px'
          }}
          grid={{
            gutter: 12,
            span: 3
          }}
          dataSource={list}
          renderItem={item => {
            const Component = item.Component
            if (Component) {
              return (
                <List.Item style={{
                  border: '1px solid var(--semi-color-border)',
                  height: '80px',
                  padding: '16px',
                  fontSize: '24px',
                  backgroundColor: 'var(--semi-color-bg-2)',
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  marginBottom: '12px',
                  borderRadius: '3px'
                }}
                >
                  <Component
                    onClick={() => {
                      onChange && onChange(item.key)
                    }} size='inherit'
                  />
                </List.Item>
              )
            } else {
              return <div>1</div>
            }
          }}
        />
      </div>
    )
  }
}
