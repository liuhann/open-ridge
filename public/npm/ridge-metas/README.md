# RidgeUI组名描述规范

## 文件格式

```json
{
  "name": "FlexContainer",
  "title": "弹性容器",
  "icon": "icons/flex-container.svg",
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
      "name": "direction",
      "description": "主轴方向，决定子项的排列方向",
      "label": "排列方向",
      "control": "radiogroup",
      "type": "string",
      "options": [
        {
          "label": "横向",
          "value": "row"
        },
        {
          "label": "纵向",
          "value": "column"
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
        },
        {
          "label": "卡片",
          "value": "card"
        },
        {
          "label": "纯卡片",
          "value": "pureCard"
        }
      ],
      "defaultValue": "default"
    },
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
    }
  ]
}
```

其他例如ReactNode等无法直接输入类型需要排除。  另外，如果有的属性比较少见或者用户不容易理解，也可以列举出来供排除
