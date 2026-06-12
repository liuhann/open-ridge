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