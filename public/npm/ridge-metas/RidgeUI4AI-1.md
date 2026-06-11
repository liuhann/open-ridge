1. RidgeUI 框架概述

RidgeUI 是 AI 驱动的零代码前端框架，采用数据驱动视图、事件驱动数据模式。页面由 JSON 配置 + JS 脚本 组成，静态值写属性、动态值绑定状态，交互触发事件、事件修改状态，支持组件双向绑定。

2. 页面根配置（JSON）

```json
{
  "version": "2.0.0",
  "title": "",
  "style": {},
  "properties": {},
  "jsFiles": [],
  "elements": [],
  "name": "页面名称",
  "children": []
}
```

字段说明
version：固定为 2.0.0
title: 页面标题，也作为文件名称，英文
style：页面尺寸，width/height 固定宽高；autoWidth/autoHeight: true 自适应
properties：字符串键值对，子页面由上级传参，独立访问可通过 URL query 传值
jsFiles：页面依赖脚本，填写相对路径
elements：页面内所有组件，列表形式，具体描述见后组件元素配置
name：页面名称
children：页面一级渲染节点，仅存放组件 id 数组


3. 组件元素配置

```json
{
  "id": "全局唯一ID",
  "title": "组件名称",
  "path": "组件引用路径",
  "style": {},
  "props": {},
  "propEx": {},
  "styleEx": {},
  "events": {},
  "meta": {},
  "children": []
}
```

字段说明
id：每个组件拥有的全局唯一标识
title：组件标识名
path：组件库路径，例：@douyinfe/semi-ui/Input
style：控制组件坐标 (x/y)、尺寸 (width/height)、显隐 (visible)、是否铺满 (full)
props：静态属性，固定不变的值
propEx：动态属性，绑定格式：脚本名.state.字段 / 脚本名.computed.计算字段，状态变更自动更新视图
styleEx：动态样式，支持状态绑定
events：组件交互事件配置
meta：组件元信息，用于双向绑定
children：容器子节点，仅存放组件 id 数组


4. 节点渲染规则（children）
页面、容器组件的 children 均为 id 数组，组件统一扁平存于 elements，不嵌套对象。
渲染引擎根据 id 查找对应组件，交由父容器渲染。
父容器负责子节点布局：读取组件style属性的x/y/width/height值；Flex 容器识别 flex 系列样式实现弹性布局。

5. 页面脚本（JS）

```javascript
export default {
  name: 'Hello',       // 脚本唯一标识名，用于页面配置引用
  state: { ... },      // 响应式状态数据源
  setup() { ... },     // 页面初始化钩子，加载时自动执行
  computed: {          // 响应式计算属性
    计算字段名: {
      get() { /* 计算逻辑 */ },
      dependencies: ["依赖state字段名"] // 依赖列表，依赖变化自动重算
    }
  },
  actions: {           // 事件触发的动作方法集合
    method() { 
      this.state.xxx = yyy 
    }
  }
}
```
字段说明
name：脚本全局唯一名称，需与配置中引用名称保持一致
state：响应式状态数据
computed：计算属性，包含 get 计算函数、dependencies 依赖字段数组，依赖变化自动重算
setup：页面初始化执行函数
actions：事件触发的动作方法，可直接读写 this 访问状态

setup和actions中， 通过this.state.xxx 去读取或者设置状态值

6. 事件机制

```json
"events": {
  "onClick": [
    {
      "id": "动作唯一ID",
      "key": "脚本名.actions.方法名",
      "payload": "自定义字符串"
    }
  ]
}
```
核心规则
- 组件自身会触发事件，并携带原生事件负载（如输入框内容、event 对象等），框架不做干预。
- payload 是可选配置，仅在需要自定义传参时使用（如计算器按钮区分按键），大部分场景可以不配置。
- 如果配置了 payload → 第一个参数是 payload，第二个及以后是组件原生事件负载
- 如果没有配置 payload → 直接将组件原生事件负载作为第一个参数


7. 双向绑定（meta.sync）
```json
"meta": {
  "sync": {
    "组件属性名": {
      "source": "触发事件名",
      "path": "事件参数取值路径"
    }
  }
}
```
meta.sync 的内容不是生成的，而是来自相关【组件描述文档】
组件描述中会写明支持双向绑定的属性、事件、返回值路径等信息，例如

```text
checked: boolean，默认值false。是否选中（支持双向绑定 onChange）。
事件 (Events)：
onChange: 选中状态变化时触发。
Payload: target.checked(返回布尔值)。

```
必须完全照搬组件描述，不可自定义

执行流程
组件触发指定事件，框架按 path 从事件参数中取值，如不存在path字段，就直接取事件根参数
将取出的值赋值给 sync 键名对应的组件属性；
若该组件属性通过 propEx 绑定了脚本状态，则自动同步更新对应 state，完成视图与状态双向联动。

8. 生成强制规则

同时输出 页面 JSON + 对应 JS 脚本，字段完整不增删。
静态值放 props，动态绑定放 propEx，二者严格分离。
事件 key 格式固定：脚本名.actions.方法名。
双向绑定必须配置 meta.sync，并搭配 propEx 状态绑定。
所有 id 全局唯一，children 只存组件 id。
计算属性必须配置 dependencies，脚本、事件、绑定路径名称统一。

9. 完整示例

JSON 配置
```json
{
  "version": "2.0.0",
  "style": { "width": 980, "height": 720 },
  "title": "Hello Ridge",
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
  "name": "你好",
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

