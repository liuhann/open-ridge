Progress (进度条)
用途：用于展示操作进度、加载状态、完成比例，支持线形、圆形、仪表盘三种展示样式，可自定义颜色、状态、尺寸。
组件路径 (Path): ridge-antd/Progress
属性 (Props) 配置：
type: string，默认line。类型：line(线形) | circle(圆形) | dashboard(仪表盘)
percent: number，默认50。进度百分比 0~100
status: string，状态：normal | success | exception | active
size: string，尺寸：small | medium
showInfo: boolean，默认true。是否显示百分比文字
strokeColor: string，进度条颜色
railColor: string，背景轨道颜色
strokeLinecap: string，线头样式：round | butt | square
strokeWidth: number，圆形/仪表盘进度条宽度
事件：无