# ridge-antd 组件库（AI 精简版）

> 本文件为 AI 自动选型参考，已裁剪所有样式/展示类属性，仅保留用途说明、数据类属性、事件。
> AI 根据用户需求在此库中自动匹配合适组件，**无需用户手动提供组件清单**。

---

## 📋 组件分类索引

| 分类 | 组件 | 典型用途 |
|------|------|----------|
| **基础输入** | Input, InputNumber, Input.TextArea, Input.OTP | 文本/数字/多行/验证码输入 |
| **选择类** | Checkbox, Checkbox.Group, Radio.Group, Switch, Segmented, Select, Cascader, TreeSelect | 选项选择、开关、下拉 |
| **日期时间** | DatePicker, TimePicker, Calendar | 日期、时间选择/展示 |
| **按钮操作** | Button, Dropdown | 点击触发、下拉菜单 |
| **数据展示** | Table, Tag, Badge, Statistic, Statistic.Timer, Progress, QRCode, Timeline | 表格/标签/徽标/统计/进度 |
| **导航** | Breadcrumb, Steps, Pagination | 路径导航、步骤、分页 |
| **文字展示** | Typography.Text, Typography.Title, Typography.Paragraph | 标题/文本/段落 |
| **媒体** | Image, Avatar, Avatar.Group, Carousel | 图片、头像、轮播 |
| **反馈提示** | Alert, Spin | 警告提示、加载状态 |
| **其他** | Divider, ColorPicker, Rate, Slider, Upload | 分割线/颜色/评分/滑动/上传 |

---

## 基础输入

### Input（输入框）
- **用途**：单行文本、密码、数字输入
- **Path**: `ridge-antd/Input`
- **数据属性**：
  - `value: string` — 输入框内容
  - `disabled: boolean` — 是否禁用
  - `type: string` — 输入类型：text、password、number
- **事件**：
  - `onChange` — 内容变化时触发
  - `onPressEnter` — 按下回车时触发
  - `onClear` — 点击清除时触发

### InputNumber（数字输入框）
- **用途**：数字类型输入，可增减、限制范围精度
- **Path**: `ridge-antd/InputNumber`
- **数据属性**：
  - `value: number` — 当前数值
  - `precision: number` — 保留小数位数
  - `disabled: boolean` — 是否禁用
- **事件**：
  - `onChange` — 数值变化时触发
  - `onPressEnter` — 按下回车时触发

### Input.TextArea（文本域）
- **用途**：多行文本输入，备注描述
- **Path**: `ridge-antd/Input.TextArea`
- **数据属性**：
  - `value: string` — 输入框内容
  - `placeholder: string` — 提示文字
  - `allowClear: boolean` — 是否显示清除按钮
  - `showCount: boolean` — 是否显示字数统计
  - `maxLength: number` — 最大输入长度
  - `autoSize: boolean` — 是否自适应高度
  - `disabled: boolean` — 是否禁用
- **事件**：
  - `onChange` — 内容变化时触发
  - `onClear` — 点击清除时触发

### Input.OTP（验证码输入框）
- **用途**：短信/邮箱验证码等一次性密码输入
- **Path**: `ridge-antd/Input.OTP`
- **数据属性**：
  - `value: string` — 验证码内容
  - `length: number` — 输入框位数（默认6）
  - `disabled: boolean` — 是否禁用
  - `mask: boolean` — 是否掩码隐藏
- **事件**：
  - `onChange` — 内容改变时触发，返回完整验证码
  - `onInput` — 实时输入时触发，返回每一位输入的数组

---

## 选择类

### Checkbox（复选框）
- **用途**：单项勾选、开关切换、同意协议
- **Path**: `ridge-antd/Checkbox`
- **数据属性**：
  - `children: string` — 选框标签文字（必填）
  - `checked: boolean` — 是否选中
  - `disabled: boolean` — 是否禁用
- **事件**：
  - `onChange` — 选中状态变化时触发

### Checkbox.Group（多选框组）
- **用途**：多选，如兴趣选择、权限配置
- **Path**: `ridge-antd/Checkbox.Group`
- **数据属性**：
  - `value: array` — 当前选中项的值列表
  - `options: array` — 选项列表 `[{ label, value, disabled }]`
  - `disabled: boolean` — 是否整组禁用
- **事件**：
  - `onChange` — 选中项变化时触发

### Radio.Group（单选框组）
- **用途**：互斥选择，如性别、类型选择
- **Path**: `ridge-antd/Radio.Group`
- **数据属性**：
  - `value: string` — 当前选中值
  - `options: array` — 选项列表 `[{ label, value, disabled }]`
  - `disabled: boolean` — 是否整组禁用
- **事件**：
  - `onChange` — 切换选项时触发

### Switch（开关）
- **用途**：开启/关闭等布尔状态切换
- **Path**: `ridge-antd/Switch`
- **数据属性**：
  - `checked: boolean` — 开关状态
  - `disabled: boolean` — 是否禁用
  - `loading: boolean` — 是否加载中
- **事件**：
  - `onChange` — 开关状态变化时触发

### Segmented（分段控制器）
- **用途**：一组选项的快速切换，如 Tab 切换
- **Path**: `ridge-antd/Segmented`
- **数据属性**：
  - `options: array` — 选项列表：字符串数组或 `[{ label, value }]`
  - `value: string|number` — 当前选中值
  - `disabled: boolean` — 是否禁用
- **事件**：
  - `onChange` — 切换选中项时触发

### Select（选择器）
- **用途**：下拉菜单选择，支持单选/多选/搜索
- **Path**: `ridge-antd/Select`
- **数据属性**：
  - `value: string|array` — 当前选中值
  - `options: array` — 下拉选项 `[{ label, value }]`
  - `placeholder: string` — 提示文字
  - `allowClear: boolean` — 是否显示清除按钮
  - `showSearch: boolean` — 是否支持搜索过滤
  - `disabled: boolean` — 是否禁用
- **事件**：
  - `onChange` — 选中值变化时触发

### Cascader（级联选择）
- **用途**：省市区、分类目录等多层级选择
- **Path**: `ridge-antd/Cascader`
- **数据属性**：
  - `value: array` — 当前选中值
  - `options: array` — 选项数据源，支持 children 层级
  - `placeholder: string` — 提示文字
  - `allowClear: boolean` — 是否显示清除
  - `multiple: boolean` — 是否支持多选
  - `disabled: boolean` — 是否禁用
- **事件**：
  - `onChange` — 选择完成后触发

### TreeSelect（树选择）
- **用途**：部门、分类等层级数据选择
- **Path**: `ridge-antd/TreeSelect`
- **数据属性**：
  - `value: string|array` — 当前选中值
  - `treeData: array` — 树形数据 `[{ value, label, children }]`
  - `placeholder: string` — 提示文字
  - `allowClear: boolean` — 是否允许清除
  - `showSearch: boolean` — 是否支持搜索
  - `treeCheckable: boolean` — 是否显示复选框
  - `treeDefaultExpandAll: boolean` — 是否默认展开全部
  - `disabled: boolean` — 是否禁用
- **事件**：
  - `onChange` — 选中值变化时触发

---

## 日期时间

### DatePicker（日期选择器）
- **用途**：日期/周/月/季度/年份选择
- **Path**: `ridge-antd/DatePicker`
- **数据属性**：
  - `value: string` — 当前选中日期
  - `picker: string` — 选择器类型：date、week、month、quarter、year
  - `placeholder: string` — 提示文字
  - `allowClear: boolean` — 是否清除
  - `disabled: boolean` — 是否禁用
- **事件**：
  - `onChange` — 选择日期后触发

### TimePicker（时间选择器）
- **用途**：时、分、秒时间选择
- **Path**: `ridge-antd/TimePicker`
- **数据属性**：
  - `value: string` — 当前选中时间
  - `placeholder: string` — 提示文字
  - `allowClear: boolean` — 是否清除
  - `format: string` — 时间显示格式（默认 HH:mm:ss）
  - `use12Hours: boolean` — 是否12小时制
  - `disabled: boolean` — 是否禁用
- **事件**：
  - `onChange` — 选择时间后触发

### Calendar（日历）
- **用途**：日历面板展示、日期选择
- **Path**: `ridge-antd/Calendar`
- **数据属性**：
  - `value: string` — 当前选中日期
  - `mode: string` — 显示模式：month（月）、year（年）
  - `showWeek: boolean` — 是否显示周数
- **事件**：
  - `onChange` — 选中日期变化时触发

---

## 按钮操作

### Button（按钮）
- **用途**：触发页面交互操作
- **Path**: `ridge-antd/Button`
- **数据属性**：
  - `children: string` — 按钮文字（必填）
  - `disabled: boolean` — 是否禁用
  - `loading: boolean` — 是否显示加载状态
- **事件**：
  - `onClick` — 点击时触发

### Dropdown（下拉菜单）
- **用途**：按钮触发弹出菜单选项
- **Path**: `ridge-antd/Dropdown`
- **数据属性**：
  - `buttonText: string` — 按钮显示文字
  - `arrow: boolean` — 是否显示下拉箭头
  - `placement: string` — 弹出位置：bottomLeft、bottom、bottomRight、topLeft、top、topRight
  - `trigger: string` — 触发方式：hover、click
  - `items: array` — 菜单项 `[{ key, label, disabled, danger }]`
- **事件**：
  - `onItemClick` — 点击菜单项时触发

---

## 数据展示

### Table（表格）
- **用途**：结构化数据展示
- **Path**: `ridge-antd/Table`
- **数据属性**：
  - `columns: array` — 表头 `[{ title, dataIndex, key }]`
  - `dataSource: array` — 数据源
  - `rowKey: string` — 数据唯一标识字段（默认 id）
  - `loading: boolean` — 是否显示加载状态
  - `pagination: boolean|object` — 是否显示分页
  - `showHeader: boolean` — 是否显示表头
- **事件**：无

### Tag（标签）
- **用途**：标记、分类、状态展示
- **Path**: `ridge-antd/Tag`
- **数据属性**：
  - `text: string` — 标签文字
  - `color: string` — 颜色：magenta/red/volcano/orange/gold/lime/green/cyan/blue/geekblue/purple
  - `closeIcon: boolean` — 是否显示关闭按钮
  - `disabled: boolean` — 是否禁用
- **事件**：
  - `onClose` — 点击关闭按钮时触发

### Badge（徽标）
- **用途**：消息通知数量、小红点提示
- **Path**: `ridge-antd/Badge`
- **数据属性**：
  - `count: number` — 显示的数字
  - `dot: boolean` — 是否小红点模式
  - `status: string` — 状态点：success/processing/default/error/warning
  - `color: string` — 自定义背景颜色
  - `overflowCount: number` — 数字封顶值（默认99）
  - `showZero: boolean` — 0是否显示
- **事件**：无

### Statistic（统计数值）
- **用途**：关键数据、统计数字展示
- **Path**: `ridge-antd/Statistic`
- **数据属性**：
  - `title: string` — 数值标题
  - `value: string|number` — 核心数值
  - `prefix: string` — 数值前缀（如 ¥）
  - `suffix: string` — 数值后缀（如 元、%）
  - `precision: number` — 小数位数
  - `groupSeparator: string` — 千分位分隔符（默认 ,）
  - `decimalSeparator: string` — 小数点符号（默认 .）
  - `loading: boolean` — 是否显示加载状态
- **事件**：无

### Statistic.Timer（计时/倒计时）
- **用途**：正计时或倒计时
- **Path**: `ridge-antd/Statistic.Timer`
- **数据属性**：
  - `type: string` — 计时类型：countdown（倒计时）、countup（正计时）
  - `value: number` — 时间值（倒计时=结束时间戳，正计时=开始时间戳）
  - `format: string` — 时间格式（默认 HH:mm:ss），支持 D天H时m分s秒S毫秒
  - `title: string` — 组件标题
  - `prefix: string` — 时间前缀
  - `suffix: string` — 时间后缀
- **事件**：
  - `onFinish` — 倒计时结束时触发
  - `onChange` — 时间每帧变化时触发

### Progress（进度条）
- **用途**：操作进度、加载状态展示
- **Path**: `ridge-antd/Progress`
- **数据属性**：
  - `type: string` — 类型：line（线形）/circle（圆形）/dashboard（仪表盘）
  - `percent: number` — 进度百分比（0~100）
  - `status: string` — 状态：normal/success/exception/active
- **事件**：无

### QRCode（二维码）
- **用途**：生成可扫描二维码
- **Path**: `ridge-antd/QRCode`
- **数据属性**：
  - `value: string` — 二维码内容（链接/文本）
  - `size: number` — 二维码尺寸（默认160）
  - `icon: string` — 中心图标地址
  - `iconSize: number` — 中心图标大小（默认40）
  - `errorLevel: string` — 纠错等级：L/M/Q/H
  - `status: string` — 状态：active/expired/loading/scanned
- **事件**：无

### Timeline（时间轴）
- **用途**：按时间顺序展示事件、步骤
- **Path**: `ridge-antd/Timeline`
- **数据属性**：
  - `items: array` — 时间轴列表 `[{ title, content }]`
  - `mode: string` — 内容位置：start/alternate/end
  - `reverse: boolean` — 是否反向排序
  - `titleSpan: number` — 标题占比宽度
- **事件**：无

---

## 导航

### Breadcrumb（面包屑）
- **用途**：页面层级路径展示与导航
- **Path**: `ridge-antd/Breadcrumb`
- **数据属性**：
  - `items: array` — 路径项 `[{ label, href }]`
- **事件**：
  - `onClick` — 点击任意路径项时触发

### Steps（步骤条）
- **用途**：多步骤流程进度展示
- **Path**: `ridge-antd/Steps`
- **数据属性**：
  - `items: array` — 步骤列表 `[{ title, content, status }]`
  - `current: number` — 当前步骤序号（从0开始）
  - `initial: number` — 起始序号（默认0）
  - `status: string` — 步骤状态：wait/process/finish/error
- **事件**：
  - `onChange` — 点击切换步骤时触发

### Pagination（分页）
- **用途**：长列表数据分页
- **Path**: `ridge-antd/Pagination`
- **数据属性**：
  - `total: number` — 数据总数
  - `current: number` — 当前页数
  - `defaultCurrent: number` — 默认当前页
  - `pageSize: number` — 每页条数（默认10）
  - `defaultPageSize: number` — 默认每页条数
  - `pageSizeOptions: array` — 每页条数选项（默认[10,20,50,100]）
  - `disabled: boolean` — 是否禁用
  - `hideOnSinglePage: boolean` — 只有一页时是否隐藏
  - `showQuickJumper: boolean` — 是否可快速跳转
  - `showSizeChanger: boolean` — 是否展示条数切换器
  - `simple: boolean` — 简洁模式
- **事件**：
  - `onChange` — 页码或 pageSize 改变时触发

---

## 文字展示

### Typography.Title（标题）
- **用途**：页面各级标题展示
- **Path**: `ridge-antd/Typography.Title`
- **数据属性**：
  - `children: string` — 标题文本（必填）
  - `level: number` — 等级：1~5（对应 h1~h5，默认1）
- **事件**：
  - `onClick` — 点击标题时触发

### Typography.Text（文本）
- **用途**：普通文本展示
- **Path**: `ridge-antd/Typography.Text`
- **数据属性**：
  - `children: string` — 显示文本（必填）
- **事件**：
  - `onClick` — 点击文本时触发

### Typography.Paragraph（段落文本）
- **用途**：大段正文文案排版
- **Path**: `ridge-antd/Typography.Paragraph`
- **数据属性**：
  - `children: string` — 段落文字（必填）
  - `copyable: boolean` — 开启一键复制
  - `editable: boolean` — 双击修改文本
  - `ellipsis: boolean` — 超长自动省略
- **事件**：
  - `onClick` — 点击段落时触发

---

## 媒体

### Image（图片）
- **用途**：单张图片展示，支持预览
- **Path**: `ridge-antd/Image`
- **数据属性**：
  - `src: string` — 图片资源地址（必填）
  - `alt: string` — 图片描述
  - `preview: boolean` — 是否开启点击预览（默认true）
  - `placeholder: boolean` — 加载时是否占位
- **事件**：
  - `onError` — 图片加载失败时触发

### Avatar（头像）
- **用途**：用户头像展示
- **Path**: `ridge-antd/Avatar`
- **数据属性**：
  - `src: string` — 头像图片地址
  - `alt: string` — 加载失败替代文字
- **事件**：
  - `onError` — 图片加载失败时触发

### Avatar.Group（头像组）
- **用途**：堆叠展示多个用户头像
- **Path**: `ridge-antd/AvatarGroup`
- **数据属性**：
  - `srcList: array` — 头像列表：图片URL字符串或 `{ text, color }` 对象
  - `max: number` — 最大显示数（默认4），超出折叠为+N
- **事件**：无

### Carousel（走马灯/轮播）
- **用途**：banner、图片轮播展示
- **Path**: `ridge-antd/Carousel`
- **数据属性**：
  - `slides: array` — 轮播内容：`{ src, title }` 对象数组
  - `effect: string` — 动画：scrollx、fade
  - `autoplay: boolean` — 是否自动播放
  - `autoplaySpeed: number` — 播放间隔（毫秒）
  - `dots: boolean` — 是否显示指示点
  - `arrows: boolean` — 是否显示箭头
  - `infinite: boolean` — 是否无限循环
  - `draggable: boolean` — 是否可拖拽切换
  - `adaptiveHeight: boolean` — 高度自适应
  - `dotPlacement: string` — 指示点位置：top/bottom/start/end
  - `speed: number` — 动画速度（毫秒）
- **事件**：
  - `afterChange` — 切换完成后触发

---

## 反馈提示

### Alert（警告提示）
- **用途**：页面中展示重要提示信息
- **Path**: `ridge-antd/Alert`
- **数据属性**：
  - `title: string` — 提示标题
  - `description: string` — 辅助性描述文字
  - `type: string` — 类型：success/info/warning/error（默认info）
  - `showIcon: boolean` — 是否显示左侧图标
  - `closable: boolean` — 是否显示关闭按钮
- **事件**：无

### Spin（加载中）
- **用途**：数据加载、页面等待状态提示
- **Path**: `ridge-antd/Spin`
- **数据属性**：
  - `spinning: boolean` — 是否加载中（默认true）
  - `description: string` — 加载描述文字
  - `delay: number` — 延迟显示（毫秒），防闪烁
  - `percent: number|'auto'` — 加载进度
- **事件**：无

---

## 其他

### Divider（分割线）
- **用途**：页面区域模块间的视觉分隔
- **Path**: `ridge-antd/Divider`
- **数据属性**：
  - `children: string` — 分割线中间显示的标题文字
  - `titlePlacement: string` — 标题位置：start/center/end
- **事件**：无

### ColorPicker（颜色选择器）
- **用途**：可视化选择颜色
- **Path**: `ridge-antd/ColorPicker`
- **数据属性**：
  - `value: string` — 当前颜色值
  - `mode: string` — 模式：single（单色）、gradient（渐变）
  - `allowClear: boolean` — 是否允许清除
  - `showText: boolean` — 是否显示颜色值文本
  - `disabled: boolean` — 是否禁用
  - `disabledAlpha: boolean` — 是否禁用透明度
- **事件**：
  - `onChange` — 颜色值变化时触发

### Rate（评分）
- **用途**：星级评价、满意度打分
- **Path**: `ridge-antd/Rate`
- **数据属性**：
  - `value: number` — 当前评分
  - `count: number` — 星星总数（默认5）
  - `allowHalf: boolean` — 是否允许半星
  - `allowClear: boolean` — 是否允许点击清除
  - `disabled: boolean` — 是否只读
- **事件**：
  - `onChange` — 评分变化时触发
  - `onHoverChange` — 鼠标悬停时触发

### Slider（滑动输入条）
- **用途**：滑动选择数值或数值范围
- **Path**: `ridge-antd/Slider`
- **数据属性**：
  - `value: number|array` — 当前值
  - `min: number` — 最小值（默认0）
  - `max: number` — 最大值（默认100）
  - `step: number` — 步长（默认1）
  - `range: boolean` — 是否双滑块范围选择
  - `disabled: boolean` — 是否禁用
- **事件**：
  - `onChange` — 滑动时实时触发

### Upload（文件上传/选择）
- **用途**：本地文件选择、预览、管理（无服务器上传功能）
- **Path**: `ridge-antd/Upload`
- **数据属性**：
  - `value: File` — 已选择的文件对象
  - `listType: string` — 展示样式：text/picture/picture-card
  - `accept: string` — 限制文件类型（如 .jpg,.png,.pdf）
  - `disabled: boolean` — 是否禁用
- **事件**：
  - `onChange` — 文件变化时触发，返回浏览器标准 File 对象，可使用 File API
