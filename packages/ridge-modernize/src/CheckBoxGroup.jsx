import React from 'react'

const CheckBoxGroup = ({
  dataSource = [],
  value = [],
  variant = 'primary',
  inline = true,
  disabled = false,
  className = '',
  style,
  onChange
}) => {
  // 单项切换勾选
  const handleItemChange = (itemVal, isChecked) => {
    if (disabled) return
    let newValue
    if (isChecked) {
      // 选中：加入数组
      newValue = [...value, itemVal]
    } else {
      // 取消：移除当前值
      newValue = value.filter(v => v !== itemVal)
    }
    onChange && onChange(newValue)
  }

  return (
    <div className={className} style={style}>
      {dataSource.map((item, idx) => {
        const itemId = `cb-group-${idx}-${item.value}`
        const isItemChecked = value.includes(item.value)
        const wrapCls = `form-check ${inline ? 'form-check-inline' : ''}`
        const inputCls = `form-check-input ${variant}`

        return (
          <div key={itemId} className={wrapCls}>
            <input
              type='checkbox'
              id={itemId}
              className={inputCls}
              value={item.value}
              checked={isItemChecked}
              disabled={disabled}
              onChange={(e) => handleItemChange(item.value, e.target.checked)}
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

export default CheckBoxGroup
