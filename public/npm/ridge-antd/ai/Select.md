Select (选择器)
用途：下拉菜单选择器，用于代替原生选择框，支持单选、多选、标签、搜索、清除，广泛用于表单选择、筛选等场景。
组件路径 (Path): ridge-antd/Select
属性 (Props) 配置：
value: string | array，默认空。当前选中的值。
options: array，默认示例选项。下拉选项列表，格式 { label, value }。
placeholder: string，默认“请选择”。输入框提示文字。
allowClear: boolean，默认false。是否显示清除按钮。
showSearch: boolean，默认false。是否支持搜索过滤选项。
disabled: boolean，默认false。是否禁用组件。
size: string，默认medium。组件大小：large、medium、small。
variant: string，默认outlined。样式形态：outlined、borderless、filled、underlined。
status: string，默认空。校验状态：error、warning。
事件 (Events)：
onChange: 选中选项或值发生变化时触发，返回最新值和选项。