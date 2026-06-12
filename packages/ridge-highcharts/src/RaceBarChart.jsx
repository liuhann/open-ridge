import React, { useMemo } from 'react'
import Highcharts from 'highcharts'
import HighchartsReact from 'highcharts-react-official';

// 注册 Highcharts 数值文本动画逻辑
(function (H) {
  const FLOAT = /^-?\d+\.?\d*$/
  H.Fx.prototype.textSetter = function () {
    const chart = H.charts[this.elem.renderer.chartIndex]
    let thousandsSep = chart.numberFormatter('1000.0')[1]
    if (/[0-9]/.test(thousandsSep)) thousandsSep = ' '
    const replaceRegEx = new RegExp(thousandsSep, 'g')
    let startValue = (this.start || '').replace(replaceRegEx, '')
    let endValue = (this.end || '').replace(replaceRegEx, '')
    if (startValue.match(FLOAT)) {
      startValue = parseInt(startValue, 10)
      endValue = parseInt(endValue, 10)
      const currentValue = Math.round(startValue + (endValue - startValue) * this.pos)
      this.elem.attr(this.prop, chart.numberFormatter(currentValue, 0), null, true)
    }
    this.elem.endText = this.end
  }
  H.SVGElement.prototype.textGetter = function () {
    const ct = this.text.element.textContent || ''
    return this.endText ? this.endText : ct.substring(0, ct.length / 2)
  }
  H.wrap(H.Series.prototype, 'drawDataLabels', function (proceed) {
    const attr = H.SVGElement.prototype.attr
    const chart = this.chart
    if (chart.sequenceTimer) {
      this.points.forEach(point => {
        (point.dataLabels || []).forEach(label => {
          label.attr = function (hash) {
            if (hash && hash.text !== undefined && chart.isResizing === 0) {
              const text = hash.text
              delete hash.text
              return this.attr(hash).animate({ text })
            }
            return attr.apply(this, arguments)
          }
        })
      })
    }
    const ret = proceed.apply(this, Array.prototype.slice.call(arguments, 1))
    this.points.forEach(p => {
      (p.dataLabels || []).forEach(d => d.attr = attr)
    })
    return ret
  })
}(Highcharts))

/**
 * 竞赛排名动态条形图（精简版，无内置轮播，日期由外部控制）
 * @param {object} data 竞赛数据源 { 竞赛者 : { 日期1: 数值, 日期2: 数值 } }
 * @param {string} currentDate 当前展示日期
 * @param {number} maxShowCount 最大展示竞赛者数量
 * @param {string} title 图表主标题
 * @param {string} unit 数值单位
 * @param {number} height 图表高度
 * @param {string[]} className 自定义CSS类名
 * @param {object} style 组件内联样式
 */
const RaceBarChart = ({
  data = {},
  currentDate = '',
  maxShowCount = 20,
  title = '',
  unit = '',
  height = 600,
  className = [],
  style = {}
}) => {
  // 根据当前日期解析、排序数据
  const getChartData = useMemo(() => {
    if (!currentDate || !data) return []
    return Object.entries(data)
      .map(([name, item]) => [name, Number(item[currentDate] || 0)])
      .sort((a, b) => b[1] - a[1])
      .slice(0, maxShowCount)
  }, [data, currentDate, maxShowCount])

  const chartOptions = useMemo(() => {
    return {
      chart: {
        type: 'bar',
        height,
        animation: { duration: 500 }
      },
      title: {
        text: title,
        align: 'left'
      },
      subtitle: {
        text: `当前时间：${currentDate}`,
        useHTML: true,
        floating: true,
        align: 'right',
        verticalAlign: 'middle',
        y: -80,
        x: -100
      },
      legend: { enabled: false },
      xAxis: { type: 'category' },
      yAxis: {
        opposite: true,
        tickPixelInterval: 150,
        title: { text: null }
      },
      tooltip: { valueSuffix: unit },
      plotOptions: {
        series: {
          groupPadding: 0,
          pointPadding: 0.1,
          borderWidth: 0,
          colorByPoint: true,
          dataSorting: { enabled: true, matchByName: true },
          dataLabels: { enabled: true }
        }
      },
      series: [{
        name: currentDate,
        data: getChartData
      }],
      responsive: {
        rules: [{
          condition: { maxWidth: 550 },
          chartOptions: {
            xAxis: { visible: false }
          }
        }]
      }
    }
  }, [getChartData, currentDate, height, title, unit])

  return (
    <div className={className.join(' ')} style={style}>
      <HighchartsReact highcharts={Highcharts} options={chartOptions} />
    </div>
  )
}

export default RaceBarChart
