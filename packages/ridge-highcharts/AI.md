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


CylinderChart (3D圆柱柱状图)
用途：3D圆柱样式柱状图，适用于分类数据数值对比，支持灵活配置标题、坐标轴、3D视角与透视效果。
组件路径 (Path): ridge-highcharts/CylinderChart
属性 (Props) 配置：
data: object，默认值为病例统计数值数组。必填，柱状图对应数值集合。
xCategories: object，默认值为年龄分段数组。X轴分类文本，和数据按顺序一一对应。
xAxisTitle: string，无默认值。横坐标(X轴)展示标题。
yAxisTitle: string，无默认值。纵坐标(Y轴)展示标题。
alpha: number，默认值15。3D图表上下倾斜角度。
beta: number，默认值15。3D图表左右旋转角度。
depth: number，默认值50。3D图形纵深厚度。
viewDistance: number，默认值25。相机透视距离，数值越大透视越平缓。
事件 (Events)：
当前组件无对外暴露交互事件。


DonutChart (Highcharts环形图)
用途：环形饼图，用于占比数据展示，自带中心总计文本、数据标签引出线、区块圆角效果，支持点击选中区块。
组件路径 (Path): ridge-highcharts/DonutChart
属性 (Props) 配置：
data: object，默认值为车辆注册分类数据数组。必填，图表数据源，每项包含 name(分类名)、y(占比数值)。
showLeaderLines: boolean，默认值true。是否显示标签与图形之间的引出线。
totalText: string，默认值"Total<br/><strong>2 877 820</strong>"。环形中心展示的总计文本，支持HTML换行与标签。
innerSize: string，默认值"75%"。环形内圈宽度，使用百分比设置。
事件 (Events)：
当前组件无对外暴露交互事件。


ThreeDDonutChart (3D环形图)
用途：3D效果环形饼图，适用于占比类数据展示，支持调节3D倾角、内圈大小与图形纵深。
组件路径 (Path): ridge-highcharts/DonutChart3D
属性 (Props) 配置：
data: object，默认值为北京冬奥会金牌数据数组。必填，数据源为二维数组，格式 [名称, 数值]。
alpha: number，默认值45。3D图表上下倾斜角度。
innerSize: number，默认值100。环形内圈大小，单位像素。
depth: number，默认值45。3D图形纵深厚度，单位像素。
事件 (Events)：
当前组件无对外暴露交互事件。


LineChart (Highcharts折线图表)
用途：基于Highcharts实现多系列折线数据可视化图表，自带响应式布局，适用于趋势数据、多分类数据对比展示。
组件路径 (Path): ridge-highcharts/LineChart
属性 (Props) 配置：
yAxisTitle: string Y坐标轴的展示文本。
series: object，图表核心数据系列，每个对象包含name(系列名称)、data(折线数据数组)，数组内null表示空白数据点。例如 [{ "name": "Installa", "data":[43934,]}...]
事件 (Events)：
当前组件无对外暴露交互事件。


HighchartsPieChart (Highcharts饼图)
用途：基于Highcharts实现百分比饼图，支持区块选中突出、鼠标缩放、Shift键平移拖拽，适用于占比类数据可视化场景。
组件路径 (Path): ridge-highcharts/PieChart
属性 (Props) 配置：
filterPercent: number，默认值10。百分比阈值，区块占比大于该值才显示内层标签。
seriesName: string，默认值"Percentage"。数据系列名称，展示在悬浮提示中。
data: object，默认值为蛋黄成分占比数组。饼图数据源，每个项支持 name(名称)、y(数值)、sliced(是否突出)、selected(是否默认选中)。
事件 (Events)：
当前组件无对外暴露交互事件。


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