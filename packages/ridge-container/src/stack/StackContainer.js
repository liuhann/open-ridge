import BaseContainer from '../BaseContainer.js'
import './style.css'

/**
 * 内容切换显示容器
 */
export default class StackContainer extends BaseContainer {
  getContainerStyle () {
    return {
      overflow: 'hidden'
    }
  }

  /**
   * 容器挂载
   * @param {*} el
   */
  async mounted () {
    this.containerEl.className = (this.props.classList || []).join(' ') + ' stack-container'
    this.forceUpdateChildren = true
    if (!this.isEditor) {
      this.forceChildrenStyle()
      this.containerEl.addEventListener('mouseenter', () => {
        this.forceChildrenStyle(true)
      })

      this.containerEl.addEventListener('mouseleave', () => {
        this.forceChildrenStyle(false)
      })
    }
  }

  forceChildrenStyle (isHover) {
    if (this.children) {
      for (const childNode of this.children) {
        if (childNode.el && childNode.style.showOnHover === true) { // 子节点悬浮展示
          if (isHover) {
            childNode.el.style.display = ''
          } else {
            childNode.el.style.display = 'none'
          }
        }
      }
    }
  }

  // Editor Only
  childSelected (childEl) {

  }

  onChildRemoved () {
  }

  onChildAppended (childNode) {

  }

  updated () {
    this.containerEl.className = (this.props.classList || []).join(' ') + ' stack-container'
  }

  getChildStyle (node, div) {
    const style = this.getResetStyle()

    style.width = '100%'
    style.height = '100%'
    style.position = 'absolute'
    style.left = 0
    style.top = 0

    // 获取其父节点
    const parent = div.parentNode
    // 将父节点的子元素转换为数组
    const childrenArray = Array.from(parent.children)
    style.zIndex = childrenArray.indexOf(div)

    return style
  }

  onStyleUpdated () {
    this.containerEl.style.position = 'relative'
  }
}
