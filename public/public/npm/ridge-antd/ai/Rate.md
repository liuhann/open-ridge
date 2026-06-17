Rate (评分)
用途：用于展示和提交星级评价、满意度打分、商品评分等场景，支持全星/半星选择。
组件路径 (Path): ridge-antd/Rate
属性 (Props) 配置：
value: number，默认0。当前选中的评分。
count: number，默认5。星星总数。
allowHalf: boolean，默认false。是否允许选择半星。
allowClear: boolean，默认true。是否允许点击清除评分。
disabled: boolean，默认false。是否禁用交互（只读模式）。
size: string，默认medium。星星大小：small、medium、large。
事件 (Events)：
onChange: 选中评分时触发，返回当前分数。
onHoverChange: 鼠标悬停时触发，返回悬停分数。