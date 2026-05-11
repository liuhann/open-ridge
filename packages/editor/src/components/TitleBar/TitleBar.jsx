import React from 'react'
import { Space, Typography, Button } from '@douyinfe/semi-ui'
import { ICON_NAV_BACK } from '../../icons/icons.js'
import './title-bar.less'
const { Text } = Typography
const TitleBar = ({
  onBack,
  title,
  right
}) => {
  return (
    <div
      className='title-bar'
    >
      <Space align='center'>
        {onBack && <Button
          icon={ICON_NAV_BACK}
          theme='borderless' type='tertiary'
          onClick={onBack}
                   />}
        <Text
          strong style={{
            fontSize: '16px',
            color: 'var(--semi-color-text-0)'
          }}
        >{title}
        </Text>
      </Space>
      <div className='align-right'>
        {right}
      </div>
    </div>
  )
}

export default TitleBar
