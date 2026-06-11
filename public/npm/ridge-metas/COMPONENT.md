## 组件格式
RidgeUI前端组件需要使用下面格式进行描述。 框架按这个文件决定组件可以配置哪些属性和事件

## 文件格式

```json
{
  "name": "SomComponent",
  "title": "弹性容器",
  "icon": "svgs/flex-container.svg",
  "description": "适合多个内容进行垂直或水平形式。",
  "tags": [
    "容器",
    "布局",
    "响应式"
  ],
  "category": "容器",
  "version": "1.0.0",
  "author": "LiuHan",
  "visualConfig": {
    "preferredWidth": 360,
    "preferredHeight": 240,
    "resizable": true,
    "aspectRatio": "no"
  },
  "properties": [
     {
      "name": "value",
      "description": "输入框内容 通过事件onChange可以实现双向绑定",
      "label": "输入内容",
      "inputEvent": "onChange",
      "type": "string",
      "defaultValue": ""
    },
    {
      "name": "checked",
      "description": "指定当前Checkbox是否选中",
      "label": "是否选中",
      "control": "boolean",
      "inputEvent": "onChange",
      "type": "boolean",
      "defaultValue": false
    },
    {
      "name": "direction",
      "description": "主轴方向，决定子项的排列方向",
      "label": "排列方向",
      "control": "radiogroup",
      "type": "string",
      "options": [
        {
          "label": "横向",
          "value": "row"
        }
      ],
      "defaultValue": "row"
    },
    {
      "name": "flexWrap",
      "description": "是否允许子项换行显示",
      "label": "换行",
      "control": "boolean",
      "type": "boolean",
      "defaultValue": false
    },
    {
      "name": "gap",
      "description": "子项之间的间距（单位：像素）",
      "label": "间隔",
      "control": "number",
      "type": "number",
      "min": 0,
      "defaultValue": 8
    },
    {
      "name": "children",
      "description": "容器内的子组件",
      "label": "子项内容",
      "type": "string"
    },
    {
      "name": "src",
      "description": "图片地址",
      "label": "图片地址",
      "type": "image",
    },
     {
      "name": "color",
      "description": "边框颜色",
      "label": "边框颜色",
      "type": "color"
    },
    {
      "name": "className",
      "description": "为容器添加自定义 CSS 类名",
      "label": "自定义类名",
      "control": "className",
      "type": "array"
    },
    {
      "name": "type",
      "description": "设置checkbox 的样式类型",
      "label": "样式类型",
      "control": "select",
      "type": "string",
      "options": [
        {
          "label": "默认",
          "value": "default"
        }
      ],
      "defaultValue": "default"
    },
    {
      "name": "options",
      "label": "子元素列表",
      "control": "json",
      "type": "array"
    },
    {
      "name": "configs",
      "label": "配置信息",
      "control": "json",
      "type": "object"
    }
    {
      "name": "style",
      "description": "组件内联样式",
      "label": "内联样式",
      "type": "CSSProperties"
    }
  ],
  "events": [
    {
      "name": "onClick",
      "description": "点击容器时触发",
      "label": "点击"
    },
    {
      "name": "onChange",
      "description": "变化时回调函数",
      "payload": "target.checked",
      "label": "状态变化"
    }
  ]
}
```


现在要通过UI组件的API表格生成上面的JSON，对于属性、事件，注意按含义和类型进行排除，包括但不限于：
1. ReactNode等无法直接输入类型
2. 比较少见或者用户不容易理解的属性
3. 如果组件定义中包含width/height等，在实际配置过程会动态拖拽调整的，需要增加属性： hidden: true
4. CSSProperties/className 等类型，虽然现在不支持，但是未来可能会支持，要保留。
5. 复杂类型，给出sample 样例 JSON数据
6. type 统一为单值：仅保留基础string，移除联合类型写法

另外，还要生成一份供AI引擎读取的语料，要实现上面JSON同样的效果，AI可以知道有哪些属性、如何配置。 例如


Button (按钮)
用途：用于页面点击操作、提交表单、确认取消等交互场景。
组件路径 (Path): @douyinfe/semi-ui/Button
属性 (Props) 配置：
children: string，默认值“按钮”。必填，按钮上显示的文字。
aria-label: string，默认值“”。无障碍辅助阅读标签。
block: boolean，默认值false。是否占满整行宽度。
disabled: boolean，默认值false。是否禁用按钮。
loading: boolean，默认值false。是否显示加载中状态（此时不可点击）。
size: string，默认值“default”。可选值：large（大）, default（默认）, small（小）。
theme: string，默认值“light”。显示风格：solid（实色背景）, borderless（无背景）, light（浅背景）, outline（边框样式）。
type: string，默认值“primary”。用途类型：primary（主要）, secondary（次要）, tertiary（三级）, warning（警告）, danger（危险）。
事件 (Events)：
onClick: 点击按钮时触发。
onMouseDown: 鼠标按下时触发。
onMouseEnter: 鼠标移入时触发。
onMouseLeave: 鼠标移出时触发。


现在我给出的组件表格如下，为我生成2份文件， 供编辑器和AI读取。  