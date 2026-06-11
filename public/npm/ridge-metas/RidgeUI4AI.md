RidgeUI AI零代码前端框架AI训练语料（纯文本完整版）
一、产品概述
RidgeUI是适配AI时代的零代码前端页面制作工具，依托内置可视化页面编辑器结合AI能力，快速开发交互式前端页面。
整体由两大核心部分构成：JSON格式的页面配置、JS格式的页面脚本。
整体运行逻辑：数据驱动页面渲染，事件驱动状态变更，底层设计理念对标Vue、React状态管理机制。
二、页面配置（JSON）完整规范
2.1 顶层通用字段
version：字符串，配置文件版本号
title：字符串，页面展示标题
style：对象，页面全局样式，支持width、height、background等标准CSS属性
jsFiles：字符串数组，用于引入当前页面依赖的外部JS脚本文件,可以为umd形式的js库，也可以是后面规范所指定的页面脚本形式
elements：数组，页面所有UI组件集合，为核心配置项
children：字符串数组，存放当前页面生效的所有组件唯一ID。组件只有明确说明为容器类型并且children类型为子节点时，才能包含子组件
2.2 elements组件字段说明
elements数组内每个对象对应一个页面组件，
全部属性释义：
title：组件别名，仅在编辑器内用于标识区分
path：组件导入路径，格式为【组件库/组件名】，示例：@douyinfe/semi-ui/Typography.Text
id：字符串，组件全局唯一ID
style：组件容器样式，控制组件位置、尺寸、显隐，内置固定属性：visible（布尔，控制显隐）、x/y（数字，画布坐标）、full（布尔，是否铺满父容器）、width/height（数字，组件宽高）；
styleEx：对象【可选】，动态样式，绑定页面状态，状态变更自动更新组件样式；
propEx：对象，动态属性，绑定state/computed状态，自动联动更新组件属性；
props：对象，组件静态属性，定义组件初始固定展示效果；
assets：字符串数组，标记指定属性为资源类型，例如["src"]代表该src属性值为图片资源地址；
events：对象【可选】，组件事件触发器，绑定事件对应的脚本动作；
children：字符串数组【可选】，当前组件下属子组件ID集合。
2.3 events事件配置规则
events以原生组件事件为key（如onClick、onChange），value为动作数组；
单条动作包含两个必填字段：id：动作唯一标识，用于编辑器内部识别；key：动作调用地址，固定格式：脚本名称.actions.自定义方法名。
三、页面脚本（JS）完整规范
页面脚本用于管理页面状态、交互逻辑、派生计算数据，以ES6默认导出对象为载体；
核心运行逻辑：state存储原始状态、computed根据state派生数据、actions修改状态、setup为页面初始化钩子。
3.1 顶层字段
name：字符串，脚本唯一名称，是页面配置绑定该脚本的唯一标识；
state：对象，全局静态数据源，自定义任意业务状态，可供组件属性、样式双向/单向绑定；
computed：对象，计算状态，基于state自动派生数据，无需手动更新；
setup：函数，页面生命周期初始化钩子，页面加载完成后自动执行；
actions：对象，自定义业务方法，接收组件事件调用，内部可直接修改state状态。
3.2 computed两种使用模式
模式1：全局计算状态。用于全局数据派生，可绑定至任意组件；结构包含get、dependencies两个字段：get(state)：回调函数，接收全局state，返回计算后的值；dependencies：字符串数组，声明该计算属性依赖的state字段，依赖变更则自动重算。
模式2：列表单项计算状态。专门服务循环列表组件，用于解析数组列表内的单项数据；回调函数参数：第一个参数为scope（包含item：当前单项数据、i：单项下标、list：原始数组），第二个参数为全局state。
四、核心绑定机制（全套运行规则）
4.1 单向数据绑定：作用域为propEx、styleEx；绑定语法：脚本名.state.状态名、脚本名.computed.计算属性名；绑定后组件自动监听对应状态，状态变更即时刷新组件属性/样式。
4.2 事件驱动机制：组件监听指定原生事件，触发后调用脚本actions内的自定义函数；函数内部通过this.state直接修改数据源，间接驱动页面组件更新。
4.3 双向数据绑定：仅支持Input、Select等可交互输入类组件；开发者只需在propEx中绑定value至指定state字段，框架自动内部封装onChange事件，无需手动配置事件；用户操作组件时，自动将组件值同步绑定至state，实现数据双向互通。
五、完整可运行官方示例
JSON 配置
```json
{
  "version": "2.0.0",
  "style": { "width": 980, "height": 720 },
  "name": "你好",
  "properties": {},
  "jsFiles": ["hello.js"],
  "elements": [
    {
      "title": "文本",
      "path": "@douyinfe/semi-ui/Typography.Text",
      "id": "pvccf4h0nv",
      "style": { "x": 47, "y": 122, "width": 105, "height": 25 },
      "propEx": { "children": "Hello.state.hello" },
      "props": { "children": "请输入大名" },
      "events": {
        "onClick": [
          { "id": "action_UWJmuY", "key": "Hello.actions.sayHello", "payload": "" }
        ]
      }
    }
  ],
  "children": ["pvccf4h0nv"]
}

```
JS 脚本

```javascript
export default {
  name: "Hello",
  state: {
    name: "",
    hello: ""
  },
  computed: {},
  setup() {},
  actions: {
    sayHello() {
      this.hello = "您好," + this.name;
    }
  }
};
```

