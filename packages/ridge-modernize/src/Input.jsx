import React from 'react'

const Input = ({
  value = '',
  placeholder = '',
  type = 'text',
  size = 'md',
  disabled = false,
  readOnly = false,
  plaintext = false,
  className = '',
  style,
  onChange,
  onFocus,
  onBlur
}) => {
  let inputClass = plaintext ? 'form-control-plaintext' : 'form-control'
  if (size === 'sm') inputClass += ' form-control-sm'
  if (size === 'lg') inputClass += ' form-control-lg'
  inputClass += ` ${className}`

  const handleChange = (e) => {
    onChange && onChange(e.target.value, e)
  }

  return (
    <input
      type={type}
      className={inputClass.trim()}
      value={value}
      placeholder={placeholder}
      disabled={disabled}
      readOnly={readOnly}
      style={style}
      onChange={handleChange}
      onFocus={onFocus}
      onBlur={onBlur}
    />
  )
}

export default Input
