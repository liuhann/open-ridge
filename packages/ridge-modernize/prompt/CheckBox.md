CheckBox (复选框)
用途：表单多选组件，用于布尔选择、多选项勾选
组件路径 (Path): ridge-modernize/CheckBox
属性 (Props) 配置：
checked: boolean，默认false。true代表勾选，false未勾选。
label: string，复选框右侧展示文本。
disabled: boolean，为true时无法切换勾选状态。
事件 (Events)：
onChange: 勾选状态切换时触发，回调参数 (checked: boolean)