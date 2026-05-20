/**
   * Fits a rectangle into anothers rectangles bounds
   * @param rect   原始大小
   * @param bounds  容器，大小不定
   * @returns {width: Number, height: Number}
   */
/**
 * 等比缩放适配：object-fit: scale-down 逻辑
 */
export function fitRectIntoBounds (rect, bounds) {
  // 比容器小 → 不放大，保持原尺寸
  if (rect.width <= bounds.width && rect.height <= bounds.height) {
    return rect
  }

  const ratio = rect.width / rect.height
  const boundsRatio = bounds.width / bounds.height

  if (ratio > boundsRatio) {
    return {
      width: bounds.width,
      height: bounds.width / ratio
    }
  } else {
    return {
      width: bounds.height * ratio,
      height: bounds.height
    }
  }
}

/**
 * 获取Rect类型元素的位置样式
 * @param {x, y, width, height} rect 元素位置
 * @param {width, height} viewBox 默认屏幕大小
 * @param {width, height} viewPort 给出的可视区域大小
 * @param {string} fitMode 对齐模式
 */
export function getRectPositionStyle (rect, viewBox, viewPort, fitMode = '') {
  let result = null
  if (viewBox && viewPort) {
    result = {
      left: rect.x * viewPort.width / viewBox.width + 'px',
      top: rect.y * viewPort.height / viewBox.height + 'px',
      width: rect.width * viewPort.width / viewBox.width + 'px',
      height: rect.height * viewPort.height / viewBox.height + 'px'
    }
  } else if (viewPort) {
    result = {
      left: 0,
      top: 0,
      width: viewPort.width + 'px',
      height: viewPort.height * rect.height / rect.width + 'px'
    }
  } else {
    result = {
      left: rect.x + 'px',
      top: rect.y + 'px',
      width: rect.width + 'px',
      height: rect.height + 'px'
    }
  }
  return result
}

/**
 * 指定的点是否在矩形范围内
 * @param {*} point
 * @param {*} rect
 */
export function isPointInRect (point, rect, outer = 0) {
  return (point.x - rect.x) < (rect.width + outer) && (point.x - rect.x) > -outer && (point.y - rect.y) < (rect.height + outer) && (point.y - rect.y) > -outer
}

/**
 * 判断2个矩形是否有交集
 * @param {*} r1
 * @param {*} r2
 */
export function intersectRect (r1, r2) {
  return !(r2.x > (r1.x + r1.width) ||
           (r2.x + r2.width) < r1.x ||
           r2.y > (r1.y + r1.height) ||
           (r2.y + r2.height) < r1.y)
}
