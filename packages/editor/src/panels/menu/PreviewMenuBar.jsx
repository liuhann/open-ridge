import React from 'react'
import { Button, Divider, Space, Dropdown } from '@douyinfe/semi-ui'
import './style.less'
import editorStore from '../../store/editor.store.js'
const PreviewMenuBar = ({ onClose, onRefresh, onDeviceChange, onOpenNewWindow }) => {
  const closePreviewPage = editorStore(state => state.closePreviewPage)
  const refreshPreviewPage = editorStore(state => state.refreshPreviewPage)

  // 设备切换菜单
  const deviceMenu = [
    { node: 'item', name: '手机（竖屏）', onClick: () => onDeviceChange?.('mobile', 'portrait') },
    { node: 'item', name: '手机（横屏）', onClick: () => onDeviceChange?.('mobile', 'landscape') },
    { node: 'item', name: '平板（竖屏）', onClick: () => onDeviceChange?.('tablet', 'portrait') },
    { node: 'item', name: '平板（横屏）', onClick: () => onDeviceChange?.('tablet', 'landscape') }
  ]

  return (
    <div className='preview-menu-bar'>
      {/* 左侧按钮组 */}
      <Space spacing={4} align='center'>
        {/* 关闭 */}
        <Button
          type='tertiary'
          theme='borderless'
          icon={<i className='bi bi-x-lg' />}
          onClick={closePreviewPage}
        />

        <Divider layout='vertical' />

        {/* 刷新 */}
        <Button
          type='tertiary'
          theme='borderless'
          icon={<i className='bi bi-arrow-clockwise' />}
          onClick={refreshPreviewPage}
        />

        <Divider layout='vertical' />

        {/* 设备切换 */}
        <Dropdown
          trigger='click'
          menu={deviceMenu}
        >
          <Button
            type='tertiary'
            theme='borderless'
            icon={<i className='bi bi-phone' />}
            suffixIcon={<i className='bi bi-arrow-repeat' />}
          >
            设备
          </Button>
        </Dropdown>
      </Space>

      {/* 右侧：新窗口预览 */}
      <Space>
        {/* <Button
          type='tertiary'
          theme='borderless'
          icon={<i className='bi bi-box-arrow-up-right' />}
          onClick={onOpenNewWindow}
        >
          新窗口预览
        </Button> */}
      </Space>
    </div>
  )
}

export default PreviewMenuBar
