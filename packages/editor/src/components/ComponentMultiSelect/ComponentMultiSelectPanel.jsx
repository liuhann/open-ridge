import React, { useState, useEffect, useMemo } from 'react'
import { Tabs, Input, Checkbox, Typography, Tag, Icon } from '@douyinfe/semi-ui'
import ComponentItemCard from '../ComponentItem/ComponentItemCard.jsx'
import SelectedComponentPopOver from './SelectedComponentPopOver.jsx'
import { ICON_COMMON_SEARCH } from '../../icons/icons.js'
// 引入 module.less
import styles from './ComponentMultiSelectPanel.module.less'
import { getIconUrl } from '../../panels/component/componentUtils.js'
import componentStore from '../../store/component.store.js'

const { Text } = Typography
const TabPane = Tabs.TabPane

const ComponentMultiSelectPanel = ({
  onSelectionChange,
  defaultSelected = []
}) => {
  const componentLibList = componentStore(state => state.componentLibList)
  const getComponentLibMeta = componentStore(state => state.getComponentLibMeta)

  const [activeLib, setActiveLib] = useState('')
  const [selectedComponents, setSelectedComponents] = useState(defaultSelected)
  const [componentLibMeta, setComponentLibMeta] = useState({})
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const [libComponents, setLibComponents] = useState([])

  useEffect(() => {
    if (componentLibList.length > 0 && !activeLib) {
      setActiveLib(componentLibList[0].module)
    }
  }, [componentLibList])

  const onLibChange = async moduleName => {
    setActiveLib(moduleName)
    setLoading(true)
    setError(null)

    try {
      const componentLibMeta = await getComponentLibMeta(moduleName)
      const mockComponents = componentLibMeta.components
      setComponentLibMeta(componentLibMeta)
      setLibComponents(mockComponents)
    } catch (err) {
      setLibComponents([])
      setError(`加载组件库失败: ${err.message}`)
      console.error('加载组件库失败:', err)
    } finally {
      setLoading(false)
    }
  }

  const toggleComponent = (comp) => {
    const key = `${comp.packageName}/${comp.name}`
    const isSelected = selectedComponents.some(item => item.key === key)

    let newSelected
    if (isSelected) {
      newSelected = selectedComponents.filter(item => item.key !== key)
    } else {
      newSelected = [
        ...selectedComponents,
        {
          ...comp,
          key,
          libTitle: componentLibMeta.libEntry.title,
          title: comp.title
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

  return (
    // 改用 styles.xxx
    <div className={styles.componentMultiSelectPanel}>
      <div className={styles.componentMultiSelectPanelTabs}>
        <Tabs
          type='button'
          collapsible='auto'
          activeKey={activeLib}
          onChange={onLibChange}
        >
          {componentLibList.map(lib => (
            <TabPane
              tab={
                <span className={styles.tabPane}>
                  <img className={styles.imageIcon} src={getIconUrl(lib)} />
                </span>
              }
              itemKey={lib.module}
              key={lib.module}
            />
          ))}
        </Tabs>
        <SelectedComponentPopOver toggleComponent={toggleComponent} selectedComponents={selectedComponents} />
      </div>

      <div className={styles.componentListWrapper}>
        <div className={styles.componentGrid}>
          {libComponents.map(comp => (
            <div key={comp.name} className={styles.componentSelectItem}>
              <Checkbox className={styles.checkBox} checked={isSelected(comp)} onChange={() => toggleComponent(comp)} />
              <ComponentItemCard
                packageName={componentLibMeta.name}
                item={comp}
                selected={isSelected(comp)}
                onItemClick={() => toggleComponent(comp)}
              />
            </div>
          ))}

          {libComponents.length === 0 && (
            <div className={styles.emptyTip}>暂无匹配组件</div>
          )}
        </div>
      </div>

      {/* <div className={styles.selectedFooter}>
        <Text strong>已选组件：</Text>
        <div className={styles.selectedTags}>
          {Object.entries(selectedGroup).map(([lib, items]) => (
            <React.Fragment key={lib}>
              <Text type='tertiary' className={styles.libLabel}>
                {lib}：
              </Text>
              {items.map(item => (
                <Tag
                  key={item.key}
                  size='small'
                  closable
                  onClose={() => toggleComponent(item)}
                >
                  {item.title}
                </Tag>
              ))}
            </React.Fragment>
          ))}

          {selectedComponents.length === 0 && (
            <Text type='tertiary'>未选择任何组件</Text>
          )}
        </div>
      </div> */}
    </div>
  )
}

export default ComponentMultiSelectPanel
