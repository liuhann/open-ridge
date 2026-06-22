一、框架定位
Open-Ridge 是AI赋能的零代码前端页面及交互制作框架，支持普通用户无代码开发可交互动态前端页面，核心逻辑为状态驱动页面渲染、事件驱动状态变更。
二、页面JSON配置规范（核心文件）
页面由JSON配置文件定义，配套JS脚本文件实现交互逻辑，完整字段规则如下：
1. 顶层通用字段
- version：框架版本号，字符串格式
- title：页面展示标题，字符串格式
- style：页面全局样式，支持width、height、background等通用CSS样式
- jsFiles：关联页面脚本文件名数组，仅填写配套生成的脚本名，用于绑定交互逻辑
- elements：页面组件数组，存储所有渲染组件配置
- children：页面根组件ID列表，定义页面渲染的顶层组件
2. elements 组件核心字段（单组件配置）
- title：组件编辑标识名称，用于编辑层识别
- path：组件库引入路径，取值来自组件描述中，组件路径 (Path) 指定的部分，必须严格匹配
- id：组件唯一标识，全局唯一
- style：组件静态布局样式，支持visible（显隐）、x/y（坐标）、width/height（尺寸）、full（是否全屏）
- styleEx：组件动态样式，绑定页面状态，随state数据实时变更。
- props：组件静态属性，固定渲染效果，不随状态变化
- propEx：组件动态属性，字符串格式绑定状态，随state实时更新，绑定规则：脚本名称.state.状态字段名，支持绑定字符串、数字、布尔、对象等所有JS基础类型数据
- assets：资源属性标识数组，用于标记组件属性为图片等资源地址
- events：组件交互事件配置，绑定脚本动作，支持onClick等原生组件事件
- children：子组件ID列表，仅容器类组件可配置，普通组件不支持子组件嵌套
关于propEx和styleEx请参考下面页面脚本相关描述
3. 事件配置规则（events）
组件事件触发后执行对应脚本动作，配置格式：事件名绑定动作数组，每个动作包含唯一id、执行key。
key固定格式：脚本名称.actions.方法名，触发事件时自动调用对应脚本动作函数。

三、页面脚本JS规范（交互逻辑文件）
脚本文件定义页面状态与交互动作，驱动页面动态变化，语法贴近React/Vue状态管理，单个脚本固定结构如下：
1. 脚本基础结构
- name：脚本唯一名称，全局唯一，用于页面JSON绑定
- state：页面状态数据源，所有动态渲染、双向绑定的数据源，可自定义字段（字符串、数字、布尔、对象、数组等）
- setup：页面初始化生命周期函数，页面加载时自动执行
- actions：自定义交互动作函数集合，通过this.state.字段名修改状态数据，间接更新页面渲染效果
2. 核心联动机制
- 状态驱动渲染：组件propEx、styleEx绑定state数据，state变更自动刷新组件属性/样式
- 事件驱动状态：组件触发events绑定的动作函数，函数内部修改state，实现页面联动交互
- 双向绑定规则：Input、Select等输入类组件，若propEx绑定value字段（格式：脚本名.state.字段），框架自动监听组件onChange事件，同步更新绑定的state状态，无需手动写更新逻辑
3. 第三方库使用限制（硬性规则）
- 禁止使用import语法引入第三方库
- 如需依赖第三方库，仅支持UMD格式文件，通过CDN地址引入，脚本中直接使用库挂载的全局变量
- 非业务必需，禁止引入任何第三方库
4. 页面脚本只能读取和更新状态，禁止直接操作DOM
四、核心运行逻辑总结
1. 静态渲染：JSON的props、style定义页面初始样式与内容；2. 动态渲染：propEx/styleEx绑定state，状态变更自动更新UI；3. 交互触发：用户操作触发组件事件，执行actions方法修改state，完成动态交互闭环。

附录1：标准页面JSON配置样例
```json
{
  "version": "2.0.0",
  "title": "页面名称",
  "style": {
    "width": 980,
    "height": 720
  },
  "jsFiles": ["demo.js"],
  "elements": [
    {
      "title": "组件名称",
      "path": "@douyinfe/semi-ui/ComponentName",
      "id": "unique_component_id",
      "style": {
        "visible": true,
        "x": 0,
        "y": 0,
        "full": false,
        "width": 100,
        "height": 30
      },
      "props": {},
      "propEx": {
        "children": "demo.state.field"
      },
      "styleEx": {
        "x": "demo.state.x"
      },
      "events": {
        "onClick": [
          {
            "id": "unique_action_id",
            "key": "demo.actions.handleAction"
          }
        ]
      },
      "assets": []
    }
  ],
  "children": ["unique_component_id"]
}
```

附录2：配套页面脚本JS样例
```javascript
export default {
  "name": "demo",
  "state": {
    "field": "",
    "x": 10
  },
  "setup": function() {},
  "actions": {
    "handleAction": function() {
      this.state.field = "状态更新内容";
      this.state.x = x + 10
    }
  }
}
```