import React from 'react'

const Progress = ({
  percent = 0,
  variant = 'primary',
  height = 6,
  className = '',
  style
}) => {
  const barBgClass = `progress-bar text-bg-${variant}`
  const barStyle = {
    width: `${percent}%`,
    height: `${height}px`
  }

  return (
    <div className={`progress ${className}`} style={style}>
      <div
        className={barBgClass}
        style={barStyle}
        role='progressbar'
        aria-valuenow={percent}
        aria-valuemin={0}
        aria-valuemax={100}
      />
    </div>
  )
}

export default Progress
