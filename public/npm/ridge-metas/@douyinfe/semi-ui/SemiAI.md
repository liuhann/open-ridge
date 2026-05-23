Typography.Text (文本)
用途：用于展示普通文字，支持样式修饰。
组件路径 (Path): @douyinfe/semi-ui/Typography.Text
属性 (Props) 配置：
children: string，默认值“文本内容”。必填，显示的文本。
size: string，默认值“normal”。可选值：normal, small, inherit。
type: string，默认值“primary”。可选值：primary, secondary, tertiary, quaternary, warning, danger, success。
strong: boolean，默认值false。是否加粗。
underline: boolean，默认值false。是否下划线。
delete: boolean，默认值false。是否删除线。
mark: boolean，默认值false。是否高亮标记。
code: boolean，默认值false。是否代码样式。
copyable: boolean，默认值false。是否允许复制。
disabled: boolean，默认值false。是否禁用（置灰）。
ellipsis: boolean，默认值false。是否自动省略。
link: boolean，默认值false。是否显示为链接样式。
weight: number，默认值400。字重，范围 100 - 900。
事件 (Events)： 无


Input (输入框)
用途：用于接收用户输入的文本，支持密码模式、尺寸调整、校验状态等。
组件路径 (Path): @douyinfe/semi-ui/Input
属性 (Props) 配置：
value: string，默认值“”。输入框内容（支持双向绑定）。
defaultValue: string，默认值“”。输入框默认内容。
type: string，默认值“text”。可选值：text（文本）, password（密码）。
mode: string，默认值“”。可选值：空（默认）, password（密码模式）。
size: string，默认值“default”。可选值：large（大）, default（默认）, small（小）。
disabled: boolean，默认值false。是否禁用。
borderless: boolean，默认值false。是否无边框。
showClear: boolean，默认值false。是否显示清除按钮。
validateStatus: string，默认值“default”。校验状态：default（默认）, error（错误）, warning（警告）。
placeholder: string，默认值“请输入”。输入框提示文字。
className: string，默认值“”。自定义CSS类名。
事件 (Events)：
onChange: 内容变化时触发。
onFocus: 获得焦点时触发。
onBlur: 失去焦点时触发。
onClear: 点击清除按钮时触发。
onEnterPress: 按下回车时触发。
onKeyDown: 按键按下时触发。
onKeyUp: 按键抬起时触发。


Button (按钮)
用途：用于页面点击操作、提交表单、确认取消等交互场景。
组件路径 (Path): @douyinfe/semi-ui/Button
属性 (Props) 配置：
children: string，默认值“按钮”。必填，按钮上显示的文字。
aria-label: string，默认值“”。无障碍辅助阅读标签。
block: boolean，默认值false。是否占满整行宽度。
disabled: boolean，默认值false。是否禁用按钮。
loading: boolean，默认值false。是否显示加载中状态（此时不可点击）。
size: string，默认值“default”。可选值：large（大）, default（默认）, small（小）。
theme: string，默认值“light”。显示风格：solid（实色背景）, borderless（无背景）, light（浅背景）, outline（边框样式）。
type: string，默认值“primary”。用途类型：primary（主要）, secondary（次要）, tertiary（三级）, warning（警告）, danger（危险）。
事件 (Events)：
onClick: 点击按钮时触发。
onMouseDown: 鼠标按下时触发。
onMouseEnter: 鼠标移入时触发。
onMouseLeave: 鼠标移出时触发。

Checkbox (复选框)
用途：用于多选场景，支持单独使用、组合使用、卡片样式及不确定状态。
组件路径 (Path): @douyinfe/semi-ui/Checkbox
属性 (Props) 配置：
children: string，默认值“切换选框”。复选框右侧的文本内容。
checked: boolean，默认值false。是否选中（支持双向绑定）。
disabled: boolean，默认值false。是否禁用。
indeterminate: boolean，默认值false。是否设为不确定状态（仅样式控制，常用于全选）。
type: string，默认值“default”。样式类型：default（默认）, card（卡片）, pureCard（纯卡片）。
extra: string，默认值“”。副文本提示。
aria-label: string，默认值“”。无障碍标签。
className: string。自定义CSS类名。
style: object。内联样式。
事件 (Events)：
onChange: 选中状态变化时触发。
Payload: target.checked(返回布尔值)。

