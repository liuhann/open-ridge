ColumnChart (Highcharts 柱状图)
用途：用于数据可视化场景，支持多组数据对比展示，自带坐标轴、悬浮提示、交叉光标等交互，适用于报表、统计面板、数据大屏等页面。
组件路径 (Path): ridge-highcharts/ColumnChart
属性 (Props) 配置：
title: string，默认值 ""。设置图表顶部展示的标题文本。
yAxisTitle: string，默认值 ""。设置 Y 坐标轴标题文本，用于标注数据含义或单位。
valueSuffix: string，默认值 ""。鼠标悬浮提示框内数值尾部追加的单位后缀。
xCategories: array，默认值 []。X 轴分类名称数组，控制横轴展示内容，示例：["USA","China","Brazil","EU","Argentina","India"]。
series: array，默认值 []。图表核心数据系列，支持多组柱状数据，示例：[{"name":"Corn","data":[387749,280000,129000,64300,54000]},{"name":"Wheat","data":[45321,140000,10000,140500,19500]}]。
height: number，默认值 400，最小值 100。图表画布高度，页面可拖拽调整。
className: array，默认值 []。为组件容器添加自定义 CSS 类名。
style: CSSProperties。组件根容器内联样式，支持标准 CSS 样式配置。
事件 (Events)：
无