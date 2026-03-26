import React from 'react'
import { ReactComposite } from 'ridgejs'

export default ({
  value,
  onChange
}) => {
  return (
    <ReactComposite
      app='ridge-editor-app'
      path='field/list/ListEdit'
      value={value}
      onChange={payload => {
        onChange && onChange(payload)
      }}
    />
  )
}
