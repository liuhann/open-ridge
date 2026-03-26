import React from 'react'
import { ReactComposite } from 'ridgejs'

export default ({
  value,
  preload,
  onChange
}) => {
  return (
    <ReactComposite
      app='ridge-editor-app'
      path='field/icon/FontIconSelect'
      preload={preload}
      value={value}
      onChange={payload => {
        onChange && onChange(payload)
      }}
    />
  )
}
