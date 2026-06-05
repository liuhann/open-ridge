import React, { useState } from 'react'
import { Button, Divider, HotKeys, confirm, Space, ButtonGroup, Modal, Dropdown, InputNumber, Tooltip, Tabs, TabPane, Popover } from '@douyinfe/semi-ui'
import './style.less'
import { ICON_NAV_COMPONENTS, ICON_COMMON_DOT, ICON_NAV_RUN, ICON_COMMON_SAVE } from '../../icons/icons.js'

import editorStore from '../../store/editor.store.js'
import ScaleController from './ScaleController.jsx'

const EditorMenuBar = () => {
  const currentOpenPageId = editorStore(state => state.currentOpenPageId)
  const openedPages = editorStore(state => state.openedPages)
  const unsavedPages = editorStore(state => state.unsavedPages)
  const saveCurrentPage = editorStore(state => state.saveCurrentPage)
  const workspaceControl = editorStore(state => state.workspaceControl)

  const zoom = editorStore(state => state.zoom)
  const setZoom = editorStore(state => state.setZoom)
  const closePage = editorStore(state => state.closePage)
  const switchPage = editorStore(state => state.switchPage)
  const previewPage = editorStore(state => state.previewPage)

  const onTabClose = async tabKey => {
    if (unsavedPages.indexOf(tabKey) > -1) {
      await Modal.confirm({
        title: '确认',
        content: '当前页面尚未保存，关闭将丢失所有改动，是否确认',
        onOk: () => {
          closePage(tabKey)
        }
      })
    } else {
      closePage(tabKey)
    }
  }

  const switchToPage = tabKey => {
    switchPage(tabKey)
  }

  const savePage = () => {
    saveCurrentPage()
  }

  return (
    <div
      className='menu-bar'
    >
      <Tabs
        className='page-tabs' type='card' activeKey={currentOpenPageId} onTabClose={onTabClose} onTabClick={switchToPage}
      >
        {openedPages.map(t => (
          <TabPane icon={unsavedPages.indexOf(t.id) > -1 ? ICON_COMMON_DOT : null} closable tab={t.name} itemKey={t.id} key={t.id} />
        ))}
      </Tabs>
      <Space gap={4}>
        <ScaleController
          scale={zoom} onChange={val => {
            setZoom(val)
          }}
        />
        <Divider layout='vertical' />
        {/* <ReactComposite app='ridge-editor-app' path='/user/UserPanel' /> */}
        {/* <Popover trigger='click' position='topRight' showArrow content={<ReactComposite app='ridge-editor-app' path='/AppShare' />}>
            <Button icon={<HumbleiconsShare />}>导出</Button>
          </Popover> */}
        <Button
          disabled={!currentOpenPageId}
          type='tertiary' icon={ICON_COMMON_SAVE} theme='borderless' onClick={savePage}
        />

        <Tooltip content='预览页面'>
          <Button
            disabled={!currentOpenPageId}
            type='tertiary'
            theme='borderless'
            icon={ICON_NAV_RUN} onClick={() => {
              previewPage(currentOpenPageId)
            }}
          >预览
          </Button>
        </Tooltip>
      </Space>
    </div>
  )
}

export default EditorMenuBar
