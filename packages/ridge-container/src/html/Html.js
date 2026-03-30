export default class HTML {
  constructor (props) {
    this.props = props
  }

  mount (el) {
    this.el = el
    this.render()
  }

  update (props) {
    this.props = props
    this.render()
  }

  render () {
    const {
      html,
      classNames = []
    } = this.props
    this.el.innerHTML = html ?? ''
    this.el.className = classNames.join(' ')
  }
}
