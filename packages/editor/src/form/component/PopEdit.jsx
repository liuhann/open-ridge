import { ReactComposite } from 'ridgejs'
import { Popover, Button, Typography } from '@douyinfe/semi-ui'
import React, { useState } from 'react'
const { Title } = Typography
/**
 * 使用Composite提供的组件进行表单值选择功能
 */
export default ({
  value,
  input,
  path,
  width = 1024,
  height = 600,
  title = '请选择',
  icon = 'bi bi-pencil-square',
  ...rest
}) => {
  const [visible, setVisible] = useState(false)
  const renderContent = () => {
    return (
      <div style={{ width: width + 'px', height: height + 'px' }}>
        <Title heading={6} style={{ padding: '14px' }}>{title}</Title>
        <ReactComposite
          app='ridge-editor-app'
          path={path}
          value={value}
          input={input}
          {...rest}
        />
      </div>
    )
  }
  return (
    <Popover content={renderContent()} trigger='click'>
      <Button
        theme='borderless'
        type='tertiary'
        icon={<i className={icon} />}
        size='small' onClick={() => {
          setVisible(true)
        }}
      />
    </Popover>
  )
}
