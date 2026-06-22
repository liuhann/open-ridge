import React from 'react'

const CallProgressCard = ({
  title = 'Outbound calls',
  trendType = 'down',
  trendPercent = 18,
  dataList = [
    { label: 'Yearly', value: '80.40%' },
    { label: 'Montly', value: '15.40%' },
    { label: 'Day', value: '5.50%' }
  ],
  progressValue = 60,
  progressTheme = 'primary',
  btnText = 'Learn More',
  btnLink = 'javascript:void(0)',
  onBtnClick,
  style
}) => {
  const barColorPool = {
    primary: 'text-bg-primary',
    success: 'text-bg-success',
    warning: 'text-bg-warning',
    danger: 'text-bg-danger',
    info: 'text-bg-info',
    secondary: 'text-bg-secondary'
  }

  const trendConfig = {
    up: {
      arrow: '↑',
      colorClass: 'text-success',
      text: `${trendPercent}%`
    },
    down: {
      arrow: '↓',
      colorClass: 'text-danger',
      text: `${trendPercent}%`
    }
  }
  const currentTrend = trendConfig[trendType] || trendConfig.down
  const barClass = barColorPool[progressTheme] || barColorPool.primary

  const handleClick = (e) => {
    if (typeof onBtnClick === 'function') {
      e.preventDefault()
      onBtnClick()
    }
  }

  return (
    <div className='card w-100 rounded-bottom-0' style={style}>
      <div className='card-body'>
        <div className='d-flex align-items-center'>
          <h4 className='card-title mb-0'>{title}</h4>
          <div className='ms-auto'>
            <span className={`fs-3 ${currentTrend.colorClass}`}>
              ( {currentTrend.arrow} {currentTrend.text} )
            </span>
          </div>
        </div>

        <div className='d-flex align-items-center my-3'>
          {dataList.map((item, index) => (
            <div
              key={index}
              className={`${index > 0 ? 'ms-3' : ''} ${index !== dataList.length - 1 ? 'border-end pe-3' : ''}`}
            >
              <h6 className='text-muted fw-normal'>{item.label}</h6>
              <b>{item.value}</b>
            </div>
          ))}
        </div>

        <a
          href={btnLink}
          className={`btn bg-${progressTheme}}-subtle text-${progressTheme}`}
          onClick={handleClick}
        >
          {btnText}
        </a>
      </div>

      <div className='progress text-bg-light'>
        <div
          className={`progress-bar progress-bar-striped ${barClass} progress-bar-animated`}
          style={{ width: `${progressValue}%`, height: '6px' }}
          role='progressbar'
        >
          <span className='sr-only'>{progressValue}% Complete</span>
        </div>
      </div>
    </div>
  )
}

export default CallProgressCard
