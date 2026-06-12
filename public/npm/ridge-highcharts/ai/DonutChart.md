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