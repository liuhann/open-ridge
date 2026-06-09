Table (表格)
用途：用于结构化数据展示，通过配置表头和数据源即可快速渲染基础表格，支持边框、尺寸、分页、加载状态。
组件路径 (Path): ridge-antd/Table
属性 (Props) 配置：
columns: array，表头配置，格式：[{ title: '列标题', dataIndex: '字段名', key: '唯一键' }]
dataSource: array，表格数据源，数组对象格式
rowKey: string，默认id，数据唯一标识字段
bordered: boolean，默认false，是否显示表格边框
size: string，默认large，表格尺寸 large / medium / small
loading: boolean，默认false，是否显示加载状态
pagination: boolean|object，默认false，是否显示分页
showHeader: boolean，默认true，是否显示表头
事件：无