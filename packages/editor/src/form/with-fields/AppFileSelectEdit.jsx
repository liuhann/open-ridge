import React, { useState, useEffect } from 'react'

import { withField, TreeSelect, Tree, TagInput, Popover, Icon, Tag, Typography } from '@douyinfe/semi-ui'
import { getAppTreeData } from '../../panels/files/utils.js'
import appStore from '../../store/app.store.js'
import editorStore from '../../store/editor.store'
import { filterTreeKeepStructure, mapTree } from '../../panels/files/buildFileTree.js'
import { ensureLeading, hasUrlProtocol, isUrlInApp } from 'ridgejs/src/utils/string.js'

// 资源文件地址选择, 支持从应用内和外部同时选择、单个或者多个。
// 选择应用文件后 原值返回，不添加前缀
// 在Tag中合并显示应用内外的文件
const AppFileSelectEdit = ({
  value,
  onChange,
  options
}) => {
  const [visible, setVisible] = useState(false)
  const [treeData, setTreeData] = useState([])

  const currentAppFilesTree = appStore(state => state.currentAppFilesTree)
  const currentAppName = appStore((state) => state.currentAppName)
  const openFile = editorStore(state => state.openFile)
  const { Title } = Typography

  useEffect(() => {
    const filtered = filterTreeKeepStructure(currentAppFilesTree, file => {
      return file.mimeType && file.mimeType.indexOf(options.fileType) > -1
    })
    const data = mapTree(getAppTreeData(filtered, currentAppName), node => {
      return {
        label: node.label,
        value: node.raw.path,
        key: node.raw.path,
        disabled: node.children != null,
        isLeaf: node.children == null,
        children: node.children
      }
    })
    setTreeData(data)
  }, [currentAppFilesTree, options.fileType])

  // 选择文件后，原值返回，去掉开头的 /
  const changeWithComposite = (selectedValues) => {
    // 去掉开头的 /
    const processPath = (p) => p?.startsWith('/') ? p.slice(1) : p

    if (options.multiple) {
      const newInternalFiles = selectedValues.map(val => processPath(val))
      onChange && onChange([...newInternalFiles])
    } else {
      const file = selectedValues[0] || ''
      if (file) {
        onChange && onChange(processPath(file))
        setVisible(false)
      }
    }
  }

  // 自行输入的修改
  const changeWithTagInput = val => {
    if (options.multiple) {
      onChange && onChange(val)
    } else {
      onChange && onChange(val[0] || '')
    }
  }

  // 树组件使用原值
  const getRemovePrefixValue = () => {
    if (options.multiple) {
      return Array.isArray(value) ? value.map(v => ensureLeading(v)) : []
    } else {
      return typeof value === 'string' ? ensureLeading(value) : ''
    }
  }

  const renderTagItem = (item, index, onClose) => {
    return (
      <Tag
        key={index}
        closable
        color='white'
        onClick={() => {
          if (isUrlInApp(item)) {
            openFile(ensureLeading(item))
          }
        }}
        onClose={onClose}
        style={{ margin: '2px 4px 2px 0' }}
      >
        {item && item.substring(item.lastIndexOf('/') + 1)}
      </Tag>
    )
  }

  const treeValue = getRemovePrefixValue()
  return (
    <Popover
      trigger='custom'
      className='pop-select-file'
      visible={visible}
      showArrow
      onClickOutSide={() => setVisible(false)}
      position='leftTop'
      style={{
        borderRadius: '8px',
        boxShadow: '0 4px 20px rgba(0, 0, 0, 0.15)',
        padding: '12px 0',
        overflow: 'hidden'
      }}
      content={
        <div className='pop-select-file-content'>
          <div style={{
            padding: '0 16px 12px',
            borderBottom: '1px var(--semi-color-border) solid',
            marginBottom: 6
          }}
          >
            <Title
              heading={6}
              style={{
                margin: 0,
                fontSize: '14px',
                fontWeight: 600,
                color: 'var(--semi-color-text-0)'
              }}
            >
              从应用中选择
            </Title>
          </div>

          <Tree
            checkRelation='unRelated'
            multiple={options.multiple}
            style={{ width: 320, height: 400 }}
            value={treeValue}
            onChange={changeWithComposite}
            treeData={treeData}
          />
        </div>
      }
    >
      <TagInput
        onFocus={() => setVisible(true)}
        value={options.multiple ? value : (value ? [value] : [])}
        maxTagCount={options.multiple ? 300 : 1}
        renderTagItem={renderTagItem}
        onChange={changeWithTagInput}
        style={{ width: '100%' }}
      />
    </Popover>
  )
}

export default withField(AppFileSelectEdit)
