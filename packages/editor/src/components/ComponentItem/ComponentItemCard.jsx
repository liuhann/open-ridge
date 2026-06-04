import React, { useState, useEffect, useRef } from 'react'
import { Typography, Popover } from '@douyinfe/semi-ui'
import EditorElement from '../../workspace/EditorElement'
import { loader } from 'ridgejs'
import { nanoid } from '../../utils/string'
import DragStore from '../../workspace/DragStore'
import styles from './card.module.less'

const { Text } = Typography

const ComponentItemCard = ({ packageName, item, selected }) => {
  const displayName = item.title || '未命名'
  const description = item.description || '无描述'
  // const iconUrl = getIconUrl(item, packageName)
  const tags = item.tags || []
  const containerRef = useRef(null)
  const detailContainerRef = useRef(null)
  const scaleRef = useRef(null)
  const [isHovered, setIsHovered] = useState(false)
  const meta = item

  // 组件原始配置宽高
  const compWidth = meta?.visualConfig?.preferredWidth || 240
  const compHeight = meta?.visualConfig?.preferredHeight || 160

  useEffect(() => {
    if (!containerRef.current) return
    mountElementInstance(containerRef.current)
    // ========== ✅ 正确：等比缩放 + 只缩小不放大 + 完全居中 ==========
    const updateScale = () => {
      const wrap = scaleRef.current
      const content = containerRef.current
      if (!wrap || !content) return

      // 容器可用宽高
      const containerW = wrap.clientWidth || 1
      const containerH = wrap.clientHeight || 1

      // 组件原始宽高
      const compW = compWidth
      const compH = compHeight

      // 计算缩放比例：取最小 → 保证内容能完整缩进来
      const scaleX = containerW / compW
      const scaleY = containerH / compH
      let scale = Math.min(scaleX, scaleY)

      // ✅ 关键：组件比容器小 → 不放大，保持 1.0
      if (scale > 1) {
        scale = 1
      }

      // ✅ 设置缩放 + 居中（必须同时定位居中）
      content.style.transform = `scale(${scale})`
      content.style.transformOrigin = 'top left'
      content.style.left = '50%'
      content.style.top = '50%'
      content.style.marginLeft = (-compW * scale) / 2 + 'px'
      content.style.marginTop = (-compH * scale) / 2 + 'px'
    }

    updateScale()
    window.addEventListener('resize', updateScale)
    return () => window.removeEventListener('resize', updateScale)
  }, [item, packageName, compWidth, compHeight])

  const mountElementInstance = (el) => {
    const elementConfig = {
      title: meta?.title || meta?.name || '未命名组件',
      path: packageName + '/' + item.name,
      id: nanoid(10),
      editor: { hidden: false, locked: false },
      styleEx: {},
      propEx: {},
      events: {}
    }

    el.style.width = compWidth + 'px'
    el.style.height = compHeight + 'px'
    const element = new EditorElement({
      composite: { loader },
      config: elementConfig,
      componentMeta: item
    })
    element.initPropsOnCreate()
    element.mount(el)
  }
  return (
    <Popover
      trigger='click'
      onVisibleChange={visible => {
        mountElementInstance(detailContainerRef.current)
      }}
      content={
        <div className={styles.tooltip}>
          <div className={styles.tooltipHeader}>
            <div><h3 className={styles.tooltipTitle}>{displayName}</h3></div>
          </div>
          {description && <Text className={styles.tooltipDescription}>{description}</Text>}
          {tags.length > 0 && (
            <div className={styles.tooltipTags}>
              {tags.slice(0, 3).map((tag, idx) => (
                <span key={idx} className={styles.tooltipTag}>{tag}</span>
              ))}
            </div>
          )}
          <h3 className={styles.tooltipTitle}>示例</h3>
          <div className={styles.previewWrapper}>
            <div ref={detailContainerRef} />
          </div>
        </div>
      }
      position='top'
      showArrow
      mouseEnterDelay={300}
    >
      <div
        className={styles.root + ' ' + (selected ? styles.rootSelected : '')}
        draggable
        onDragStart={() => DragStore.setDragData({ type: 'component', packageName, componentName: item.name, item })}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {/* <div className='component-item-image'>
          <img
            src={iconUrl}
            alt={displayName}
          />
        </div> */}
        {/* 👇 固定宽高 + 溢出隐藏 */}
        <div className={styles.renderContainer} ref={scaleRef}>
          <div ref={containerRef} style={{ position: 'absolute', top: 0, left: 0 }} />
        </div>

        <div className={styles.content}>
          <Text strong className={styles.name}>{displayName}</Text>
        </div>
        <div className={styles.hoverOverlay}><Text className={styles.text}>点击查看详情</Text></div>
      </div>
    </Popover>
  )
}

export default ComponentItemCard
