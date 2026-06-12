import React, { useRef, useEffect } from 'react'
import Highcharts from 'highcharts'
import HighchartsReact from 'highcharts-react-official'

const HighchartsLineChart = (props) => {
  const {
    yAxisTitle = '',
    series = [],
    responsiveMaxWidth = 500
  } = props

  // 基础图表配置
  const chartConfig = {
    chart: {
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
    series,
    responsive: {
      rules: [{
        condition: {
          maxWidth: responsiveMaxWidth
        },
        chartOptions: {
          legend: {
            layout: 'horizontal',
            align: 'center',
            verticalAlign: 'bottom'
          }
        }
      }]
    }
  }

  return <HighchartsReact highcharts={Highcharts} options={chartConfig} />
}

export default HighchartsLineChart
