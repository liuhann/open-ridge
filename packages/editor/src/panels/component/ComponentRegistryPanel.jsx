import React, { useState, useEffect, useCallback } from 'react'
import { Button, Empty, Spin, Typography, Tag, Input, Icon } from '@douyinfe/semi-ui'
import { CATEGORIES, getDisplayName } from './componentUtils'
import ComponentLibCard from './ComponentLibCard.jsx'
import ComponentItemCard from '../../components/ComponentItem/ComponentItemCard.jsx'
import CategoryHeader from './CategoryHeader.jsx'
import TitleBar from '../../components/TitleBar/TitleBar.jsx'
import componentStore from '../../store/component.store'
import './ComponentRegistryPanel.less'
import { ICON_COMMON_SEARCH } from '../../icons/icons.js'

const { Text } = Typography

const ComponentRegistryPanel = () => {
  const [currentView, setCurrentView] = useState('libs')
  const [currentLib, setCurrentLib] = useState(null)
  const [libComponents, setLibComponents] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [componentLibMeta, setComponentLibMeta] = useState({})
  // 搜索过滤关键词
  const [filterKeyword, setFilterKeyword] = useState('')
  const componentLibList = componentStore(state => state.componentLibList)
  const getComponentLibMeta = componentStore(state => state.getComponentLibMeta)

  const groupedData = componentLibList.reduce((acc, item) => {
    if (!acc[item.category]) {
      acc[item.category] = []
    }
    acc[item.category].push(item)
    return acc
  }, {})

  const loadLibComponents = async (libItem) => {
    setLoading(true)
    setError(null)
    setCurrentLib(libItem)
    setFilterKeyword('') // 切换库时清空搜索

    try {
      const componentLibMeta = await getComponentLibMeta(libItem.module)
      const mockComponents = componentLibMeta.components

      setComponentLibMeta(componentLibMeta)
      setLibComponents(mockComponents)
      setCurrentView('components')
    } catch (err) {
      setError(`加载组件库失败: ${err.message}`)
      console.error('加载组件库失败:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleBackToLibs = () => {
    setCurrentView('libs')
    setCurrentLib(null)
    setLibComponents([])
    setFilterKeyword('')
  }

  const handleLibClick = (libItem) => {
    loadLibComponents(libItem)
  }

  // 过滤后的组件列表
  const filteredComponents = libComponents.filter(component => {
    if (!filterKeyword) return true
    const title = (component.title || '').toLowerCase()
    return title.includes(filterKeyword.toLowerCase())
  })

  const renderLibsView = () => (
    <>
      <TitleBar title='组件库' right={<Text className='component-grid-subtitle'>悬停在组件库上查看详细信息</Text>} />
      <div className='component-grid-container'>
        <div className='component-grid-list'>
          {Object.entries(CATEGORIES).map(([categoryKey, categoryInfo]) => {
            const items = groupedData[categoryKey] || []
            if (items.length === 0) return null

            return (
              <React.Fragment key={categoryKey}>
                <CategoryHeader
                  title={categoryInfo.title}
                  count={items.length}
                />

                {items.map((item, index) => (
                  <ComponentLibCard
                    key={index}
                    item={item}
                    onItemClick={handleLibClick}
                  />
                ))}
              </React.Fragment>
            )
          })}
        </div>
      </div>

      <div className='component-grid-footer'>
        <Text className='component-grid-count'>
          已加载 {componentLibList.length} 个组件库 | 悬停查看详情
        </Text>
      </div>
    </>
  )

  const renderComponentsView = () => (
    <>
      <TitleBar
        onBack={handleBackToLibs} title={getDisplayName(currentLib)} right={
          <Tag size='small'>{currentLib.version} </Tag>
        }
      />
      {loading
        ? (
          <div className='loading-container'>
            <Spin size='large' />
            <Text className='loading-text'>正在加载组件...</Text>
          </div>
          )
        : error
          ? (
            <div className='error-container'>
              <Empty
                title='加载失败'
                description={error}
              />
              <Button
                onClick={() => loadLibComponents(currentLib)}
                className='retry-button'
              >
                重试
              </Button>
            </div>
            )
          : (
            <>
              <div className='components-view-container'>
                {/* 搜索过滤输入框 */}
                <Input
                  placeholder='输入组件名称搜索...'
                  value={filterKeyword}
                  showClear
                  onChange={setFilterKeyword}
                  style={{ marginBottom: 16 }}
                />

                {filteredComponents.length === 0
                  ? (
                    <div className='empty-container'>
                      <Empty
                        title='暂无匹配组件'
                        description='切换关键词或重试'
                        image={<Icon style={{ fontSize: '52px' }} svg={ICON_COMMON_SEARCH} />}
                      />
                    </div>
                    )
                  : (
                    <div className='components-grid'>
                      {filteredComponents.map((component, index) => (
                        <div key={index} className='component-grid-item'>
                          <ComponentItemCard
                            packageName={componentLibMeta.name}
                            item={component}
                            onItemClick={() => {}}
                          />
                        </div>
                      ))}
                    </div>
                    )}
              </div>

              <div className='components-view-footer'>
                <Text className='components-count'>
                  共 {filteredComponents.length} 个组件
                </Text>
                <Text className='components-tip'>
                  点击组件以使用
                </Text>
              </div>
            </>
            )}
    </>
  )

  return (
    <div className='component-grid left-panel'>
      {currentView === 'libs' ? renderLibsView() : renderComponentsView()}
    </div>
  )
}

export default ComponentRegistryPanel
