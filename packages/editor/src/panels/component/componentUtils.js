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
  chart: {
    title: '图表组件',
    color: 'purple'
  }
};

export const getDisplayName = (item) => {
  if (!item) return '未知组件';
  return item.title || item.name || item.module || '未命名组件';
};

export const getInitial = (name) => {
  if (!name) return '?';
  return name.charAt(0).toUpperCase();
};

export const getIconUrl = (item) => {
  if (item.icon) {
    return item.icon;
  }
  return null;
};

export const getThumbnailUrl = (item) => {
  if (item.visualConfig?.thumbnail) {
    return item.visualConfig.thumbnail;
  }
  return null;
};

export const estimateBundleSize = (dist) => {
  if (!dist) return '未知';
  if (Array.isArray(dist)) {
    const estimatedKB = dist.length * 75;
    return `${estimatedKB}KB`;
  } else {
    return '约50KB';
  }
};