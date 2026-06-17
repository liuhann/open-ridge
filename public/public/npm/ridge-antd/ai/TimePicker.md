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