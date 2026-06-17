Carousel (走马灯/轮播)
用途：用于banner、广告、图片、图文内容的轮播展示，支持自动播放、渐变/滚动动画、箭头切换、指示点。
组件路径：ridge-antd/Carousel
属性：
slides: 轮播内容数组，支持：
  - 纯图片：{ src: 'url' }
  - 纯文字：{ title: '文字' }
  - 图片+标题：{ src: 'url', title: '文字' }
effect: 动画效果 scrollx / fade
autoplay: 是否自动播放
autoplaySpeed: 播放间隔毫秒
dots: 是否显示指示点
arrows: 是否显示左右箭头
infinite: 无限循环
draggable: 拖拽切换
adaptiveHeight: 高度自适应
dotPlacement: 指示点位置 top/bottom/start/end
speed: 动画速度毫秒
事件：
afterChange: 切换完成后触发