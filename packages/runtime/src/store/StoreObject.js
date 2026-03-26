import debug from 'debug'
import { proxy, subscribe } from 'valtio/vanilla'
import set from 'lodash/set'
import get from 'lodash/get'
import { cloneDeep } from '../utils/object.js'
import { measureAsyncExecutionTime, measureExecutionTime } from './mesure'

import { isArrowFunction } from '../utils/is'

const log = debug('ridge:store')
const error = debug('ridge:store-error')

export default class ValtioStoreObject {
  constructor (module, composite) {
    this.module = module
    this.composite = composite

    this.watchers = {
      '*': new Set()
    }

    // 计算字段的依赖信息
    // this.computedDependencies = {}
    this.state = {}

    // 增加全局机制， 可以在store中通过 this.xxx 来设置和获取全局服务/变量， 但是这个变量不会绑定到数据，也不会变化后驱动组件改变
    this.globals = {}

    // 当setup、destory、computed、action等方法执行时，传入的上下文对象。
    this.context = new Proxy(this, {
      get: function (storeObject, p) {
        switch (p) {
          case 'context':
            return storeObject.composite.context
          case 'composite':
            return storeObject.composite
          case 'emit':
            return (name, payload) => {
              storeObject.composite.emit(name, cloneDeep(payload))
            }
          case 'setState':
            return (state) => {
              Object.assign(storeObject.state, state)
            }
          case 'properties':
            return storeObject.properties
          case 'state':
            return storeObject.state
          case 'scope':
            return
          default:
            if (storeObject.state[p] !== undefined) {
              if (storeObject.computedUsedState) { // 对于需要计算依赖的场景
                storeObject.computedUsedState.push(p)
              }
              return storeObject.state[p]
            } else if (storeObject.module.actions && storeObject.module.actions[p]) { // 动作
              return storeObject.module.actions[p]
            } else if (storeObject.module.computed && storeObject.module.computed[p]) { // 计算类
              if (typeof storeObject.module.computed[p] === 'function') {
                return storeObject.module.computed[p].call(storeObject.context)
              } else if (typeof storeObject.module.computed[p].get === 'function') {
                return storeObject.module.computed[p].get.call(storeObject.context)
              }
            } else if (storeObject.properties[p] !== undefined) { // 属性
              return storeObject.properties[p]
            } else if (storeObject.globals[p] !== undefined) { // 通过this.xxx设置上的场合
              return storeObject.globals[p]
            } else if (window[p]) {
              return window[p]
            }
        }
      },
      set: function (storeObject, prop, value) {
        if (storeObject.state[prop] !== undefined) {
          storeObject.state[prop] = value
        } else {
          storeObject.globals[prop] = value
        }
        return true
      }
    })
    this.scheduledJobs = new Set()
  }

  /**
   * 从传入属性初始化Store实例
   * @param {*} properties
   */

  async initStore (properties, globalVariables) {
    this.properties = properties
    this.globalVariables = globalVariables

    // 从属性初始化组件state
    if (typeof this.module.state === 'function') {
      try {
        this.state = proxy(this.module.state(properties))
      } catch (e) {
        console.error('initStore Error', e)
      }
    } else if (typeof this.module.state === 'object') {
      this.state = proxy(cloneDeep(this.module.state))
    } else {
      // 无状态
      this.state = proxy({})
    }

    // 外部未设置值+Store给了默认值
    for (const property of (this.module.properties || [])) {
      if (this.properties[property.name] == null && property.value != null) {
        this.properties[property.name] = property.value
      }
    }

    // TODO 考虑后面去除  import '..' 可以实现同样效果
    if (this.module.externals) {
      if (Array.isArray(this.module.externals)) { // 定义为数组
        for (const ext of this.module.externals) {
          await this.composite.context.loadScript(ext)
        }
      } else if (typeof this.module.externals === 'string') { // 定义为string
        await this.composite.context.loadScript(this.module.externals)
      } else { // 定义为对象 （TODO lts 后续移除)
        for (const ext of Object.keys(this.module.externals)) {
          await this.composite.context.loadScript(this.module.externals[ext])
        }
      }
    }

    if (Array.isArray(this.module.dependencies)) { // 代码中使用import xxx 导入的部分
      for (const ext of this.module.dependencies) {
        await this.composite.context.loadScript(ext)
      }
    }
    // 判断 初始化过后部重复监听
    if (this.state) {
      // 初始化监听state变化
      subscribe(this.state, mutations => {
        this.onMutations(mutations)
      })
    }
    if (this.module.setup) {
      try {
        const dura = await measureAsyncExecutionTime(async () => {
          await this.module.setup.call(this.context, this.context)
        }, debug.enabled)

        if (dura > -1) {
          debug('Module Setup:', this.module.name, 'Duration:', dura + 'ms')
        }
        this.storeSetUp = true
        this.flushScheduledJobs()
      } catch (e) {
        console.error('Module Setup Error!', this.module, e)
      }
    }
  }

  updateProps (properties) {
    this.properties = properties

    const propertiesWatchers = []

    for (const name in properties) {
      // 数据绑定到属性的  调度触发
      if (this.watchers[name]) {
        propertiesWatchers.push(...this.watchers[name])
      }
      // 直接声明module.watch 直接调用
      if (this.module.watch && this.module.watch[name]) {
        this.module.watch[name].call(this.context, properties[name], properties)
      }
    }
    this.scheduleCallback(propertiesWatchers)
    if (this.module.update) {
      this.module.update.call(this.context, properties)
    }
    this.flushScheduledJobs()
  }

  /**
   * 提交对状态、计算值、属性进行监听
   * @param {string} type state/computed
   * @param {string} path
   * @param {*} callback
   */
  subscribe (type, path, callback) {
    const name = path.join('.')
    switch (type) {
      case 'state':
        // 绑定到状态的，按绑定路径增加监听器
        this.addWatchers(name, callback)
        break
      case 'computed':
        // 绑定到计算值的，按情况处理
        if (this.module.computed && this.module.computed[name]) {
          // 声明了dependencies的
          if (Array.isArray(this.module.computed[name].dependencies)) {
            for (const expr of this.module.computed[name].dependencies) {
              this.addWatchers(expr, callback)
            }
          } else {
            // 未声明依赖则更新所有涉及
            const getMethod = this.module.computed[name].get || this.module.computed[name]
            if (getMethod.length === 0) { // get 或者 方法都没有参数，表示全局计算， 否则认为是scope计算，就不监听
              this.addWatchers('*', callback)
            }
          }
        }
        break
      case 'prop':
        this.addWatchers(name, callback)
        break
      default:
        break
    }
  }

  addWatchers (path, callback) {
    if (this.watchers[path] == null) {
      this.watchers[path] = new Set()
    }
    this.watchers[path].add(callback)
  }

  /**
   * 获取状态值、计算值等
   * @param {*} type
   * @param {*} name
   * @param {*} scopes 当前计算上下文的局部数据，数组形式表示嵌套的局部（通常由循环产生）
   * @returns
   */
  getValue (type, name, scopes) {
    let result = null
    if (type === 'state') {
      result = get(this.state, name)
    } else if (type === 'computed') {
      const args = [...scopes]
      args.push(this.context.state)
      // 执行表达式
      const computed = this.module.computed[name]
      if (computed) {
        this.computedUsedState = []
        try {
          if (typeof computed === 'function') {
            result = computed.call(this.context, ...args)
          } else if (typeof computed.get === 'function') {
            result = computed.get.call(this.context, ...args)
          }
          // 获取计算过程中依赖的状态列表 不进行computedDependencies计算，因为函数可能有if else等，监听可能并不准确，还是统一未提供按*全部计算处理了
          // if (this.computedDependencies[name]) {
          //   this.computedDependencies[name] = Array.from(new Set([...this.computedDependencies[name], ...this.computedUsedState]))
          // } else {
          //   this.computedDependencies[name] = this.computedUsedState
          // }
        } catch (e) {
          console.error('getValue Error', e)
          if (this.storeSetUp) {
            console.error('ComputedError: ', computed, scopes)
          }
          // 忽略未完成setup的异常
        }
      }
    } else if (type === 'prop') {
      return this.context.properties[name]
    }
    if (result != null) {
      result = cloneDeep(result)
    }
    return result
  }

  dispatchChange (type, stateName, val, scoped) {
    if (type === 'state') {
      set(this.state, stateName.split('.'), val)
      // this.state[stateName] = val
    } else if (type === 'computed') {
      if (this.module.computed && typeof this.module.computed[stateName]?.set === 'function') {
        try {
          this.module.computed[stateName]?.set.call(this.context, val, this.state, ...scoped)
        } catch (e) {
          error('dispatchChange Error', e)
        }
      }
    }
  }

  /**
   * 执行动作调用， 如果有返回值，将返回值返写入state
   * @param {*} actionName
   * @param {*} { scopedData 列表嵌套情况下， scope信息, payload:事件时携带的payload , eventArgs: 方法配置的参数 }
   */
  doStoreAction (actionName, {
    scopedData,
    payload,
    eventArgs
  }) {
    if (this.module.actions && this.module.actions[actionName]) {
      try {
        const args = []

        // 0. 箭头函数：第一个参数是context
        if (isArrowFunction(this.module.actions[actionName])) {
          args.push(this.context)
        }
        // 1. 方法配置的参数
        if (eventArgs !== '') {
          args.push(eventArgs)
        }
        // 2. 在列表嵌套情况下， scope信息，每层嵌套一个
        if (scopedData && scopedData.length) {
          args.push(...scopedData)
        }
        // 3. 发出事件时携带的payload, 可能是多个
        if (payload != null) {
          if (Array.isArray(payload)) {
            args.push(...payload)
          } else {
            args.push(payload)
          }
        }
        const dura = measureExecutionTime(() => {
          //  this.module.setup.call(this.context)
          const exeResult = this.module.actions[actionName].call(this.context, ...args)
          if (typeof exeResult === 'object') {
            this.context.setState(exeResult)
          }
        }, debug.enabled)

        if (dura > -1) {
          debug('Action Dura', actionName, args, dura)
        }
      } catch (e) {
        console.error('doStoreAction Error', e)
      }
    }
  }

  onMutations (mutations) {
    for (const mutation of mutations) {
      const [action, statePath, newValue, oldValue] = mutation
      log('mutation', action, statePath.join('.'), newValue, oldValue)
      // 发出state单值改变事件
      this.onStateChange(statePath, newValue, oldValue)
    }
    this.flushScheduledJobs()
  }

  // State变更处理： 这里是页面所有变化产生之源， 状态变化同时也会驱动相关计算值变化
  onStateChange (states, newValue, oldValue) {
    const statePath = states.join('.')
    const watchers = []
    const globalWatchers = new Set()

    if (this.watchers['*']) {
      watchers.push(...this.watchers['*'])
    }

    const watcherKeys = Object.keys(this.watchers) // 处理脚本里 watch : {} 的情况

    // 直接绑定到state： 判断变化的路径 （state/state.2.xx） 是否包含当前state
    for (const watchKey of watcherKeys) {
      if (watchKey.startsWith(statePath) || statePath.startsWith(watchKey + '.') || watchKey === statePath) {
        watchers.push(...this.watchers[watchKey])
      }
    }

    const moduleWatcherKey = Object.keys(this.module.watch || {})
    for (const watchKey of moduleWatcherKey) {
      if (watchKey.startsWith(statePath) || statePath.startsWith(watchKey + '.') || watchKey === statePath) {
        globalWatchers.add(this.module.watch[watchKey])
      }
    }
    watchers.push(...Array.from(globalWatchers).map(w => {
      return () => {
        w.call(this.context, oldValue, newValue)
      }
    }))
    this.scheduleCallback(watchers)
  }

  scheduleCallback (watchers) {
    for (const callback of watchers) {
      this.scheduledJobs.add(callback)
    }
  }

  flushScheduledJobs () {
    for (const job of this.scheduledJobs) {
      try {
        job()
      } catch (e) {
        console.error('job exec error', e)
      }
    }
    this.scheduledJobs.clear()
  }

  destory () {
    this.module.destory && this.module.destory.call(this.context)
  }
}
