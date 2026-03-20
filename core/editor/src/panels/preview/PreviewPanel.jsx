import React, { useState } from 'react'
import { Typography, Tree, RadioGroup, Radio } from '@douyinfe/semi-ui'
import appStore from '../../store/app.store.js'
import { filterTree, mapTree } from '../files/buildFileTree.js'
const { Text } = Typography

const PreviewPanel = () => {
  const currentAppFilesTree = appStore((state) => state.currentAppFilesTree)

  const [type, setType] = useState('preview')

  const pageTreeData = mapTree(filterTree(currentAppFilesTree, node => node.type === 'directory' || node.type === 'page'),
    node => {
      if (node.type === 'directory') {
        return {
          icon: <i className='bi bi-folder2' />,
          label: node.name,
          id: node.id,
          key: node.id
        }
      }
      if (node.type === 'page') {
        return {
          icon: <i className='bi bi-layout-text-window-reverse' />,
          label: node.name,
          id: node.id,
          key: node.id
        }
      }
    }
  )

  const onNodeSelect = () => {}

  const onTypeChange = e => {
    setType(e.target.value)
  }
  return (
    <div className='left-panel'>
      <div className='panel-title'><Text type='tertiary'>预览和调试</Text></div>
      <RadioGroup
        onChange={onTypeChange}
        value={type}
        type='button'
      >
        <Radio value='preview'>页面预览</Radio>
        <Radio value='debug'>代码调试</Radio>
      </RadioGroup>
      <div className='panel-content'>
        <Tree
          className='file-tree'
          treeData={pageTreeData}
          onSelect={(key, selected, node) => {
            onNodeSelect(node)
          }}
        />
      </div>
    </div>
  )
}

export default PreviewPanel
