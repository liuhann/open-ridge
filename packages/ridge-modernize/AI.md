BlogCard (描述卡片)
用途：图文内容展示组件，用于博客、资讯、商品简介等图文卡片场景，内置图片、标题、正文、操作按钮结构，支持自定义素材与点击交互。
组件路径 (Path): ridge-modernize/BlogCard
属性 (Props) 配置：
imgSrc: image，默认值"./assets/blog-img1.jpg"。卡片顶部展示图片的资源路径。
title: string，卡片头部大标题文字。
text: string，卡片正文描述文本。
btnText: string，底部按钮展示文字。
事件 (Events)：
onBtnClick: 点击底部操作按钮触发，回调无参数


Button (按钮)
用途：页面交互基础组件，用于操作触发、表单提交等场景
组件路径 (Path): ridge-modernize/Button
属性 (Props) 配置：
children: string，默认值"Button"。必填，按钮展示文字。
disabled: boolean，默认值false。true为禁用按钮，不可点击。
事件 (Events)：
onClick: 鼠标点击按钮时触发，接收点击事件参数。


CheckBox (复选框)
用途：表单多选组件，用于布尔选择、多选项勾选
组件路径 (Path): ridge-modernize/CheckBox
属性 (Props) 配置：
checked: boolean，默认false。true代表勾选，false未勾选。
label: string，复选框右侧展示文本。
disabled: boolean，为true时无法切换勾选状态。
事件 (Events)：
onChange: 勾选状态切换时触发，回调参数 (checked: boolean)


CheckBoxGroup (复选框组)
用途：表单批量多选场景，根据数据源自动生成一组彩色复选框，支持多选存储多个value，后台筛选、批量勾选场景使用
组件路径 (Path): ridge-modernize/CheckBoxGroup
属性 (Props) 配置：
dataSource: object数组，默认[{label:"选项一",value:"1"},{label:"选项二",value:"2"},{label:"选项三",value:"3"}]。渲染选项列表，label为展示文字，value为存储值。
value: object数组，默认空数组。存储所有已勾选选项的value，配合onChange实现双向绑定。
disabled: boolean，取true时无法切换勾选。
事件 (Events)：
onChange: 任意选项勾选/取消时触发，回调参数为最新的选中value数组。


CheckList (可选择列表)
用途：后台待办、任务管理、日程列表，支持复选框多选、每条标题+备注、右侧多色标签、每行右侧三点下拉操作菜单。
组件路径 (Path): ridge-modernize/CheckList
属性 (Props) 配置：
showCheckbox: boolean，默认true。控制列表左侧复选框显示隐藏。
dataSource: object数组，默认值包含两条任务数据。单条item结构：
    title: string 任务标题；
    desc: string 底部描述/日期；
    theme: string 条目复选框主题，可选primary/success/warning/danger/info/secondary；
    tags: 标签数组，单tag {label:string, theme:string}，支持0~N个标签；
    menus: 下拉菜单字符串数组，如["Edit","Delete"]，为空则不渲染三点下拉。
事件 (Events)：
onCheckChange：复选框切换触发，回调参数(index, checked)；index为当前点击条目数组下标，checked为true选中/false取消。
onMenuClick：右侧下拉菜单选项点击触发，回调参数(rowIndex, menuKey)；rowIndex为当前行下标，menuKey为menus内对应字符串。


Dropdown (拆分下拉按钮)
用途：操作按钮附带下拉菜单，左侧为主功能按钮，右侧拆分箭头展开更多操作菜单，后台管理系统批量操作、更多功能场景使用，兼容AdminMart Bootstrap后台样式。
组件路径 (Path): ridge-modernize/Dropdown
属性 (Props) 配置：
children: string，默认值"Action"。左侧主按钮显示文字。
disabled: boolean，默认false。true时按钮与下拉全部禁用，不可交互。
menuItems: object数组，默认内置5条菜单（含分割线）。数组子项结构：{label:文字, href:跳转地址, disabled:是否禁用, divider:是否分割线}，用于配置下拉菜单内容。
事件 (Events)：
onItemClick: 点击下拉菜单条目触发，回调携带两个参数：当前菜单项item、菜单下标index。


EmptyTipCard (空状态占位提示卡片)
用途：页面异常报错、功能开发中、列表无数据、空白页面等场景的统一占位提示，带插画、标题说明与操作按钮。
组件路径 (Path): ridge-modernize/EmptyTipCard
属性 (Props) 配置：
imgSrc: image 占位插画图片地址。
title: string，提示大标题。
desc: string，下方辅助说明文字。
btnText: string，底部按钮展示文字。
事件 (Events)：
onBtnClick：点击底部操作按钮触发，无参数回调。


FormFile (文件上传选择框)
用途：表单文件上传组件，原生file输入，基于Bootstrap form-control样式，用于图片、文档、附件选择。
组件路径 (Path): ridge-modernize/FormFile
属性 (Props) 配置：
size: string，默认md。可选sm小号、md中号、lg大号，控制输入框尺寸。
disabled: boolean，默认false。true禁用选择框，无法点击选文件。
accept: string，默认空。限制文件后缀/MIME类型，例：.png,.jpg,.pdf。
multiple: boolean，默认false。true支持一次性多选多个文件。
事件 (Events)：
onChange: 选择文件后触发，回调参数 (files, event)；
multiple=false 时 files 为单个File实例；
multiple=true 时 files 为File对象数组。


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


ListGroup (列表组)
用途：侧边导航、文字列表、分类选择，基于Bootstrap list-group交互按钮列表，仅支持纯字符串数组数据源。
组件路径 (Path): ridge-modernize/ListGroup
属性 (Props) 配置：
dataSource: 字符串数组，默认["选项一","选项二","选项三"]。数组内每个字符串对应一条列表显示文本。
value: string，默认空字符串。当前选中条目文本，完全匹配则条目高亮active。
事件 (Events)：
onChange: 点击列表条目触发，回调参数为点击条目的字符串文本。


MetricGrowthStat (增长趋势指标统计)
用途：后台财务、营收仪表盘，展示指标名称、涨跌百分比、大额核心数值、环比/同比说明文字。上涨自动绿色+号，下跌红色-号。
组件路径 (Path): ridge-modernize/MetricGrowthStat
属性 (Props) 配置：
title: string，指标顶部标题文本
value: string，加粗大字号核心指标值
growthPercent: string，涨跌百分比纯数字
trendType: string，可选up/down 表示涨-up 跌-down
descText: string，底部小字描述
事件 (Events)：


MetricStatItem (圆点指标数据项)
用途：后台仪表盘、财务统计、业务概览，展示分类标签（带彩色圆点）+ 核心指标数值。
组件路径 (Path): ridge-modernize/MetricStatItem
属性 (Props) 配置：
label: string，指标分类标题。
value: string，底部大字号展示数值，支持金额、纯数字文本。
事件 (Events)：
无


Progress (进度条)
用途：数据进度可视化组件，用于加载进度、完成率、任务进度展示，基于Bootstrap progress样式，支持多主题色与自定义高度。
组件路径 (Path): ridge-modernize/Progress
属性 (Props) 配置：
percent: number，默认0。取值范围0~100，代表当前进度百分比。
事件 (Events)：无


ProgressCard (业务指标进度卡片)
用途：后台数据仪表盘、呼叫中心、业务报表，展示标题、涨跌箭头、年/月/日多维度指标、操作按钮与条纹动画进度条。上涨自动展示绿色上箭头，下跌自动展示红色下箭头。
组件路径 (Path): ridge-modernize/ProgressCard
属性 (Props) 配置：
title: string，默认值"Outbound calls"。卡片顶部主标题文本。
trendType: string，默认值"down"。可选值 up / down；up=上涨绿色向上箭头，down=下跌红色向下箭头。
trendPercent: number，默认值18，最小值0。趋势变化百分比数值，组件自动拼接展示文本。
dataList: object数组，默认值[{"label":"Yearly","value":"80.40%"}, ..]。多维度统计数据，label为维度名称，value为展示数值。
progressValue: number，默认值60，取值0~100。进度条填充占比。
btnText: string，默认值"Learn More"。底部按钮展示文字。
事件 (Events)：
onBtnClick：点击底部操作按钮触发，回调无参数，内部自动执行e.preventDefault阻止链接跳转。


RadioGroup (单选框组)
用途：表单单选场景，根据数据源生成一组彩色单选框，同一分组互斥仅能选择一项，返回单个value值，基于Bootstrap form-check样式，配套AdminMart后台主题。
组件路径 (Path): ridge-modernize/RadioGroup
属性 (Props) 配置：
dataSource: object数组，默认[{label:"选项一",value:"1"},{label:"选项二",value:"2"},{label:"选项三",value:"3"}]。渲染单选列表，label展示文字，value存储选中值。
value: string/数字，默认空字符串。当前选中选项的value，配合onChange双向绑定，仅支持单值。
disabled: boolean，默认false。true全局禁用所有单选框，无法切换。
事件 (Events)：
onChange: 切换单选选项时触发，回调参数为当前选中项的value。


Select (下拉选择框)
用途：表单单选下拉组件，用于固定选项选择场景，基于Bootstrap form-select原生样式，后台筛选、编辑表单通用。
组件路径 (Path): ridge-modernize/Select
属性 (Props) 配置：
dataSource: object数组，默认[{label:"选项一",value:"1"},{label:"选项二",value:"2"},{label:"选项三",value:"3"}]。渲染下拉列表，label展示文字，value存储选中值。
value: string/数字，默认空字符串。当前选中项的值，配合onChange双向绑定。
placeholder: string，默认"请选择"。未选择时的灰色占位提示。
disabled: boolean，默认false。true禁用下拉，不可展开选择。
事件 (Events)：
onChange: 切换下拉选项触发，回调参数 (value, event)。


SimpleProgressCard (简易进度指标卡片)
用途：后台仪表盘、首页数据概览，轻量化单指标展示，搭配图标与静态进度条。
组件路径 (Path): ridge-modernize/SimpleProgressCard
属性 (Props) 配置：
value: string，默认值"86%"。卡片左侧大字体指标数值。
title: string，默认值"Total Product"。数值下方小标题说明文本。
progressPercent: number，默认值85，取值范围0~100。底部进度条填充宽度百分比。
事件 (Events)：
无交互事件，如需点击可在外层容器绑定点击事件。


StatCard (数据统计卡片)
用途：后台仪表盘、数据看板展示单一指标，包含图标、数字、指标描述，多套主题背景色，适合各类业务统计数据展示。
组件路径 (Path): ridge-modernize/StatCard
属性 (Props) 配置：
bgType: string，默认值"primary"。可选配色：primary、success、warning、danger、info、secondary，控制卡片背景主题色。
icon: string，默认值"ti-layout-grid"。Tabler图标后缀，自动拼接ti-类名。
number: string，默认值"450"。卡片大字号统计数值，支持数字/字符串。
label: string，默认值"New Products"。底部浅色说明文字，描述指标含义。
事件 (Events)：


Switch (滑动开关)
用途：表单布尔开关组件，用于启用/关闭功能配置，基于Bootstrap form-switch彩色开关样式，后台设置类页面常用。
组件路径 (Path): ridge-modernize/Switch
属性 (Props) 配置：
checked: boolean，默认false。true为开启，false关闭，配合onChange双向绑定。
label: string，默认"开关"。开关右侧显示文本。
disabled: boolean，默认false。true禁用开关，不可点击切换。
事件 (Events)：
onChange: 切换开关状态触发，回调参数 (checked布尔值, 原生event)。


Textarea (多行文本域)
用途：表单多行大文本录入组件，用于备注、描述、长文本输入，基于Bootstrap form-control样式，支持自适应填满父容器高度。
组件路径 (Path): ridge-modernize/Textarea
属性 (Props) 配置：
value: string，默认空字符串。绑定输入文本，配合onChange双向绑定。
placeholder: string，默认"Text Here..."。空白时提示文字。
disabled: boolean，默认false。true禁用，不可输入。
事件 (Events)：
onChange: 文本修改触发，回调参数 (value, event)。


Typography (文本)
用途：页面文字展示组件，支持多级标题、大段落，单选选择单一文字修饰效果。
组件路径 (Path): ridge-modernize/Typography
属性 (Props) 配置：
children: string，默认"文本内容"。组件展示文字。
tag: string，默认"p"。可选h1/h2/h3/h4/h5/h6/p，控制DOM标签。
style: CSSProperties，无默认值。行内样式对象。
事件 (Events)：无