# RidgeUI AI时代的页面及交互呈现制作工具
RidgeUI是一个零代码前端框架，用户可以使用页面编辑器并借助AI来实现交互页面的制作。

## 页面配置
下面是一个RidgeUI的页面配置示例：
```json
{
  "version": "2.0.0",
  "title": "页面标题",
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
      "assets": [
        "src"
      ],
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
  "children": [
    "pvccf4h0nv"
  ]
}
```
这其中：
- title  页面标题
- style: 描述页面整体样式， 可以写 width/height/background等
- jsFiles: 页面脚本文件列表, 可以为umd形式的js库，也可以是后面规范所指定的页面脚本形式
- elements: 页面元素，包含：
  - title: 元素名称，编辑时的标识
  - path：渲染使用的组件路径，例如@douyinfe/semi-ui/Input 表示 @douyinfe/semi-ui组件库下的Input组件
  - props: 属性值对象，用来修改组件显示效果
  - propEx：动态属性对象，随页面状态变化进行动态计算
  - style: 样式对象，组件上级对组件位置、大小、显隐进行控制
  - styleEx： 动态样式对象，随页面状态变化进行动态计算
  - event：定义组件发出事件后的处理动作
  - assets: 指定哪些属性是资源类型。 例如 ["src"] 表示src属性对应的资源为图片地址。
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

当组件定义了数据绑定 propEx.value 时, 例如
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