RadioGroup (单选框组)
用途：表单单选场景，根据数据源生成一组彩色单选框，同一分组互斥仅能选择一项，返回单个value值，基于Bootstrap form-check样式，配套AdminMart后台主题。
组件路径 (Path): ridge-modernize/RadioGroup
属性 (Props) 配置：
dataSource: object数组，默认[{label:"选项一",value:"1"},{label:"选项二",value:"2"},{label:"选项三",value:"3"}]。渲染单选列表，label展示文字，value存储选中值。
value: string/数字，默认空字符串。当前选中选项的value，配合onChange双向绑定，仅支持单值。
disabled: boolean，默认false。true全局禁用所有单选框，无法切换。
事件 (Events)：
onChange: 切换单选选项时触发，回调参数为当前选中项的value。