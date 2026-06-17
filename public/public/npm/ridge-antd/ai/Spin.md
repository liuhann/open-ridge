Spin (加载中)
用途：用于数据加载、页面等待、操作处理中的状态提示，支持普通加载、全屏加载、进度展示、描述文字。
组件路径 (Path): ridge-antd/Spin
属性 (Props) 配置：
spinning: boolean，默认true。是否处于加载中状态
size: string，默认medium。加载图标尺寸：small / medium / large
description: string，加载下方的描述文字，如“加载中...”
fullscreen: boolean，默认false。是否开启全屏遮罩加载
delay: number，延迟显示加载的时间（毫秒），防止快速闪烁
percent: number | 'auto'，显示加载进度
事件：无