InputNumber (数字输入框)
用途：用于输入数字类型内容，支持手动输入、点击增减按钮、限制最大/最小值、控制小数精度。
组件路径 (Path): ridge-antd/InputNumber
属性 (Props) 配置：
value: number，默认空。当前输入的数字值。
precision: number，默认空。保留的小数位数。
disabled: boolean，默认false。是否禁用输入框。
status: string，默认空。校验状态：error、warning。
事件 (Events)：
onChange: 数字值发生变化时触发，返回最新数值。
onPressEnter: 按下回车键时触发。