import React from 'react'

const Select = ({
  dataSource = [],
  value = '',
  placeholder = '请选择',
  size = 'md',
  disabled = false,
  className = '',
  style,
  onChange
}) => {
  let selectClass = 'form-select select2'
  if (size === 'sm') selectClass += ' form-select-sm'
  if (size === 'lg') selectClass += ' form-select-lg'
  selectClass += ` ${className}`

  const handleChange = (e) => {
    onChange && onChange(e.target.value, e)
  }

  return (
    <select
      className={selectClass.trim()}
      value={value}
      disabled={disabled}
      style={style}
      onChange={handleChange}
    >
      {/* 占位空选项 */}
      <option value='' disabled hidden>
        {placeholder}
      </option>
      {dataSource.map((item, idx) => (
        <option key={idx} value={item.value}>
          {item.label}
        </option>
      ))}
    </select>
  )
}
export default Select
