const fetchSvgToDom = (svgUrl, container) => {
  // 使用fetch API获取SVG文件内容
  fetch(svgUrl)
    .then(response => response.text()) // 将响应转换为文本
    .then(svgString => {
      // 使用DOMParser将SVG字符串解析为DOM元素
      const parser = new window.DOMParser()
      const svgDoc = parser.parseFromString(svgString, 'image/svg+xml')

      // 清除容器内的任何现有内容
      container.innerHTML = ''

      // 将解析后的SVG DOM元素添加到HTML中
      container.appendChild(svgDoc.documentElement)
    })
    .catch(error => {
      console.error('Error fetching SVG:', error)
    })
}

export default fetchSvgToDom
