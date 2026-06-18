import React from 'react'

const CheckBox = ({
  checked = false,
  label = '选项',
  variant = 'primary',
  inline = true,
  disabled = false,
  className = '',
  style,
  onChange
}) => {
  // 唯一ID，关联input与label
  const inputId = `checkbox-${Math.random().toString(36).slice(2)}`
  // 拼接样式类
  const wrapCls = `form-check ${inline ? 'form-check-inline' : ''} ${className}`
  const inputCls = `form-check-input ${variant}`

  const handleChange = (e) => {
    onChange && onChange(e.target.checked, e)
  }

  return (
    <div className={wrapCls} style={style}>
      <input
        type='checkbox'
        id={inputId}
        className={inputCls}
        checked={checked}
        disabled={disabled}
        onChange={handleChange}
      />
      <label className='form-check-label' htmlFor={inputId}>
        {label}
      </label>
    </div>
  )
}

export default CheckBox
