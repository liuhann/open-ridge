Image (图片)
用途：用于展示单张图片，支持预览、加载占位、失败兜底图、宽高自适应，是页面中最常用的媒体展示组件。
组件路径 (Path): ridge-antd/Image
属性 (Props) 配置：
src: string，默认空。图片资源地址。
alt: string，默认空。图片描述，用于无障碍和SEO。
preview: boolean，默认true。是否开启点击放大预览。
placeholder: boolean，默认false。图片加载中是否显示占位效果。
事件：
onError: 图片加载失败、地址错误时触发回调。