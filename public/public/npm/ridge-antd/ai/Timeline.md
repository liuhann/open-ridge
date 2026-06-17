Timeline (时间轴)
用途：用于按时间顺序展示事件、流程步骤、任务记录、日志信息，支持垂直/水平布局、交替展示、样式变体。
组件路径 (Path): ridge-antd/Timeline
属性 (Props) 配置：
items: array，时间轴列表，格式：[{ title: '标题/时间', content: '描述内容' }]
mode: string，默认start。内容位置：start(左侧)、alternate(交替)、end(右侧)
orientation: string，默认vertical。方向：vertical(垂直)、horizontal(水平)
variant: string，默认outlined。样式：outlined(描边)、filled(填充)
reverse: boolean，默认false。是否反向排序节点
titleSpan: number|string，默认12。标题占比宽度
事件：无