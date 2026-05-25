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

Typography.Title（标题）
用途：用于页面标题、章节标题、卡片标题等场景，支持 6 级标题、可复制、省略、颜色样式、加粗等配置。
组件路径 (Path)：@douyinfe/semi-ui/Typography.Title
属性 (Props) 配置：
children: string，默认值“文本内容”。必填，标题显示的文本内容。
heading: number，默认值 1。可选值：1, 2, 3, 4, 5, 6。标题级别，对应 HTML 的 h1 到 h6。
copyable: boolean，默认值 false。是否允许点击复制文本。
delete: boolean，默认值 false。是否显示删除线。
disabled: boolean，默认值 false。是否置灰禁用。
ellipsis: boolean，默认值 false。是否开启内容超长自动省略。
link: boolean，默认值 false。是否显示为链接样式。
mark: boolean，默认值 false。是否高亮标记文本。
type: string，默认值 primary。可选值：primary, secondary, tertiary, quaternary, warning, danger, success。标题颜色类型。
underline: boolean，默认值 false。是否显示下划线。
weight: string，默认值 default。可选值：light, regular, medium, semibold, bold, default。字体粗细（字重）。
事件 (Events)：
无


Typography.Numeral（数字格式化）
路径：@douyinfe/semi-ui/Typography.Numeral
用途：用于数字展示与格式化，支持普通数字、百分比、字节、科学计数法等，可控制精度与取整方式。
属性：
children: string，默认 "123456"，显示的数字内容
rule: string，默认 text，可选 text / numbers / bytes-decimal / bytes-binary / percentages / exponential，格式化规则
precision: number，默认 0，小数位数
truncate: string，默认 round，可选 round / ceil / floor，取整方式
code: boolean，默认 false，代码样式
copyable: boolean，默认 false，可复制
delete: boolean，默认 false，删除线
disabled: boolean，默认 false，禁用置灰
ellipsis: boolean，默认 false，超长省略
link: boolean，默认 false，链接样式
mark: boolean，默认 false，高亮标记
size: string，默认 normal，可选 normal / small
strong: boolean，默认 false，加粗
type: string，默认 primary，可选 primary / secondary / tertiary / quaternary / warning / danger / success
underline: boolean，默认 false，下划线
事件：无



Typography.Avatar（头像）
路径：@douyinfe/semi-ui/Avatar
用途：展示用户头像，支持图片、文字与图标，常用于用户中心、评论区与列表。
属性：
children: string，默认 "刘"，无图时显示的文字
src: image，默认 ""，图片地址
alt: string，默认 ""，图片替代文本
shape: string，默认 circle，可选 circle / square
size: string，默认 medium，可选 extra-extra-small / extra-small / small / default / medium / large / extra-large
color: string，默认 grey，仅文字头像生效，可选 amber / blue / cyan / green / grey / indigo / light-blue / light-green / lime / orange / pink / purple / red / teal / violet / yellow
border: boolean，默认未定义，是否显示额外边框
contentMotion: boolean，默认 false，是否开启动效
事件：
onClick：点击回调
onError：图片加载失败
onMouseEnter：鼠标进入
onMouseLeave：鼠标离开


Typography.Card（卡片）
路径：@douyinfe/semi-ui/Card
用途：基础容器组件，用于信息分组、数据展示与操作聚合。
属性：
children: string，默认 ""，卡片主体内容
title: string，默认 ""，卡片标题
headerExtraContent: string，默认 ""，标题右侧附加内容
footer: string，默认 ""，卡片底部内容
bordered: boolean，默认 true，是否显示边框
loading: boolean，默认 false，是否显示加载占位
shadows: string，默认 ""，可选 hover / always，控制阴影显示时机
事件：无


Typography.DatePicker（日期选择器）
路径：@douyinfe/semi-ui/DatePicker
用途：用于选择日期、日期时间和月份，适用于表单与时间筛选场景。
属性：
type: string，默认 date，可选 date / dateTime / month，选择器类型
disabled: boolean，默认 false，是否禁用
size: string，默认 default，可选 small / default / large
placeholder: string，默认 "选择日期"，输入框提示文字
format: string，默认 "YYYY-MM-DD"，日期显示格式
showClear: boolean，默认 true，是否显示清除按钮
validateStatus: string，默认 default，可选 default / error / warning
weekStartsOn: number，默认 1，周起始日（0 周日，1 周一）
className: string，自定义类名
style: object，内联样式
事件：
onChange：值变化时触发
onOpenChange：面板展开或收起时触发
onClear：点击清除按钮时触发


Typography.Descriptions（描述列表）
路径：@douyinfe/semi-ui/Descriptions
用途：用于展示详情信息，如表单结果、基础资料、对象属性，支持垂直与水平布局。
属性：
data: array，默认 []，描述项数据源，每项包含 key、value、span
layout: string，默认 vertical，可选 vertical / horizontal，布局模式
align: string，默认 center，可选 center / justify / left / plain，对齐方式
row: boolean，默认 false，是否双行显示（label 在上，value 在下）
column: number，默认 3，每行显示列数
size: string，默认 medium，可选 small / medium / large，双行模式下的尺寸
className: string，自定义 CSS 类名
style: object，内联样式
事件：无



Typography.ColorPicker（颜色选择器）
路径：@douyinfe/semi-ui/ColorPicker
用途：用于颜色选择，支持透明度调节与浮层展示，常用于表单与配置场景。
属性：
alpha: boolean，默认 true，是否开启透明度选择
eyeDropper: boolean，默认 true，是否启用吸色器
usePopover: boolean，默认 false，是否使用浮层展示
width: number，默认 280，组件宽度（hidden）
height: number，默认 280，组件高度（hidden）
className: array，自定义 CSS 类名
style: object，内联样式（hidden）
事件：
onChange：颜色变化时触发


Typography.Image（图片）
路径：@douyinfe/semi-ui/Image
用途：用于展示图片，支持地址配置、跨域设置、预览控制与加载状态反馈。
属性：
src: image，必填，图片资源地址
alt: string，默认 ""，图片描述文本
width: string，默认 "100%"，图片显示宽度（hidden）
height: string，默认 "100%"，图片显示高度（hidden）
className: string，默认 ""，组件外层自定义类名
imgCls: string，默认 ""，图片节点自定义类名
crossOrigin: string，默认 ""，可选 anonymous / use-credentials，图片跨域配置
preview: boolean，默认 true，是否开启预览
事件：
onClick：点击图片时触发
onLoad：图片加载成功时触发
onError：图片加载失败时触发


Typography.InputNumber（数字输入框）
路径：@douyinfe/semi-ui/InputNumber
用途：用于输入数字，支持精度、步长、极值限制及货币模式展示。
属性：
autofocus: boolean，默认 false，是否自动获取焦点
className: array，自定义 CSS 类名
currency: string，默认 "false"，是否开启货币模式或指定币种（如 CNY、USD）
currencyDisplay: string，默认 "symbol"，可选 symbol / code / name，货币展示方式
defaultValue: number，默认值
disabled: boolean，默认 false，是否禁用
hideButtons: boolean，默认 false，是否隐藏上下调整按钮
localeCode: string，货币地区代码（如 zh-CN）
max: number，最大值
min: number，最小值
precision: number，小数精度
showClear: boolean，默认 false，是否显示清除按钮
showCurrencySymbol: boolean，默认 true，是否显示货币符号
size: string，默认 "default"，可选 default / small / large
step: number，默认 1，调整步长
style: object，内联样式（hidden）
value: number，当前值
事件：
onBlur：失去焦点时触发
onChange：数值变化时触发
onFocus：获得焦点时触发
onNumberChange：纯数字值变化时触发


Typography.InputNumber（数字输入框）
路径：@douyinfe/semi-ui/InputNumber
用途：用于输入数字，支持精度、步长、极值限制及前后缀展示。
属性：
autofocus: boolean，默认 false，是否自动获取焦点
className: array，自定义 CSS 类名
defaultValue: number，默认值
disabled: boolean，默认 false，是否禁用
hideButtons: boolean，默认 false，是否隐藏上下调整按钮
max: number，最大值
min: number，最小值
precision: number，小数精度
prefix: string，默认 ""，输入框前缀文字
suffix: string，默认 ""，输入框后缀文字
showClear: boolean，默认 false，是否显示清除按钮
size: string，默认 "default"，可选 default / small / large
step: number，默认 1，调整步长
style: object，内联样式（hidden）
value: number，当前值
事件：
onBlur：失去焦点时触发
onChange：数值变化时触发
onFocus：获得焦点时触发
onNumberChange：纯数字值变化时触发


Typography.Paragraph（段落）
路径：@douyinfe/semi-ui/Typography.Paragraph
用途：用于展示多行段落文本，支持省略、复制、行距与样式修饰，适合详情描述与正文展示。
属性：
children: string，默认 "这是一段段落文本"，段落内容
copyable: boolean，默认 false，是否允许复制
delete: boolean，默认 false，是否显示删除线
disabled: boolean，默认 false，是否置灰禁用
ellipsis: boolean，默认 false，是否自动省略
link: boolean，默认 false，是否链接样式
mark: boolean，默认 false，是否高亮标记
size: string，默认 "normal"，可选 normal / small
spacing: string，默认 "normal"，可选 normal / extended，行距
strong: boolean，默认 false，是否加粗
type: string，默认 "primary"，可选 primary / secondary / tertiary / quaternary / warning / danger / success
underline: boolean，默认 false，是否显示下划线
事件：无



