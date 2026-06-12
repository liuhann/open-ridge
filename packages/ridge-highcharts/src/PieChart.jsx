import React from 'react'
import Highcharts from 'highcharts'
import HighchartsReact from 'highcharts-react-official'

const PieChart = (props) => {
  const {
    title = '',
    subtitle = '',
    tooltipSuffix = '%',
    panKey = 'shift',
    zoomEnabled = true,
    panEnabled = true,
    allowPointSelect = true,
    cursor = 'pointer',
    dataLabelOuterDistance = 20,
    dataLabelInnerDistance = -40,
    filterPercent = 10,
    seriesName = 'Percentage',
    colorByPoint = true,
    data = [],
    chartWidth = null,
    chartHeight = null
  } = props

  const chartOptions = {
    chart: {
      type: 'pie',
      width: chartWidth,
      height: chartHeight,
      zooming: {
        type: 'xy',
        enabled: zoomEnabled
      },
      panning: {
        enabled: panEnabled,
        type: 'xy'
      },
      panKey
    },
    title: {
      text: title
    },
    subtitle: {
      text: subtitle
    },
    tooltip: {
      valueSuffix: tooltipSuffix
    },
    plotOptions: {
      pie: {
        allowPointSelect,
        cursor,
        dataLabels: [
          {
            enabled: true,
            distance: dataLabelOuterDistance
          },
          {
            enabled: true,
            distance: dataLabelInnerDistance,
            format: '{point.percentage:.1f}%',
            style: {
              fontSize: '1.2em',
              textOutline: 'none',
              opacity: 0.7
            },
            filter: {
              operator: '>',
              property: 'percentage',
              value: filterPercent
            }
          }
        ]
      }
    },
    series: [
      {
        name: seriesName,
        colorByPoint,
        data
      }
    ]
  }

  return <HighchartsReact highcharts={Highcharts} options={chartOptions} />
}

export default PieChart
