import React from 'react'
import { withField, ColorPicker } from '@douyinfe/semi-ui'

export const PopColorPicker = ({
  value,
  input,
  onChange
}) => {
  let val = null
  if (value) {
    try {
      val = ColorPicker.colorStringToValue(value)
    } catch (e) {
      val = ColorPicker.colorStringToValue('#fff')
    }
  }
  return (
    <ColorPicker
      alpha
      usePopover
      value={val}
      onChange={newVal => {
        console.log(newVal)
        input && input(newVal.hex)
        onChange && onChange(newVal.hex)
      }}
    />
  )
}

export default withField(PopColorPicker)
