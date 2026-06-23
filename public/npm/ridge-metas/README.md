# Open-Ridge AI时代的页面及交互呈现制作工具
Open-Ridge是一个零代码前端框架，可以借助AI让普通用户能制作页面。

## 页面配置
下面是一个Open-Ridge的页面配置示例：
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
页面是由多个组件组成，为了支持组件的联动和动态效果，还通过jsFiles指定了页面脚本。 
页面JSON文件格式如下：
- title  页面标题
- style: 描述页面整体样式， 可以写 width/height/background等
- jsFiles: 页面脚本文件列表, 必须写为配套生成的页面脚本文件名称
- elements: 页面元素，包含：
  - title: 元素名称，编辑时的标识
  - path：渲染使用的组件路径，取值来自组件描述中，组件路径 (Path) 指定的部分，必须严格匹配
  - props: 属性值对象，用来修改组件显示效果
  - propEx：动态属性对象，随页面状态变化进行动态计算
  - style: 样式对象，组件上级对组件位置、大小、显隐进行控制。页面根组件（页面元素列表children）支持 x/y/width/height/visible等属性
  - styleEx： 动态样式对象，随页面状态变化进行动态计算。上述x/y/width/height/visible可以设置为页面状态
  - event：定义组件发出事件后的处理动作
  - assets: 指定哪些属性是资源类型。 例如 ["src"] 表示src属性对应的资源为图片地址。
  - children: 包含的子组件。组件只有明确说明为容器类型并且children类型为子节点时，才能包含子组件
- children: 页面元素列表

关于propEx和styleEx请参考下面页面脚本相关描述

## 页面脚本

页面脚本定义了页面的交互和动态展示逻辑，原理React和Vue的状态管理类似，脚本中定义了状态(state)和动作(action)。状态决定页面呈现，而动作则驱动页面状态变化

上个例子对应脚本内容如下
```javascript
export default {
  name: 'Hello',
  state: {  // 状态数据
    name: '', // 姓名
    hello: '', // 欢迎语
    time: null // 当前时间
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
上面的脚本，定义了动作方法， 通过this.state.hello 修改了状态。

具体来说：

1. 数据决定页面呈现

页面配置中，组件的属性propEx、样式styleEx 都可以定义其绑定的状态，例如：
```json
  "propEx": {
    "children": "Hello.state.name"
  },
  "styleEx": {
    "x": "Hello.state.x"
  }
```
上面例子表示children的值随state.name的状态数据进行变化。 格式为[脚本Name.state.状态名称]。 

注意：组件属性值可能是一个object类型，但是propEx赋值必须是上述格式的字符串。状态的取值可以是 数字、布尔、字符串、对象等标准JS对象。

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

3. 双向绑定

当组件定义了数据绑定 propEx.value 时, 例如
```json
  "propEx" : {
     "value": "Hello.state.name"
  }
```
运行时会自动监听组件的onChange事件， 将onChange事件的返回值给到value，并且更新value指定的状态。在用户输入Input、Select的场合，只需要绑定到状态就可以了，状态会自动进行更新

4. 组件库的依赖
!!不能使用 import 语法来引入其他库，如果页面脚本执行需要依赖一些第三方库时，请给出第三方下载地址，（库必须是umd形式，在脚本中直接使用umd全局变量名称使用）
非必要情况，请不要使用第三方库。

5. 页面脚本只能读取和更新状态，禁止直接操作DOM。例如：通过styleEx的visible指定的状态 （true/false）来切换组件显隐


## 组件

制作应用时，用户会同时提供一系列应用需要的UI组件， 描述格式如下： 

Button (按钮)
用途：用于页面点击操作、提交表单、确认取消等交互场景。
组件路径 (Path): @douyinfe/semi-ui/Button
属性 (Props) 配置：
children: string，默认值“按钮”。必填，按钮上显示的文字。
block: boolean，默认值false。是否占满整行宽度。

这样，通过组件路径、属性的描述，可以生成上面页面配置。 Open-Ridge平台组件非常多，需要用户即时提供以便达到最好的呈现效果

## 应用目录

上述前面的页面、页面脚本还有页面中可能使用的图片资源等信息，可以放置到相同目录， 同时提供package.json 文件描述应用。

例如
```json
{
  "name": "ridge-hecebxwn",
  "version": "1.0.0",
  "icon": "icon.png",
  "description": "1—5月全国房地产市场数据概览"
}
```

例如，最终目录结构如下：
LogosAwsShield.svg
package.json
passwordGenerator.js
PasswordGenerator.json
prompt.md

（组件运行文件在页面运行时会通过组件路径自动加载。不需要加入应用目录）

最后整个目录需要打成zip包， 可以放到Open-Ridge编辑器中进一步调整， 或者放到运行时中直接执行

Skill要求根据输入需求 + 提供的组件  完成上述zip包的输出

## 举例





