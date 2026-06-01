import React, { useState, useEffect, useMemo } from 'react'
import { Tabs, Input, Checkbox, Typography, Tag, Icon } from '@douyinfe/semi-ui'
import ComponentItemCard from '../ComponentItem/ComponentItemCard.jsx'
import { ICON_COMMON_SEARCH } from '../../icons/icons.js'
// 引入 module.less
import styles from './ComponentMultiSelectPanel.module.less'

const { Text } = Typography
const TabPane = Tabs.TabPane

const ComponentMultiSelectPanel = ({
  componentLibs = [],
  componentDataMap = {},
  libMetas = {},
  onSelectionChange,
  defaultSelected = []
}) => {
  const [activeLib, setActiveLib] = useState('')
  const [filterKeyword, setFilterKeyword] = useState('')
  const [selectedComponents, setSelectedComponents] = useState(defaultSelected)

  useEffect(() => {
    if (componentLibs.length > 0 && !activeLib) {
      setActiveLib(componentLibs[0].module)
    }
  }, [componentLibs])

  const currentComponents = useMemo(() => {
    return componentDataMap[activeLib] || []
  }, [activeLib, componentDataMap])

  const filteredComponents = useMemo(() => {
    if (!filterKeyword) return currentComponents
    const kw = filterKeyword.toLowerCase()
    return currentComponents.filter(comp => {
      const title = (comp.title || comp.name || '').toLowerCase()
      return title.includes(kw)
    })
  }, [currentComponents, filterKeyword])

  const toggleComponent = (comp) => {
    const key = `${activeLib}/${comp.name}`
    const isSelected = selectedComponents.some(item => item.key === key)

    let newSelected
    if (isSelected) {
      newSelected = selectedComponents.filter(item => item.key !== key)
    } else {
      newSelected = [
        ...selectedComponents,
        {
          key,
          lib: activeLib,
          libTitle: libMetas[activeLib]?.title || activeLib,
          comp
        }
      ]
    }

    setSelectedComponents(newSelected)
    onSelectionChange?.(newSelected)
  }

  const isSelected = (comp) => {
    const key = `${activeLib}/${comp.name}`
    return selectedComponents.some(item => item.key === key)
  }

  const selectedGroup = useMemo(() => {
    return selectedComponents.reduce((acc, cur) => {
      acc[cur.lib] = acc[cur.lib] || []
      acc[cur.lib].push(cur)
      return acc
    }, {})
  }, [selectedComponents])

  return (
    // 改用 styles.xxx
    <div className={styles.componentMultiSelectPanel} style={{ width: 900, height: 320 }}>
      <Tabs
        type='scrollable'
        activeKey={activeLib}
        onChange={setActiveLib}
      >
        {componentLibs.map(lib => (
          <TabPane
            tab={lib.title}
            key={lib.module}
          />
        ))}
      </Tabs>

      <div className={styles.componentListWrapper}>
        <Input
          placeholder='搜索组件…'
          value={filterKeyword}
          showClear
          onChange={setFilterKeyword}
          prefix={<Icon svg={ICON_COMMON_SEARCH} />}
          style={{ marginBottom: 10 }}
        />

        <div className={styles.componentGrid}>
          {filteredComponents.map(comp => (
            <div key={comp.name} className={styles.componentSelectItem}>
              <Checkbox checked={isSelected(comp)} onChange={() => toggleComponent(comp)} />
              <ComponentItemCard
                packageName={activeLib}
                item={comp}
                onItemClick={() => toggleComponent(comp)}
              />
            </div>
          ))}

          {filteredComponents.length === 0 && (
            <div className={styles.emptyTip}>暂无匹配组件</div>
          )}
        </div>
      </div>

      <div className={styles.selectedFooter}>
        <Text strong>已选组件：</Text>
        <div className={styles.selectedTags}>
          {Object.entries(selectedGroup).map(([lib, items]) => (
            <React.Fragment key={lib}>
              <Text type='tertiary' className={styles.libLabel}>
                {libMetas[lib]?.title || lib}：
              </Text>
              {items.map(item => (
                <Tag
                  key={item.key}
                  size='small'
                  closable
                  onClose={() => toggleComponent(item.comp)}
                >
                  {getDisplayName(item.comp)}
                </Tag>
              ))}
            </React.Fragment>
          ))}

          {selectedComponents.length === 0 && (
            <Text type='tertiary'>未选择任何组件</Text>
          )}
        </div>
      </div>
    </div>
  )
}

export default ComponentMultiSelectPanel
