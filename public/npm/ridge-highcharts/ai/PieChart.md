HighchartsPieChart (Highcharts饼图)
用途：基于Highcharts实现百分比饼图，支持区块选中突出、鼠标缩放、Shift键平移拖拽，适用于占比类数据可视化场景。
组件路径 (Path): ridge-highcharts/PieChart
属性 (Props) 配置：
filterPercent: number，默认值10。百分比阈值，区块占比大于该值才显示内层标签。
seriesName: string，默认值"Percentage"。数据系列名称，展示在悬浮提示中。
data: object，默认值为蛋黄成分占比数组。饼图数据源，每个项支持 name(名称)、y(数值)、sliced(是否突出)、selected(是否默认选中)。
事件 (Events)：
当前组件无对外暴露交互事件。