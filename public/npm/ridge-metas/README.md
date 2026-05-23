# RidgeUI AI时代的页面及交互呈现制作工具

RidgeUI是一个零代码前端框架，用户可以使用页面编辑器并借助AI来实现交互页面的制作。

## 页面配置

下面是一个RidgeUI的页面配置示例：

```json
{
  "version": "2.0.0",
  "style": {
    "width": 980,
    "height": 720
  },
  "properties": {},
  "jsFiles": [
    "hello.js"
  ],
  "elements": [
    {
      "title": "文本",
      "path": "@douyinfe/semi-ui/Typography.Text",
      "id": "pvccf4h0nv",
      "style": {
        "visible": true,
        "x": 47,
        "y": 122,
        "full": false,
        "width": 105,
        "height": 25
      },
      "propsEx": {
        "children": "Hello.state.name"
      },
      "props": {
        "children": "请输入您的大名"
      },
      "events": {
        "onClick": [
          {
            "id": "action_UWJmuY",
            "key": "Hello.actions.sayHello",
            "payload": ""
          }
        ]
      }
    },
  ],
  "name": "你好",
  "children": [
    "pvccf4h0nv"
  ]
}
```
这其中：
- style: 描述页面尺寸。 width:xx 固定宽度， autoWidth:true  自适应宽度
- properties: 字符串键值对，作为子页面时上级页面可修改此值影响当前页面样式
- jsFiles: 页面脚本文件
- elements: 页面元素
  - title: 元素名称，编辑时的标识
  - path：呈现的组件，例如@douyinfe/semi-ui/Input 表示 @douyinfe/semi-ui组件库下的Input组件
  - props: 属性值用来修改组件显示效果
  - propEx： 动态属性
  - style: 样式，组件上级对组件位置、大小、显隐进行控制
  - styleEx： 动态样式
  - event：组件发出事件后的处理动作
  - meta: 描述组件支持的双向绑定、资源等特性
  - children: 包含的子组件
- children: 页面直接的元素

## 页面脚本

上个例子脚本内容如下

```javascript
  export default {
  name: 'Hello',
  state: {
    name: '', // 姓名
    hello: '', // 欢迎语
    time: '' // 当前时间
  },

  setup () {
    this.updateTick()
  },

  actions: {
    sayHello () {
      this.hello = '您好,' + this.name
    },
    updateTick () {
      this.time = new Date()
      setTimeout(() => {
        this.updateTick()
      }, 1000) 
    }
  }
}
```

页面脚本和React和Vue的状态管理类似： 数据决定页面呈现，而事件则驱动数据进行改变。 

1. 数据决定页面呈现

上面例子，Hello.state.hello表示组件的children属性动态值，当hello状态变化，则组件则同时随之改变

2. 事件驱动数据进行改变
```json
 "events": {
    "onClick": [
      {
        "id": "action_UWJmuY",
        "key": "Hello.actions.sayHello",
        "payload": ""
      }
    ]
  }
```
这个定义表示 onClick 事件发生时， 调用了  Hello.actions.sayHello 方法。

3. 双向绑定

```json
"meta": {
    "sync": {
      "checked": {
        "source": "onChange",
        "path": "target.checked"
      },
    },
    "url": []
  },
```
这个描述，表示了组件的onChange事件携带的负载会直接修改 value属性所连接的状态。 path表示取值为事件payload.target.checked 对应的值。 如果没有可不填，取决于组件定义中事件上的 "payload": "target.checked" 定义。
 
上面输入框的配置描述了 用户输入文字， 文字改变状态(name), 输入框按name进行改变 这一系列典型的双向绑定的流程


## 组件
```json
{
  "name": "Typography.Text",
  "title": "文本",
  "icon": "svgs/typography.svg",
  "description": "基础文本组件，用于展示普通文字内容，支持加粗、删除线、下划线、省略、可复制、链接、不同颜色与大小等样式",
  "tags": [
    "文本",
    "展示",
    "基础组件",
    "排版"
  ],
  "category": "展示组件",
  "version": "1.0.0",
  "author": "LiuHan",
  "visualConfig": {
    "preferredWidth": 240,
    "preferredHeight": 32,
    "resizable": true,
    "aspectRatio": "no"
  },
  "properties": [
    {
      "name": "children",
      "description": "显示的文本内容",
      "label": "文本内容",
      "type": "string",
      "defaultValue": "文本内容"
    },
    {
      "name": "code",
      "description": "是否以代码样式展示",
      "label": "代码样式",
      "control": "boolean",
      "type": "boolean",
      "defaultValue": false
    },
    {
      "name": "copyable",
      "description": "是否允许点击复制文本",
      "label": "可复制",
      "control": "boolean",
      "type": "boolean",
      "defaultValue": false
    },
    {
      "name": "delete",
      "description": "是否显示删除线",
      "label": "删除线",
      "control": "boolean",
      "type": "boolean",
      "defaultValue": false
    },
    {
      "name": "disabled",
      "description": "是否置灰禁用状态",
      "label": "禁用",
      "control": "boolean",
      "type": "boolean",
      "defaultValue": false
    },
    {
      "name": "ellipsis",
      "description": "内容超长时自动省略",
      "label": "自动省略",
      "control": "boolean",
      "type": "boolean",
      "defaultValue": false
    },
    {
      "name": "link",
      "description": "是否作为链接展示",
      "label": "链接样式",
      "control": "boolean",
      "type": "boolean",
      "defaultValue": false
    },
    {
      "name": "mark",
      "description": "是否高亮标记",
      "label": "高亮标记",
      "control": "boolean",
      "type": "boolean",
      "defaultValue": false
    },
    {
      "name": "size",
      "description": "文本大小",
      "label": "大小",
      "control": "select",
      "type": "string",
      "options": [
        {
          "label": "标准",
          "value": "normal"
        },
        {
          "label": "小",
          "value": "small"
        },
        {
          "label": "继承父级",
          "value": "inherit"
        }
      ],
      "defaultValue": "normal"
    },
    {
      "name": "strong",
      "description": "是否加粗",
      "label": "加粗",
      "control": "boolean",
      "type": "boolean",
      "defaultValue": false
    },
    {
      "name": "type",
      "description": "文本颜色类型",
      "label": "颜色类型",
      "control": "select",
      "type": "string",
      "options": [
        {
          "label": "主要",
          "value": "primary"
        },
        {
          "label": "次要",
          "value": "secondary"
        },
        {
          "label": "三级",
          "value": "tertiary"
        },
        {
          "label": "四级",
          "value": "quaternary"
        },
        {
          "label": "警告",
          "value": "warning"
        },
        {
          "label": "危险",
          "value": "danger"
        },
        {
          "label": "成功",
          "value": "success"
        }
      ],
      "defaultValue": "primary"
    },
    {
      "name": "underline",
      "description": "是否显示下划线",
      "label": "下划线",
      "control": "boolean",
      "type": "boolean",
      "defaultValue": false
    },
    {
      "name": "weight",
      "description": "字体粗细数值",
      "label": "字重",
      "control": "number",
      "type": "number",
      "min": 100,
      "max": 900,
      "defaultValue": 400
    }
  ],
  "events": []
}

```

## 组件格式
RidgeUI前端组件需要使用下面格式进行描述。 框架按这个文件决定组件可以配置哪些属性和事件

## 文件格式

```json
{
  "name": "FlexContainer",
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

给出的UI组件表格如下：

Banner
属性	说明	类型	默认值	版本
bordered	是否展示边框，仅在非全屏模式下有效	boolean	false	1.0
className	类名	string	-	-
closeIcon	自定义关闭icon，为 null 时不显示关闭按钮	string| ReactNode	-	1.0
description	描述内容	ReactNode	-	1.0
fullMode	是否为全屏模式	boolean	true	1.0
icon	自定义 icon，为 null 时不显示 icon	string| ReactNode	-	1.0
onClose	关闭时的回调函数	function	-	-
style	样式名	object	-	-
title	标题	ReactNode	-	1.0
type	类型，支持 info, success, danger, warning	string	info	-