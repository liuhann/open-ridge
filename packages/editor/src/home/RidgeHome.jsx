import React, { useState } from 'react'
import { Layout, Nav, Button, Typography, Empty, Icon, Modal, Avatar } from '@douyinfe/semi-ui'
import { IconHome, IconTemplate, IconApps } from '@douyinfe/semi-icons'
import { ICON_COMMON_USER_PLUS, ICON_COMMON_HOME, ICON_MENU_STAR, ICON_COMMON_PLUS, FILE_FOLDER } from '../icons/icons.js'
import AppListPanel from '../panels/apps/AppListPanel.jsx'
import './home.less'

const { Content, Sider } = Layout
const { Title, Text } = Typography

// 模拟数据
const mockAppList = [
  { id: 'app1', name: '数据大屏示例', iconUrl: '' },
  { id: 'app2', name: '表单编辑器', iconUrl: '' },
  { id: 'app3', name: '流程设计器', iconUrl: '' }
]

const recommendApps = [
  { id: 'r1', name: '官方数据模板' },
  { id: 'r2', name: '流程设计器' },
  { id: 'r3', name: '报表生成器' },
  { id: 'r4', name: '表单编辑器' },
  { id: 'r5', name: '数据大屏' },
  { id: 'r6', name: '导入助手' }
]

// 右侧首页内容
const AppListPanel1 = () => {
  const [createDialogVisible, setCreateDialogVisible] = useState(false)
  const appList = mockAppList
  const recentApps = appList.slice(-3).reverse()

  const openApp = (id) => {
    Modal.info({ title: '打开应用', content: `应用ID：${id}` })
  }

  const getAppIcon = () => {
    return <IconApps size='large' />
  }

  const openRecommendApp = (item) => {
    Modal.info({ title: '打开官方模板', content: `模板：${item.name}` })
  }

  return (
    <div className='app-list-panel' style={{ padding: 24 }}>
      {/* 顶部：开始创作（横贯式） */}
      <div
        style={{
          background: 'linear-gradient(201.15deg, rgba(255, 255, 255, 0.12) 6.58%, rgba(255, 226, 138, 0.12) 32.88%, rgba(231, 45, 255, 0.12) 67.93%, rgba(0, 115, 255, 0.12) 94.23%)',
          borderRadius: 12,
          padding: '28px 32px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          marginBottom: 32,
          cursor: 'pointer'
        }}
        onClick={() => setCreateDialogVisible(true)}
      >
        <Title heading={4} style={{ color: '#fff', margin: 0 }}>{ICON_COMMON_PLUS} 开始创作</Title>
      </div>

      {/* 模板样例 */}
      <div style={{ marginBottom: 32 }}>
        <Text strong style={{ fontSize: 16, display: 'block', marginBottom: 16 }}>
          从模板样例开始
        </Text>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))',
          gap: 16
        }}
        >
          {recommendApps.map(item => (
            <div
              key={item.id}
              style={{
                padding: 16,
                borderRadius: 8,
                background: 'var(--semi-color-fill-0)',
                textAlign: 'center',
                cursor: 'pointer'
              }}
              onClick={() => openRecommendApp(item)}
            >
              <div style={{ marginBottom: 8 }}>⭐</div>
              <div>{item.name}</div>
            </div>
          ))}
        </div>
      </div>

      {/* 最近打开 */}
      <div>
        <Text strong style={{ fontSize: 16, display: 'block', marginBottom: 16 }}>
          最近打开应用
        </Text>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))',
          gap: 16
        }}
        >
          {recentApps.map(item => (
            <div
              key={item.id}
              style={{
                padding: 16,
                borderRadius: 8,
                background: 'var(--semi-color-fill-0)',
                textAlign: 'center',
                cursor: 'pointer'
              }}
              onClick={() => openApp(item.id)}
            >
              <div style={{ marginBottom: 8 }}>{getAppIcon()}</div>
              <div>{item.name}</div>
            </div>
          ))}
        </div>
        {recentApps.length === 0 && (
          <Empty layout='horizontal' description='暂无最近打开应用' />
        )}
      </div>
    </div>
  )
}

// 主页面（使用 Semi 官方 Nav）
const RidgeUHomePage = () => {
  const [isLogin, setIsLogin] = useState(false)

  return (
    <Layout style={{ height: '100vh', border: '1px solid var(--semi-color-border)' }}>
      {/* 👇 完全按你给的官方写法实现 */}
      <Sider className='nav-sider' style={{ backgroundColor: 'var(--semi-color-bg-1)' }}>
        <Nav
          className='nav-sider-nav'
          style={{ maxWidth: 220, height: '100%' }}
          items={[
            { itemKey: 'home', text: '首页', icon: ICON_COMMON_HOME },
            { itemKey: 'template', text: '模板', icon: ICON_MENU_STAR },
            { itemKey: 'myApp', text: '我的应用', icon: FILE_FOLDER }
          ]}
        // 头部：Logo + 标题
          header={{
            logo: (
              <Avatar
                size='small'
                // icon={isLogin ? null : <Icon svg={ICON_COMMON_USER} />}
                style={{ marginRight: 10, fontSize: 28 }}
              >
                {ICON_COMMON_USER_PLUS}
              </Avatar>
            ),
            text: isLogin ? '我的工作台' : '请登录'
          }}
        // 底部：收缩按钮
          footer={{
            collapseButton: true
          }}
          onSelect={(data) => console.log('选择菜单：', data)}
          onClick={(data) => console.log('点击菜单：', data)}
        />
      </Sider>
      <Layout>
        <Content style={{ background: 'var(--semi-color-bg-1)', overflow: 'auto' }}>
          <AppListPanel />
        </Content>
      </Layout>
    </Layout>
  )
}

export default RidgeUHomePage
