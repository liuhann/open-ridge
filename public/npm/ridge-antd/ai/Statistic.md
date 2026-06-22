Statistic (统计数值)
用途：用于展示关键数据、统计数值、卡片数字，支持标题、前后缀、千分位、小数点、精度格式化，适用于数据面板、首页统计、大屏展示。
组件路径 (Path): ridge-antd/Statistic
属性 (Props) 配置：
title: string，默认“统计数值”。数值标题。
value: string | number，默认12345。要展示的核心数值。
prefix: string，默认空。数值前缀，如“¥”“$”“¥”。
suffix: string，默认空。数值后缀，如“元”“%”“次”。
precision: number，默认空。保留小数位数。
groupSeparator: string，默认,。千分位分隔符。
decimalSeparator: string，默认.。小数点符号。
loading: boolean，默认false。是否显示加载状态。
事件：无