AutoComplete (自动完成)
用途：用于输入框内容自动提示、搜索补全、快速选择常用选项，广泛用于搜索框、表单输入场景。
组件路径 (Path): ridge-antd/AutoComplete
属性 (Props) 配置：
value: string，默认空。当前选中/输入的值。
placeholder: string，默认“请输入内容”。输入框提示文字。
allowClear: boolean，默认false。是否显示清除按钮。
disabled: boolean，默认false。是否禁用组件。
size: string，默认medium。组件大小：large、medium、small。
variant: string，默认outlined。样式形态：outlined、borderless、filled、underlined。
status: string，默认空。校验状态：error、warning。
options: array，默认示例选项。下拉选项列表，格式 { label, value }。
事件 (Events)：
onChange: 值变化时触发，返回当前输入/选中的 value。
onSelect: 选中下拉选项时触发，返回选中值和选项对象。