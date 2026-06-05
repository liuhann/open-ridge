Checkbox.Group (多选框组)
用途：用于同时展示多个选项并支持多选，如兴趣选择、权限配置、多条件筛选等场景。
组件路径 (Path): ridge-antd/Checkbox.Group
属性 (Props) 配置：
value: array，默认[]。当前选中项的值。
options: array，默认示例选项。选项列表，每一项包含 label、value、disabled。
disabled: boolean，默认false。是否整组禁用。
事件 (Events)：
onChange: 选中项发生变化时触发，返回当前所有选中项的值数组。