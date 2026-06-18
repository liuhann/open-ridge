import React from 'react'

const ListGroup = ({
  dataSource = [],
  value = '',
  disabled = false,
  className = '',
  style,
  onChange
}) => {
  const handleClick = (itemVal) => {
    if (disabled) return
    onChange && onChange(itemVal)
  }

  return (
    <div className={`list-group ${className}`} style={style}>
      {dataSource.map((text, idx) => {
        const isActive = value === text
        let itemClass = 'list-group-item list-group-item-action'
        if (isActive) itemClass += ' active'

        return (
          <button
            key={idx}
            type='button'
            className={itemClass}
            disabled={disabled}
            aria-current={isActive ? 'true' : undefined}
            onClick={() => handleClick(text)}
          >
            {text}
          </button>
        )
      })}
    </div>
  )
}

export default ListGroup
