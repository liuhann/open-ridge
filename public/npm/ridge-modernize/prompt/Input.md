Input (输入框)
用途：表单基础录入组件，支持全部HTML5原生输入类型，用于文本、密码、数字、邮箱、日期、颜色、搜索等录入场景，后台管理系统查询、新增编辑表单通用，基于Bootstrap form-control样式。
组件路径 (Path): ridge-modernize/Input
属性 (Props) 配置：
value: string，默认值空字符串。输入框绑定文本值，配合onChange双向绑定。
placeholder: string，默认值"请输入内容"。输入空白时显示提示文字。
type: string，默认text。完整HTML5输入类型可选：text/password/number/email/tel/url/date/datetime-local/month/week/time/color/search。
disabled: boolean，默认false。true时禁用输入，无法操作。
事件 (Events)：
onChange: 输入内容修改触发，回调参数 (value, event)。
