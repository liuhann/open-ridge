BsButton (Bootstrap按钮)
用途：页面交互基础组件，用于操作触发、表单提交、弹窗确认、数据新增删除等场景，兼容AdminMart Bootstrap后台模板样式，支持实心/浅底色/描边三种外观、多尺寸、多主题色。
组件路径 (Path): ridge-modernize/BsButton
属性 (Props) 配置：
children: string，默认值"Button"。必填，按钮展示文字。
variant: string，默认值"primary"。可选值：primary(主色)、secondary(次要)、success(成功)、info(信息)、warning(警告)、danger(危险)、light(浅灰)、dark(深色)；控制按钮主题配色。
disabled: boolean，默认值false。true为禁用按钮，不可点击。
事件 (Events)：
onClick: 鼠标点击按钮时触发，接收点击事件参数。


CheckBox (复选框)
用途：表单多选组件，用于布尔选择、多选项勾选，配套AdminMart彩色bootstrap复选框样式。
组件路径 (Path): ./components/CheckBox
属性 (Props) 配置：
checked: boolean，默认false。true代表勾选，false未勾选，配合onChange双向绑定。
label: string，默认值"Default"。复选框右侧展示文本。
disabled: boolean，默认false。true禁用，无法切换勾选状态。
事件 (Events)：
onChange: 勾选状态切换时触发，回调参数 (checked: boolean, event)。


CheckBoxGroup (复选框组)
用途：表单批量多选场景，根据数据源自动生成一组彩色复选框，支持多选存储多个value，后台筛选、批量勾选场景使用，基于Bootstrap form-check样式。
组件路径 (Path): ridge-modernize/CheckBoxGroup
属性 (Props) 配置：
dataSource: object数组，默认[{label:"选项一",value:"1"},{label:"选项二",value:"2"},{label:"选项三",value:"3"}]。渲染选项列表，label为展示文字，value为存储值。
value: object数组，默认空数组。存储所有已勾选选项的value，配合onChange实现双向绑定。
disabled: boolean，默认false。true全局禁用所有复选框，无法切换勾选。
事件 (Events)：
onChange: 任意选项勾选/取消时触发，回调参数为最新的选中value数组。


Dropdown (拆分下拉按钮)
用途：操作按钮附带下拉菜单，左侧为主功能按钮，右侧拆分箭头展开更多操作菜单，后台管理系统批量操作、更多功能场景使用，兼容AdminMart Bootstrap后台样式。
组件路径 (Path): ridge-modernize/Dropdown
属性 (Props) 配置：
children: string，默认值"Action"。左侧主按钮显示文字。
disabled: boolean，默认false。true时按钮与下拉全部禁用，不可交互。
menuItems: object数组，默认内置5条菜单（含分割线）。数组子项结构：{label:文字, href:跳转地址, disabled:是否禁用, divider:是否分割线}，用于配置下拉菜单内容。
事件 (Events)：
onItemClick: 点击下拉菜单条目触发，回调携带两个参数：当前菜单项item、菜单下标index。


Input (输入框)
用途：表单基础录入组件，用于文本、密码、数字、邮箱、手机号录入，后台管理系统查询、新增编辑表单通用，基于Bootstrap form-control样式。
组件路径 (Path): ridge-modernize/Input
属性 (Props) 配置：
value: string，默认值空字符串。输入框绑定文本值，配合onChange双向绑定。
placeholder: string，默认值"请输入内容"。输入空白时显示提示文字。
disabled: boolean，默认false。true时禁用输入，无法操作。
事件 (Events)：
onChange: 输入内容修改触发，回调参数 (value, event)。


RadioGroup (单选框组)
用途：表单单选场景，根据数据源生成一组彩色单选框，同一分组互斥仅能选择一项，返回单个value值，基于Bootstrap form-check样式，配套AdminMart后台主题。
组件路径 (Path): ridge-modernize/RadioGroup
属性 (Props) 配置：
dataSource: object数组，默认[{label:"选项一",value:"1"},{label:"选项二",value:"2"},{label:"选项三",value:"3"}]。渲染单选列表，label展示文字，value存储选中值。
value: string/数字，默认空字符串。当前选中选项的value，配合onChange双向绑定，仅支持单值。
disabled: boolean，默认false。true全局禁用所有单选框，无法切换。
事件 (Events)：
onChange: 切换单选选项时触发，回调参数为当前选中项的value。