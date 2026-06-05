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