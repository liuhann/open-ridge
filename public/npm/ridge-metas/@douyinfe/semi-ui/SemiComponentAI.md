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
checked: boolean，默认值false。是否选中（支持双向绑定 onChange）。
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


Typography.PinCode（验证码输入）
路径：@douyinfe/semi-ui/PinCode
用途：用于输入验证码，支持指定位数、尺寸与输入格式限制，常用于登录与安全校验场景。
属性：
autoFocus: boolean，默认 true，是否自动聚焦到第一个输入框
className: array，自定义 CSS 类名
count: number，默认 6，可选范围 4–8，验证码位数
defaultValue: string，输入框默认值
disabled: boolean，默认 false，是否禁用
format: string，默认 "number"，可选 number / mixed，输入格式限制
size: string，默认 "default"，可选 large / default / small，输入框尺寸
style: object，内联样式（hidden）
value: string，当前输入值
事件：
onChange：输入内容变化时触发
onComplete：验证码全部输入完成时触发


Typography.Progress（进度条）
路径：@douyinfe/semi-ui/Progress
用途：用于展示任务进度，支持线形与环形两种样式，可自定义颜色、尺寸与方向。
属性：
percent: number，默认 20，进度百分比（0–100）
type: string，默认 "line"，可选 line / circle，进度条类型
direction: string，默认 "horizontal"，可选 horizontal / vertical，线形进度条排列方向
size: string，默认 "default"，可选 default / small / large，组件尺寸
showInfo: boolean，默认 false，是否显示进度文本
stroke: string，默认 "#1bcc76"，进度条填充颜色
orbitStroke: string，默认 "#eee"，轨道底色
strokeLinecap: string，默认 "round"，可选 round / square，环形进度条端点样式
strokeWidth: number，默认 4，环形进度条线条宽度
className: string，自定义 CSS 类名
style: object，内联样式
事件：无


Typography.RadioGroup（单选框组）
路径：@douyinfe/semi-ui/RadioGroup
用途：用于在一组选项中进行单选，支持按钮、卡片等多种样式与排列方式。
属性：
value: string，当前选中的值
disabled: boolean，默认 false，是否禁用整个单选组
type: string，默认 "default"，可选 default / button / card / pureCard，单选框样式类型
direction: string，默认 "horizontal"，可选 horizontal / vertical，排列方向（仅 default 类型生效）
buttonSize: string，默认 "middle"，可选 small / middle / large，按钮类型时的尺寸
options: array，默认 [{label:"Guest",value:"Guest"},{label:"Developer",value:"Developer"},{label:"Maintainer",value:"Maintainer",disabled:true}]，配置选项列表
className: array，自定义 CSS 类名
style: object，内联样式
事件：
onChange：选中值变化时触发


Typography.Rating（评分组件）
路径：@douyinfe/semi-ui/Rating
用途：用于评分与星级评价，支持半选、清除、提示信息与禁用状态。
属性：
value: number，默认 0，当前评分值
allowClear: boolean，默认 true，是否允许再次点击清除评分
allowHalf: boolean，默认 false，是否允许半星选择
count: number，默认 5，星级总数
defaultValue: number，默认 0，默认评分值
disabled: boolean，默认 false，是否禁用
size: string | number，默认 "default"，可选 "default" / "small"（hidden）
tooltips: array，默认 []，自定义星级提示信息
className: string，自定义 CSS 类名
style: object，内联样式
事件：
onBlur：失去焦点时触发
onChange：评分改变时触发
onFocus：获取焦点时触发
onHoverChange：鼠标悬停星级时触发
onKeyDown：按键按下时触发


Typography.Select（下拉选择器）
路径：@douyinfe/semi-ui/Select
用途：用于从选项列表中进行单选或多选，支持搜索、创建、清除与校验状态。
属性：
value: string，当前选中值
optionList: array，选项列表，每项包含 label、value、disabled 等
placeholder: string，默认 "请选择"，占位提示文字
disabled: boolean，默认 false，是否禁用
multiple: boolean，默认 false，是否开启多选
filter: boolean，默认 false，是否开启搜索筛选
allowCreate: boolean，默认 false，是否允许创建新选项（需配合搜索）
showClear: boolean，默认 false，是否显示清除按钮
showArrow: boolean，默认 true，是否显示下拉箭头
autoFocus: boolean，默认 false，是否自动聚焦
defaultOpen: boolean，默认 false，是否默认展开下拉
size: string，默认 "default"，可选 default / small / large（hidden）
borderless: boolean，默认 false，是否无边框
maxTagCount: number，默认 3，多选时最多显示标签数
max: number，多选时最多可选数量
loading: boolean，默认 false，是否显示加载状态
position: string，默认 "bottomLeft"，可选 bottomLeft / bottomRight / topLeft / topRight，下拉位置
validateStatus: string，默认 "default"，可选 default / warning / error，校验状态
className: string，自定义 CSS 类名
style: object，内联样式
dropdownStyle: object，下拉弹层样式
事件：
onChange：选中值变化时触发
onSelect：选中选项时触发
onDeselect：取消选中时触发
onClear：点击清除时触发
onSearch：搜索内容变化时触发
onCreate：创建新选项时触发
onDropdownVisibleChange：下拉展开/收起时触发
onFocus：获取焦点时触发
onBlur：失去焦点时触发
onExceed：多选超出限制时触发


Typography.Slider（滑块）
路径：@douyinfe/semi-ui/Slider
用途：用于在数值区间内通过滑动方式选择数值，支持刻度、范围、禁用与垂直方向展示。
属性：
value: number，默认 20，当前选中值
min: number，默认 0，最小值
max: number，默认 100，最大值
step: number，默认 1，滑动步长
disabled: boolean，默认 false，是否禁用
vertical: boolean，默认 false，是否垂直方向展示
showBoundary: boolean，默认 false，hover 时是否显示最大/最小值
tooltipVisible: boolean，默认 false，是否始终显示数值提示
railStyle: object，滑块轨道样式
className: string，自定义 CSS 类名
style: object，内联样式
事件：
onChange：滑动值改变时触发
onAfterChange：滑动结束后触发
onMouseUp：鼠标松开滑块时触发


Typography.Spin（加载）
路径：@douyinfe/semi-ui/Spin
用途：用于页面或区域的加载状态提示，支持延迟显示与尺寸控制。
属性：
spinning: boolean，默认 true，是否处于加载中状态
size: string，默认 "middle"，可选 small / middle / large，组件大小
delay: number，默认 0，延迟显示加载效果的毫秒数
事件：
onClick：点击组件时触发


Typography.Switch（开关）
路径：@douyinfe/semi-ui/Switch
用途：用于状态切换，支持禁用、加载与尺寸控制。
属性：
checked: boolean，默认 false，是否选中
aria-label: string，默认 ""，无障碍标签
disabled: boolean，默认 false，是否禁用
loading: boolean，默认 false，是否加载中
size: string，默认 "default"，可选 large / default / small
事件：
onChange：状态变化时触发
onMouseEnter：鼠标移入时触发
onMouseLeave：鼠标移出时触发


Typography.Table（表格）
路径：@douyinfe/semi-ui/Table
用途：用于数据展示、排序、筛选、分页与行操作，支持树形数据与高性能渲染。
属性：
className: array，自定义 CSS 类名
style: object，内联样式
bordered: boolean，默认 false，是否显示边框
size: string，默认 "default"，可选 default / middle / small，表格尺寸
loading: boolean，默认 false，是否加载中
showHeader: boolean，默认 true，是否显示表头
pagination: boolean，默认 true，是否开启分页
columns: array，列配置，默认 [{title:"名称",dataIndex:"name"},{title:"大小",dataIndex:"size"},{title:"更新时间",dataIndex:"updateTime"}]
dataSource: array，表格数据，默认 [{key:"1",name:"设计文件",size:"2M",updateTime:"2020-02-02"},{key:"2",name:"AI语料文件",size:"13.2K",updateTime:"2026-02-02"}]
sticky: boolean，默认 false，是否固定表头
resizable: boolean，默认 false，是否允许拖拽列宽
事件：
onChange：分页、排序、筛选变化时触发
onExpand：行展开或收起时触发
onRow：点击表格行时触发


Typography.TagInput（标签输入框）
路径：@douyinfe/semi-ui/TagInput
用途：用于输入、添加、删除多个标签，支持拖拽排序、数量限制与校验状态。
属性：
value: array，默认 []，当前标签列表
inputValue: string，默认 ""，输入框实时内容
placeholder: string，默认 "请输入并按回车添加标签"，占位提示
disabled: boolean，默认 false，是否禁用
draggable: boolean，默认 false，是否支持拖拽排序
allowDuplicates: boolean，默认 true，是否允许重复标签
showClear: boolean，默认 false，是否显示清空按钮
max: number，最大允许添加的标签数量
maxLength: number，单个标签的最大输入长度
maxTagCount: number，页面最多显示的标签数
size: string，默认 "default"，可选 small / default / large（hidden）
validateStatus: string，默认 "default"，可选 default / warning / error，校验状态
className: string，自定义 CSS 类名
style: object，内联样式
事件：
onChange：标签列表变化时触发
onAdd：添加标签时触发
onRemove：删除标签时触发


Typography.Tag（标签）
路径：@douyinfe/semi-ui/Tag
用途：用于标记、分类与展示关键词，支持多种颜色、形状与样式类型。
属性：
children: string，默认 "标签"，标签显示文字
closable: boolean，默认 false，是否显示关闭按钮
color: string，默认 "grey"，可选 grey / blue / green / red / orange / purple / cyan / yellow，主题色
shape: string，默认 "square"，可选 square / circle，标签形状
size: string，默认 "small"，可选 small / large，标签尺寸
type: string，默认 "light"，可选 light / solid / ghost，样式类型
visible: boolean，默认 true，是否可见
width: number，组件宽度（hidden）
height: number，组件高度（hidden）
事件：
onClick：点击标签时触发
onClose：点击关闭按钮时触发


