import ReactRenderer from '../render/ReactRenderer'
import VanillaRender from '../render/VanillaRenderer'
import createReactElement from '../render/createReactElement.js'
import { nanoid, ensureLeading } from '../utils/string'
import BaseNode from './BaseNode.js'
import {
  forceDOMElementState
} from '../utils/pseudo.js'
import { isObject, isObjectsEqual } from '../utils/is.js'
import { cloneDeep } from '../utils/object.js'
import { IN_APP_FILE_PREFIEX, ridgeBaseUrl } from '../index'
import createDebugger from 'debug'

const debug = createDebugger('ridge:element')

const runtimeDefaults = {
  styleEx: {},
  propEx: {},
  events: {},
  props: {},
  slots: [],
  editor: { hidden: false, locked: false },
  meta: { sync: [], url: [] }
}

export default class Element extends BaseNode {
  constructor ({
    config,
    composite
  }) {
    super()
    this.config = { ...config }
    this.restoreRuntimeDefaultConfig()
    this.uuid = 'ins-' + nanoid(8)
    this.composite = composite
    this.definition = null
    this.properties = {}
    this.events = {}
    this.renderer = null
    this.isMounted = false
    this.mounteds = []

    this.onMounted(() => {
      this.bindDOMEvents()
    })
  }

  // 运行时加载：自动回填导出时被清理的默认基础配置
  restoreRuntimeDefaultConfig () {
    for (const key in runtimeDefaults) {
      if (this.config[key] === undefined) {
        this.config[key] = cloneDeep(runtimeDefaults[key])
      }
    }
  }

  getId () { return this.config.id }
  getParent () { return this.parent }
  getEl () { return this.el }

  getProperties () {
    const properties = {
      ...this.config.props,
      ...this.properties,
      ...this.events
    }

    // this.children是所有子节点 node类型，但是如果之前就是string (Semi 文本、按钮等情况) 则直接传入string
    if (typeof properties.children !== 'string' && this.children) {
      properties.children = this.children
    }
    if (this.config.meta && Array.isArray(this.config.meta.url)) {
      for (const propName of this.config.meta.url) {
        if (properties[propName]) {
          properties[propName] = this.getBlobUrl(properties[propName])
        }
      }
    }
    return properties
  }

  getStyle () {
    return {
      ...this.config.style,
      ...this.style
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
    if (this.definition) return true

    if (this.config.path) {
      try {
        this.definition = await this.composite.loader.loadComponent(this.config.path)
      } catch (e) {
        console.error('[ridge] load component failed', this.config.path, e)
        this.setStatus('load-error')
        return false
      }
    }

    if (!this.definition) {
      this.setStatus('not-found')
      return false
    } else {
      this.setStatus('loaded')
    }

    if (this.loadMeta) {
      await this.loadMeta()
    }

    // 同时加载子节点（貌似没必要？）
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
    if (this.firstPainted) return

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
  mount (el) {
    if (!el && !this.el) return
    if (this.el && el && this.el !== el) {
      try { this.unmount() } catch (e) {}
    }
    if (el) {
      this.el = el
    }
    this.el.ridgeNode = this
    this.firstPaint()

    // 异步不阻塞
    this.load().then(() => {
      if (!this.definition) return
      this.initializeEvents()
      this.initSubscription()
      this.updateConnectedProperties()
      this.createRenderer()
      this.mounted()
      this.parent?.updateChildStyle(this)
      this.styleUpdated && this.styleUpdated()
    })
  }

  createRenderer () {
    if (!this.definition) return
    try {
      const properties = this.getProperties()
      if (VanillaRender.isComponent(this.definition)) {
        this.renderer = new VanillaRender(this.definition, properties)
      } else if (ReactRenderer.isComponent(this.definition)) {
        this.renderer = new ReactRenderer(this.definition, properties)
      }
      debug('this.renderer?.mount', properties)
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

  /**
   * 初始化(递归)所有可触达节点
   */
  initChildren () {
    if (this.config.props.children && this.children == null) {
      this.children = []
      for (const id of this.config.props.children) {
        const childNode = this.composite.getNode(id)
        if (childNode) {
          childNode.parent = this
          this.children.push(childNode)
          childNode.initChildren()
        }
      }
    }

    if (this.config.slots && this.config.slots.length) {
      for (const id of this.config.slots) {
        const childNode = this.composite.getNode(id)
        if (childNode) {
          childNode.parent = this
          childNode.isSlot = true
          childNode.initChildren()
        }
      }
    }
  }

  // ========================================================================
  // 事件 / 响应式
  // 符合 RidgeUI 官方规范：
  // 1. props 静态值
  // 2. propsEx 动态绑定状态路径
  // 3. meta.sync 双向绑定 { 属性名: { source, path } }
  // 4. 事件按 path 提取 payload
  // 5. 自动 dispatchChange 同步状态
  // ========================================================================
  initializeEvents () {
    const events = this.config.events || {}
    this.events = this.events || {} // 确保事件对象存在

    // ======================================================
    // 【官方规范】处理双向绑定 meta.sync
    // 格式：meta.sync = {
    //   value: { source: 'onChange', path: 'target.value' }
    // }
    // ======================================================
    const sync = this.config.meta?.sync
    if (sync && typeof sync === 'object' && !Array.isArray(sync)) {
    // 遍历所有需要双向绑定的属性
      for (const [propName, syncRule] of Object.entries(sync)) {
        const { source: eventName, path } = syncRule // source=事件名, path=取值路径
        if (!eventName || !this.config.propEx[propName]) continue

        // 注册事件：实现自动同步到状态
        this.events[eventName] = (...payloadArgs) => {
        // 第一步：按规则取事件值
          let value = payloadArgs[0] // 默认取第一个参数
          if (path && typeof value === 'object') {
          // 按 path 如 target.value 取值
            value = path.split('.').reduce((obj, key) => obj?.[key], value)
          }

          // 第二步：更新组件属性
          this.setProperties({ [propName]: value })

          // 第三步：同步到全局状态（propsEx绑定的路径）
          const store = this.composite.store
          if (store) {
            store.dispatchChange(this.config.propEx[propName], value)
          }
        }
      }
    }

    // ======================================================
    // 【官方规范】处理配置事件：elements[x].events.onClick = [...]
    // ======================================================
    for (const [eventName, actions] of Object.entries(events)) {
      this.events[eventName] = (...payloadArgs) => {
        if (!Array.isArray(actions)) return

        for (const act of actions) {
          if (!act.key) continue

          // 解析 store.action.method
          const [storeName, actionName, methodName] = act.key.split('.')
          if (!storeName || !methodName) continue

          // 构造 RidgeUI 标准事件对象
          const event = {
            payload: payloadArgs, // 原始事件参数
            scopedData: this.getScopedData(), // 作用域数据
            eventArgs: act.payload // 配置中定义的事件参数结构
          }

          // 执行 store 动作
          const store = this.composite.store
          store?.doStoreAction(storeName, methodName, event)
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

  // 删除 forceUpdateStyle 和 forceUpdateProperty 方法
  // 用统一的 forceUpdate 替代
  forceUpdate () {
    this.updateStyle()
    this.updateProps()
  }

  // 修改：更新属性时使用计算后的值
  updateProps (props) {
    // 计算运行时属性
    const runtimeProps = this.computeRuntimeProperties()

    // 合并到this.properties
    Object.assign(this.properties, runtimeProps)

    if (this.renderer && this.el?.getAttribute('ridge-mount') === 'mounted') {
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
    return this.definition?.type === 'react'
      ? createReactElement(node)
      : node
  }

  getBlobUrl (url) {
    if (url.startsWith('http') || url.startsWith('data:') || url.startsWith('blob:') || url.startsWith('/')) {
      return url
    } else {
      return this.composite.getBlobUrl(url)
    }
  }

  getHidden () {
    return this.config?.editor?.hidden
  }

  // 修改：更新样式时使用计算后的值
  updateStyle () {
    if (!this.el) return

    // 计算运行时样式
    this.style = this.computeRuntimeStyle()

    this.el.classList.add('ridge-element')
    this.el.setAttribute('component', this.config.path || '')

    if (this.getHidden()) {
      this.el.classList.add('ridge-runtime-hidden')
    } else {
      this.el.classList.remove('ridge-runtime-hidden')
    }
    this.parent?.updateChildStyle(this)
    this.styleUpdated && this.styleUpdated()
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

  // 新增：计算运行时样式（合并固定和动态）
  computeRuntimeStyle () {
    const runtimeStyle = { ...this.config.style }

    // 合并动态样式（styleEx）
    if (this.config.styleEx) {
      const store = this.composite.store
      if (store) {
        for (const [key, expr] of Object.entries(this.config.styleEx)) {
          if (expr) {
            try {
              runtimeStyle[key] = store.getStoreValue(expr, this.getScopedData())
            } catch (e) {}
          }
        }
      }
    }

    return runtimeStyle
  }

  // 新增：计算运行时属性
  computeRuntimeProperties () {
    const runtimeProps = {}

    // 合并动态属性（propEx）
    if (this.config.propEx) {
      const store = this.composite.store
      if (store) {
        for (const [key, expr] of Object.entries(this.config.propEx)) {
          if (expr) {
            try {
              runtimeProps[key] = store.getStoreValue(expr, this.getScopedData())
            } catch (e) {}
          }
        }
      }
    }
    return runtimeProps
  }
}
