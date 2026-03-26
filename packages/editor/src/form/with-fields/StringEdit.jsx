import React from 'react'
import { withField, Button, Input } from '@douyinfe/semi-ui'

const StringEdit = withField(({
  value,
  onChange,
  ...opts
}) => {
  return (
    <Input
      {...opts}
      value={value} onChange={val => {
        onChange(val)
      }}
    />
  )
})

export default StringEdit
