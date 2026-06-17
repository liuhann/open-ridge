Avatar.Group (头像组)
用途：用于堆叠展示多个用户头像，支持图片链接、自定义文字+背景色两种格式，可统一控制大小、形状，自动折叠超出数量的头像。
组件路径 (Path): ridge-antd/AvatarGroup
属性 (Props) 配置：
srcList: array，默认示例数据。头像列表，仅支持两种格式：
  1. 图片URL字符串，例如 "xx.svg"
  2. 对象 {text: '字符', color: '背景色'}，例如 {text: 'K', color: '#f56a00'} color背景色可选填
max: number，默认4。最大显示头像数，超出自动折叠为 +N
size: string，默认medium。头像大小：small、medium、large
shape: string，默认circle。头像形状：circle(圆形)、square(方形)
事件：无