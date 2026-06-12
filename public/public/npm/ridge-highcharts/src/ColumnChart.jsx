import React from 'react'
import Highcharts from 'highcharts'
import HighchartsReact from 'highcharts-react-official'

/**
 * 通用 Highcharts 柱状图组件
 * @param {string} title - 图表标题
 * @param {string} yAxisTitle - Y轴标题
 * @param {string} valueSuffix - 提示框数值后缀
 * @param {string[]} xCategories - X轴分类数组
 * @param {Array<{name: string, data: number[]}>} series - 系列数据
 * @param {number} height - 图表高度
 */
const ColumnChart = ({
  title = '',
  yAxisTitle = '',
  valueSuffix = '',
  xCategories = [],
  series = [],
  height = 400
}) => {
  const options = {
    chart: {
      type: 'column',
      height
    },
    title: {
      text: title
    },
    xAxis: {
      categories: xCategories,
      crosshair: true,
      accessibility: {
        description: 'Countries'
      }
    },
    yAxis: {
      min: 0,
      title: {
        text: yAxisTitle
      }
    },
    tooltip: {
      valueSuffix
    },
    plotOptions: {
      column: {
        pointPadding: 0.2,
        borderWidth: 0
      }
    },
    series
  }

  return (
    <HighchartsReact
      highcharts={Highcharts}
      options={options}
    />
  )
}

export default ColumnChart
