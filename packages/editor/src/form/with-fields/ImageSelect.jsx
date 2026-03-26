import React from 'react'
import { ReactComposite } from 'ridgejs'
import { withField } from '@douyinfe/semi-ui'

const ImageSelect = ({
  value,
  onChange
}) => {
  return <ReactComposite value={value} input={onChange} onChange={onChange} app='ridge-editor-app' path='field/image-select/ImageSelect' />
}

export default withField(ImageSelect)
