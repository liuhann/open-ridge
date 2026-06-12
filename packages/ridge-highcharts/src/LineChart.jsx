import React, { useRef, useEffect } from 'react'
import Highcharts from 'highcharts'
import HighchartsReact from 'highcharts-react-official'

const HighchartsLineChart = (props) => {
  const {
    width,
    height,
    yAxisTitle = '',
    series = []
  } = props

  // 基础图表配置
  const chartConfig = {
    chart: {
      width,
      height
    },
    title: {
      text: '',
      align: 'left'
    },
    subtitle: {
      text: '',
      align: 'left'
    },
    yAxis: {
      title: {
        text: yAxisTitle
      }
    },
    xAxis: {
      accessibility: {
      }
    },
    legend: {
      layout: 'vertical',
      align: 'right',
      verticalAlign: 'middle'
    },
    plotOptions: {
      series: {
        label: {
          connectorAllowed: false
        }
      }
    },
    series
  }

  return <HighchartsReact highcharts={Highcharts} options={chartConfig} />
}

export default HighchartsLineChart
