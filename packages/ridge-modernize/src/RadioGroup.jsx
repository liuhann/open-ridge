import React from 'react'

const RadioGroup = ({
  dataSource = [],
  value = '',
  variant = 'primary',
  inline = true,
  disabled = false,
  name = 'radio-group',
  className = '',
  style,
  onChange
}) => {
  const handleItemChange = (itemVal) => {
    if (disabled) return
    onChange && onChange(itemVal)
  }

  return (
    <div className={className} style={style}>
      {dataSource.map((item, idx) => {
        const itemId = `radio-${name}-${idx}-${item.value}`
        const wrapCls = `form-check ${inline ? 'form-check-inline' : ''}`
        const inputCls = `form-check-input ${variant}`

        return (
          <div key={itemId} className={wrapCls}>
            <input
              type='radio'
              id={itemId}
              name={name}
              className={inputCls}
              value={item.value}
              checked={value === item.value}
              disabled={disabled}
              onChange={() => handleItemChange(item.value)}
            />
            <label className='form-check-label' htmlFor={itemId}>
              {item.label}
            </label>
          </div>
        )
      })}
    </div>
  )
}

export default RadioGroup
