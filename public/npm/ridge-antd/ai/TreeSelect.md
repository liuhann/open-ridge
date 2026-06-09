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