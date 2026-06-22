Statistic.Timer (计时/倒计时)
用途：用于展示正计时或倒计时，支持自定义时间格式、标题、前后缀、数值样式，支持结束回调与实时变化回调，适用于活动倒计时、任务计时等场景。
组件路径 (Path): ridge-antd/Statistic.Timer
属性 (Props) 配置：
type: string，默认countdown。计时类型：countdown(倒计时) / countup(正计时)
value: number，默认0。时间值（倒计时=结束时间戳，正计时=开始时间戳）
format: string，默认HH:mm:ss。时间格式化字符串 支持：D天H时m分s秒S毫秒
title: string，默认空。组件标题
prefix: string，默认空。时间前缀
suffix: string，默认空。时间后缀
valueStyle: CSSProperties，默认空。数值区域自定义样式
事件：
onFinish: 倒计时结束时触发（仅countdown有效）
onChange: 时间数值每帧变化时触发