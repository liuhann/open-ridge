export const getFileTree = (files, each) => {
  const roots = files.filter(file => file.parent === -1).map(file => buildFileTree(file, null, files, each)).sort(sortFile)

  return roots
}

const sortFile = (a, b) => {
  if (a.type === 'directory' && b.type === 'directory') {
    return a.label > b.label ? 1 : -1
  } else if (a.type === 'directory') {
    return -1
  } else if (b.type === 'directory') {
    return 1
  } else {
    return a.label > b.label ? 1 : -1
  }
}

export const eachNode = async (files, callback) => {
  const result = []
  for (const file of files) {
    result.push(await callback(file))
    if (file.children) {
      await eachNode(file.children, callback)
    }
  }
  return result
}

/**
 * 树形结构扁平化（递归版，支持无限层级）
 * @param {Array} tree 树形数组
 * @returns {Array} 扁平化后的一维数组
 */
export const flattenTree = (tree) => {
  const result = []

  // 递归处理节点
  const traverse = (node) => {
    // 把当前节点推入结果（排除children，只保留自身属性）
    const { children, ...rest } = node
    result.push(rest)

    // 如果有子节点，继续递归
    if (children && children.length > 0) {
      children.forEach((child) => traverse(child))
    }
  }

  // 遍历整棵树
  tree.forEach((item) => traverse(item))

  return result
}

/* 从树节点过滤掉 */
export const filterTree = (treeData, filterCb) => {
  const result = []

  treeData.forEach(node => {
    if (node.children) {
      result.push(...filterTree(node.children, filterCb))
    }
    if (filterCb(node)) {
      result.push(node)
    }
  })
  return result
}

export const mapTree = (treeData, map) => {
  const result = []

  treeData.forEach(node => {
    const mapped = map(Object.assign({}, node))
    if (mapped) {
      if (node.children) {
        mapped.children = mapTree(node.children, map)
      }
      result.push(mapped)
    }
  })
  return result
}

export const buildFileTree = (file, dir, files, each) => {
  const treeNode = {
    ...file
  }
  treeNode.path = (file.parent === -1) ? ('/' + file.name) : (dir.path + '/' + file.name)
  treeNode.parentNode = dir

  if (treeNode.type === 'directory') {
    const children = files.filter(item => item.parent === file.id)

    treeNode.children = children.map(child => buildFileTree(child, treeNode, files, each)).sort(sortFile)
  }
  // Object.freeze(treeNode)
  each && each(treeNode)
  return treeNode
}
