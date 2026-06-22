CheckBoxGroup (复选框组)
用途：表单批量多选场景，根据数据源自动生成一组彩色复选框，支持多选存储多个value，后台筛选、批量勾选场景使用
组件路径 (Path): ridge-modernize/CheckBoxGroup
属性 (Props) 配置：
dataSource: object数组，默认[{label:"选项一",value:"1"},{label:"选项二",value:"2"},{label:"选项三",value:"3"}]。渲染选项列表，label为展示文字，value为存储值。
value: object数组，默认空数组。存储所有已勾选选项的value，配合onChange实现双向绑定。
disabled: boolean，取true时无法切换勾选。
事件 (Events)：
onChange: 任意选项勾选/取消时触发，回调参数为最新的选中value数组。