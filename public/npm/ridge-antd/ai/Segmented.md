Segmented (分段控制器)
用途：用于一组选项的快速切换，支持横向/纵向布局、自适应宽度、尺寸/形状配置，是页面内常用的切换筛选组件。
组件路径 (Path): ridge-antd/Segmented
属性 (Props) 配置：
options: array，默认示例数据。选项列表，支持两种格式：
  1. 字符串数组：["选项1","选项2"]
  2. 对象数组：[{ label:"显示文字", value:"提交值" }]
value: string | number，当前选中值（受控）
block: boolean，默认false。是否铺满父元素宽度
disabled: boolean，默认false。是否禁用整个控制器
orientation: string，默认horizontal。排列方向：horizontal(横向) / vertical(纵向)
size: string，默认medium。尺寸：large / medium / small
shape: string，默认default。形状：default(默认) / round(圆角)
事件：
onChange: 切换选中项时触发，返回当前选中的 value