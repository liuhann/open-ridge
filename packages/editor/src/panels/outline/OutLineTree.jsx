import React from 'react'
import Debug from 'debug'
import { Tree, Space, Typography, Button, Tag, Toast } from '@douyinfe/semi-ui'
import './outline.less'
import context from '../../service/RidgeEditorContext.js'
import { ThemeContext } from '../movable/MoveablePanel.jsx'

const { Text } = Typography
const debug = Debug('ridge:outline')

class OutLineTree extends React.Component {
  constructor () {
    super()
    this.state = {
      componentTreeData: [],
      expandedKeys: [],
      selected: null
    }
    context.services.outlinePanel = this
  }

  static contextType = ThemeContext

  updateOutline (reset) {
    if (reset) {
      this.setState({
        expandedKeys: [],
        selected: null
      })
    }
    if (context.editorComposite) {
      const componentTreeData = context.editorComposite.getCompositeElementTree()

      debug('updateOutline', componentTreeData)
      this.setState({
        componentTreeData
      })
    } else {
      this.setState({
        componentTreeData: []
      })
    }
  }

  /**
   * 对外提供方法，工作区选择节点调用
   **/
  setCurrentNode (node) {
    if (node) {
      let treeNode = this.findNode(this.state.componentTreeData, node.getId())
      const keys = []

      while (treeNode) {
        keys.push(treeNode.key)
        if (treeNode.parentKey) {
          treeNode = this.findNode(this.state.componentTreeData, treeNode.parentKey)
        } else {
          treeNode = null
        }
      }

      this.setState({
        selected: node.getId(),
        expandedKeys: Array.from(new Set([...keys, ...this.state.expandedKeys]))
      })
    } else {
      this.setState({
        selected: null
      })
    }
  }

  findNode (treeData, key) {
    for (const node of treeData) {
      if (node.key === key) {
        return node
      }
      if (node.children) {
        const c = this.findNode(node.children, key)
        if (c) {
          return c
        }
      }
    }
  }

  /**
   * 点击选择节点
   * @param {*} val 节点id
   */
  onNodeSelected (val, treeNode) {
    const node = context.getNode(val)
    if (node) {
      if (node.el && node.config.visible && !node.config.locked) {
        // 联动workspace选择节点
        node.selected()
        context.workspaceControl.selectElements([node.el], true)
      } else {
        context.workspaceControl.selectElements([])
        context.onElementSelected(node)
      }
    }
    this.setState({
      selected: val
    })
  }

  toggleLock = (data) => {
    const view = context.getNode(data.element)
    view.setLocked(!view.config.locked)
    context.workspaceControl.selectElements([view.el])
  }

  toggleVisible = (data) => {
    const view = context.getNode(data.element)
    view.setVisible(!view.config.visible)

    this.updateOutline()
  }

  renderFullLabel = (label, data) => {
    const { toggleLock, toggleVisible } = this
    let { visible, locked } = data.element.config
    const { slotLabel } = data

    if (visible !== false) {
      visible = true
    }
    if (locked !== true) {
      locked = false
    }

    return (
      <div className={'tree-label ' + (visible ? 'is-visible' : 'is-hidden') + ' ' + (locked ? 'is-locked' : '')}>
        <Space className='label-content'>
          <Text className='label-text'>{label ?? data.key}</Text>
          {data.tags && data.tags.map(tag => <Tag size='small' color='amber' key={tag}> {tag} </Tag>)}
        </Space>
        {!slotLabel &&
          <Space spacing={2}>
            <Button
              className={locked ? '' : 'hover-show'}
              size='small' theme='borderless' type='tertiary' onClick={() => {
                toggleLock(data)
              }} icon={locked ? <i class='bi bi-lock-fill' /> : <i class='bi bi-unlock-fill' />}
            />
            <Button
              className={visible ? 'hover-show' : ''}
              size='small' theme='borderless' type='tertiary' onClick={() => {
                toggleVisible(data)
              }} icon={visible ? <i class='bi bi-eye-fill' /> : <i class='bi bi-eye-slash-fill' />}
            />
          </Space>}
        {slotLabel && <Tag>{slotLabel}</Tag>}
      </div>
    )
  }

  /**
   * 拖拽 dragNode 到一个排序子节点列表之中, 放置到node之前(-1)或之后(1)
   */
  ordering (siblingNodes, dragNode, node, beforeOrAfter) {
    const finals = []
    for (let i = 0; i < siblingNodes.length; i++) {
      if (siblingNodes[i].key === node.key) {
        if (beforeOrAfter === -1) {
          finals.push(dragNode.key)
          finals.push(node.key)
        } else if (beforeOrAfter === 1) {
          finals.push(node.key)
          finals.push(dragNode.key)
        }
      } else if (siblingNodes[i].key !== dragNode.key) {
        finals.push(siblingNodes[i].key)
      }
    }
    return finals
  }

  /**
   * 树拖拽放置到目标位置
   * node: 拖拽节点之前的父节点？
   * dragNode： 拖拽的节点
   * dropPosition： 拖拽目标的位置
   * dropToGap： 是附加到节点后 （追加） 还是在子中间
   **/
  onTreeDrop ({ event, node, dragNode, dragNodesKeys, dropPosition, dropToGap }) {
    // 首先根据dropPosition和node.pos计算出来目标位置相对于node的前后关系,直接用dropPosition存在问题

    if (node.parentKey) {
      node.parent = this.findNode(this.state.componentTreeData, node.parentKey)
    }
    if (dragNode.parentKey) {
      dragNode.parent = this.findNode(this.state.componentTreeData, dragNode.parentKey)
    }
    const dropPos = node.pos.split('-')
    const beforeOrAfter = dropPosition - Number(dropPos[dropPos.length - 1])
    const targetParent = node.parent ? node.parent.element : context.editorComposite
    const dragParent = dragNode.parent ? dragNode.parent.element : context.editorComposite

    if (dropToGap === true) {
      const siblings = node.parent ? node.parent.children : this.state.componentTreeData
      const orders = this.ordering(siblings, dragNode, node, beforeOrAfter)
      // removeChild
      if (targetParent !== dragParent) {
        dragParent.removeChild(dragNode.element)
      }
      // appendChild
      if (orders.length !== siblings.length) {
        targetParent.appendChild(dragNode.element)
      }
      targetParent.updateChildList(orders)
    } else {
      if (node.element.children == null) {
        Toast.warning({
          content: '目标节点无法再放入子节点',
          duration: 3
        })
        return
      } else {
        dragParent.removeChild(dragNode.element)
        node.element.appendChild(dragNode.element)
      }
    }
    this.updateOutline()
    context.workspaceControl.selectElements([dragNode.element.el], true)
  }

  onNodeDblClick = (node) => {
    console.log('onNodeDblClick', node)

    if (node.element?.config?.path === 'ridge-container/composite') { // 双击打开的是composite节点
      const filePath = node.element?.config?.props?.pagePath
      if (filePath) {
        const file = context.services.appService.getFileByPath(filePath)
        if (file && file.id) {
          context.openFile(file.id)
        }
      }
    }
  }

  render () {
    const { selected, componentTreeData, expandedKeys } = this.state
    const { renderFullLabel, onTreeDrop, onNodeDblClick } = this
    return (
      <Tree
        className='outline-tree'
        autoExpandWhenDragEnter
        showFilteredOnly
        filterTreeNode
        draggable
        emptyContent='暂无打开的页面'
        renderLabel={renderFullLabel}
        onDrop={onTreeDrop.bind(this)}
        onChange={(value, node) => {
          this.onNodeSelected(value, node)
        }}
        onDoubleClick={(event, node) => {
          onNodeDblClick(node)
        }}
        onExpand={expandedKeys => {
          this.setState({
            expandedKeys
          })
        }}
        expandedKeys={expandedKeys}
        value={selected}
        treeData={componentTreeData}
      />
    )
  }
}

export default OutLineTree
