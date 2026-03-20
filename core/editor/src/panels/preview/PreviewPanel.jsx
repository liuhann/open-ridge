import React from 'react'
import { Typography, Tree } from '@douyinfe/semi-ui'
import appStore from '../../store/app.store.js'

const { Text } = Typography

const PreviewPanel = () => {
  const currentAppFilesTree = appStore((state) => state.currentAppFilesTree)
  return (
    <div className='left-panel'>
      <div className='panel-title'><Text type='tertiary'>预览和调试</Text></div>

      <div className='panel-content' >
        <Tree></Tree>
      </div>
    </div>
  )
}

export default PreviewPanel
