StringTextList (文字列表)
用途：接收纯字符串数组渲染文本列表，支持展示数字序号、单项点击选中高亮，兼容 Ant Design List 原生基础配置，用于数据文本展示、单选选择场景。
组件路径 (Path): ridge-antd/StringTextList
属性 (Props) 配置：
dataSource: object，默认值 ["示例文本 1", "示例文本 2", "示例文本 3"]。列表数据源，必须为纯字符串数组。
showIndex: boolean，默认值 false。是否在每条文本前展示数字序号（1、2、3...）。
selectedIndex: number，默认值 -1，最小值 -1。当前选中条目下标，-1 代表无选中项，用于双向绑定选中状态。
事件 (Events)：
onSelect: 点击列表条目选中时触发，回调参数 (index: number, text: string)，index 为选中下标，text 为当前选中文本。