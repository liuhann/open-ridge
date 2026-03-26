// treeUtils.js - 树结构处理工具类（ES6模块化）

/**
 * 通用树遍历递归函数（深度优先）【私有工具，不对外导出】
 * @param {Object} node - 当前节点
 * @param {Function} handler - 节点处理函数 (node, children) => newNode
 * @returns {Object|null} 处理后的节点（null表示过滤掉）
 */
const traverseTreeRecursive = (node, handler) => {
  // 提前判断：无children则直接处理当前节点，避免空递归
  if (!node.children || node.children.length === 0) {
    return handler(node, [])
  }

  // 递归处理子节点，过滤掉null值（过滤场景）
  const processedChildren = node.children
    .map(child => traverseTreeRecursive(child, handler))
    .filter(Boolean)

  // 处理当前节点（传入处理后的子节点）
  return handler(node, processedChildren)
}

/**
 * 生成节点路径（私有工具，不对外导出）
 * @param {Object} node - 当前节点
 * @param {String} parentPath - 父节点路径
 * @param {String} separator - 路径分隔符
 */
const generateNodePath = (node, parentPath, separator) => {
  node.path = parentPath
    ? `${parentPath}${separator}${node.name}`
    : node.name
}

/**
 * 构建树状结构（高性能版）【对外导出】
 * @param {Array} list - 原始扁平数组
 * @param {string|number} rootValue - 根节点parent值（默认-1）
 * @param {string} pathSeparator - 路径分隔符（默认/）
 * @returns {Array} 树状结构数组
 */
export const buildTree = (list, rootValue = -1, pathSeparator = '/') => {
  // 1. 构建节点映射表（Map比普通对象查找更快）
  const nodeMap = new Map()
  list.forEach(node => {
    nodeMap.set(node.id, {
      id: node.id,
      name: node.name,
      parent: node.parent,
      // 仅拷贝必要的扩展属性，减少内存占用
      ...(node.type ? { type: node.type } : {}),
      ...(node.sort ? { sort: node.sort } : {}),
      children: [],
      path: ''
    })
  })

  // 2. 构建父子关系
  const rootNodes = []
  for (const node of nodeMap.values()) {
    const parentNode = nodeMap.get(node.parent)
    if (parentNode) {
      parentNode.children.push(node)
    } else if (node.parent === rootValue) {
      rootNodes.push(node)
    }
  }

  // 3. 生成路径
  rootNodes.forEach(root => {
    traverseTreeRecursive(root, (node) => {
      generateNodePath(
        node,
        node.parent === rootValue ? '' : nodeMap.get(node.parent).path,
        pathSeparator
      )
      return node
    })
  })

  return rootNodes
}

/**
 * 过滤树节点（高性能版）【对外导出】
 * @param {Array} tree - 构建好的树状结构
 * @param {Function} filterFn - 过滤函数 (node) => boolean
 * @returns {Array} 过滤后的树
 */
export const filterTree = (tree, filterFn) => {
  // 缓存过滤处理逻辑，避免重复创建函数
  const filterHandler = (node, processedChildren) => {
    const isMatch = filterFn(node)
    if (isMatch || processedChildren.length > 0) {
      return {
        ...node,
        children: processedChildren
      }
    }
    return null
  }

  // 遍历根节点并过滤null值
  return tree.map(node => traverseTreeRecursive(node, filterHandler)).filter(Boolean)
}

/**
 * 映射树节点（高性能版）【对外导出】
 * @param {Array} tree - 构建好的树状结构
 * @param {Function} mapFn - 映射函数 (node) => newNode
 * @returns {Array} 映射后的新树
 */
export const mapTree = (tree, mapFn) => {
  // 缓存映射处理逻辑
  const mapHandler = (node, processedChildren) => {
    const newNode = mapFn(node)
    newNode.children = processedChildren // 绑定处理后的子节点
    return newNode
  }

  // 遍历根节点
  return tree.map(node => traverseTreeRecursive(node, mapHandler))
}

// 可选：导出所有方法的集合（方便批量导入）
export default {
  buildTree,
  filterTree,
  mapTree
}
