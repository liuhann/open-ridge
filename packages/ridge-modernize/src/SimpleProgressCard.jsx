import React from 'react'

const SimpleProgressCard = ({
  value = '86%',
  title = 'Total Product',
  icon = 'ti-box',
  progressPercent = 85,
  theme = 'success',
  style
}) => {
  const themeMap = {
    primary: 'text-bg-primary text-primary',
    success: 'text-bg-success text-success',
    warning: 'text-bg-warning text-warning',
    danger: 'text-bg-danger text-danger',
    info: 'text-bg-info text-info',
    secondary: 'text-bg-secondary text-secondary'
  }
  const barClass = themeMap[theme]?.split(' ')[0] || themeMap.success.split(' ')[0]
  const iconColorClass = themeMap[theme]?.split(' ')[1] || themeMap.success.split(' ')[1]

  return (
    <div className='card' style={style}>
      <div className='card-body'>
        <div className='d-flex align-items-center mb-3'>
          <div>
            <h3 className='fs-6'>{value}</h3>
            <p className='card-subtitle'>{title}</p>
          </div>
          <div className='ms-auto'>
            <span className={`${iconColorClass} display-6`}>
              <i className={`ti ${icon}`} />
            </span>
          </div>
        </div>
        <div className='progress text-bg-light'>
          <div
            className={`progress-bar ${barClass}`}
            role='progressbar'
            style={{ width: `${progressPercent}%`, height: '6px' }}
            aria-valuenow={progressPercent}
            aria-valuemin={0}
            aria-valuemax={100}
          />
        </div>
      </div>
    </div>
  )
}

export default SimpleProgressCard
