import React from 'react'

const Switch = ({
  checked = false,
  label = '开关',
  variant = 'primary',
  disabled = false,
  className = '',
  style,
  onChange
}) => {
  const inputId = `switch-${Math.random().toString(36).slice(2)}`
  const wrapCls = `form-check form-switch ${className}`
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

export default Switch
