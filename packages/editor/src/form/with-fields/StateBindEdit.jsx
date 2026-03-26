import React, { useState } from 'react'
import context from '../../service/RidgeEditorContext'
import { withField, Popover, Button, Space, Tree, Input, Typography, Tooltip, Tabs, TabPane } from '@douyinfe/semi-ui'

const { Title, Text } = Typography

const StateBindEdit = withField(({
  value,
  onChange
}) => {
  const [storeTreeData, setStoreTreeData] = useState([])
  const [visible, setVisible] = useState()

  const updateStateTree = () => {
    const storeModules = context.editorComposite ? context.editorComposite.getStoreModules() : []
    setStoreTreeData(storeModules.map(storeModule => storeModule.connects))
  }

  const [StoreName, type, key] = (value ?? '').split('.')
  const renderSelectState = () => {
    return (
      <div className='state-tree-wrapper'>
        <Space style={{ marginBottom: 10, width: '100%' }}>
          <Text style={{ flex: 1 }}>连接动态数据值</Text>
          <Button
            size='small'
            theme='solid' type='secondary' onClick={() => {
              onChange(null)
              setVisible(false)
            }}
          >取消连接
          </Button>
        </Space>
        <Tabs type='card'>
          <TabPane tab='页内数据值' itemKey='1'>
            <Tree
              searchRender={({ prefix, ...restProps }) => (
                <Space>
                  <Input
                    showClear
                    prefix={<i className='bi bi-search' style={{ margin: '0 8px' }} />}
                    {...restProps}
                  />
                </Space>
              )}
              value={value}
              filterTreeNode={storeTreeData.length}
              expandAll
              emptyContent='无可连接动态数据'
              treeData={storeTreeData}
              onSelect={val => {
                if (value === val) {
                  onChange(null)
                }
              }}
              onChange={val => {
                onChange(val)
              }}
            />
          </TabPane>
          <TabPane tab='提升为外部属性' itemKey='2'>
            <Space style={{ padding: '5px 10px' }}>
              <Text style={{ width: 100 }}>名称</Text> <Input
                showClear value={StoreName === 'Promote' ? key : ''} onChange={val => {
                  if (val === '' || val == null) {
                    onChange(null)
                  } else {
                    onChange('Promote.props.' + val)
                  }
                }}
                                                     />
            </Space>
          </TabPane>
        </Tabs>
      </div>
    )
  }

  return (
    <Popover
      content={renderSelectState} trigger='click' showArrow visible={visible} onVisibleChange={visible => {
        setVisible(visible)
        updateStateTree()
      }}
    >
      <div
        style={{
          height: 26,
          display: 'flex',
          alignItems: 'center'
        }}
      >
        <Tooltip
          content='数据连接'
          arrowPointAtCenter={false}
          position='topLeft'
        >
          <Button
            className='btn-code'
            placeholder='连接数据'
            type={value ? 'primary' : 'tertiary'}
            size='small'
            theme='borderless'
            onClick={() => {
              setVisible(!visible)
            }}
            icon={<i className='bi bi-lightning-charge' style={{ margin: '0 2px', flexShrink: 0 }} />}
          />
        </Tooltip>
      </div>
    </Popover>
  )
})

export default StateBindEdit
