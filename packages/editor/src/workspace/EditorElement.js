import { Element } from 'ridgejs'
import cloneDeep from 'lodash/cloneDeep.js'
import { nanoid } from '../utils/string'
import context from '../service/RidgeEditorContext.js'

export default class EditorElement extends Element {
  // ========================================================================
  // 编辑态属性
  // ========================================================================
  getProperties () {
    return {
      __isEdit: true,
      __el: this.el,
      __composite: this.composite,
      width: this.style?.width,
      height: this.style?.height,
      ...this.config.props,
      ...this.properties,
      children: this.children
    }
  }

  // ========================================================================
  // 编辑态样式：锁定 / 隐藏
  // ========================================================================
  updateEditStyle () {
    if (!this.el) return

    if (this.config.locked) {
      this.el.classList.add('ridge-is-locked')
    } else {
      this.el.classList.remove('ridge-is-locked')
    }

    if (this.config.visible) {
      this.el.classList.remove('ridge-is-hidden')
    } else {
      this.el.classList.add('ridge-is-hidden')
    }

    if (this.config.locked || !this.config.visible) {
      context.workspaceControl?.selectElements([])
    }
  }

  styleUpdated () {
    if (!this.el) return
    this.el.classList.add('ridge-editor-element')
    if (this.isContainer()) this.el.classList.add('ridge-container')
    this.el.classList.toggle('ridge-is-slot', !!this.isSlot)
  }

  // ========================================================================
  // 异步安全：容器判断
  // ========================================================================
  isContainer () {
    return this.getPropDefinations().some(p =>
      p.name === 'children' || p.type === 'slot'
    )
  }

  // ========================================================================
  // 拖放核心（异步安全）
  // ========================================================================
  isDroppable () {
    const props = this.getPropDefinations()
    const slotLen = props.filter(p => p.type === 'slot').length
    const childLen = props.some(p => p.name === 'children') ? 9999 : 0
    const max = slotLen + childLen
    const cur = this.children?.length || 0
    return cur < max
  }

  canDroppedOnElement () {
    return this.componentDefinition?.portalled !== true
  }

  // ========================================================================
  // 属性定义（异步安全）
  // ========================================================================
  getPropDefinations () {
    return this.componentDefinition?.props || []
  }

  getPropDefination (name) {
    return this.getPropDefinations().find(p => p.name === name) || null
  }

  // ========================================================================
  // 子节点管理
  // ========================================================================
  appendChild (node, { x, y } = {}, rect) {
    this.children ||= []
    let order = -1

    if (this.hasMethod('checkNodeOrder') && rect) {
      order = this.invoke('checkNodeOrder', [rect]) ?? -1
    }

    if (order >= 0) {
      this.children.splice(order, 0, node)
    } else {
      this.children.push(node)
    }

    node.parent = this
    this.invoke('appendChild', [node, { x, y }, order])
    node.forceUpdate()
    this.forceUpdate()

    this.config.props.children = this.children.map(c => c.getId())
  }

  removeChild (node) {
    this.children ||= []
    this.children = this.children.filter(c => c !== node)
    this.config.props.children = this.children.map(c => c.getId())
    node.parent = null

    const ws = context.workspaceControl
    const rect = ws?.getElementRectConfig(node.el)
    if (rect) node.setStyleConfig(rect)

    this.invoke('removeChild', [node])
    this.forceUpdate()
  }

  // ========================================================================
  // 创建时初始化
  // ========================================================================
  initPropsOnCreate () {
    for (const prop of this.getPropDefinations()) {
      if (!prop.name) continue
      if (prop.value !== undefined && this.config.props[prop.name] === undefined) {
        this.config.props[prop.name] = prop.value
      }
      if (prop.name === 'children' || prop.type === 'slot') {
        this.config.props.children ||= []
        this.children ||= []
      }
    }
  }

  // ========================================================================
  // 插槽
  // ========================================================================
  setSlot (slot) {
    this.config.slot = !!slot
    this.el?.classList.toggle('ridge-is-slot', this.config.slot)
  }

  getSlotElements () {
    return this.getPropDefinations()
      .filter(p => p.type === 'slot' && this.config.props[p.name])
      .map(p => this.config.props[p.name])
  }

  isSlotChildResizable (id) {
    for (const p of this.getPropDefinations()) {
      if (p.type === 'slot' && this.config.props[p.name] === id) {
        return p.resizable !== false
      }
    }
    return false
  }

  isResizable () {
    if (this.config.slot && this.parent) {
      return this.parent.isSlotChildResizable(this.config.id)
    }
    return true
  }

  // ========================================================================
  // 样式更新（已修复 this.config.style 不存在报错）
  // ========================================================================
  updateStyleConfig (style) {
    if (!this.config.style) {
      this.config.style = {}
    }
    Object.assign(this.config.style, style)
    this.style = { ...this.config.style }
    this.updateStyle()
  }

  setStyleConfig (style) {
    this.config.style = { ...style }
    this.style = { ...this.config.style }
    this.updateStyle()
  }

  updateChildConfig (children) {
    this.config.props.children = children.map(c => c.getId())
    this.properties.children = children
    this.updateProps()
  }

  // ========================================================================
  // 克隆（编辑复制）
  // ========================================================================
  clone () {
    const cfg = cloneDeep(this.config)
    cfg.id = nanoid(5)

    const cloned = new EditorElement({
      composite: this.composite,
      componentDefinition: this.componentDefinition,
      config: cfg
    })

    // 异步加载
    if (!cloned.componentDefinition && cloned.config.path) {
      cloned.load().catch(() => {})
    }

    if (this.children) {
      cloned.children = this.children.map(child => {
        const c = child.clone()
        c.parent = cloned
        this.composite.nodes[c.getId()] = c
        return c
      })
    }

    this.composite.nodes[cloned.getId()] = cloned
    return cloned
  }

  // ========================================================================
  // 导出
  // ========================================================================
  exportJSON () {
    const json = cloneDeep(this.config)
    json.props.children = this.children?.map(c => c.getId()) || []
    json.slots = this.getSlotElements()
    if (this.componentDefinition?.portalled) {
      json.style.portalled = true
    }
    return json
  }

  exportJSONTree () {
    const tree = cloneDeep(this.config)
    tree.props.children = this.children?.map(c => c.exportJSONTree()) || []

    for (const p of this.getPropDefinations()) {
      if (p.type === 'slot' && this.config.props[p.name]) {
        const node = this.composite.getNode(this.config.props[p.name])
        tree.props[p.name] = node?.exportJSONTree()
      }
    }
    return tree
  }
}
