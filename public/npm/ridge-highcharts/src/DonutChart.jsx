// HighchartsDonutChart.jsx
import React from 'react'
import Highcharts from 'highcharts'
import HighchartsReact from 'highcharts-react-official'

const DonutChart = (props) => {
  const {
    totalText = '',
    innerSize = '75%',
    allowPointSelect = true,
    cursor = 'pointer',
    borderRadius = 8,
    outerLabelDistance = 20,
    innerLabelDistance = -15,
    showLeaderLines = true,
    seriesName = 'Registrations',
    colorByPoint = true,
    data = [],
    title = '',
    width,
    height,
    subtitle = '',
    style = {}
  } = props

  const chartOptions = {
    chart: {
      width,
      height,
      type: 'pie',
      custom: {},
      events: {
        render () {
          const chart = this
          const series = chart.series[0]
          let customLabel = chart.options.chart.custom.label

          if (!customLabel) {
            customLabel = chart.options.chart.custom.label = chart.renderer
              .label(totalText)
              .css({
                color: 'var(--highcharts-neutral-color-100, #000)',
                textAnchor: 'middle'
              })
              .add()
          }

          const x = series.center[0] + chart.plotLeft
          const y = series.center[1] + chart.plotTop - (customLabel.attr('height') / 2)
          customLabel.attr({ x, y })
          customLabel.css({
            fontSize: `${series.center[2] / 12}px`
          })
        }
      }
    },
    accessibility: {
      point: {
        valueSuffix: '%'
      }
    },
    title: { text: title },
    subtitle: { text: subtitle },
    tooltip: {
      pointFormat: '{series.name}: <b>{point.percentage:.0f}%</b>'
    },
    credits: {
      enabled: false
    },
    legend: { enabled: false },
    plotOptions: {
      series: {
        allowPointSelect,
        cursor,
        borderRadius,
        showInLegend: true,
        dataLabels: [
          {
            enabled: true,
            distance: outerLabelDistance,
            format: '{point.name}',
            connectorEnabled: showLeaderLines // 引出线开关
          },
          {
            enabled: true,
            distance: innerLabelDistance,
            format: '{point.percentage:.0f}%',
            style: { fontSize: '0.9em' }
          }
        ]
      }
    },
    series: [
      {
        name: seriesName,
        colorByPoint,
        innerSize,
        data
      }
    ]
  }

  return <HighchartsReact highcharts={Highcharts} options={chartOptions} />
}

export default DonutChart
