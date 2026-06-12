ridge-highcharts
本库封装了Highchart的很多常用图表组件， 使用时无需额外引入highchart.js文件，当前库已包含


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


RaceBarChart (竞赛动态排名条形图)
用途：动态榜单排名条形图，根据传入日期渲染对应竞赛数据，内置数值动画与自动排序，日期切换逻辑交由外部组件实现，适用于赛事积分、选手排名、数据竞速等可视化场景。
组件路径 (Path): ridge-highcharts/RaceBarChart
属性 (Props) 配置：
data: object，默认值{}。竞赛核心数据源，格式{竞赛者名称:{日期:数值}}，示例：{"选手A":{"2020":1200,"2021":1500},"选手B":{"2020":900,"2021":1300}}。
currentDate: string，默认值""。当前展示日期，通过外部状态/组件控制切换。
maxShowCount: number，默认值20，最小值1。榜单最多展示的竞赛者数量。
title: string，默认值""。图表顶部主标题。
unit: string，默认值""。数据数值单位，鼠标悬浮提示自动追加。
height: number，默认值600，最小值200。图表画布高度，页面支持拖拽调整。
style: CSSProperties。组件根容器内联样式，支持标准CSS配置。
事件 (Events)：
无