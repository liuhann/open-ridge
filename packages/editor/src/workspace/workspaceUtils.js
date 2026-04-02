// workspaceUtils.js

// 检查元素是否可移动
export function isElementMovable (element) {
  if (!element || !element.classList) return false
  return !element.classList.contains('ridge-is-locked') &&
         !element.classList.contains('ridge-is-full')
}

// 检查元素是否可选择
export function isElementSelectable (element) {
  if (!element || !element.classList) return false
  return !element.classList.contains('ridge-is-hidden') &&
         !element.classList.contains('ridge-is-locked')
}

// 检查元素是否可调整大小
export function isElementResizable (element) {
  if (!element || !element.classList) return false
  if (element.classList.contains('ridge-is-locked') ||
      element.classList.contains('ridge-is-hidden')) {
    return false
  }
  if (element.classList.contains('ridge-is-slot')) {
    return element.ridgeNode?.isResizable?.() ?? true
  }
  return true
}

// 获取元素的矩形配置
export function getElementRectConfig (element, viewPortEl, zoom) {
  const beforeRect = element.getBoundingClientRect()
  const rbcr = viewPortEl.getBoundingClientRect()

  return {
    position: 'absolute',
    visible: true,
    x: (beforeRect.x - rbcr.x) / zoom,
    y: (beforeRect.y - rbcr.y) / zoom,
    width: beforeRect.width / zoom,
    height: beforeRect.height / zoom
  }
}

// 坐标转换：从屏幕坐标转换到视口坐标
export function screenToViewport ({ x, y }, viewPortEl, zoom) {
  const rbcr = viewPortEl.getBoundingClientRect()
  return {
    x: (x - rbcr.x) / zoom,
    y: (y - rbcr.y) / zoom
  }
}

// 坐标转换：从视口坐标转换到屏幕坐标
export function viewportToScreen ({ x, y }, viewPortEl, zoom) {
  const rbcr = viewPortEl.getBoundingClientRect()
  return {
    x: x * zoom + rbcr.x,
    y: y * zoom + rbcr.y
  }
}

// 计算元素的中心点
export function getElementCenter (element) {
  const rect = element.getBoundingClientRect()
  return {
    x: rect.left + rect.width / 2,
    y: rect.top + rect.height / 2
  }
}
