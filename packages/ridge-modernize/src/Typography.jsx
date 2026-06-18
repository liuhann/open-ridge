import React from 'react'

const Typography = ({
  children = '文本内容',
  tag = 'p',
  textStyle = 'normal',
  lead = false,
  className = '',
  style
}) => {
  let rootClass = ''
  if (lead) rootClass += ' lead'
  rootClass += ` ${className}`

  // 根据单选textStyle 包裹对应标签
  let content = children
  switch (textStyle) {
    case 'mark':
      content = <mark>{content}</mark>
      break
    case 'del':
      content = <del>{content}</del>
      break
    case 's':
      content = <s>{content}</s>
      break
    case 'ins':
      content = <ins>{content}</ins>
      break
    case 'u':
      content = <u>{content}</u>
      break
    case 'small':
      content = <small>{content}</small>
      break
    case 'strong':
      content = <strong>{content}</strong>
      break
    case 'em':
      content = <em>{content}</em>
      break
    default:
      // normal 无任何修饰
      break
  }

  const Tag = tag
  return (
    <Tag className={rootClass.trim()} style={style}>
      {content}
    </Tag>
  )
}

export default Typography
