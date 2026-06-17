QRCode (二维码)
用途：用于生成可扫描的二维码，支持链接、文本编码，可自定义颜色、大小、中间图标、状态，广泛用于登录、分享、信息展示场景。
组件路径 (Path): ridge-antd/QRCode
属性 (Props) 配置：
value: string，默认https://ant.design。二维码扫描内容（链接/文本）。
size: number，默认160。二维码整体尺寸。
icon: string，默认空。二维码中心图标地址。
iconSize: number，默认40。中心图标大小。
color: string，默认#000000。二维码前景色。
bgColor: string，默认transparent。二维码背景色。
bordered: boolean，默认true。是否显示边框。
marginSize: number，默认0。二维码留白边距。
errorLevel: string，默认M。纠错等级：L / M / Q / H。
status: string，默认active。状态：active / expired / loading / scanned。
事件：无