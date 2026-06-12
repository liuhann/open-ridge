BarChart (Highcharts条形图)
用途：横向条形图组件，适用于各类分类数据横向对比统计，支持主副标题、数据标签、图例、悬浮提示，可用于人口统计、业务报表、数据大屏等场景。
组件路径 (Path): ridge-highcharts/BarChart
属性 (Props) 配置：
title: string，默认值""。设置图表顶部主标题文本。
subtitle: string，默认值""。设置图表副标题，可填写来源、备注等内容。
xCategories: array，默认值[]。X轴分类名称数组，示例：["Africa","America","Asia","Europe"]。
yAxisTitle: string，默认值""。设置Y坐标轴标题，用于标注数据单位。
valueSuffix: string，默认值""。鼠标悬浮提示框内数值后缀，示例：" millions"。
series: array，默认值[]。图表数据系列，支持多组条形数据，示例：[{"name":"Year 1990","data":[632,727,3202,721]},{"name":"Year 2000","data":[814,841,3714,726]}]。
legendEnabled: boolean，默认值true。是否展示右侧悬浮图例。
dataLabelsEnabled: boolean，默认值true。是否在条形上显示数值标签。
style: CSSProperties。组件根容器内联样式，支持标准CSS样式配置。
事件 (Events)：
无