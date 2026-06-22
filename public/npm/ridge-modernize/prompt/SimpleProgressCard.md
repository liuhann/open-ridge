SimpleProgressCard (简易进度指标卡片)
用途：后台仪表盘、首页数据概览，轻量化单指标展示，搭配图标与静态进度条。
组件路径 (Path): ridge-modernize/SimpleProgressCard
属性 (Props) 配置：
value: string，默认值"86%"。卡片左侧大字体指标数值。
title: string，默认值"Total Product"。数值下方小标题说明文本。
progressPercent: number，默认值85，取值范围0~100。底部进度条填充宽度百分比。
事件 (Events)：
无交互事件，如需点击可在外层容器绑定点击事件。