import React, { useState } from 'react'
import { Layout, Nav, Button, Typography, Empty, Icon, Modal, Avatar, Descriptions } from '@douyinfe/semi-ui'
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
