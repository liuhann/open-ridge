Alert (警告提示)
用途：用于页面中展示重要的提示信息，如成功通知、警告提示、错误信息、顶部公告栏。
组件路径 (Path): ridge-antd/Alert
属性 (Props) 配置：
title: string，提示的标题内容。
description: string，提示的辅助性描述文字。
type: string，默认info。样式类型：success(成功)、info(消息)、warning(警告)、error(错误)。
showIcon: boolean，默认false。是否显示左侧图标。banner模式下默认为true。
closable: boolean，默认false。是否显示关闭按钮。
事件：无


AutoComplete (自动完成)
用途：用于输入框内容自动提示、搜索补全、快速选择常用选项，广泛用于搜索框、表单输入场景。
组件路径 (Path): ridge-antd/AutoComplete
属性 (Props) 配置：
value: string，默认空。当前选中/输入的值。
placeholder: string，默认“请输入内容”。输入框提示文字。
allowClear: boolean，默认false。是否显示清除按钮。
disabled: boolean，默认false。是否禁用组件。
size: string，默认medium。组件大小：large、medium、small。
variant: string，默认outlined。样式形态：outlined、borderless、filled、underlined。
status: string，默认空。校验状态：error、warning。
options: array，默认示例选项。下拉选项列表，格式 { label, value }。
事件 (Events)：
onChange: 值变化时触发，返回当前输入/选中的 value。
onSelect: 选中下拉选项时触发，返回选中值和选项对象。


Avatar.Group (头像组)
用途：用于堆叠展示多个用户头像，支持图片链接、自定义文字+背景色两种格式，可统一控制大小、形状，自动折叠超出数量的头像。
组件路径 (Path): ridge-antd/AvatarGroup
属性 (Props) 配置：
srcList: array，默认示例数据。头像列表，仅支持两种格式：
  1. 图片URL字符串，例如 "xx.svg"
  2. 对象 {text: '字符', color: '背景色'}，例如 {text: 'K', color: '#f56a00'} color背景色可选填
max: number，默认4。最大显示头像数，超出自动折叠为 +N
size: string，默认medium。头像大小：small、medium、large
shape: string，默认circle。头像形状：circle(圆形)、square(方形)
事件：无


Avatar (头像)
用途：用于展示用户头像、图标、文字，支持图片、 fallback 文字、形状、大小控制。
组件路径 (Path): ridge-antd/Avatar
属性 (Props) 配置：
src: string，默认空。头像图片地址。
alt: string，默认空。图片加载失败时的替代文字。
shape: string，默认circle。头像形状：circle(圆形)、square(方形)。
size: string，默认medium。头像大小：small、medium、large。
事件 (Events)：
onError: 图片加载失败时触发，可处理错误回退。


Badge (徽标)
用途：用于展示消息通知数量、小红点提示、状态标记，常搭配图标、按钮、头像使用。
组件路径 (Path): ridge-antd/Badge
属性 (Props) 配置：
count: number，默认0。徽标显示的数字。
dot: boolean，默认false。是否开启小红点模式（不显示数字）。
status: string，默认空。状态点类型：success、processing、default、error、warning。
color: string，默认空。自定义徽标背景颜色。
overflowCount: number，默认99。数字封顶值，超过显示 99+。
showZero: boolean，默认false。数值为0时是否显示徽标。
size: string，默认medium。徽标尺寸：medium、small。
事件：无


Breadcrumb (面包屑)
用途：用于展示用户当前所在页面的层级路径，支持点击返回上级页面，常用于后台管理系统。
组件路径 (Path): ridge-antd/Breadcrumb
属性 (Props) 配置：
items: array，默认值为示例路径。配置面包屑路径项，每一项包含 label（显示名称）、href（跳转链接）。
事件 (Events)：
onClick: 点击任意面包屑项时触发，返回当前点击项完整对象 { label, href, index }。


Button (按钮)
用途：用于触发页面交互操作，支持多种样式、尺寸、形状与状态，满足不同场景点击需求。
组件路径 (Path): ridge-antd/Button
属性 (Props) 配置：
children: string，默认按钮。按钮展示文本。
type: string，默认default。按钮类型：default(默认)、primary(主要)、dashed(虚线)、link(链接)、text(文字)。
variant: string，默认空。按钮变体样式：outlined、dashed、solid、filled、text、link。
shape: string，默认default。按钮形状：default(默认)、circle(圆形)、round(圆角)。
size: string，默认medium。按钮尺寸：large(大)、medium(中)、small(小)。
disabled: boolean，默认false。是否禁用按钮。
ghost: boolean，默认false。是否开启透明背景幽灵样式。
block: boolean，默认false。是否宽度撑满父容器。
loading: boolean，默认false。是否显示加载状态。
danger: boolean，默认false。是否设为危险按钮样式。
事件：
onClick: 点击按钮时触发回调。


Calendar (日历)
用途：日历面板展示，支持日期查看、月份/年份切换、日期选择，用于日期展示、日期选择场景。
组件路径 (Path): ridge-antd/Calendar
属性 (Props) 配置：
value: string，默认空。当前选中的日期（受控值）。
mode: string，默认month。显示模式：month(月视图)、year(年视图)。
fullscreen: boolean, 默认false  是否大尺寸模式
showWeek: boolean，默认false。是否显示左侧周数。
事件：
onChange: 选中日期、日期值发生变化时触发。


Carousel (走马灯/轮播)
用途：用于banner、广告、图片、图文内容的轮播展示，支持自动播放、渐变/滚动动画、箭头切换、指示点。
组件路径：ridge-antd/Carousel
属性：
slides: 轮播内容数组，支持：
  - 纯图片：{ src: 'url' }
  - 纯文字：{ title: '文字' }
  - 图片+标题：{ src: 'url', title: '文字' }
effect: 动画效果 scrollx / fade
autoplay: 是否自动播放
autoplaySpeed: 播放间隔毫秒
dots: 是否显示指示点
arrows: 是否显示左右箭头
infinite: 无限循环
draggable: 拖拽切换
adaptiveHeight: 高度自适应
dotPlacement: 指示点位置 top/bottom/start/end
speed: 动画速度毫秒
事件：
afterChange: 切换完成后触发


Cascader (级联选择)
用途：用于省市区、分类目录等多层级数据选择，支持单选、多选、搜索、快速清除选择。
组件路径 (Path): ridge-antd/Cascader
属性 (Props) 配置：
value: array，默认[]。当前选中项的值。
options: array，必填。选项数据源，支持多层级 children 结构。
placeholder: string，默认“请选择”。输入框提示文字。
allowClear: boolean，默认true。是否显示清除按钮。
multiple: boolean，默认false。是否支持多选。
disabled: boolean，默认false。是否禁用组件。
size: string，默认medium。组件大小：large、medium、small。
variant: string，默认outlined。样式形态：outlined、borderless、filled、underlined。
status: string，默认空。校验状态：error、warning。
事件 (Events)：
onChange: 选择完成后触发，返回选中值 value 与选项列表 selectedOptions。


Checkbox.Group (多选框组)
用途：用于同时展示多个选项并支持多选，如兴趣选择、权限配置、多条件筛选等场景。
组件路径 (Path): ridge-antd/Checkbox.Group
属性 (Props) 配置：
value: array，默认[]。当前选中项的值。
options: array，默认示例选项。选项列表，每一项包含 label、value、disabled。
disabled: boolean，默认false。是否整组禁用。
事件 (Events)：
onChange: 选中项发生变化时触发，返回当前所有选中项的值数组。


Checkbox (复选框)
用途：用于单项勾选、开关切换、同意协议等场景，支持选中、半选、禁用状态。
组件路径 (Path): ridge-antd/Checkbox
属性 (Props) 配置：
children: string，默认值“切换选框”。必填，切换框内容
checked: boolean，默认false。当前是否选中。
disabled: boolean，默认false。是否禁用。
事件 (Events)：
onChange: 勾选或取消勾选时触发，返回最新的选中状态。


ColorPicker (颜色选择器)
用途：用于可视化选择颜色，支持单色/渐变模式、多种颜色格式、透明度调节、预设颜色，广泛用于样式配置、主题设置等场景。
组件路径 (Path): ridge-antd/ColorPicker
属性 (Props) 配置：
value: string，默认#1677ff。当前选中的颜色值。
mode: string，默认single。选择模式：single(单色)、gradient(渐变)。
allowClear: boolean，默认false。是否允许清除选择的颜色。
showText: boolean，默认false。是否显示颜色值文本。
disabled: boolean，默认false。是否禁用组件。
disabledAlpha: boolean，默认false。是否禁用透明度选择。
size: string，默认medium。组件大小：large、medium、small。
事件 (Events)：
onChange: 颜色值发生变化时触发。


DatePicker (日期选择器)
用途：用于选择日期、周、月、季度、年份，广泛用于表单、筛选、查询等时间选择场景。
组件路径 (Path): ridge-antd/DatePicker
属性 (Props) 配置：
value: string，默认空。当前选中的日期值。
picker: string，默认date。选择器类型：date(日期)、week(周)、month(月)、quarter(季度)、year(年)。
placeholder: string，默认“请选择”。输入框提示文字。
allowClear: boolean，默认true。是否显示清除按钮。
disabled: boolean，默认false。是否禁用组件。
size: string，默认medium。组件大小：large、medium、small。
variant: string，默认outlined。样式形态：outlined、borderless、filled、underlined。
status: string，默认空。校验状态：error、warning。
事件 (Events)：
onChange: 选择日期后触发，返回选中的日期数据。


Divider (分割线)
用途：用于页面中不同区域、模块、列表项之间的视觉分隔，可配置水平/垂直、实线/虚线/点线、带标题等样式。
组件路径 (Path): ridge-antd/Divider
属性 (Props) 配置：
children: string，默认值“”。分割线中间显示的标题内容。
variant: string，默认值“solid”。可选值：solid（实线）, dashed（虚线）, dotted（点线）。
titlePlacement: string，默认值“center”。可选值：start（居左）, center（居中）, end（居右）。
size: string，默认值空。可选值：small, medium, large。仅对水平分割线生效。
plain: boolean，默认值false。标题文字是否使用普通正文样式。
dashed: boolean，默认值false。是否显示为虚线（兼容属性）。
事件 (Events)：
无


Dropdown (下拉菜单)
用途：按钮触发弹出下拉选项，用于展示操作菜单、设置项、快捷操作。
组件路径 (Path): ridge-antd/Dropdown
属性 (Props) 配置：
buttonText: string，默认“下拉菜单”。按钮显示文字。
type: string，默认default。按钮类型：default, primary, dashed, text, link。
size: string，默认middle。按钮尺寸：large, middle, small。
arrow: boolean，默认false。是否显示下拉箭头。
placement: string，默认bottomLeft。弹出位置：bottomLeft, bottom, bottomRight, topLeft, top, topRight。
trigger: string，默认hover。触发方式：hover, click。
items: array，菜单配置项，包含 key、label、disabled、danger。
事件 (Events)：
onItemClick: 点击菜单项触发，返回当前项 { key, label, disabled... }。


Image (图片)
用途：用于展示单张图片，支持预览、加载占位、失败兜底图、宽高自适应，是页面中最常用的媒体展示组件。
组件路径 (Path): ridge-antd/Image
属性 (Props) 配置：
src: string，默认空。图片资源地址。
alt: string，默认空。图片描述，用于无障碍和SEO。
preview: boolean，默认true。是否开启点击放大预览。
placeholder: boolean，默认false。图片加载中是否显示占位效果。
事件：
onError: 图片加载失败、地址错误时触发回调。


Input.OTP (验证码输入框)
用途：用于短信验证码、邮箱验证码、两步验证等一次性密码输入，自动聚焦、自动切换输入格。
组件路径 (Path): ridge-antd/Input.OTP
属性 (Props) 配置：
value: string，默认空。验证码内容。
length: number，默认6。输入框位数。
size: string，默认medium。组件大小：small、medium、large。
variant: string，默认outlined。样式形态：outlined、borderless、filled、underlined。
disabled: boolean，默认false。是否禁用。
mask: boolean，默认false。是否开启掩码隐藏内容。
status: string，默认空。校验状态：error、warning。
事件 (Events)：
onChange: 输入内容改变时触发，返回完整验证码字符串。
onInput: 实时输入时触发，返回每一位输入的数组。


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


InputNumber (数字输入框)
用途：用于输入数字类型内容，支持手动输入、点击增减按钮、限制最大/最小值、控制小数精度。
组件路径 (Path): ridge-antd/InputNumber
属性 (Props) 配置：
value: number，默认空。当前输入的数字值。
placeholder: string，默认“请输入数字”。输入框提示文字。
min: number，默认0。允许输入的最小值。
max: number，默认99999。允许输入的最大值。
step: number，默认1。点击增减按钮时的变化步长。
precision: number，默认空。保留的小数位数。
controls: boolean，默认true。是否显示上下增减按钮。
disabled: boolean，默认false。是否禁用输入框。
readOnly: boolean，默认false。是否只读不可编辑。
size: string，默认medium。组件大小：large、medium、small。
variant: string，默认outlined。样式形态：outlined、borderless、filled、underlined。
status: string，默认空。校验状态：error、warning。
事件 (Events)：
onChange: 数字值发生变化时触发，返回最新数值。
onPressEnter: 按下回车键时触发。


Pagination (分页)
用途：用于长列表数据展示场景，提供页码切换、每页条数调整、快速跳转、数据总数展示等功能。
组件路径 (Path): ridge-antd/Pagination
属性 (Props) 配置：
total: number，默认值0。数据总数。
current: number，默认值1。当前页数。
defaultCurrent: number，默认值1。默认的当前页数。
pageSize: number，默认值10。每页条数。
defaultPageSize: number，默认值10。默认的每页条数。
align: string，默认值空。可选值：start（左对齐）、center（居中）、end（右对齐）。
size: string，默认值medium。可选值：large、medium、small。
pageSizeOptions: array，默认值[10,20,50,100]。指定每页可以显示多少条。
disabled: boolean，默认值false。禁用分页。
hideOnSinglePage: boolean，默认值false。只有一页时是否隐藏分页器。
showLessItems: boolean，默认值false。是否显示较少页面内容。
showQuickJumper: boolean，默认值false。是否可以快速跳转至某页。
showSizeChanger: boolean，默认值false。是否展示 pageSize 切换器。
simple: boolean，默认值false。简洁分页模式。
事件 (Events)：
onChange: 页码或 pageSize 改变时触发，返回 page 和 pageSize。


Progress (进度条)
用途：用于展示操作进度、加载状态、完成比例，支持线形、圆形、仪表盘三种展示样式，可自定义颜色、状态、尺寸。
组件路径 (Path): ridge-antd/Progress
属性 (Props) 配置：
type: string，默认line。类型：line(线形) | circle(圆形) | dashboard(仪表盘)
percent: number，默认50。进度百分比 0~100
status: string，状态：normal | success | exception | active
size: string，尺寸：small | medium
showInfo: boolean，默认true。是否显示百分比文字
strokeColor: string，进度条颜色
railColor: string，背景轨道颜色
strokeLinecap: string，线头样式：round | butt | square
strokeWidth: number，圆形/仪表盘进度条宽度
事件：无


QRCode (二维码)
用途：用于生成可扫描的二维码，支持链接、文本编码，可自定义颜色、大小、中间图标、状态，广泛用于登录、分享、信息展示场景。
组件路径 (Path): ridge-antd/QRCode
属性 (Props) 配置：
value: string，默认https://ant.design。二维码扫描内容（链接/文本）。
size: number，默认160。二维码整体尺寸。
icon: string，默认空。二维码中心图标地址。
iconSize: number，默认40。中心图标大小。
color: string，默认#000000。二维码前景色。
bgColor: string，默认transparent。二维码背景色。
bordered: boolean，默认true。是否显示边框。
marginSize: number，默认0。二维码留白边距。
errorLevel: string，默认M。纠错等级：L / M / Q / H。
status: string，默认active。状态：active / expired / loading / scanned。
事件：无


Radio.Group (单选框组)
用途：用于在一组互斥选项中只能选择一个的场景，如性别选择、状态选择、类型选择。
组件路径 (Path): ridge-antd/Radio.Group
属性 (Props) 配置：
value: string，默认空。当前选中项的值。
options: array，默认示例选项。选项列表，每一项包含 label、value、disabled。
optionType: string，默认default。选项样式：default(默认)、button(按钮)。
buttonStyle: string，默认outline。按钮风格：outline(描边)、solid(填充)。
orientation: string，默认horizontal。排列方向：horizontal(水平)、vertical(垂直)。
disabled: boolean，默认false。是否整组禁用。
size: string，默认medium。组件大小：large、medium、small。
事件 (Events)：
onChange: 切换选中选项时触发，返回最新选中值。


Rate (评分)
用途：用于展示和提交星级评价、满意度打分、商品评分等场景，支持全星/半星选择。
组件路径 (Path): ridge-antd/Rate
属性 (Props) 配置：
value: number，默认0。当前选中的评分。
count: number，默认5。星星总数。
allowHalf: boolean，默认false。是否允许选择半星。
allowClear: boolean，默认true。是否允许点击清除评分。
disabled: boolean，默认false。是否禁用交互（只读模式）。
size: string，默认medium。星星大小：small、medium、large。
事件 (Events)：
onChange: 选中评分时触发，返回当前分数。
onHoverChange: 鼠标悬停时触发，返回悬停分数。


Segmented (分段控制器)
用途：用于一组选项的快速切换，支持横向/纵向布局、自适应宽度、尺寸/形状配置，是页面内常用的切换筛选组件。
组件路径 (Path): ridge-antd/Segmented
属性 (Props) 配置：
options: array，默认示例数据。选项列表，支持两种格式：
  1. 字符串数组：["选项1","选项2"]
  2. 对象数组：[{ label:"显示文字", value:"提交值" }]
value: string | number，当前选中值（受控）
block: boolean，默认false。是否铺满父元素宽度
disabled: boolean，默认false。是否禁用整个控制器
orientation: string，默认horizontal。排列方向：horizontal(横向) / vertical(纵向)
size: string，默认medium。尺寸：large / medium / small
shape: string，默认default。形状：default(默认) / round(圆角)
事件：
onChange: 切换选中项时触发，返回当前选中的 value


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


Slider (滑动输入条)
用途：用于通过滑动方式选择数值或数值范围，适用于音量调节、价格筛选、进度控制等场景。
组件路径 (Path): ridge-antd/Slider
属性 (Props) 配置：
value: number | array，默认0。当前选中值。
min: number，默认0。最小值。
max: number，默认100。最大值。
step: number，默认1。滑动步长。
range: boolean，默认false。是否开启双滑块范围选择。
disabled: boolean，默认false。是否禁用组件。
orientation: string，默认horizontal。排列方向：horizontal(水平)、vertical(垂直)。
事件 (Events)：
onChange: 滑动过程中实时触发，返回最新值。


Spin (加载中)
用途：用于数据加载、页面等待、操作处理中的状态提示，支持普通加载、全屏加载、进度展示、描述文字。
组件路径 (Path): ridge-antd/Spin
属性 (Props) 配置：
spinning: boolean，默认true。是否处于加载中状态
size: string，默认medium。加载图标尺寸：small / medium / large
description: string，加载下方的描述文字，如“加载中...”
fullscreen: boolean，默认false。是否开启全屏遮罩加载
delay: number，延迟显示加载的时间（毫秒），防止快速闪烁
percent: number | 'auto'，显示加载进度
事件：无


Statistic (统计数值)
用途：用于展示关键数据、统计数值、卡片数字，支持标题、前后缀、千分位、小数点、精度格式化，适用于数据面板、首页统计、大屏展示。
组件路径 (Path): ridge-antd/Statistic
属性 (Props) 配置：
title: string，默认“统计数值”。数值标题。
value: string | number，默认12345。要展示的核心数值。
prefix: string，默认空。数值前缀，如“¥”“$”“¥”。
suffix: string，默认空。数值后缀，如“元”“%”“次”。
precision: number，默认空。保留小数位数。
groupSeparator: string，默认,。千分位分隔符。
decimalSeparator: string，默认.。小数点符号。
loading: boolean，默认false。是否显示加载状态。
事件：无
示例：
展示距离过年还有xx天， 设置title为“距离过年”，value为“xx” suffix为“天”
展示发电量xx度： 设置title为“发电量”， value为“xx” suffix为“度”


Steps (步骤条)
用途：用于展示多步骤流程进度，如表单填写、订单状态、任务办理等，支持切换步骤与状态展示。
组件路径 (Path): ridge-antd/Steps
属性 (Props) 配置：
items: array，默认包含3个示例步骤。配置步骤列表，每一项支持 title、content、status。
current: number，默认值0。当前激活步骤，从 0 开始计数。
initial: number，默认值0。步骤起始序号。
status: string，默认值process。步骤状态：wait(等待)、process(处理中)、finish(完成)、error(错误)。
orientation: string，默认值horizontal。步骤方向：horizontal(水平)、vertical(垂直)。
type: string，默认值default。类型：default、dot、inline、navigation、panel。
variant: string，默认值filled。样式：filled(填充)、outlined(描边)。
titlePlacement: string，默认值horizontal。标题位置：horizontal(右侧)、vertical(下方)。
size: string，默认值medium。尺寸：medium(标准)、small(迷你)。
事件 (Events)：
onChange: 点击步骤切换时触发，返回当前步骤序号 current。


Switch (开关)
用途：用于状态的快速切换，如开启/关闭、启用/禁用等布尔型状态控制。
组件路径 (Path): ridge-antd/Switch
属性 (Props) 配置：
checked: boolean，默认false。当前开关状态。
disabled: boolean，默认false。是否禁用。
loading: boolean，默认false。是否加载中状态。
size: string，默认medium。开关大小：medium、small。
事件 (Events)：
onChange: 开关状态发生变化时触发。


Table (表格)
用途：用于结构化数据展示，通过配置表头和数据源即可快速渲染基础表格，支持边框、尺寸、分页、加载状态。
组件路径 (Path): ridge-antd/Table
属性 (Props) 配置：
columns: array，表头配置，格式：[{ title: '列标题', dataIndex: '字段名', key: '唯一键' }]
dataSource: array，表格数据源，数组对象格式
rowKey: string，默认id，数据唯一标识字段
bordered: boolean，默认false，是否显示表格边框
size: string，默认large，表格尺寸 large / medium / small
loading: boolean，默认false，是否显示加载状态
pagination: boolean|object，默认false，是否显示分页
showHeader: boolean，默认true，是否显示表头
事件：无


Tag (标签)
用途：用于标记、分类、状态、关键词展示，支持预设主题色、关闭按钮、链接、三种变体样式。
组件路径 (Path): ridge-antd/Tag
属性 (Props) 配置：
text: string，默认“标签”。标签显示的文字内容。
color: string，预设颜色：magenta、red、volcano、orange、gold、lime、green、cyan、blue、geekblue、purple。
variant: string，默认filled。标签样式：filled(填充)、solid(纯色)、outlined(描边)。
closeIcon: boolean，默认false。是否显示关闭按钮。
disabled: boolean，默认false。是否禁用标签。
事件：
onClose: 点击关闭按钮时触发回调。


TimePicker (时间选择器)
用途：用于选择具体的时、分、秒时间，广泛用于表单、筛选、预约等时间选择场景。
组件路径 (Path): ridge-antd/TimePicker
属性 (Props) 配置：
value: string，默认空。当前选中的时间值。
placeholder: string，默认“请选择时间”。输入框提示文字。
allowClear: boolean，默认true。是否显示清除按钮。
format: string，默认HH:mm:ss。时间显示格式。
use12Hours: boolean，默认false。是否使用12小时制（AM/PM）。
disabled: boolean，默认false。是否禁用组件。
size: string，默认medium。组件大小：large、medium、small。
variant: string，默认outlined。样式形态：outlined、borderless、filled、underlined。
status: string，默认空。校验状态：error、warning。
事件 (Events)：
onChange: 选择时间后触发，返回最新时间数据。


Timeline (时间轴)
用途：用于按时间顺序展示事件、流程步骤、任务记录、日志信息，支持垂直/水平布局、交替展示、样式变体。
组件路径 (Path): ridge-antd/Timeline
属性 (Props) 配置：
items: array，时间轴列表，格式：[{ title: '标题/时间', content: '描述内容' }]
mode: string，默认start。内容位置：start(左侧)、alternate(交替)、end(右侧)
orientation: string，默认vertical。方向：vertical(垂直)、horizontal(水平)
variant: string，默认outlined。样式：outlined(描边)、filled(填充)
reverse: boolean，默认false。是否反向排序节点
titleSpan: number|string，默认12。标题占比宽度
事件：无


TreeSelect (树选择)
用途：用于选择层级结构数据（如部门、分类、地区），支持树形下拉、单选/多选、搜索、复选框展示。
组件路径 (Path): ridge-antd/TreeSelect
属性 (Props) 配置：
value: string | array，默认空。当前选中值。
treeData: array，默认示例数据。树形结构数据源，包含 value、label、children。
placeholder: string，默认“请选择”。选择框提示文字。
allowClear: boolean，默认false。是否允许清除选择。
showSearch: boolean，默认false。是否支持搜索过滤。
treeCheckable: boolean，默认false。是否显示节点复选框。
treeDefaultExpandAll: boolean，默认false。是否默认展开全部树节点。
disabled: boolean，默认false。是否禁用组件。
size: string，默认medium。组件大小：large、medium、small。
variant: string，默认outlined。样式形态：outlined、borderless、filled、underlined。
status: string，默认空。校验状态：error、warning。
事件 (Events)：
onChange: 选中节点、值发生变化时触发。


Typography.Paragraph (段落文本)
用途：用于大段正文文案排版，支持多行省略、文本高亮、可复制、在线编辑等常用文本能力。
组件路径 (Path): ridge-antd/Typography.Paragraph
属性 (Props) 配置：
children: string，默认值“段落正文内容”。必填，段落展示文字。
type: string，默认值空。可选值：secondary（次要）, success（成功）, warning（警告）, danger（危险）。
strong: boolean，默认值false。是否加粗文字。
italic: boolean，默认值false。是否斜体文字。
delete: boolean，默认值false。是否添加删除线。
underline: boolean，默认值false。是否添加下划线。
code: boolean，默认值false。启用代码样式。
mark: boolean，默认值false。文字高亮底色标记。
disabled: boolean，默认值false。禁用文本。
copyable: boolean，默认值false。开启文本一键复制。
editable: boolean，默认值false。双击修改文本内容。
ellipsis: boolean，默认值false。超长文字自动省略，支持展开查看全文。
width: number，默认值auto。组件宽度（画布拖拽调整）。
height: number，默认值auto。组件高度（画布拖拽调整）。
事件 (Events)：
onClick: 点击段落时触发回调。


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


Typography.Title (标题)
用途：用于页面各级标题展示，支持h1-h5等级、省略、可编辑、可复制、加粗、斜体、删除线、高亮等样式。
组件路径 (Path): ridge-antd/Typography.Title
属性 (Props) 配置：
children: string，默认值“标题内容”。必填，显示的标题文本内容。
level: number，默认值1。可选值：1,2,3,4,5。对应h1-h5标题等级。
type: string，默认值空。可选值：secondary（次要）, success（成功）, warning（警告）, danger（危险）。
disabled: boolean，默认值false。是否禁用标题。
事件 (Events)：
onClick: 点击标题时触发。


Upload (文件上传/选择)
用途：用于本地文件选择、预览、管理，支持多选、格式限制、数量限制，选中的文件可直接绑定到变量，供低代码脚本处理，无服务器上传功能。
组件路径 (Path): ridge-antd/Upload
属性 (Props) 配置：
value: file对象，默认空，表示已选择的文件
listType: string，默认text。展示样式：text(文本)、picture(图片)、picture-card(图片卡片)。
accept: string，默认空。限制可选择的文件类型，如 .jpg,.png,.pdf,.docx。
disabled: boolean，默认false。是否禁用组件。
事件 (Events)：
onChange: 当前选中文件变化时触发，参数为当前文件（file对象）