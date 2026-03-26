import React, { useState } from 'react'
import { withField, Button, Space, TextArea, Tree, Popover, Typography, Select, Tag, Checkbox } from '@douyinfe/semi-ui'
import context from '../../service/RidgeEditorContext'

const { Text } = Typography

const EventEdit = withField(({
  value,
  options,
  onChange
}) => {
  const [payloadValue, setPayloadValue] = useState('')
  // const [actionIndexList, setActionIndexList] = useState([])

  const actions = value || []
  const storeModules = context.editorComposite ? context.editorComposite.getStoreModules() : []
  const getTreeData = () => {
    if (value === 'promoted') {
      return [{
        label: options.label,
        key: 'action-root',
        root: true,
        disabled: true,
        children: []
      }]
    } else {
      return [{
        label: options.label,
        key: 'action-root',
        root: true,
        disabled: true,
        children: [...actions.map((action, index) => {
          const node = {}
          node.key = 'node-' + index
          node.index = index
          node.store = action.store
          node.method = action.method
          node.payload = action.payload || ''
          return node
        })]
      }]
    }
  }

  const renderTreeLabel = (label, data) => {
    return (
      <div className='tree-label'>
        {data.root &&
          <>
            <Text className='label-content'>
              <Tag
                onClick={() => {
                  const [, name] = options.fieldId.split('.')
                  console.log(name + ' Added')
                }} color='green'
              >{label}
              </Tag>
            </Text>
            <Space className='action'>
              {context.getSelectedNode() && <Button
                size='small'
                icon={<i class='bi bi-broadcast' />} theme={value === 'promoted' ? 'solid' : 'borderless'} onClick={() => {
                  if (value === 'promoted') {
                    onChange([])
                  } else {
                    onChange('promoted')
                  }
                }}
                                            />}
              {value !== 'promoted' &&
                <Button
                  style={{ marginRight: 10 }}
                  size='small' theme='borderless' type='primary' onClick={addAction} icon={<i class='bi bi-plus' />}
                />}
            </Space>
          </>}
        {!data.root && renderActionEdit(data)}
        {/* {!data.root && actionIndexList.indexOf(data.index) > -1 && renderActionEdit(data)}
        {!data.root && actionIndexList.indexOf(data.index) === -1 && renderActionNode(data)} */}
      </div>
    )
  }

  const renderActionEdit = (data) => {
    return (
      <>
        <div className='label-content'>
          <Select
            placeholder='请选择'
            style={{ width: 120 }}
            noLabel value={(data.store && data.method) ? (data.store + '.' + data.method) : ''} size='small' onChange={val => {
              const [store, method] = val.split('.')
              data.store = store
              data.method = method
              confirmActionEdit(data)
            }}
          >
            {storeModules.map(storeModule => {
              const storeActionRoot = storeModule.actions
              return (
                <Select.OptGroup label={storeActionRoot.label} key={storeActionRoot.name}>
                  {storeActionRoot.children.map(({ name, label }) => {
                    return <Select.Option key={name} value={name}>{label}</Select.Option>
                  })}
                </Select.OptGroup>
              )
            })}
          </Select>
          <Popover
            trigger='click'
            content={
              <div style={{ padding: 10 }}>
                <Text>请输入方法参数</Text>
                <TextArea
                  value={data.payload} onChange={val => {
                    confirmActionEdit(Object.assign(data, {
                      payload: val
                    }))
                  }}
                />
              </div>
            }
          >
            <Button
              theme='borderless'
              type={data.payload ? 'primary' : 'tertiary'}
              onClick={() => {
                setPayloadValue(data.payload)
              }}
              size='small'
              icon={<i class='bi bi-diagram-3' />}
            />
          </Popover>

        </div>
        <Space className='action'>
          <Button
            size='small' theme='borderless' type='tertiary' icon={<i class='bi bi-trash' />} onClick={() => {
              removeAction(data.index)
            }}
          />
        </Space>
      </>
    )
  }

  const addAction = () => {
    const newActions = [...actions, {
      store: '',
      method: '',
      payload: ''
    }]
    // setActionIndexList([...actionIndexList, newActions.length - 1])
    onChange(newActions)
  }

  // 删除动作
  const removeAction = (index) => {
    onChange(actions.filter((a, i) => {
      if (i === index) {
        return false
      } else {
        return true
      }
    }))
  }

  const confirmActionEdit = data => {
    // setActionIndexList(actionIndexList.filter(i => i !== data.index))
    onChange(actions.map((action, index) => {
      if (index === data.index) {
        return {
          store: data.store,
          method: data.method,
          payload: data.payload
        }
      } else {
        return action
      }
    }))
  }

  const treeData = getTreeData()
  return (
    <div className='event-edit'>
      <Tree
        className='event-tree'
        expandAll
        disabled
        renderLabel={renderTreeLabel}
        treeData={treeData}
      />
    </div>
  )
})

export default EventEdit
