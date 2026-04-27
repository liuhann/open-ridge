import React, { useState } from 'react'
import { withField, Button, Tree, Typography, Select, Tag, TextArea, Popover } from '@douyinfe/semi-ui'
import { nanoid } from 'nanoid' // 引入 nanoid
import editorStore from '../../store/editor.store'

const { Text } = Typography

// 用 nanoid 生成唯一 ID（官方推荐，更短更安全）
const generateId = () => 'action_' + nanoid(6)

const EventEdit = withField(({
  value,
  options,
  onChange
}) => {
  const actions = value || []
  const compositeStoreModules = editorStore(state => state.compositeStoreModules)

  // 新增动作
  const addAction = () => {
    const newAction = {
      id: generateId(), // 使用 nanoid
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

  // 拖拽排序（官方规范）
  const onDrop = (info) => {
    const { node, dragNode, dropPosition } = info

    if (!node || !dragNode || node.root) return

    const oldIndex = actions.findIndex(item => item.id === dragNode.key)
    const newIndex = actions.findIndex(item => item.id === node.key)

    if (oldIndex === -1 || newIndex === -1) return

    const newActions = [...actions]
    const movedItem = newActions.splice(oldIndex, 1)[0]
    const insertIndex = dropPosition === -1 ? newIndex : newIndex + 1

    newActions.splice(insertIndex, 0, movedItem)
    onChange(newActions)
  }

  // 渲染单个动作项
  const renderActionItem = (item) => {
    return (
      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        <Select
          placeholder='请选择方法'
          style={{ width: 170 }}
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
            <div style={{ padding: 12, width: 320 }}>
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
            size='small'
            theme='borderless'
            type={item.payload ? 'primary' : 'tertiary'}
            icon={<i className='bi bi-diagram-3' />}
          />
        </Popover>

        <Button
          size='small'
          theme='borderless'
          type='tertiary'
          icon={<i className='bi bi-trash' />}
          onClick={() => removeAction(item.id)}
        />
      </div>
    )
  }

  // 树根标题 + 按钮右侧对齐
  const renderTreeLabel = (label, data) => {
    if (data.root) {
      return (
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          width: '100%'
        }}
        >
          <Tag color='green'>{options.label}</Tag>
          <Button
            size='small'
            type='primary'
            theme='borderless'
            icon={<i className='bi bi-plus' />}
            onClick={addAction}
          />
        </div>
      )
    }
    return renderActionItem(data.item)
  }

  // 100% 符合 Semi Tree 规范
  const treeData = [{
    label: options.label,
    key: 'action-root',
    root: true,
    children: actions.map(item => ({
      key: item.id, // 唯一 ID
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
        draggable
        onDrop={onDrop}
        allowDrop={({ dropNode }) => !dropNode.root}
        animation={false}
      />
    </div>
  )
})

export default EventEdit
