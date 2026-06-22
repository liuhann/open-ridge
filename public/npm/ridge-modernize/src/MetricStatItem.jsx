import React from 'react'

const MetricStatItem = ({
  label = 'Selling Product',
  value = '$3,350,00',
  colorTheme = 'danger',
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
  const [dotBg, textColor] = themeMap[colorTheme]?.split(' ') || themeMap.danger.split(' ')

  return (
    <div className='p-4 py-3 py-md-4' style={style}>
      <p className={`fs-4 ${textColor} mb-0`}>
        <span className={textColor}>
          <span className={`round-8 ${dotBg} rounded-circle d-inline-block me-1`} />
        </span>
        {label}
      </p>
      <h3 className='mt-2 mb-0'>{value}</h3>
    </div>
  )
}

export default MetricStatItem
