import { nanoid } from '../utils/string'
import { STORE, PROP } from 'ridgejs/src/utils/contants.js'
import { cloneDeep, isPlainObject } from 'lodash'

/**
   * 更新页面引入的样式表
   */
const importStyleFiles = async (cssFiles, context) => {
  const oldStyles = document.querySelectorAll('style[local-path]')
  for (const styleEl of oldStyles) {
    document.head.removeChild(styleEl)
  }

  const { appService } = context.services
  const classNames = []
  for (const filePath of cssFiles || []) {
    const file = appService.getFileByPath(filePath)

    if (file) {
      if (!file.textContent) {
        file.textContent = await appService.getFileContent(file)
      }
      const styleEl = document.createElement('style')
      styleEl.setAttribute('local-path', filePath)
      document.head.appendChild(styleEl)
      styleEl.textContent = '\r\n' + file.textContent
      // 计算使用的样式
      const matches = file.textContent.match(/\/\*.+\*\/[^{]+{/g)
      for (const m of matches) {
        const label = m.match(/\/\*.+\*\//)[0].replace(/[/*]/g, '')
        const className = m.match(/\n[^{]+/g)[0].trim().substring(1)

        classNames.push({
          className,
          label
        })
      }
    }
  }
  return classNames
}

/**
 * 加载JS-Store源代码，返回Store模块
 * @param {*} sourceCode
 * @returns
 */
const loadJsModule1 = async sourceCode => {
  const scriptEl = document.createElement('script')
  const jsGlobal = 'ridge-store-' + nanoid(10)
  // 去除import的部分
  const { updatedSourceCode, importStatements } = cleanImports(sourceCode)
  scriptEl.textContent = updatedSourceCode.replace('export default', 'window["' + jsGlobal + '"]=')

  return new Promise((resolve, reject) => {
    try {
      window.onerror = e => {
        try {
          document.head.removeChild(scriptEl)
          reject(e)
        } catch (e) {}
      }
      document.head.append(scriptEl)
      const module = window[jsGlobal]
      // module.parsedLines = parseSourceWithComments(file.textContent)

      module.jsContent = updatedSourceCode
      module.dependencies = importStatements

      if (module) {
        resolve(module)
      } else {
        reject(new Error('not'))
      }
    } catch (e) {
      reject(e)
    } finally {
      delete window[jsGlobal]
      window.onerror = null
      document.head.removeChild(scriptEl)
    }
  })
}

const cleanImports = sourceCode => {
  const importStatements = []
  let updatedSourceCode = sourceCode
  // 使用正则表达式匹配import语句，并捕获from后面的模块路径
  const importRegex = /import\s+.*?\s+from\s+(['"])(.*?)(['"])/gm
  // 执行替换操作，同时收集被处理的模块路径
  let match
  while ((match = importRegex.exec(sourceCode))) {
    const modulePath = match[2] // 捕获到的模块路径在match[2]中
    importStatements.push(modulePath) // 将模块路径添加到列表中
    // 替换import语句为空字符串
    updatedSourceCode = updatedSourceCode.replace(match[0], '')
  }

  return {
    updatedSourceCode,
    importStatements
  }
}

// 假设这是您从某个地方获取的JavaScript源文件的文本内容
// const jsSourceText = '...' // 源文件内容

// 预先解析源文件，提取每行代码和对应的注释
// const codeLinesWithComments = parseSourceWithComments(jsSourceText)

// 搜索特定的代码内容，并找到同行注释
function searchCodeWithComment (searchCode, codeLinesWithComments) {
  for (const { code, currentComment } of codeLinesWithComments) {
    if (new RegExp(searchCode + ' *[:(]').test(code) && currentComment) {
      return currentComment
      // results.push({ lineNumber, code, comment })
    }
  }
  return searchCode
}

function parseSourceWithComments (sourceText) {
  const lines = sourceText.split('\n')
  const parsedLines = []
  let previousComment = null // 用于存储上一行的注释

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i]
    const trimmedLine = line.trim()
    let currentComment = null
    let onlyComment = null
    let code = trimmedLine

    // 检查当前行是否整行都是注释
    if (trimmedLine.startsWith('//')) {
      onlyComment = trimmedLine.substring(2).trim() // 去除开头的 '//'
      code = '' // 当前行没有代码
    } else {
      // 检查当前行是否包含注释
      const commentIndex = code.indexOf('// ')
      if (commentIndex !== -1) {
        // 如果有注释，但不是整行注释，则不视为当前行的注释
        code = code.substring(0, commentIndex).trim()
        currentComment = trimmedLine.substring(commentIndex + 2).trim()
      }
    }

    // 创建包含代码、上一行注释和当前行注释的对象
    const parsedLine = {
      lineNumber: i + 1,
      code,
      previousComment: (i > 0 && previousComment !== null) ? previousComment : null, // 仅在上一行是整行注释时返回
      currentComment // 当前行整行是注释时返回，否则为null
    }

    parsedLines.push(parsedLine)
    // 如果当前行是整行注释，则将其设置为上一行的注释
    if (onlyComment !== null) {
      previousComment = onlyComment
    } else {
      previousComment = null // 否则，重置上一行的注释为null
    }
  }

  return parsedLines.filter(line => line.currentComment || line.previousComment)
}
// 使用示例
// const searchCode = '特定的代码内容'
// const searchResults = searchCodeWithComment(searchCode)
// console.log(searchResults)

function removeImportsAndReturnModules (sourceCode) {
  const importRegex = /import\s+([^'"]+)\s+from\s+('[^']+'|"[^"]+")/g
  const importMatches = sourceCode.matchAll(importRegex)
  const modules = []
  let newSourceCode = sourceCode

  for (const match of importMatches) {
    const moduleName = match[1]
    modules.push(moduleName)
    // 替换 import 语句为注释或者空字符串
    newSourceCode = newSourceCode.replace(match[0], `// import ${moduleName} from ...`)
  }

  return {
    newSourceCode,
    modules
  }
}

/**
 * 获取Composite可对外配置的属性。 主要来源于：
 * 1、Store中定义的属性
 * 2、组件promote属性
 * @param {*} composite
 * @returns
 */
const getCompositePropertiesDef = (composite) => {
  const propertiesDefinations = []

  // Store中定义的属性
  for (const storeModule of composite.jsModules ?? []) {
    propertiesDefinations.push(...(storeModule.properties ?? []).map(prop => {
      return Object.assign({}, prop, {
        field: 'properties.' + prop.name
      })
    }))
  }

  // 获取Promote的属性
  for (const node of Object.values(composite.nodes)) {
    for (const [key, value] of Object.entries(node.config.propEx || {})) {
      if (typeof value === 'string' && value.startsWith(STORE + '.' + PROP)) {
        const [store, prop, label] = value.split('.')

        const propDef = getNodePropDefination(node, key)
        if (propDef) {
          propertiesDefinations.push(cloneDeep(Object.assign(getNodePropDefination(node, key), {
            label,
            field: 'properties.' + label
          })))
        }
      }
    }
  }
  return propertiesDefinations
}

/**
 * 获取页面的事件列表
 * @returns
 */
const getCompositeEventsDef = composite => {
  const eventDefinations = []

  // 页面脚本库中声明的事件列表
  for (const storeModule of composite.jsModules ?? []) {
    eventDefinations.push(...(storeModule.events ?? []).map(event => {
      return Object.assign({}, event, {
        control: 'event',
        field: 'events.' + event.name
      })
    }))
  }

  // 组件定义了事件为promoted
  for (const node of composite.getNodes()) {
    Object.entries(node.config.events).forEach(([key, value]) => {
      if (value === 'promoted') {
        const eventName = (node.componentDefinition ? node.componentDefinition.events.find(ev => ev.name === key)?.label : key) ?? key

        eventDefinations.push({
          label: node.config.title + '-' + eventName,
          control: 'event',
          field: 'events.' + node.getId() + '-' + key
        })
      }
    })
  }
  return eventDefinations
}

const getNodePropDefination = (node, key) => {
  if (node.componentDefinition && node.componentDefinition.props) {
    return node.componentDefinition.props.filter(p => p.name === key)[0]
  } else {
    return null
  }
}

const buildStateConnectTree = (key, value, keyPrefix, parsedLines) => {
  const tree = {
    key: keyPrefix + key,
    label: searchCodeWithComment(key, parsedLines)
  }

  if (isPlainObject(value)) {
    tree.children = []

    for (const k in value) {
      if (!k.startsWith('_')) {
        tree.children.push(buildStateConnectTree(k, value[k], keyPrefix + key + '.', parsedLines))
      }
    }
  }
  return tree
}

/**
 * 解析store的结构，读取属性、状态、事件等信息
 * 返回树结构以供后续绑定时选择
 * @param {*} jsStoreModule
 * @return { connects = [{key, label, children}], events = [key, label, children] }
 * }
 */
const parseStoreMeta = jsStoreModule => {
  try {
    const StateBindRootNode = {
      key: jsStoreModule.name + '.connect',
      icon: <i className='bi bi-window-dock' />,
      disabled: false,
      label: jsStoreModule.label ?? jsStoreModule.name,
      children: []
    }
    const ActionBindRootNode = {
      key: jsStoreModule.name + '.event',
      label: jsStoreModule.label ?? jsStoreModule.name,
      children: []
    }

    const parsedLines = parseSourceWithComments(jsStoreModule.jsContent)

    if (jsStoreModule.properties) {
      const propNode = {
        key: jsStoreModule.name + '.properties',
        label: '属性',
        children: []
      }
      for (const prop of jsStoreModule.properties) {
        propNode.children.push({
          key: jsStoreModule.name + '.prop.' + prop.name,
          label: prop.label ?? prop.name
        })
      }
      if (propNode.children.length) {
        StateBindRootNode.children.push(propNode)
      }
    }

    // 写入状态列表
    if (jsStoreModule.state) {
      const stateNode = {
        key: jsStoreModule.name + '.state',
        label: '状态',
        children: []
      }
      let initStateObject = {}
      if (typeof jsStoreModule.state === 'function') {
        initStateObject = jsStoreModule.state({})
      } else if (typeof jsStoreModule.state === 'object') {
        initStateObject = jsStoreModule.state
      }

      for (const key of Object.keys(initStateObject)) {
        if (!key.startsWith('_')) {
          stateNode.children.push(buildStateConnectTree(key, initStateObject[key], jsStoreModule.name + '.state.', parsedLines))
        }
      }
      if (stateNode.children.length) {
        StateBindRootNode.children.push(stateNode)
      }
    }

    if (jsStoreModule.computed) {
      const computedNode = {
        key: jsStoreModule.name + '.computed',
        label: '计算值',
        children: []
      }
      for (const key of Object.keys(jsStoreModule.computed)) {
        computedNode.children.push({
          key: jsStoreModule.name + '.computed.' + key,
          label: searchCodeWithComment(key, parsedLines)
        })
      }
      if (computedNode.children.length) {
        StateBindRootNode.children.push(computedNode)
      }
    }

    if (jsStoreModule.actions && typeof jsStoreModule.actions === 'object') {
      Object.keys(jsStoreModule.actions || {}).forEach(key => {
        if (!key.startsWith('_')) {
          ActionBindRootNode.children.push({
            name: jsStoreModule.name + '.' + key,
            label: searchCodeWithComment(key, parsedLines)
          })
        }
      })
    }
    return {
      name: jsStoreModule.name,
      events: jsStoreModule.events ?? [],
      properties: jsStoreModule.properties ?? [],
      connects: StateBindRootNode,
      actions: ActionBindRootNode
    }
  } catch (e) {
    console.error('jsStoreModule Parse Error', jsStoreModule)

    return {
      error: e
    }
  }
}

/**
 * 获取节点列表的所有配置信息，用于节点的复制
 * @param {*} nodes
 */
const getNodeListConfig = nodes => {
  const result = []

  for (const node of nodes) {
    const nodeConfig = node.exportJSONTree()
    result.push(nodeConfig)
  }
  return result
}

export {
  getCompositePropertiesDef,
  getCompositeEventsDef,
  loadJsModule1,
  removeImportsAndReturnModules,
  searchCodeWithComment,
  parseSourceWithComments,
  parseStoreMeta,
  importStyleFiles,
  getNodeListConfig
}
