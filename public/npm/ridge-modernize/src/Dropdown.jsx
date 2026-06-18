import React, { useState, useRef, useEffect } from 'react'

const BsSplitDropdown = ({
  children,
  variant = 'primary',
  mode = 'solid',
  size = 'md',
  disabled = false,
  block = false,
  menuItems = [],
  className = '',
  style,
  onItemClick
}) => {
  const [open, setOpen] = useState(false)
  const wrapRef = useRef(null)

  // 点击外部区域关闭下拉
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (wrapRef.current && !wrapRef.current.contains(e.target)) {
        setOpen(false)
      }
    }
    document.addEventListener('click', handleClickOutside)
    return () => document.removeEventListener('click', handleClickOutside)
  }, [])

  // 生成按钮样式类
  const getBtnClass = () => {
    switch (mode) {
      case 'outline':
        return `btn-outline-${variant}`
      case 'subtle':
        return `bg-${variant}-subtle text-${variant}`
      default:
        return `btn-${variant}`
    }
  }
  const btnCls = getBtnClass()
  const sizeCls = size === 'sm' ? 'btn-sm' : size === 'lg' ? 'btn-lg' : ''

  // 切换下拉显隐
  const toggleDropdown = (e) => {
    e.stopPropagation()
    if (!disabled) setOpen(!open)
  }

  // 菜单项点击回调
  const handleMenuClick = (item, idx) => {
    if (item.disabled || disabled) return
    setOpen(false)
    onItemClick && onItemClick(item, idx)
  }

  return (
    <div
      ref={wrapRef}
      className={`btn-group position-relative ${block ? 'w-100' : ''} ${className}`}
      style={style}
    >
      {/* 左侧主按钮 */}
      <button
        type='button'
        className={`btn ${btnCls} ${sizeCls}`}
        disabled={disabled}
      >
        {children}
      </button>

      {/* 右侧拆分下拉箭头按钮 */}
      <button
        type='button'
        className={`btn ${btnCls} ${sizeCls} dropdown-toggle dropdown-toggle-split`}
        onClick={toggleDropdown}
        disabled={disabled}
        aria-haspopup='true'
        aria-expanded={open}
      >
        <span className='visually-hidden'>Toggle Dropdown</span>
      </button>

      {/* 下拉菜单：新增 top-100 start-0，菜单固定在按钮下方 */}
      <ul className={`dropdown-menu top-100 start-0 ${open ? 'd-block' : 'd-none'}`}>
        {menuItems.map((item, idx) => {
          if (item.divider) {
            return <li key={`div-${idx}`}><hr className='dropdown-divider' /></li>
          }
          return (
            <li key={idx}>
              <a
                className={`dropdown-item ${item.disabled || disabled ? 'disabled' : ''}`}
                href={item.href || 'javascript:void(0)'}
                onClick={(ev) => {
                  ev.preventDefault()
                  handleMenuClick(item, idx)
                }}
              >
                {item.label}
              </a>
            </li>
          )
        })}
      </ul>
    </div>
  )
}

export default BsSplitDropdown
