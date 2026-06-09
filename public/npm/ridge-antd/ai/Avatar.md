Avatar (头像)
用途：用于展示用户头像、图标、文字，支持图片、 fallback 文字、形状、大小控制。
组件路径 (Path): ridge-antd/Avatar
属性 (Props) 配置：
src: string，默认空。头像图片地址。
alt: string，默认空。图片加载失败时的替代文字。
shape: string，默认circle。头像形状：circle(圆形)、square(方形)。
size: string，默认medium。头像大小：small、medium、large。
事件 (Events)：
onError: 图片加载失败时触发，可处理错误回退。