import { Element } from 'ridgejs'
import cloneDeep from 'lodash/cloneDeep.js'
import { nanoid } from '../utils/string'
import merge from 'lodash/merge'

export default class EditorElement extends Element {
  constructor ({ config, composite, componentMeta }) {
    // 在构造函数中接收 componentMeta
    super({ config, composite })
    if (componentMeta) {
      this.setComponentMeta(componentMeta)
    }
  }

  // ========================================================================
  // 设置组件元数据
  // ========================================================================
  setComponentMeta (componentMeta) {
    this.componentMeta = componentMeta
  }

  // 获取组件元数据
  getComponentMeta () {
    return this.componentMeta
  }

  // 检查是否已加载组件元数据
  isMetaLoaded () {
    return !!this.componentMeta
  }

  // ========================================================================
  // 编辑态属性
  // ========================================================================
  getProperties () {
    return {
      __isEdit: true,
      __el: this.el,
      __composite: this.composite,
      ...this.config.props,
      ...this.properties,
      children: this.children
    }
  }

  updateConfig (config) {
    merge(this.config, config)
    this.style = { ...this.config.style }
    this.properties = { ...this.config.props }
    this.updateEditStyle()
    this.updateProps()
    this.updateEditorStyle()
  }

  updateEditorStyle () {
    if (!this.el) return
    this.updateEditStyle()
    this.parent?.updateChildStyle(this)
  }

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
      // context.workspaceControl?.selectElements([])
    }
  }

  styleUpdated () {
    if (!this.el) return
    this.el.classList.add('ridge-editor-element')
    if (this.isContainer()) this.el.classList.add('ridge-container')
    this.el.classList.toggle('ridge-is-slot', !!this.isSlot)
  }

  isContainer () {
    return this.getPropDefinations().some(p =>
      p.name === 'children' || p.type === 'slot'
    )
  }

  isDroppable () {
    const props = this.getPropDefinations()
    const slotLen = props.filter(p => p.type === 'slot').length
    const childLen = props.some(p => p.name === 'children') ? 9999 : 0
    const max = slotLen + childLen
    const cur = this.children?.length || 0
    return cur < max
  }

  canDroppedOnElement () {
    return this.componentMeta?.portalled !== true
  }

  getPropDefinations () {
    return this.componentMeta?.props || []
  }

  getPropDefination (name) {
    return this.getPropDefinations().find(p => p.name === name) || null
  }

  // 移除原来的 load 方法，由外部处理加载
  async load (includeChildren = false) {
    // 这个方法不再加载组件元数据，只处理子节点
    if (includeChildren && this.config.props.children) {
      for (const id of this.config.props.children) {
        const child = this.composite.getNode(id)
        child && await child.load(true)
      }
    }
    return true
  }

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
  // 样式更新
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
      componentMeta: this.componentMeta, // 传递 componentMeta
      config: cfg
    })

    // 注意：clone 时不异步加载，componentMeta 已经传递

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
    if (this.componentMeta?.portalled) {
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
