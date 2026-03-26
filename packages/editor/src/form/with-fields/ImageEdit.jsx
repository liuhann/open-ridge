import React from 'react'
import { withField, TreeSelect } from '@douyinfe/semi-ui'
import ridgeEditService from '../../service/RidgeEditorContext.js'

export const ImageEdit = ({
  value,
  onChange,
  options
}) => {
  const { appService } = ridgeEditService.services
  const treeData = appService.getUITreeData(node => {
    return node.type === options.type || (node.mimeType && node.mimeType.indexOf(options.type) > -1)
  })
  const renderLabel = (label, data) => {
    return <div>{label}</div>
  }

  return (
    <TreeSelect
      leafOnly
      size='small'
      onChange={(val, node) => {
        if (node && node.isLeaf) {
          onChange(val)
        } else {
          onChange('')
        }
      }}
      showClear
      value={value}
      style={{ width: 180 }}
      dropdownStyle={{ maxHeight: 320, overflow: 'auto' }}
      renderLabel={renderLabel}
      treeData={treeData}
      placeholder='请选择'
    />
  )
}

export default withField(ImageEdit)
