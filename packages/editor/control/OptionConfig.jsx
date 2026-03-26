import React from 'react'

export default ({
  value,
  onChange
}) => {
  const { ReactComposite } = window.ridgejs
  return (
    <ReactComposite app='ridge-editor-app' path='field/options/OptionListEdit' value={value} onChange={onChange} />
  )
}
