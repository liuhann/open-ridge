LineChart (Highcharts折线图表)
用途：基于Highcharts实现多系列折线数据可视化图表，自带响应式布局，适用于趋势数据、多分类数据对比展示。
组件路径 (Path): ridge-highcharts/LineChart
属性 (Props) 配置：
yAxisTitle: string Y坐标轴的展示文本。
series: object，图表核心数据系列，每个对象包含name(系列名称)、data(折线数据数组)，数组内null表示空白数据点。例如 [{ "name": "Installa", "data":[43934,]}...]
事件 (Events)：
当前组件无对外暴露交互事件。