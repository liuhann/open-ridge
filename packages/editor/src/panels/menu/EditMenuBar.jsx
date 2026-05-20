import React, { useState } from 'react'
import { Button, Divider, HotKeys, confirm, Space, ButtonGroup, Modal, Dropdown, InputNumber, Tooltip, Tabs, TabPane, Popover } from '@douyinfe/semi-ui'
import './style.less'
import { ICON_NAV_COMPONENTS, ICON_NAV_FOLDERS, ICON_NAV_RUN, ICON_COMMON_GEAR } from '../../icons/icons.js'

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

  const [shortcutVisible, setShortcutVisible] = useState(false)

  // 🔥 你的快捷键配置（直接在这里扩展）
  const shortcutList = [
    {
      keys: [HotKeys.Keys.ArrowUp],
      desc: '向上移动',
      onHotKey: () => {
        workspaceControl.triggerKeyBoardEvent('up')
      }
    },
    {
      keys: [HotKeys.Keys.ArrowDown],
      desc: '向下移动',
      onHotKey: () => {
        workspaceControl.triggerKeyBoardEvent('down')
      }
    },
    { keys: [HotKeys.Keys.ArrowLeft], desc: '向左移动' },
    { keys: [HotKeys.Keys.ArrowRight], desc: '向右移动' },
    { keys: [HotKeys.Keys.Control, HotKeys.Keys.C], desc: '复制' },
    { keys: [HotKeys.Keys.Control, HotKeys.Keys.V], desc: '粘贴' },
    { keys: [HotKeys.Keys.Control, HotKeys.Keys.S], desc: '保存' },
    { keys: [HotKeys.Keys.Delete], desc: '删除选中项' }
  ]

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
          <TabPane icon={unsavedPages.indexOf(t.id) > -1 ? <i class='bi bi-circle-fill' /> : null} closable tab={t.name} itemKey={t.id} key={t.id} />
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

        {/* 🔥 快捷键帮助按钮 */}
        <Tooltip content='快捷键说明'>
          <Button
            type='tertiary'
            theme='borderless'
            icon={<i className='bi bi-keyboard' />}
            onClick={() => setShortcutVisible(true)}
          />
        </Tooltip>

        <Button
          disabled={!currentOpenPageId}
          type='tertiary' icon={<i className='bi bi-floppy' />} theme='borderless' onClick={savePage}
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

      {/* 🔥 SemiUI 快捷键帮助弹窗（你要的样式） */}
      <Modal
        title='键盘快捷键'
        visible={shortcutVisible}
        onCancel={() => setShortcutVisible(false)}
        footer={null}
        width={500}
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {shortcutList.map((item, idx) => (
            <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
              {/* 直接渲染你原生使用的 HotKeys 组件 */}
              <HotKeys
                hotKeys={item.keys} onHotKey={() => {
                  item.onHotKey()
                }}
              />
              <span style={{ fontSize: 14 }}>{item.desc}</span>
            </div>
          ))}
        </div>
      </Modal>
    </div>
  )
}

export default EditorMenuBar
