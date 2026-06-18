ComplexTextList (复杂结构化列表)
用途：展示包含标题、描述、多标签的结构化数据列表，支持单选 / 多选模式，单选点击行触发选择，多选显示复选框，标签支持点击事件，适用于后台管理、数据清单展示。
组件路径 (Path): ridge-antd/ComplexTextList
属性 (Props) 配置：
dataSource: object，默认值 [{"title":"示例标题","description":"示例描述","tags":["标签 1","标签 2"]}]。列表数据源，数组元素包含 title/description/tags 字段。
multiple: boolean，默认值 false。true = 多选 (显示 Checkbox)，false = 单选 (点击行选中)。
selectedKeys: object，默认值 []。已选中项的下标数组，如 [0]、[1,2]。
事件 (Events)：
onChangeSelect: 选中状态变更时触发，回调参数 (selectedIndexs: number [])，返回选中项下标数组。
onTagClick: 点击标签时触发，回调参数 (index: number, tagText: string)，分别为行下标、标签文字。