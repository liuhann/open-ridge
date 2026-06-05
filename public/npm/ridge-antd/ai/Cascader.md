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