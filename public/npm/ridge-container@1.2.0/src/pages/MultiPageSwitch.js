import './style.css'

/**
 * 多页切换容器
 */
export default class MultiPageSwitch {
  constructor (props) {
    this.props = props
  }

  mount (el) {
    this.el = el
    this.containerEl = document.createElement('div')
    el.appendChild(this.containerEl)
    this.updateContainerStyle()
    this.renderUpdate()
  }

  update (props) {
    this.props = props
    this.renderUpdate()
    this.updateContainerStyle()
  }

  renderUpdate () {
    const { pages = [], currentPageId = '' } = this.props

    // 先处理新增页面
    for (const page of pages) {
      if (!page.id) continue
      const targetDiv = this.containerEl.querySelector(`div.sub-page[page="${page.id}"]`)

      if (!targetDiv) {
        this.appendPage(page)
      }
    }

    const subPageEls = this.containerEl.querySelectorAll('div.sub-page')

    // 切换子页面显隐条件
    for (const subEl of subPageEls) {
      const id = subEl.getAttribute('page')
      if (!pages.find(p => p.id === id)) {
        this.containerEl.removeChild(subEl)
      }
      if (currentPageId === id) {
        subEl.style.visibility = 'visible'
      } else {
        subEl.style.visibility = 'hidden'
      }
    }
  }

  appendPage (page) {
    const { __composite } = this.props
    const { packageName, pagePath, ...otherProps } = page

    if (!packageName || !pagePath) {
      console.warn('多页切换容器 页面项无效：', page)
      return
    }
    const div = document.createElement('div')
    div.setAttribute('page', page.id)
    div.className = 'sub-page'
    this.containerEl.appendChild(div)
    if (pagePath) {
      // 这里包名如果未明确定义，表示包就再初始包之中
      const compositeCreated = window.ridge.createComposite(packageName || __composite.packageName, pagePath, otherProps)

      if (compositeCreated) {
        compositeCreated.initialize().then(ok => {
          if (ok) {
            compositeCreated.mount(div)
          }
        })
      }
    }
  }

  updateContainerStyle () {
    const { classList } = this.props
    this.containerEl.className = 'm-page-container ' + classList.join(' ')
  }
}
