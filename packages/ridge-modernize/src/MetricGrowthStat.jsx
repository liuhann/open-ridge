import React from 'react'

const MetricGrowthStat = ({
  title = 'Total Revenue',
  value = '$8,240,00',
  growthPercent = '9.78',
  trendType = 'up',
  descText = 'Increased 15% from last month',
  style
}) => {
  const trendColorMap = {
    up: 'text-success',
    down: 'text-danger'
  }
  const trendCls = trendColorMap[trendType] || trendColorMap.up
  const trendPrefix = trendType === 'up' ? '+' : '-'

  return (
    <div className='mt-4 mb-4' style={style}>
      <span className='text-dark'>
        {title} <span className={trendCls}>{trendPrefix}{growthPercent}%</span>
      </span>
      <h2 className='mt-2 fw-bold'>{value}</h2>
      <span>{descText}</span>
    </div>
  )
}

export default MetricGrowthStat
