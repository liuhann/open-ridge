ListGroup (列表组)
用途：侧边导航、文字列表、分类选择，基于Bootstrap list-group交互按钮列表，仅支持纯字符串数组数据源。
组件路径 (Path): ridge-modernize/ListGroup
属性 (Props) 配置：
dataSource: 字符串数组，默认["选项一","选项二","选项三"]。数组内每个字符串对应一条列表显示文本。
value: string，默认空字符串。当前选中条目文本，完全匹配则条目高亮active。
事件 (Events)：
onChange: 点击列表条目触发，回调参数为点击条目的字符串文本。