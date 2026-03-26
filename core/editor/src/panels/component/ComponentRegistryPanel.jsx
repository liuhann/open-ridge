import React, { useState, useEffect } from 'react'
import {
  Typography,
  Popover,
  Tooltip
} from '@douyinfe/semi-ui'
import './ComponentRegistryPanel.less'
import { loader } from 'ridgejs'

const { Text } = Typography

// 分类定义
const CATEGORIES = {
  container: {
    title: '容器组件',
    color: 'blue'
  },
  interaction: {
    title: '交互组件',
    color: 'green'
  },
  chart: {
    title: '图表组件',
    color: 'purple'
  }
}

// 获取版本号
const getVersion = (dist) => {
  if (!dist) return '未知版本'

  if (Array.isArray(dist)) {
    const firstDist = dist[0] || ''
    const match = firstDist.match(/@([\d.]+)/)
    return match ? `v${match[1]}` : '未知版本'
  } else {
    const match = dist.match(/@([\d.]+)/)
    return match ? `v${match[1]}` : '未知版本'
  }
}

// 获取显示名称
const getDisplayName = (item) => {
  if (!item) return '未知组件'
  return item.title || item.module || '未命名组件'
}

// 获取首字母
const getInitial = (name) => {
  if (!name) return '?'
  return name.charAt(0).toUpperCase()
}

// 获取图标URL
const getIconUrl = (item) => {
  if (item.icon) {
    return item.icon
  }
  return null
}

// 估算加载大小
const estimateBundleSize = (dist) => {
  if (!dist) return '未知'

  if (Array.isArray(dist)) {
    // 简单估算：每个文件平均约50-100KB
    const estimatedKB = dist.length * 75
    return `${estimatedKB}KB`
  } else {
    return '约50KB'
  }
}

// Popover详细内容组件
const PopoverDetailContent = ({ item }) => {
  const displayName = getDisplayName(item)
  const version = getVersion(item.dist)
  const iconUrl = getIconUrl(item)
  const dependencies = item.dependencies || []
  const bundleSize = estimateBundleSize(item.dist)
  const categoryInfo = CATEGORIES[item.category] || {}

  return (
    <div className='popover-detail'>
      {/* 头部 */}
      <div className='popover-detail-header'>
        <div className='popover-detail-title'>
          {iconUrl
            ? (
              <img src={iconUrl} alt={displayName} className='popover-detail-icon' />
              )
            : (
              <div className='popover-detail-icon'>
                {getInitial(displayName)}
              </div>
              )}
          <div>
            <h3 className='popover-detail-name'>{displayName}</h3>
            <div className='popover-detail-meta'>
              <span className='popover-detail-version'>{version}</span>
            </div>
            {/* <code className='popover-detail-module'>{item.module}</code> */}
          </div>
        </div>

        {item.description && (
          <Text className='popover-detail-description'>
            {item.description}
          </Text>
        )}
      </div>

      {/* 主体内容 */}
      <div className='popover-detail-body'>
        {/* 标签和分类 */}
        <div className='popover-detail-section'>
          <h4 className='popover-detail-section-title'>许可</h4>
          <div className='popover-detail-tags'>
            {item.license && (
              <span className='popover-detail-tag'>{item.license}</span>
            )}
          </div>
        </div>

        {/* 统计信息 */}
        <div className='popover-detail-section'>
          <h4 className='popover-detail-section-title'>技术信息</h4>
          <div className='popover-detail-stats'>
            <div className='popover-detail-stat'>
              <div className='popover-detail-stat-label'>版本</div>
              <div className='popover-detail-stat-value'>{version}</div>
            </div>
            <div className='popover-detail-stat'>
              <div className='popover-detail-stat-label'>加载大小</div>
              <div className='popover-detail-stat-value'>{bundleSize}</div>
            </div>
            <div className='popover-detail-stat'>
              <div className='popover-detail-stat-label'>依赖数量</div>
              <div className='popover-detail-stat-value'>{dependencies.length}</div>
            </div>
          </div>
        </div>

        {/* 依赖信息 */}
        {dependencies.length > 0 && (
          <div className='popover-detail-section'>
            <h4 className='popover-detail-section-title'>依赖项</h4>
            <div className='popover-detail-dependencies'>
              {dependencies.map((dep, index) => (
                <span key={index} className='popover-detail-dependency'>
                  {dep}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* 示例图片 */}
        <div className='popover-detail-section'>
          <h4 className='popover-detail-section-title'>示例展示</h4>
          <div className='popover-detail-image'>
            {item.splash
              ? (
                <img src={loader.addUrlPrefix(item.splash)} alt={`${displayName}示例`} />
                )
              : (
                <div className='image-placeholder'>
                  暂无示例图片
                </div>
                )}
          </div>
        </div>
      </div>

      {/* 底部 */}
      <div className='popover-detail-footer'>
        <Text className='popover-detail-action'>
          点击卡片以使用此组件库
        </Text>
      </div>
    </div>
  )
}

// 组件卡片
const ComponentCard = ({ item, onItemClick }) => {
  const displayName = getDisplayName(item)
  const version = getVersion(item.dist)
  const iconUrl = getIconUrl(item)
  const dependencies = item.dependencies || []
  const [popoverVisible, setPopoverVisible] = useState(false)

  const handleCardClick = () => {
    if (onItemClick) {
      onItemClick(item)
    }
  }

  return (
    <Popover
      visible={popoverVisible}
      onVisibleChange={setPopoverVisible}
      content={<PopoverDetailContent item={item} />}
      position='right'
      trigger='hover'
      className='component-popover'
      showArrow
      autoAdjustOverflow
      spacing={12}
    >
      <div
        className='component-card'
        onClick={handleCardClick}
        onMouseEnter={() => setPopoverVisible(true)}
        onMouseLeave={() => setPopoverVisible(false)}
      >
        {/* 卡片主内容 */}
        <div className='component-card-image'>
          {iconUrl
            ? (
              <img src={iconUrl} alt={displayName} />
              )
            : (
              <div className='default-icon'>
                {getInitial(displayName)}
              </div>
              )}
        </div>

        <Text className='component-card-name'>
          {displayName}
        </Text>

        {/* Tooltip提示基础信息 */}
        <Tooltip content={`${displayName} - ${version}`}>
          <div style={{ position: 'absolute', inset: 0 }} />
        </Tooltip>
      </div>
    </Popover>
  )
}

// 分类标题
const CategoryHeader = ({ title, count }) => (
  <div className='category-header'>
    <div className='category-header-title'>
      {title}
      <span className='category-header-count'>{count}个</span>
    </div>
  </div>
)

// 主组件
const ComponentGrid = ({ componentStore, onItemClick }) => {
  const [componentData, setComponentData] = useState([])

  // 从store获取数据
  const registry = componentStore(state => state.registry)
  const init = componentStore(state => state.init)

  // 初始化数据
  useEffect(() => {
    init()
  }, [init])

  // 处理数据变化
  useEffect(() => {
    if (Array.isArray(registry)) {
      // 过滤掉基础库，只展示UI组件
      const filteredRegistry = registry.filter(item => item.category !== 'base')
      setComponentData(filteredRegistry)
    }
  }, [registry])

  // 按分类分组
  const groupedData = componentData.reduce((acc, item) => {
    if (!acc[item.category]) {
      acc[item.category] = []
    }
    acc[item.category].push(item)
    return acc
  }, {})

  return (
    <div className='component-grid'>
      {/* 头部信息 */}
      <div className='component-grid-header'>
        <h2 className='component-grid-title'>组件库</h2>
        <Text className='component-grid-subtitle'>
          将鼠标悬停在组件上查看详细信息
        </Text>
      </div>

      {/* 网格列表 */}
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
                  <ComponentCard
                    key={index}
                    item={item}
                    onItemClick={onItemClick}
                  />
                ))}
              </React.Fragment>
            )
          })}
        </div>
      </div>

      {/* 底部统计 */}
      <div className='component-grid-footer'>
        <Text className='component-grid-count'>
          已加载 {componentData.length} 个组件库 | 悬停查看详情
        </Text>
      </div>
    </div>
  )
}

export default ComponentGrid
