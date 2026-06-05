InputNumber (数字输入框)
用途：用于输入数字类型内容，支持手动输入、点击增减按钮、限制最大/最小值、控制小数精度。
组件路径 (Path): ridge-antd/InputNumber
属性 (Props) 配置：
value: number，默认空。当前输入的数字值。
placeholder: string，默认“请输入数字”。输入框提示文字。
min: number，默认0。允许输入的最小值。
max: number，默认99999。允许输入的最大值。
step: number，默认1。点击增减按钮时的变化步长。
precision: number，默认空。保留的小数位数。
controls: boolean，默认true。是否显示上下增减按钮。
disabled: boolean，默认false。是否禁用输入框。
readOnly: boolean，默认false。是否只读不可编辑。
size: string，默认medium。组件大小：large、medium、small。
variant: string，默认outlined。样式形态：outlined、borderless、filled、underlined。
status: string，默认空。校验状态：error、warning。
事件 (Events)：
onChange: 数字值发生变化时触发，返回最新数值。
onPressEnter: 按下回车键时触发。