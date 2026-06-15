import React, { useEffect, useRef, useState } from 'react'
import {
  ImagePreview,
  Tabs,
  TabPane,
  Modal,
  ResizeGroup,
  ResizeItem,
  ResizeHandler
} from '@douyinfe/semi-ui'

import ConfigPanel from './panels/config/ConfigPanel.jsx'
import DialogCodeEdit from './panels/files/DialogCodeEdit.jsx'
import EditMenuBar from './panels/menu/EditMenuBar.jsx'
import PreviewMenuBar from './panels/menu/PreviewMenuBar.jsx'
import WorkSpaceControl from './workspace/WorkspaceControl'

import editorStore from './store/editor.store.js'
import appStore from './store/app.store.js'

import './editor.less'
import './panels/common.less'
import AppFileList from './panels/files/AppFileList.jsx'
import LeftNav from './panels/left-nav/LeftNav.jsx'
import AppPagePreviewList from './panels/files/AppPagePreviewList.jsx'
import ComponentRegistryPanel from './panels/component/ComponentRegistryPanel.jsx'

const Editor = () => {
  const codeEditorRef = useRef(null)

  const [collapseLeft, setCollapseLeft] = useState(false)
  // const [currentPanel, setCurrentPanel] = useState('app')
  const [leftContentWidth, setLeftContentWidth] = useState(340) // 存储左侧宽度

  const currentPanel = editorStore((state) => state.currentPanel)
  const setCurrentPanel = editorStore((state) => state.setCurrentPanel)
  const imagePreviewVisible = editorStore((state) => state.imagePreviewVisible)
  const imagePreviewSrc = editorStore((state) => state.imagePreviewSrc)
  const setWorkspaceControl = editorStore((state) => state.setWorkspaceControl)
  const closeImagePreview = editorStore((state) => state.closeImagePreview)
  const initStore = editorStore((state) => state.initStore)
  const openedPages = editorStore((state) => state.openedPages)
  const closeAllPages = editorStore((state) => state.closeAllPages)
  const exitToAppList = appStore((state) => state.exitToAppList)

  useEffect(() => {
    const initialize = async () => {
      initStore({
        codeEditorRef
      })
      const workspaceControl = new WorkSpaceControl()
      workspaceControl.init({
        editorStore
      })
      setWorkspaceControl(workspaceControl)
    }
    initialize()
  }, [])

  const confirmExitToAppList = async () => {
    if (openedPages.length) {
      Modal.confirm({
        title: '离开应用',
        content: '确认离开应用并且关闭当前所有打开的页面',
        onOk: async () => {
          await closeAllPages()
          exitToAppList()
        }
      })
    } else {
      exitToAppList()
    }
  }

  const onDeviceChange = () => {

  }

  return (
    <div className='editor-root'>
      <LeftNav active={currentPanel} onChange={val => setCurrentPanel(val)} onBack={confirmExitToAppList} />
      {/* 使用 ResizeGroup 替换手动拖拽实现 */}
      <ResizeGroup direction='horizontal' className='editor-resize-group'>
        {/* 左侧内容区域 */}
        <ResizeItem
          defaultSize={leftContentWidth + 'px'}
          min='280px'
          max='600px'
          onResize={(size) => {
            setLeftContentWidth(parseInt(size))
          }}
          style={{
            display: collapseLeft ? 'none' : 'block',
            height: '100%',
            overflow: 'hidden'
          }}
        >
          <div className='left-content'>
            <Tabs
              renderTabBar={null}
              activeKey={currentPanel}
              onChange={setCurrentPanel}
              tabPosition='none'
              style={{ height: '100%' }}
            >
              {/* 应用 → 文件列表 / 应用列表 自动切换 */}
              <TabPane tab='应用' itemKey='app'>
                <AppFileList />
                {/* <Tabs
                  activeKey={appTab}
                  style={{ height: '100%' }}
                >
                  <TabPane tab='应用' itemKey='app-list'>
                    <AppListPanel />
                  </TabPane>
                  <TabPane tab='组件' itemKey='loading'>
                    <Spin
                      spinning
                      size='middle'
                      tip='应用读取中'
                      style={{
                        minHeight: '600px',
                        height: '100%',
                        width: '100%'
                      }}
                    />
                  </TabPane>
                  <TabPane tab='组件' itemKey='file-list'>
                  </TabPane>
                </Tabs> */}
              </TabPane>

              {/* 组件库 */}
              <TabPane tab='组件' itemKey='component'>
                <ComponentRegistryPanel />
              </TabPane>

              {/* 预览 */}
              <TabPane tab='预览' itemKey='preview'>
                <AppPagePreviewList />
              </TabPane>
            </Tabs>
          </div>
        </ResizeItem>

        {/* 拖拽手柄 */}
        <ResizeHandler style={{
          width: 4,
          background: 'var(--semi-color-bg-0)',
          borderRight: '1px solid var(--semi-color-border)',
          zIndex: 99
        }}
        >
          <div />
        </ResizeHandler>

        {/* 右侧编辑区域 */}
        <ResizeItem
          min='400px'
          style={{
            height: '100%',
            overflow: 'hidden',
            flex: 1
          }}
        >
          <div
            className='editor-content' style={{
              display: currentPanel === 'preview' ? 'none' : ''
            }}
          >
            <EditMenuBar />
            <div className='workspace-panel'>
              <div className='workspace'>
                <div className='view-port' isViewPort />
              </div>
              <ConfigPanel />
            </div>
          </div>

          <div
            className='preview-content' style={{
              display: currentPanel === 'preview' ? '' : 'none'
            }}
          >
            <PreviewMenuBar onDeviceChange={onDeviceChange} />
            <div className='preview-space'>
              <div className='preview-view-port' />
            </div>
          </div>
        </ResizeItem>
      </ResizeGroup>

      <ImagePreview
        src={imagePreviewSrc}
        visible={imagePreviewVisible}
        onVisibleChange={visible => !visible && closeImagePreview()}
      />
      <DialogCodeEdit ref={codeEditorRef} />
    </div>
  )
}
export default Editor
