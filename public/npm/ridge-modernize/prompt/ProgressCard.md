ProgressCard (业务指标进度卡片)
用途：后台数据仪表盘、呼叫中心、业务报表，展示标题、涨跌箭头、年/月/日多维度指标、操作按钮与条纹动画进度条。上涨自动展示绿色上箭头，下跌自动展示红色下箭头。
组件路径 (Path): ridge-modernize/ProgressCard
属性 (Props) 配置：
title: string，默认值"Outbound calls"。卡片顶部主标题文本。
trendType: string，默认值"down"。可选值 up / down；up=上涨绿色向上箭头，down=下跌红色向下箭头。
trendPercent: number，默认值18，最小值0。趋势变化百分比数值，组件自动拼接展示文本。
dataList: object数组，默认值[{"label":"Yearly","value":"80.40%"}, ..]。多维度统计数据，label为维度名称，value为展示数值。
progressValue: number，默认值60，取值0~100。进度条填充占比。
btnText: string，默认值"Learn More"。底部按钮展示文字。
事件 (Events)：
onBtnClick：点击底部操作按钮触发，回调无参数，内部自动执行e.preventDefault阻止链接跳转。