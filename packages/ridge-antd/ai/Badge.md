Badge (徽标)
用途：用于展示消息通知数量、小红点提示、状态标记，常搭配图标、按钮、头像使用。
组件路径 (Path): ridge-antd/Badge
属性 (Props) 配置：
count: number，默认0。徽标显示的数字。
dot: boolean，默认false。是否开启小红点模式（不显示数字）。
status: string，默认空。状态点类型：success、processing、default、error、warning。
text: string，默认空。状态点右侧显示的文字。
color: string，默认空。自定义徽标背景颜色。
overflowCount: number，默认99。数字封顶值，超过显示 99+。
showZero: boolean，默认false。数值为0时是否显示徽标。
size: string，默认medium。徽标尺寸：medium、small。
事件：无