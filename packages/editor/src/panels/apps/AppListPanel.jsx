import React, { useState, useEffect } from 'react'
import './app-list.less'
import { Button, Modal, Typography, Empty, Space } from '@douyinfe/semi-ui'
import CreateAppDialog from './CreateAppDialog.jsx'
import appStore from '../../store/app.store.js'
import selectZipFile from '../../utils/selectFileUpload.js'

import { ICON_COMMON_PLUS } from '../../icons/icons.js'
import TitleBar from '../../components/TitleBar/TitleBar.jsx'

const { Text, Title } = Typography

const AppListPanel = () => {
  const [createDialogVisible, setCreateDialogVisible] = useState(false)
  const appList = appStore((state) => state.appList)
  const openApp = appStore((state) => state.openApp)
  const trashApp = appStore((state) => state.trashApp)
  const importAppFile = appStore((state) => state.importAppFile)
  const createEmptyApp = appStore((state) => state.createEmptyApp)

  // 最近打开（取最近3个）
  const recentApps = appList.slice(-3).reverse()

  // 推荐应用（官方示例，固定写6个占位，你后面可从接口/store取）
  const recommendApps = [
    { id: 'r1', name: '官方数据模板' },
    { id: 'r2', name: '流程设计器' },
    { id: 'r3', name: '报表生成器' },
    { id: 'r4', name: '表单编辑器' },
    { id: 'r5', name: '数据大屏' },
    { id: 'r6', name: '导入助手' }
  ]

  // 打开推荐应用
  const openRecommendApp = (item) => {
    Modal.info({ title: '打开官方应用', content: `应用：${item.name}` })
  }

  return (
    <div className='app-list-panel left-panel'>
      {/* 顶部标题 + 操作 */}
      <TitleBar
        title='应用管理' right={
          <Button
            theme='borderless' type='tertiary'
            icon={ICON_COMMON_PLUS}
            onClick={() => setCreateDialogVisible(true)}
          >新增应用
          </Button>
        }
      />
      <Text type='tertiary' className='panel-desc'>
        管理、创建、编辑你的所有应用
      </Text>

      {/* 创建弹窗 */}
      <CreateAppDialog
        visible={createDialogVisible}
        onConfirm={name => {
          setCreateDialogVisible(false)
          if (name === 'import') {
            selectZipFile(async file => {
              await importAppFile(file)
            })
          } else if (name === 'empty') {
            createEmptyApp()
          }
        }}
        onCancel={() => setCreateDialogVisible(false)}
      />

      {/* 最近打开 */}
      <div className='app-section'>
        <div className='section-header'>
          <Text strong>最近打开</Text>
        </div>
        <div className='app-grid'>
          {recentApps.length > 0 && (
            recentApps.map(item => (
              <div
                key={item.id}
                className='app-card'
                onClick={() => openApp(item.id)}
              >
                <div className='app-icon'>📄</div>
                <div className='app-name'>{item.name}</div>
                <div className='app-desc'>最近打开</div>
              </div>
            ))
          )}
        </div>
        {recentApps.length === 0 && <Empty layout='horizontal' description='暂无最近打开应用' />}
      </div>

      {/* 官方推荐 */}
      <div className='app-section'>
        <div className='section-header'>
          <Text strong>官方推荐应用</Text>
          <Text type='tertiary'>开箱即用</Text>
        </div>
        <div className='app-grid'>
          {recommendApps.map(item => (
            <div
              key={item.id}
              className='app-card recommend'
              onClick={() => openRecommendApp(item)}
            >
              <div className='app-icon'>⭐</div>
              <div className='app-name'>{item.name}</div>
              <div className='app-tag'>官方</div>
            </div>
          ))}
        </div>
      </div>

      {/* 全部应用 */}
      <div className='app-section'>
        <div className='section-header'>
          <Text strong>全部应用</Text>
          <Text type='tertiary'>{appList.length} 个应用</Text>
        </div>
        <div className='app-grid'>
          {appList.length > 0 && appList.map(item => (
            <div
              key={item.id}
              className='app-card'
              onClick={() => openApp(item.id)}
              onContextMenu={(e) => {
                e.preventDefault()
              }}
            >
              <div className='app-icon'>📁</div>
              <div className='app-name'>{item.name}</div>
              <div className='app-actions'>
                <Text
                  size='small'
                  type='danger'
                  onClick={(e) => {
                    e.stopPropagation()
                    Modal.confirm({
                      title: '确认删除？',
                      content: '应用删除后不可找回，如有需要建议您先导出到本地文件系统保存',
                      onOk: () => {
                        trashApp(item.id)
                      }
                    })
                  }}
                >
                  删除
                </Text>
              </div>
            </div>
          ))}
        </div>
        {appList.length === 0 &&
          <div style={{
            width: '100%',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '40px 0'
          }}
          >
            <Empty description='暂无应用，点击新增创建应用' />

            <Button
              style={{ marginTop: 20 }}
              theme='solid'
              type='primary'
              icon={ICON_COMMON_PLUS}
              onClick={() => setCreateDialogVisible(true)}
            >
              新增应用
            </Button>
          </div>}
      </div>
    </div>
  )
}

export default AppListPanel
