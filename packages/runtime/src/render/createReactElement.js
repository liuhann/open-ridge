/* eslint-disable no-undef */
// import React, { Component } from 'react'

/**
 * 根据组件生成一个React包装类， 以便插槽情况下React组件可以通过属性函数执行方式调用
 */
export default element => {
  return ({
    scope
  } = {}) => {
    class ReactElement extends React.Component {
      constructor (props) {
        super(props)
        this.scope = props.scope
        this.ref = React.createRef()
        this.ridgeElement = null
      }

      componentDidMount () {
        if (this.props.scope) {
          if (!this.ridgeElement) {
            this.ridgeElement = this.props.element.clone()
            this.ridgeElement.setScopedData(this.props.scope)
            this.ridgeElement.mount(this.ref.current)
          } else {
            this.ridgeElement.setScopedData(this.props.scope)
            this.ridgeElement.forceUpdate()
          }
        } else {
          this.ridgeElement = this.props.element
          this.ridgeElement.mount(this.ref.current)
        }
      }

      componentWillUnmount () {
        // this.ridgeElement.unmount()
      }

      render () {
        return <div ref={this.ref} style={{ width: '100%', height: '100%' }} />
      }
    }
    return <ReactElement element={element} scope={scope} />
  }
}
