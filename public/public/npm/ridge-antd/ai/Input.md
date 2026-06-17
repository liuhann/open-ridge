Input (输入框)
用途：用于用户输入单行文本、密码、数字等内容，是最基础的表单输入组件。
组件路径 (Path): ridge-antd/Input
属性 (Props) 配置：
value: string，默认空。输入框内容。
placeholder: string，默认“请输入”。输入框提示文字。
allowClear: boolean，默认true。是否显示清除按钮。
showCount: boolean，默认false。是否显示字数统计。
disabled: boolean，默认false。是否禁用输入框。
size: string，默认medium。组件大小：large、medium、small。
variant: string，默认outlined。样式形态：outlined、borderless、filled、underlined。
status: string，默认空。校验状态：error、warning。
type: string，默认text。输入类型：text、password、number。
事件 (Events)：
onChange: 输入内容发生变化时触发。
onPressEnter: 按下回车键时触发。
onClear: 点击清除按钮时触发。