import React, { Component } from 'react'

class SvgLoader extends Component {
  constructor (props) {
    super(props)
    this.state = {
      svgContent: null
    }
  }

  componentDidMount () {
    this.loadSvg(this.props.src)
  }

  componentDidUpdate (prevProps) {
    // 如果SVG的src地址发生变化，重新加载SVG
    if (prevProps.src !== this.props.src) {
      this.loadSvg(this.props.src)
    }
  }

  loadSvg = (src) => {
    fetch(src.replace(/\/+/g, '/'))
      .then(response => response.text())
      .then(svgString => {
        // 注意：在浏览器环境中，你可能需要使用原生的DOMParser
        // 但如果你正在Node环境中或者想要更好的兼容性，你可以使用'xmldom'
        const parser = new window.DOMParser()
        const svgDoc = parser.parseFromString(svgString, 'image/svg+xml')

        this.setState({ svgContent: svgString })
      })
      .catch(error => {
        console.error('Error fetching SVG:', error)
      })
  }

  render () {
    const { svgContent } = this.state
    const { width = 32, height = 32 } = this.props
    return (
      <div
        className='svg-container' style={{
          display: 'flex',
          justifyContent: 'center',
          width: width + 'px',
          height: height + 'px'
        }} dangerouslySetInnerHTML={{ __html: svgContent }}
      />
    )
  }
}

export default SvgLoader
