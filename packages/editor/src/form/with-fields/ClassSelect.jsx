import React from 'react'

import PopEdit from '../component/PopEdit.jsx'
import { withField, Space, Input } from '@douyinfe/semi-ui'

const ClassSelect = ({
  value,
  onChange,
  options
}) => {
  return (
    <Space>
      <Input size='small' readonly value={value} />
      <PopEdit width={1024} height={600} title='请选择类样式' value={value} input={onChange} path='field/style/DialogStyleSelect' />
    </Space>
  )
}

export default withField(ClassSelect)
