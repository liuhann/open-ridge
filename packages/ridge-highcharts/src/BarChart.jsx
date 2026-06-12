import React from 'react'
import Highcharts from 'highcharts'
import HighchartsReact from 'highcharts-react-official'

/**
 * Highcharts 条形图组件
 * @param {string} title 图表主标题
 * @param {string} subtitle 图表副标题
 * @param {string[]} xCategories X轴分类数组
 * @param {string} yAxisTitle Y轴标题
 * @param {string} valueSuffix 悬浮提示数值后缀
 * @param {Array} series 数据系列
 * @param {number} height 图表高度
 * @param {boolean} legendEnabled 是否显示图例
 * @param {boolean} dataLabelsEnabled 是否显示数据标签
 * @param {string} className 自定义样式类名
 * @param {object} style 内联样式
 */
const BarChart = ({
  title = '',
  subtitle = '',
  xCategories = [],
  yAxisTitle = '',
  valueSuffix = '',
  series = [],
  height = 400,
  legendEnabled = true,
  dataLabelsEnabled = true,
  className = [],
  style = {}
}) => {
  const options = {
    chart: {
      type: 'bar',
      height
    },
    title: {
      text: title
    },
    subtitle: {
      text: subtitle
    },
    xAxis: {
      categories: xCategories,
      title: {
        text: null
      },
      gridLineWidth: 1,
      lineWidth: 0
    },
    yAxis: {
      min: 0,
      title: {
        text: yAxisTitle,
        align: 'high'
      },
      labels: {
        overflow: 'justify'
      },
      gridLineWidth: 0
    },
    tooltip: {
      valueSuffix
    },
    plotOptions: {
      bar: {
        borderRadius: '50%',
        dataLabels: {
          enabled: dataLabelsEnabled
        },
        groupPadding: 0.1
      }
    },
    legend: legendEnabled
      ? {
          layout: 'vertical',
          align: 'right',
          verticalAlign: 'top',
          x: -40,
          y: 80,
          floating: true,
          borderWidth: 1,
          backgroundColor: 'var(--highcharts-background-color, #ffffff)',
          shadow: true
        }
      : { enabled: false },
    credits: {
      enabled: false
    },
    series
  }

  return (
    <div className={className.join(' ')} style={style}>
      <HighchartsReact highcharts={Highcharts} options={options} />
    </div>
  )
}

export default BarChart
