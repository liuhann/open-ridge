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