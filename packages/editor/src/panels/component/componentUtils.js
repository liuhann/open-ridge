// utils/componentUtils.js
export const CATEGORIES = {
  container: {
    title: '容器组件',
    color: 'blue'
  },
  interaction: {
    title: '交互组件',
    color: 'green'
  },
  display: {
    title: '展示组件',
    color: 'purple'
  }
}

export const getDisplayName = (item) => {
  if (!item) return '未知组件'
  return item.title || item.name || item.module || '未命名组件'
}

export const getInitial = (name) => {
  if (!name) return '?'
  return name.charAt(0).toUpperCase()
}

// 替换字符串中的双斜杠为单斜杠， 但是对于协议部分的双斜杠 例如 http:// 不做替换
const replaceDoubleSlashWithHttpProtocal = (str) => {
  return str.replace(/(http[s]?:\/\/[^/]+)\/\//g, '/')
}
export const getIconUrl = (item, packageName) => {
  if (item && item.icon) {
    // 先判断icon是不是base64等非url类型，如果是就直接使用
    if (item.icon.startsWith('data:')) {
      return item.icon
    } else {
      const finalPkgName = packageName || item.packageName || item.module
      if (finalPkgName) {
        // 获取图标
        return replaceDoubleSlashWithHttpProtocal(`${window.RidgeUI?.baseUrl ?? '/npm'}/${finalPkgName}/${item.icon}`)
      } else {
        return item.icon
      }
    }
  }
  return null
}

export const getThumbnailUrl = (item) => {
  if (item.visualConfig?.thumbnail) {
    return item.visualConfig.thumbnail
  }
  return null
}

export const estimateBundleSize = (dist) => {
  if (!dist) return '未知'
  if (Array.isArray(dist)) {
    const estimatedKB = dist.length * 75
    return `${estimatedKB}KB`
  } else {
    return '约50KB'
  }
}
