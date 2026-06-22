BlogCard (博客卡片)
用途：图文内容展示组件，用于博客、资讯、商品简介等图文卡片场景，内置图片、标题、正文、操作按钮结构，支持自定义素材与点击交互。
组件路径 (Path): ridge-modernize/BlogCard
属性 (Props) 配置：
imgSrc: image，默认值"./assets/blog-img1.jpg"。卡片顶部展示图片的资源路径。
title: string，卡片头部大标题文字。
text: string，卡片正文描述文本。
btnText: string，底部按钮展示文字。
事件 (Events)：
onBtnClick: 点击底部操作按钮触发，回调无参数