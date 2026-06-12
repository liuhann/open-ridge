// ridge-highcharts/ThreeDDonutChart.jsx
import React from 'react'
import Highcharts from 'highcharts'
import HighchartsReact from 'highcharts-react-official'
// 引入3D模块
import 'highcharts/highcharts-3d'

const DonutChart3D = (props) => {
  const {
    title,
    subtitle,
    alpha = 45,
    innerSize = 100,
    depth = 45,
    seriesName = '',
    width,
    height,
    data = []
  } = props

  const chartOptions = {
    credits: { enabled: false },
    chart: {
      width,
      height,
      type: 'pie',
      options3d: {
        enabled: true,
        alpha
      }
    },
    title: { text: title },
    subtitle: { text: subtitle },
    plotOptions: {
      pie: {
        innerSize,
        depth
      }
    },
    series: [{
      name: seriesName,
      data
    }]
  }

  return <HighchartsReact highcharts={Highcharts} options={chartOptions} />
}

export default DonutChart3D
