Input.TextArea (文本域)
用途：用于多行文本输入、备注、详情描述等场景，支持自适应高度、字数统计、清除功能。
组件路径 (Path): ridge-antd/Input.TextArea
属性 (Props) 配置：
value: string，默认空。输入框内容。
placeholder: string，默认“请输入内容”。提示文字。
allowClear: boolean，默认true。是否显示清除按钮。
showCount: boolean，默认false。是否显示字数统计。
maxLength: number，默认空。最大输入长度。
autoSize: boolean，默认false。是否自适应内容高度。
disabled: boolean，默认false。是否禁用。
size: string，默认medium。组件大小：large、medium、small。
variant: string，默认outlined。样式：outlined、borderless、filled、underlined。
status: string，默认空。校验状态：error、warning。
事件 (Events)：
onChange: 输入内容变化时触发。
onClear: 点击清除按钮时触发。