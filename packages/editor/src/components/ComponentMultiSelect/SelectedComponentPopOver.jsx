import React, { useMemo } from 'react'
import { Popover, Typography, Tag } from '@douyinfe/semi-ui'
import styles from './ComponentMultiSelectPanel.module.less'
const { Text } = Typography
const SelectedComponentPopOver = ({
  selectedComponents,
  toggleComponent
}) => {
  const totalSelected = selectedComponents.length

  const selectedGroup = useMemo(() => {
    return selectedComponents.reduce((acc, cur) => {
      acc[cur.libTitle] = acc[cur.libTitle] || []
      acc[cur.libTitle].push(cur)
      return acc
    }, {})
  }, [selectedComponents])

  // 悬浮卡片里的内容（你原来的完整列表）
  const popoverContent = (
    <div className={styles.selectedTags}>
      {Object.entries(selectedGroup).map(([lib, items]) => (
        <div key={lib} className={styles.libGroup}>
          <Text type='tertiary' className={styles.libLabel}>
            {lib}：
          </Text>
          <div className={styles.selectedList}>
            {items.map(item => (
              <Tag
                key={item.key}
                size='small'
                closable
                onClose={(e) => {
                  // 阻止冒泡，避免点击关闭时触发 Popover 关闭
                  e.preventDefault()
                  e.stopPropagation()
                  toggleComponent(item)
                }}
              >
                {item.title}
              </Tag>
            ))}

          </div>
        </div>
      ))}

      {totalSelected === 0 && (
        <Text type='tertiary'>未选择任何组件</Text>
      )}
    </div>
  )

  return (
    <Popover
      content={popoverContent}
      title='已选组件'
      trigger='hover'
      placement='bottomLeft'
      arrow={false}
      overlayStyle={{ minWidth: 320 }}
    >
      <div className={styles.selectedFooter} style={{ cursor: 'pointer' }}>
        <Text strong>
          {totalSelected === 0
            ? '未选择任何组件'
            : `已选 ${totalSelected} 个组件`}
        </Text>
      </div>
    </Popover>
  )
}

export default SelectedComponentPopOver
