import React, { useState } from 'react'
import { withField, Button, Space, TextArea, Tree, Popover, Typography, Select, Tag } from '@douyinfe/semi-ui'
import editorStore from '../../store/editor.store'

const { Text } = Typography

// 简单唯一 ID 生成
const generateId = () => 'action_' + Date.now() + '_' + Math.random().toString(36).slice(2, 6)

const EventEdit = withField(({
  value,
  options,
  onChange
}) => {
  const actions = value || []
  const compositeStoreModules = editorStore(state => state.compositeStoreModules)

  // 新增动作（自带唯一 ID）
  const addAction = () => {
    const newAction = {
      id: generateId(), // 👈 唯一 ID，永远不重复
      key: '',
      payload: ''
    }
    onChange([...actions, newAction])
  }

  // 删除
  const removeAction = (id) => {
    onChange(actions.filter(item => item.id !== id))
  }

  // 更新
  const updateAction = (id, updatedFields) => {
    onChange(
      actions.map(item =>
        item.id === id ? { ...item, ...updatedFields } : item
      )
    )
  }

  // 渲染单个动作
  const renderActionItem = (item) => {
    return (
      <div className='tree-label' style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        <Select
          placeholder='请选择方法'
          style={{ width: 160 }}
          size='small'
          value={item.key}
          onChange={(val) => updateAction(item.id, { key: val })}
        >
          {compositeStoreModules.map(storeModule => (
            <Select.OptGroup label={storeModule.actions.label} key={storeModule.actions.key}>
              {storeModule.actions.children.map(({ key, label }) => (
                <Select.Option key={key} value={key}>{label}</Select.Option>
              ))}
            </Select.OptGroup>
          ))}
        </Select>

        <Popover
          trigger='click'
          content={
            <div style={{ padding: 10, width: 300 }}>
              <Text strong>方法参数</Text>
              <TextArea
                value={item.payload}
                onChange={(val) => updateAction(item.id, { payload: val })}
                rows={4}
                style={{ marginTop: 8 }}
              />
            </div>
          }
        >
          <Button
            size='small' theme='borderless' type={item.payload ? 'primary' : 'tertiary'}
            icon={<i className='bi bi-diagram-3' />}
          />
        </Popover>

        <Button
          size='small' theme='borderless' type='tertiary'
          icon={<i className='bi bi-trash' />}
          onClick={() => removeAction(item.id)}
        />
      </div>
    )
  }

  // 树标题
  const renderTreeLabel = (label, data) => {
    if (data.root) {
      return (
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <Tag color='green'>{options.label}</Tag>
          <Button
            size='small' type='primary' theme='borderless'
            icon={<i className='bi bi-plus' />}
            onClick={addAction}
          />
        </div>
      )
    }
    return renderActionItem(data.item)
  }

  // 树数据（用 id 做唯一 key）
  const treeData = [{
    label: options.label,
    key: 'action-root',
    root: true,
    children: actions.map(item => ({
      key: item.id, // 👈 永远唯一
      item
    }))
  }]

  return (
    <div className='event-edit'>
      <Tree
        className='event-tree'
        expandAll
        renderLabel={renderTreeLabel}
        treeData={treeData}
      />
    </div>
  )
})

export default EventEdit
