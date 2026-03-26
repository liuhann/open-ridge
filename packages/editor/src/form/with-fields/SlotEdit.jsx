import React, { useEffect } from 'react'
import { withField, TreeSelect } from '@douyinfe/semi-ui'

import context from '../../service/RidgeEditorContext.js'

const SlotEdit = ({
  value,
  onChange
}) => {
  const treeData = context.editorComposite.getCompositeElementTree().filter(child => child.key !== context.selectedNode?.getId())

  return (
    <TreeSelect
      className='slot-tree-select'
      showClear
      size='small'
      onChange={(val, node) => {
        onChange(val)
      }}
      value={value}
      style={{ width: 180 }}
      dropdownStyle={{ maxHeight: 320, overflow: 'auto' }}
      treeData={treeData}
      placeholder='请选择目标元素'
    />
  )
}

export default withField(SlotEdit)
