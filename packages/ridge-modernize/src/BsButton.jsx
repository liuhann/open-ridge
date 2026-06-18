import React from 'react'
const BsButton = ({
  children,
  variant = 'primary', // primary / secondary / success / info / warning / danger / light / dark
  mode = 'solid', // solid 实心 | subtle 浅底色 | outline 描边
  size = 'md', // sm / md / lg
  disabled = false,
  block = false, // 宽度100%块级按钮
  type = 'button', // button / submit / reset
  onClick,
  className = '',
  ...restProps
}) => {
  // 拼接bootstrap class
  let btnClass = 'btn'

  // 尺寸
  if (size === 'sm') btnClass += ' btn-sm'
  if (size === 'lg') btnClass += ' btn-lg'

  // 三种样式模式区分
  if (mode === 'solid') {
    btnClass += ` btn-${variant}`
  } else if (mode === 'outline') {
    btnClass += ` btn-outline-${variant}`
  } else if (mode === 'subtle') {
    btnClass += ` bg-${variant}-subtle text-${variant}`
  }

  // 块级按钮
  if (block) btnClass += ' w-100'

  // 自定义外部class
  btnClass += ` ${className}`

  return (
    <button
      type={type}
      className={btnClass.trim()}
      disabled={disabled}
      onClick={onClick}
      {...restProps}
    >
      {children}
    </button>
  )
}

export default BsButton
