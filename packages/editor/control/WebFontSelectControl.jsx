import React, { useEffect, useState } from 'react'
import { Select } from '@douyinfe/semi-ui'

export default ({
  value,
  onChange,
  context
}) => {
  const [options, setOptions] = useState([])

  useEffect(() => {
    setOptions(context.editorComposite?.fontList ?? [])
  })
  return (
    <Select
      showClear
      optionList={options} value={value} onChange={val => {
        onChange && onChange(val)
      }}
    />

  )
}
