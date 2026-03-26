import { List, Popover, Image, Button } from '@douyinfe/semi-ui'
import React from 'react'

export default props => {
  const renderContent = () => {
    return (
      <div style={{
        width: props.width ? (props.width + 'px') : '480px',
        padding: '10px',
        height: props.height ? (props.height + 'px') : '480px',
        overflow: 'hidden auto'
      }}
      >
        <List
          grid={{
            gutter: 8,
            span: props.span ?? 6
          }} dataSource={props.options}
          layout='horizontal'
          renderItem={item => (
            <List.Item
              onClick={() => {
                props.onChange && props.onChange(item.value)
              }}
              main={
                <div style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
                >
                  {props.renderImage ? props.renderImage(item) : <Image src={item.src} />}
                  <div style={{ color: 'var(--semi-color-text-0)', fontWeight: 500 }}>{item.label}</div>
                </div>
                              }
            />
          )}
        />
      </div>
    )
  }

  return (
    <Popover content={renderContent} trigger='click'>
      <Button type='tertiary'>第三按钮</Button>
    </Popover>
  )
}
