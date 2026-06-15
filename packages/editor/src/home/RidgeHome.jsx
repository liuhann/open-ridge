import React, { useState, useEffect } from 'react'
import { Layout, Nav, Button, Typography, Avatar, Space } from '@douyinfe/semi-ui'
import { ICON_COMMON_USER_PLUS, ICON_COMMON_HOME, ICON_MENU_STAR, FILE_FOLDER } from '../icons/icons.js'
import AppListPanel from './AppListPanel.jsx'
import RegisterDialog from './RegisterDialog.jsx'
import LoginDialog from './LoginDialog.jsx'
import GenerateInviteDialog from './GenerateInviteDialog.jsx'
import userStore from '../store/user.store.js'

import './home.less'

const { Content, Sider } = Layout

const RidgeUHomePage = () => {
  // 弹窗状态
  const [registerVisible, setRegisterVisible] = useState(false)
  const [loginVisible, setLoginVisible] = useState(false)
  const [inviteVisible, setInviteVisible] = useState(false)

  // 从 store 获取登录状态 & 方法
  const logonUser = userStore(state => state.logonUser)
  const initCurrentLogon = userStore(state => state.initCurrentLogon)
  const logout = userStore(state => state.logout)

  // 页面挂载初始化登录态
  useEffect(() => {
    initCurrentLogon()
  }, [initCurrentLogon])

  const isLogin = !!logonUser

  return (
    <Layout style={{ height: '100vh', border: '1px solid var(--semi-color-border)' }}>
      <Sider className='nav-sider' style={{ backgroundColor: 'var(--semi-color-bg-1)' }}>
        <Nav
          className='nav-sider-nav'
          style={{ maxWidth: 220, height: '100%' }}
          items={[
            { itemKey: 'home', text: '首页', icon: ICON_COMMON_HOME },
            { itemKey: 'template', text: '模板', icon: ICON_MENU_STAR },
            { itemKey: 'myApp', text: '我的应用', icon: FILE_FOLDER }
          ]}
          header={{
            children: (
              <div style={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: 8, padding: '0 8px' }}>
                <Avatar size='small' style={{ fontSize: 28 }}>
                  {ICON_COMMON_USER_PLUS}
                </Avatar>
                <Typography.Text strong>
                  {isLogin ? '我的工作台' : '请登录'}
                </Typography.Text>

                {isLogin
                  ? (
                    <Button
                      size='small'
                      type='danger'
                      style={{ marginLeft: 'auto' }}
                      onClick={logout}
                    >
                      退出登录
                    </Button>
                    )
                  : (
                    <Space style={{ marginLeft: 'auto' }} size={4}>
                      <Button
                        size='small'
                        type='tertiary'
                        onClick={() => setLoginVisible(true)}
                      >
                        登录
                      </Button>
                      <Button
                        size='small'
                        theme='solid'
                        type='primary'
                        onClick={() => setRegisterVisible(true)}
                      >
                        注册
                      </Button>
                    </Space>
                    )}
              </div>
            )
          }}
          footer={{
            collapseButton: true,
            extra: (
              <Button
                block
                size='small'
                type='warning'
                style={{ marginTop: 12 }}
                onClick={() => setInviteVisible(true)}
              >
                生成邀请码
              </Button>
            )
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

      {/* 弹窗 */}
      <RegisterDialog
        visible={registerVisible}
        onCancel={() => setRegisterVisible(false)}
      />
      <LoginDialog
        visible={loginVisible}
        onCancel={() => setLoginVisible(false)}
      />
      <GenerateInviteDialog
        visible={inviteVisible}
        onCancel={() => setInviteVisible(false)}
      />
    </Layout>
  )
}

export default RidgeUHomePage
