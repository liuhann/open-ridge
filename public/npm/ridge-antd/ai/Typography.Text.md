Typography.Text (文本)
用途：用于展示普通文本、加粗、斜体、删除线、代码、高亮标记等内容。
组件路径 (Path): ridge-antd/Typography.Text
属性 (Props) 配置：
children: string，默认值“文本内容”。必填，显示的文本内容。
type: string，默认值空。可选值：secondary（次要）, success（成功）, warning（警告）, danger（危险）。
strong: boolean，默认值false。是否加粗显示文本。
italic: boolean，默认值false。是否斜体显示文本。
delete: boolean，默认值false。是否添加删除线样式。
underline: boolean，默认值false。是否添加下划线样式。
code: boolean，默认值false。是否显示为代码样式。
mark: boolean，默认值false。是否高亮标记文本。
keyboard: boolean，默认值false。是否显示键盘样式。
disabled: boolean，默认值false。是否禁用文本。
ellipsis: boolean，默认值false。内容超出宽度时自动省略显示。
className: array，默认值[]。自定义CSS类名。
style: CSSProperties，默认值{}。自定义内联样式。
width: number，默认值auto。组件宽度（拖拽配置）。
height: number，默认值auto。组件高度（拖拽配置）。
事件 (Events)：
onClick: 点击文本时触发。