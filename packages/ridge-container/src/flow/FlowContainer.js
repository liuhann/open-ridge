import BaseContainer from '../BaseContainer'

const styleSize = len => {
  if (typeof len === 'number') {
    return len + 'px'
  } else if (typeof len === 'string' && len.match(/^[0-9]+$/)) {
    return len + 'px'
  } else {
    return len
  }
}

export default class FlowContainer extends BaseContainer {
  // 放入一个新的rect后，根据位置放置其所在子节点的索引
  checkNodeOrder (rect) {
    const centerX = rect.x + rect.width / 2
    const centerY = rect.y + rect.height / 2
    const childNodes = this.containerEl.childNodes

    let before = -1
    // 横向
    for (let i = childNodes.length - 1; i >= 0; i--) {
      const bc = childNodes[i].getBoundingClientRect()
      const compareX = bc.x + bc.width / 2
      const compareY = bc.y + bc.height / 2

      if (compareX > centerX && compareY > centerY) {
        before = i
      }
    }
    return before
  }

  getContainerStyle () {
    return {
      width: '100%'
    }
  }

  getChildStyle (view) {
    const style = this.getResetStyle()

    if (view.config.style.block) {
      style.display = 'block'
      style.width = '100%'
      style.height = view.config.style.height + 'px'
    } else {
      style.display = 'inline-block'
      style.width = view.config.style.width + 'px'
      style.height = view.config.style.height + 'px'
    }

    // style.width = styleSize(view.config.style.width)
    // style.height = styleSize(view.config.style.height)

    return style
  }
}
