import debugGen from 'debug'
import ReactRenderer from '../render/ReactRenderer'
import VanillaRender from '../render/VanillaRenderer'
import createReactElement from '../render/createReactElement.js'
import { STORE, PROP } from '../utils/contants.js'
import { nanoid } from '../utils/string'
import BaseNode from './BaseNode.js'
import {
  forceDOMElementState,
  handleClassListPropValue
} from '../utils/pseudo.js'
import { isObject, isObjectsEqual } from '../utils/is.js'

const debug = debugGen('ridge:element')

export default class Element extends BaseNode {
  constructor ({
    config,
    composite,
    componentDefinition
  }) {
    super()
    this.config = { ...config }
    this.uuid = 'ins-' + nanoid(8)
    this.composite = composite
    this.componentDefinition = componentDefinition
    this.properties = {}
    this.events = {}
    this.renderer = null
    this.isMounted = false
    this.mounteds = []

    this.config.events ||= {}
    this.config.visible ??= true
    this.config.slots ||= []
    this.config.propEx ||= {}
    this.config.styleEx ||= {}

    this.onMounted(() => {
      this.bindDOMEvents()
    })
  }

  getId () { return this.config.id }
  getParent () { return this.parent }
  getEl () { return this.el }

  getProperties () {
    return {
      ...this.config.props,
      ...this.properties,
      ...this.events,
      children: this.children
    }
  }

  getScopedData () {
    const parent = this.getParent()
    const parentScopes = parent?.getScopedData() || []
    return this.scopedData ? [this.scopedData, ...parentScopes] : parentScopes
  }

  setScopedData (data) { this.scopedData = data }

  // ========================================================================
  // 异步加载组件（不阻塞拖拽）
  // ========================================================================
  async load (includeChildren = false) {
    if (this.componentDefinition) return true

    if (this.config.path) {
      try {
        this.componentDefinition = await this.composite.loader.loadComponent(this.config.path)
      } catch (e) {
        console.error('[ridge] load component failed', this.config.path, e)
        this.setStatus('load-error')
        return false
      }
    }

    if (!this.componentDefinition) {
      this.setStatus('not-found')
      return false
    }

    if (includeChildren && this.config.props.children) {
      for (const id of this.config.props.children) {
        const child = this.composite.getNode(id)
        child && await child.load(true)
      }
    }
    return true
  }

  // ========================================================================
  // 同步绘制外壳（编辑器拖拽核心）
  // ========================================================================
  firstPaint (el) {
    if (el) this.el = el
    this.firstPainted = true
    this.setStatus('loading')
    this.el.ridgeNode = this
    this.el.setAttribute('ridge-id', this.config.id)
    this.el.setAttribute('ridge-title', this.config.title || '')
    this.el.setAttribute('ridge-mount', 'mounting')
    this.style = { ...this.config.style }
    this.updateStyle()
  }

  // ========================================================================
  // 挂载：外壳同步，渲染异步
  // ========================================================================
  async mount (el) {
    if (!el) return
    if (this.el && this.el !== el) {
      try { this.unmount() } catch (e) {}
    }

    this.el = el
    this.el.ridgeNode = this
    this.firstPaint()

    // 异步不阻塞
    this.load().then(() => {
      if (!this.componentDefinition) return
      this.initializeEvents()
      this.initSubscription()
      this.updateConnectedProperties()
      this.preparePropsBeforeRender()
      this.createRenderer()
      this.mounted()
    })
  }

  createRenderer () {
    if (!this.componentDefinition) return
    try {
      if (VanillaRender.isComponent(this.componentDefinition)) {
        this.renderer = new VanillaRender(this.componentDefinition, this.getProperties())
      } else if (ReactRenderer.isComponent(this.componentDefinition)) {
        this.renderer = new ReactRenderer(this.componentDefinition, this.getProperties())
      }
      this.renderer?.mount(this.el)
    } catch (e) {
      this.setStatus('render-error')
      console.error('[ridge] render error', e)
    }
  }

  // ========================================================================
  // 安全调用（运行时必须安全）
  // ========================================================================
  invoke (method, args) {
    return this.renderer?.invoke(method, args)
  }

  hasMethod (methodName) {
    return this.renderer?.hasMethod(methodName) || false
  }

  // ========================================================================
  // 事件 / 响应式
  // ========================================================================
  initializeEvents () {
    const events = this.config.events || {}
    for (const [name, actions] of Object.entries(events)) {
      this.events[name] = (...payload) => {
        if (!Array.isArray(actions)) return
        for (const act of actions) {
          if (act.store && act.method) {
            const event = {
              payload,
              scopedData: this.getScopedData(),
              eventArgs: act.payload
            }
            this.composite.store.doStoreAction(act.store, act.method, event)
          }
        }
      }
    }
  }

  initSubscription () {
    const store = this.composite.store
    if (!store) return
    Object.values(this.config.styleEx || {}).forEach(expr => {
      store.subscribe(expr, () => this.forceUpdateStyle())
    })
    Object.values(this.config.propEx || {}).forEach(expr => {
      store.subscribe(expr, () => this.forceUpdateProperty())
    })
  }

  forceUpdateStyle () {
    const before = { width: this.style.width, height: this.style.height, visible: this.style.visible }
    this.updateConnectedStyle()
    this.updateStyle()
    const after = { width: this.style.width, height: this.style.height, visible: this.style.visible }
    if (!isObjectsEqual(before, after)) this.updateProps()
  }

  forceUpdateProperty () {
    this.updateConnectedProperties()
    this.updateProps()
  }

  forceUpdate () {
    this.forceUpdateStyle()
    this.forceUpdateProperty()
  }

  updateProps (props) {
    if (props) Object.assign(this.properties, props)
    if (this.renderer && this.el?.getAttribute('ridge-mount') === 'mounted') {
      this.preparePropsBeforeRender()
      this.renderer.updateProps(this.getProperties())
    }
  }

  updateConnectedStyle () {
    const store = this.composite.store
    if (!store) return
    for (const key of Object.keys(this.config.styleEx || {})) {
      const expr = this.config.styleEx[key]
      if (!expr) continue
      this.style[key] = store.getStoreValue(expr, this.getScopedData())
    }
  }

  updateConnectedProperties () {
    const store = this.composite.store
    if (!store || !isObject(this.config.propEx)) return
    for (const [key, expr] of Object.entries(this.config.propEx)) {
      if (!expr) continue
      try {
        this.properties[key] = store.getStoreValue(expr, this.getScopedData())
      } catch (e) {}
    }
  }

  // ========================================================================
  // 插槽 / 特殊属性
  // ========================================================================
  getSlotPropValue (node) {
    if (!node) return null
    node.parent = this
    node.isSlot = true
    return this.componentDefinition?.type === 'react'
      ? createReactElement(node)
      : node
  }

  preparePropsBeforeRender () {
    if (!this.componentDefinition?.props) return
    let slotOrder = 0

    for (const prop of this.componentDefinition.props) {
      if (prop.type === 'image' || prop.type === 'file') {
        const v = this.config.props[prop.name] ?? this.properties[prop.name]
        if (v) this.properties[prop.name] = this.composite.getBlobUrl(v, this.composite.packageName)
      } else if (prop.type === 'slot') {
        delete this.properties[prop.name]
        const sid = this.config.props[prop.name]
        if (sid) {
          const slotNode = this.composite.getNode(sid)
          this.properties[prop.name] = this.getSlotPropValue(slotNode)
        } else if (Array.isArray(this.children)) {
          const match = this.children.find(c => c.config.title === prop.name)
          if (match) {
            this.properties[prop.name] = this.getSlotPropValue(match)
          } else {
            const slotNode = this.children[slotOrder++]
            this.properties[prop.name] = this.getSlotPropValue(slotNode)
          }
        }
      } else if (prop.type === 'decorate') {
        const nid = this.config.props[prop.name]
        if (nid) this.properties[prop.name] = this.composite.getNode(nid)
      } else if (prop.type === 'style') {
        this.properties[prop.name] = handleClassListPropValue(this.config.props[prop.name], this.composite)
      }
    }
  }

  // ========================================================================
  // DOM / 样式
  // ========================================================================
  updateStyle () {
    if (!this.el) return
    this.el.classList.add('ridge-element')
    this.el.setAttribute('component', this.config.path || '')

    if (this.style.visible === false) {
      this.el.classList.add('ridge-runtime-hidden')
    } else {
      this.el.classList.remove('ridge-runtime-hidden')
    }
    this.parent?.updateChildStyle(this)
  }

  updateChildStyle (child) {
    this.invoke('updateChildStyle', [child])
  }

  bindDOMEvents () {
    if (!this.el) return
    if (this.el.classList.contains('ridge-is-hoverable')) {
      this.el.addEventListener('mouseenter', e => forceDOMElementState(e.target, 'hover'))
      this.el.addEventListener('mouseleave', e => forceDOMElementState(e.target, 'hover', true))
    }
  }

  // ========================================================================
  // 生命周期
  // ========================================================================
  unmount () {
    this.isMounted = false
    this.renderer?.destroy()
    this.renderer = null
    this.el = null
  }

  clone () {
    const cloned = new this.constructor({
      composite: this.composite,
      componentDefinition: this.componentDefinition,
      config: JSON.parse(JSON.stringify(this.config))
    })

    if (this.children) {
      cloned.children = this.children.map(child => {
        const c = child.clone()
        c.parent = cloned
        return c
      })
    }
    cloned.isSlot = this.isSlot
    cloned.parent = this.parent
    return cloned
  }

  onMounted (fn) {
    if (this.isMounted) fn(this)
    else this.mounteds.push(fn)
  }

  mounted () {
    this.isMounted = true
    this.mounteds.forEach(fn => fn(this))
    this.el?.setAttribute('ridge-mount', 'mounted')
    this.removeStatus()
  }
}
