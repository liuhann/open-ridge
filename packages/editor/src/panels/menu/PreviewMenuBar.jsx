import React, { useState, useMemo } from 'react'
import { Button, Divider, Space, Dropdown, Tabs, RadioGroup, Radio } from '@douyinfe/semi-ui'
import './style.less'
import { ICON_COMMON_DEVICE, ICON_COMMON_CLOSE, ICON_COMMON_REFRESH, ICON_DEVICE_ROTATE } from '../../icons/icons.js'
import editorStore from '../../store/editor.store.js'

// 设备数据：分类 + 选项(名称、宽、高)
const deviceGroups = [
  {
    groupName: '旗舰手机',
    list: [
      { label: 'iPhone 17/17 Pro 6.3"', w: 402, h: 874 },
      { label: 'iPhone 16/15 Pro Max 6.9"', w: 430, h: 932 },
      { label: 'iPhone 14/15 6.1"', w: 390, h: 844 },
      { label: '华为 Pura80 Ultra 6.8"', w: 424, h: 947 },
      { label: '小米 15 Ultra 6.73"', w: 412, h: 917 },
      { label: '三星 S25 Ultra 6.9"', w: 432, h: 936 },
      { label: '安卓通用旗舰 6.7"', w: 411, h: 915 }
    ]
  },
  {
    groupName: '折叠屏',
    list: [
      { label: '三星 Z Fold5 内屏 7.6"', w: 717, h: 954 },
      { label: '三星 Z Flip7 外屏 4.1"', w: 260, h: 520 }
    ]
  },
  {
    groupName: '平板设备',
    list: [
      { label: 'iPad Pro 11" 2025', w: 834, h: 1194 },
      { label: 'iPad Pro 13" 2025', w: 956, h: 1366 },
      { label: '华为 MatePad Pro 13.2"', w: 920, h: 1380 },
      { label: '小米 Pad 7 8.7"', w: 600, h: 960 }
    ]
  },
  {
    groupName: '笔记本/PC',
    list: [
      { label: 'MacBook Air 13.6" 2025', w: 1280, h: 800 },
      { label: 'MacBook Pro 14" 2025', w: 1440, h: 900 },
      { label: '荣耀 MagicBook 16" 2.5K', w: 1600, h: 1000 },
      { label: 'PC 1080P', w: 1920, h: 1080 },
      { label: 'PC 2K', w: 2560, h: 1440 }
    ]
  },
  {
    groupName: 'Widget/小窗口',
    list: [
      { label: '手机Widget 2x1', w: 300, h: 120 },
      { label: '手机Widget 2x2', w: 300, h: 300 },
      { label: '手机Widget 2x3', w: 300, h: 480 },
      { label: '桌面Widget 小', w: 320, h: 240 },
      { label: '桌面Widget 中', w: 480, h: 320 },
      { label: '桌面Widget 大', w: 640, h: 480 },
      { label: '侧边栏/小弹窗', w: 360, h: 600 }
    ]
  }
]

// 扁平化所有设备，用于状态取值
const flatDeviceList = deviceGroups.reduce((arr, group) => [...arr, ...group.list], [])

const PreviewMenuBar = ({ onClose, onRefresh, onDeviceChange, onOpenNewWindow }) => {
  const closePreviewPage = editorStore(state => state.closePreviewPage)
  const refreshPreviewPage = editorStore(state => state.refreshPreviewPage)
  const backToEdit = editorStore(state => state.backToEdit)

  // 状态：当前选中设备索引、横竖屏模式
  const [activeIndex, setActiveIndex] = useState(0)
  const [screenMode, setScreenMode] = useState('vertical')

  // 生成分组下拉菜单，选项展示 名称 + 像素尺寸
  const dropdownMenu = useMemo(() => {
    const menu = []
    deviceGroups.forEach(group => {
      // 分组标题
      menu.push({ node: 'title', name: group.groupName })
      // 分组内选项
      group.list.forEach((item) => {
        const idx = flatDeviceList.findIndex(d => d.label === item.label)
        // 选项文本：设备名 + 分辨率
        const optionName = `${item.label} (${item.w} × ${item.h})`
        menu.push({
          node: 'item',
          name: optionName,
          onClick: () => {
            setActiveIndex(idx)
            const [width, height] = screenMode === 'vertical' ? [item.w, item.h] : [item.h, item.w]
            onDeviceChange?.(width, height)
          }
        })
      })
      // 分组分割线
      menu.push({ node: 'divider' })
    })
    return menu
  }, [screenMode, onDeviceChange])

  // 横竖屏切换
  const handleTabChange = (key) => {
    setScreenMode(key)
    const { w, h } = flatDeviceList[activeIndex]
    const [width, height] = key === 'vertical' ? [w, h] : [h, w]
    onDeviceChange?.(width, height)
  }

  const currentDevice = flatDeviceList[activeIndex]
  // 按钮显示文本：设备名 + 当前分辨率
  const btnText = `${currentDevice.label} (${currentDevice.w} × ${currentDevice.h})`

  return (
    <div className='preview-menu-bar'>
      <Space spacing={4} align='center'>
        <Button type='tertiary' theme='borderless' onClick={backToEdit}>
          返回编辑
        </Button>

        <Divider layout='vertical' />

        <Button
          type='tertiary'
          theme='borderless'
          icon={ICON_COMMON_REFRESH}
          onClick={refreshPreviewPage}
        />

        <Divider layout='vertical' />

        {/* 分组下拉 + 横竖屏Tab */}
        <Space align='center'>
          <Dropdown
            trigger='click' style={{
              height: 600
            }} menu={dropdownMenu} position='bottomLeft'
          >
            <Button
              type='tertiary' theme='borderless' icon={ICON_COMMON_DEVICE}
            >
              {btnText}
            </Button>
          </Dropdown>

          <Button
            style={{
              fontSize: '18px'
            }}
            theme={screenMode === 'vertical' ? 'solid' : 'borderless'}
            type={screenMode === 'vertical' ? 'primary' : 'tertiary'}
            icon={ICON_DEVICE_ROTATE} onClick={() => {
              handleTabChange(screenMode === 'vertical' ? 'horizontal' : 'vertical')
            }}
          />
          <Tabs
            size='small'
            activeKey={screenMode}
            tabList={[
              { tab: '竖屏', key: 'vertical' },
              { tab: '横屏', key: 'horizontal' }
            ]}
          />
        </Space>
      </Space>

      <Space>
        <Button
          type='tertiary'
          theme='borderless'
          icon={ICON_COMMON_CLOSE}
          onClick={closePreviewPage}
        />
      </Space>
    </div>
  )
}

export default PreviewMenuBar
