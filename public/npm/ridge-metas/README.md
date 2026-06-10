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
      "propEx": {
        "children": "Hello.state.name"
      },
      "props": {
        "children": "请输入您的大名"
      },
      "events": {
        "onClick": [
          {
            "id": "action_UWJmuY",
            "key": "Hello.actions.sayHello"
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
- style: 描述页面整体样式， 可以写 width/height/background等
- jsFiles: 页面脚本文件列表
- elements: 页面元素，包含：
  - title: 元素名称，编辑时的标识
  - path：渲染使用的组件路径，例如@douyinfe/semi-ui/Input 表示 @douyinfe/semi-ui组件库下的Input组件
  - props: 属性值对象，用来修改组件显示效果
  - propEx：动态属性对象，随页面状态变化进行动态计算
  - style: 样式对象，组件上级对组件位置、大小、显隐进行控制
  - styleEx： 动态样式对象，随页面状态变化进行动态计算
  - event：定义组件发出事件后的处理动作
  - meta: 描述组件支持的双向绑定、资源等特性
  - children: 包含的子组件
- children: 页面元素列表

## 页面脚本

页面脚本定义了页面的交互和动态展示逻辑，它和React和Vue的状态管理类似， 定义了状态和动作。状态决定页面呈现，而动作则驱动页面状态变化

上个例子对应脚本内容如下

```javascript
export default {
  name: 'Hello',
  state: {  // 状态数据
    name: '', // 姓名
    hello: '', // 欢迎语
    time: '' // 当前时间
  },
  computed: {  // 计算状态及列表单项状态
    currentSeccond: {
      get: state => {
        return state.time.getSeconds() + ''
      },
      dependencies: ['time']
    },
    listItemContent: (scope, state) => { // 循环项单项的数据获取计算
      return scope.item.textContent   // scope.item  
    }
  },
  setup () {
    this.updateTick()
  },

  actions: {
    sayHello () {
      this.state.hello = '您好,' + this.state.name
    },
    updateTick () {
      this.state.time = new Date()
      setTimeout(() => {
        this.updateTick()
      }, 1000) 
    }
  }
}
```
1. 数据决定页面呈现

组件的属性propEx、样式styleEx 都可以定义其绑定的状态，例如：
```json
  "propEx": {
    "children": "Hello.state.name"
  }
```
上面例子表示children的值随state.name的状态数据进行变化。 格式为[脚本命名.state.状态名称] 或者 [脚本命名.computed.计算状态名称]

2. 事件驱动数据进行改变

组件的events配置定义了事件对应的一系列处理动作， 例如：
```json
 "events": {
    "onClick": [
      {
        "id": "action_UWJmuY",
        "key": "Hello.actions.sayHello",
      }
    ]
  }
```
它表示组件onClick事件发生时，调用Hello.actions.sayHello 方法。 格式为[脚本命名.actions.方法名]
id是动作的唯一标识，用于编辑期间使用

3. 双向绑定

当组件定义了数据绑定 propEx.value 时
```json
  "propEx" : {
     "value": "Hello.state.name"
  }
```
运行时会自动处理onChange事件， 将onChange事件的返回值给到value，并且更新value指定的状态。在用户输入Input、Select的场合，只需要绑定到状态就可以了，状态会自动进行更新

4. 计算状态

计算状态是随状态改变后联动计算的值。 它主要用于2种情况：

1、 直接随状态改变，即状态变化后，会重新计算值，并驱动绑定的组件重新渲染。 格式通常是: 

```javascript
computed: {  // 计算状态及列表单项状态
  currentSeccond: {
    get: state => { 
      // get方法，参数为state， 根据state计算并返回值
      return;
    },
    dependencies: ['time'] // 定义依赖的状态
  },
},
```

2、计算列表单项值，经常是将状态数组(例如 listData)绑定到列表后， 列表中每个单项会得到数组数据（例如 listData[0]、listData[1]...）

单项绑定的计算值会额外接受到第一个参数， 包含 { item, i, list }信息

```javascript
  computed: {  
    listItemContent: ({ item, i, list}, state) => { // 循环项单项的数据获取计算
      return item.textContent  
    }
  },
```

## 应用及资源

一个前端应用可能会包含多个页面、脚本及图片等其他资源， 他们会同时放置到一个目录之下， 页面内引用其他资源写入相对于当前页面的路径。
例如 a.js  folder/a.js 等

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






