import React from 'react'

const StatCard = ({
  bgType = 'primary',
  icon = 'ti-layout-grid',
  number = '450',
  label = 'New Products',
  style
}) => {
  // 支持的背景配色枚举
  const bgClassMap = {
    primary: 'bg-primary text-white',
    success: 'text-bg-success',
    warning: 'text-bg-warning',
    danger: 'text-bg-danger',
    info: 'text-bg-info',
    secondary: 'text-bg-secondary'
  }

  const cardBgClass = bgClassMap[bgType] || bgClassMap.primary

  return (
    <div className={`card rounded ${cardBgClass}`} style={style}>
      <div className='card-body p-4'>
        <span>
          <i className={`ti ${icon} fs-8`} />
        </span>
        <h3 className='card-title mt-3 mb-0 text-white'>{number}</h3>
        <p className='card-text text-white-50 fs-3 fw-normal'>
          {label}
        </p>
      </div>
    </div>
  )
}

export default StatCard
