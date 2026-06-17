Slider (滑动输入条)
用途：用于通过滑动方式选择数值或数值范围，适用于音量调节、价格筛选、进度控制等场景。
组件路径 (Path): ridge-antd/Slider
属性 (Props) 配置：
value: number | array，默认0。当前选中值。
min: number，默认0。最小值。
max: number，默认100。最大值。
step: number，默认1。滑动步长。
range: boolean，默认false。是否开启双滑块范围选择。
disabled: boolean，默认false。是否禁用组件。
orientation: string，默认horizontal。排列方向：horizontal(水平)、vertical(垂直)。
事件 (Events)：
onChange: 滑动过程中实时触发，返回最新值。