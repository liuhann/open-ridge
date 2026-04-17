import BaseContainer from '../BaseContainer.js'
import './style.css'

/**
 * 堆叠容器 - 多个子节点层叠显示
 */
export default class StackContainer extends BaseContainer {
  constructor (props) {
    super(props)
    this.handleMouseEnter = this.handleMouseEnter.bind(this)
    this.handleMouseLeave = this.handleMouseLeave.bind(this)
  }

  getContainerStyle () {
    return {
      overflow: 'hidden',
      position: 'relative' // 添加相对定位，确保子节点绝对定位基准正确
    }
  }

  // 挂载完成后的初始化
  async mounted () {
    this.containerEl.className = this.getContainerClassName()
    this.forceUpdateChildren = false

    if (!this.isEditor) {
      this.updateChildrenVisibility()
    }
  }

  // 获取容器类名
  getContainerClassName () {
    return 'switch-container'
  }

  // 更新子节点可见性
  updateChildrenVisibility () {
    const { current } = this.props

    this.children?.forEach((childNode, index) => {
      if (index === current) {
        childNode.el.style.display = ''
      } else {
        childNode.el.style.display = 'none'
      }
    })
  }

  // Editor Only - 子节点被选中
  childSelected (childEl) {}

  onChildRemoved () {}

  onChildAppended (childNode) {}

  updated () {
    this.containerEl.className = this.getContainerClassName()
    this.updateChildrenVisibility()
  }

  // 修复：参数与父类一致
  getChildStyle (style) {
    return {
      ...this.getResetStyle(),
      ...style,
      width: '100%',
      height: '100%',
      position: 'absolute',
      left: 0,
      top: 0
    }
  }

  // 销毁时清理
  destroy () {
    if (!this.isEditor) {
      this.removeHoverListeners()
    }
    super.destroy()
  }
}
