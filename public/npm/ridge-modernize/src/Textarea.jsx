import React from 'react'

const Textarea = ({
  value = '',
  placeholder = '请输入内容',
  rows = 3,
  fullHeight = false,
  disabled = false,
  readOnly = false,
  className = '',
  style,
  onChange,
  onFocus,
  onBlur
}) => {
  let inputClass = 'form-control'
  inputClass += ` ${className}`

  // 自动铺满父容器高度样式
  const mergeStyle = {
    ...style,
    ...(fullHeight ? { height: '100%' } : {})
  }

  const handleChange = (e) => {
    onChange && onChange(e.target.value, e)
  }

  return (
    <textarea
      className={inputClass.trim()}
      value={value}
      placeholder={placeholder}
      rows={fullHeight ? undefined : rows}
      disabled={disabled}
      readOnly={readOnly}
      style={mergeStyle}
      onChange={handleChange}
      onFocus={onFocus}
      onBlur={onBlur}
    />
  )
}

export default Textarea
