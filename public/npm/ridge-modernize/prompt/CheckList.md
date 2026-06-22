CheckList (可选择列表)
用途：后台待办、任务管理、日程列表，支持复选框多选、每条标题+备注、右侧多色标签展示。
组件路径 (Path): ridge-modernize/CheckList
属性 (Props) 配置：
showCheckbox: boolean，默认true。控制列表左侧复选框显示隐藏。
dataSource: object数组，默认值包含两条任务数据。单条item结构：
title: string 任务标题；
desc: string 底部描述/日期；
theme: string 条目复选框主题，可选primary/success/warning/danger/info/secondary；
tags: 标签数组，单tag {label:string, theme:string}，支持0~N个标签。
style: CSSProperties，无默认值。组件外层自定义行内样式。
事件 (Events)：
onCheckChange：复选框切换触发，回调参数(index, checked)；index为当前点击条目数组下标，checked为true选中/false取消。