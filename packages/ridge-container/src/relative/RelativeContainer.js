import BaseContainer from '../BaseContainer'

function getChildIndex (element) {
  if (!element || !element.parentNode) {
    return -1 // 如果元素不存在或没有父元素，返回-1
  }

  const children = Array.from(element.parentNode.children) // 将父元素的子节点转换为数组
  return children.indexOf(element) // 返回元素在数组中的索引
}

export default class RelativeContainer extends BaseContainer {
  getContainerStyle () {
    const { overflow } = this.props
    const containerStyle = {
      width: '100%',
      height: '100%',
      boxSizing: 'border-box',
      position: 'relative'
    }
    if (overflow) {
      containerStyle.overflow = 'hidden'
    }
    return containerStyle
  }

  onChildAppended (element, { x, y }) {
    // 因为子节点是从外部拖入，其xy 都是相对于根的，这里根据传入的相对当前父的xy做更新
    element.updateConfig({
      style: { x, y }
    })
  }

  onChildRemoved (element) {

  }

  getChildStyle (configStyle, index = 1) {
    const style = this.getResetStyle()

    style.zIndex = index + 10
    style.position = 'absolute'
    style.top = configStyle.y + 'px'
    style.left = configStyle.x + 'px'
    style.width = configStyle.width + 'px'
    style.height = configStyle.height + 'px'
    return style
  }
}
