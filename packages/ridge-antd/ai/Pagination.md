Pagination (分页)
用途：用于长列表数据展示场景，提供页码切换、每页条数调整、快速跳转、数据总数展示等功能。
组件路径 (Path): ridge-antd/Pagination
属性 (Props) 配置：
total: number，默认值0。数据总数。
current: number，默认值1。当前页数。
defaultCurrent: number，默认值1。默认的当前页数。
pageSize: number，默认值10。每页条数。
defaultPageSize: number，默认值10。默认的每页条数。
align: string，默认值空。可选值：start（左对齐）、center（居中）、end（右对齐）。
size: string，默认值medium。可选值：large、medium、small。
pageSizeOptions: array，默认值[10,20,50,100]。指定每页可以显示多少条。
disabled: boolean，默认值false。禁用分页。
hideOnSinglePage: boolean，默认值false。只有一页时是否隐藏分页器。
showLessItems: boolean，默认值false。是否显示较少页面内容。
showQuickJumper: boolean，默认值false。是否可以快速跳转至某页。
showSizeChanger: boolean，默认值false。是否展示 pageSize 切换器。
simple: boolean，默认值false。简洁分页模式。
事件 (Events)：
onChange: 页码或 pageSize 改变时触发，返回 page 和 pageSize。