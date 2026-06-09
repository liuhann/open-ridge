Button (按钮)
用途：用于触发页面交互操作，支持多种样式、尺寸、形状与状态，满足不同场景点击需求。
组件路径 (Path): ridge-antd/Button
属性 (Props) 配置：
children: string，默认按钮。按钮展示文本。
type: string，默认default。按钮类型：default(默认)、primary(主要)、dashed(虚线)、link(链接)、text(文字)。
variant: string，默认空。按钮变体样式：outlined、dashed、solid、filled、text、link。
shape: string，默认default。按钮形状：default(默认)、circle(圆形)、round(圆角)。
size: string，默认medium。按钮尺寸：large(大)、medium(中)、small(小)。
disabled: boolean，默认false。是否禁用按钮。
ghost: boolean，默认false。是否开启透明背景幽灵样式。
block: boolean，默认false。是否宽度撑满父容器。
loading: boolean，默认false。是否显示加载状态。
danger: boolean，默认false。是否设为危险按钮样式。
事件：
onClick: 点击按钮时触发回调。