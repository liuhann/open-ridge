Switch (滑动开关)
用途：表单布尔开关组件，用于启用/关闭功能配置，基于Bootstrap form-switch彩色开关样式，后台设置类页面常用。
组件路径 (Path): ridge-modernize/Switch
属性 (Props) 配置：
checked: boolean，默认false。true为开启，false关闭，配合onChange双向绑定。
label: string，默认"开关"。开关右侧显示文本。
disabled: boolean，默认false。true禁用开关，不可点击切换。
事件 (Events)：
onChange: 切换开关状态触发，回调参数 (checked布尔值, 原生event)。