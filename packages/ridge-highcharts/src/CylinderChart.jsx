// ridge-highcharts/CylinderChart.jsx
import React from 'react'
import Highcharts from 'highcharts'
import HighchartsReact from 'highcharts-react-official'
// 引入3D、圆柱图必需模块
import 'highcharts/highcharts-3d'
import 'highcharts/modules/cylinder'

const CylinderChart = (props) => {
  const {
    title,
    subtitle,
    xAxisTitle,
    yAxisTitle,
    alpha = 15,
    beta = 15,
    depth = 50,
    viewDistance = 25,
    xCategories = [],
    width,
    height,
    data = [],
    seriesName = 'Cases'
  } = props

  const chartOptions = {
    credits: { enabled: false }, // 移除Highcharts版权水印
    chart: {
      width,
      height,
      type: 'cylinder',
      options3d: {
        enabled: true,
        alpha,
        beta,
        depth,
        viewDistance
      }
    },
    title: { text: title },
    subtitle: { text: subtitle },
    xAxis: {
      categories: xCategories,
      title: { text: xAxisTitle },
      labels: { skew3d: true }
    },
    yAxis: {
      title: { margin: 20, text: yAxisTitle },
      labels: { skew3d: true }
    },
    tooltip: {
      headerFormat: ''
    },
    plotOptions: {
      series: {
        depth: 25,
        colorByPoint: true
      }
    },
    series: [{
      name: seriesName,
      data,
      showInLegend: false
    }]
  }

  return <HighchartsReact highcharts={Highcharts} options={chartOptions} />
}

export default CylinderChart
