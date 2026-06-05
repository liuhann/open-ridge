ColorPicker (颜色选择器)
用途：用于可视化选择颜色，支持单色/渐变模式、多种颜色格式、透明度调节、预设颜色，广泛用于样式配置、主题设置等场景。
组件路径 (Path): ridge-antd/ColorPicker
属性 (Props) 配置：
value: string，默认#1677ff。当前选中的颜色值。
mode: string，默认single。选择模式：single(单色)、gradient(渐变)。
allowClear: boolean，默认false。是否允许清除选择的颜色。
showText: boolean，默认false。是否显示颜色值文本。
disabled: boolean，默认false。是否禁用组件。
disabledAlpha: boolean，默认false。是否禁用透明度选择。
size: string，默认medium。组件大小：large、medium、small。
事件 (Events)：
onChange: 颜色值发生变化时触发。