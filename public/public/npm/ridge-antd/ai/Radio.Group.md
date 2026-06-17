Radio.Group (单选框组)
用途：用于在一组互斥选项中只能选择一个的场景，如性别选择、状态选择、类型选择。
组件路径 (Path): ridge-antd/Radio.Group
属性 (Props) 配置：
value: string，默认空。当前选中项的值。
options: array，默认示例选项。选项列表，每一项包含 label、value、disabled。
optionType: string，默认default。选项样式：default(默认)、button(按钮)。
buttonStyle: string，默认outline。按钮风格：outline(描边)、solid(填充)。
orientation: string，默认horizontal。排列方向：horizontal(水平)、vertical(垂直)。
disabled: boolean，默认false。是否整组禁用。
size: string，默认medium。组件大小：large、medium、small。
事件 (Events)：
onChange: 切换选中选项时触发，返回最新选中值。