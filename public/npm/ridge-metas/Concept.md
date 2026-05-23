RidgeUI 页面配置速览 (Page Schema)
页面由一个 JSON 对象定义，用于描述页面的结构、样式和逻辑。
顶层字段：
version: 配置文件版本号。
style: 页面画布设置。
width/height: 固定尺寸。
autoWidth: true 表示自适应宽度。
properties: 页面级变量，作为子页面时可由父页面传入。
jsFiles: 脚本文件路径数组（如 ["hello.js"]），用于定义状态和动作。
elements: 页面元素数组，页面的核心内容。
name: 页面名称。
children: 根节点元素的 ID 列表。
Elements (组件节点) 配置：
每个元素代表一个具体的 UI 组件。
id: 元素唯一标识。
title: 编辑时的名称。
path: 组件来源路径（例：@douyinfe/semi-ui/Input）。
props: 静态属性值（如 placeholder: "请输入"）。
propsEx: 动态属性绑定。值为状态路径（如 Hello.state.name），状态变则视图变。
style: 布局与显隐。
x, y: 坐标。
width, height: 尺寸。
visible: 是否显示。
events: 事件映射。定义组件交互行为。
键为事件名（如 onClick）。
值为动作数组，key 指向脚本方法（如 Hello.actions.sayHello）。
meta: 组件元数据。
sync: 双向绑定协议（详见核心机制）。
children: 该元素包含的子元素 ID 列表（用于容器组件）。

2. 页面脚本 (Logic Script)
通过 jsFiles引入，采用 ES Module 导出对象：
export default {
  name: 'Hello',       // 命名空间
  state: { ... },      // 响应式数据源
  setup() { ... },     // 初始化钩子
  actions: {           // 方法集合
    method() { this.state.xxx = yyy }
  }
}
核心逻辑流：
数据驱动：propsEx引用 State，State 变更自动更新 UI。
事件驱动：UI 事件 → 调用 actions→ 修改 State。
双向绑定：meta.sync自动将 UI 事件（如输入）同步回 State，无需手写 Action。
3. 关键路径约定
状态读：<Namespace>.state.<key>
动作写：<Namespace>.actions.<method>
事件传参：payload可传递事件对象中的数据。

RidgeUI 核心机制（含双向绑定）
数据驱动与绑定
RidgeUI 采用状态驱动视图模式。
静态数据写在 props 中。
动态数据写在 propsEx 中，值为状态路径（如 User.state.name），状态变更自动刷新视图。
事件与动作
UI 事件（如 onClick）通过 elements[x].events 配置。
事件触发脚本中的 actions。
示例：{ "onClick": [{ "key": "Hello.actions.sayHello" }] }
双向绑定协议 (meta.sync)
这是引擎层面的自动同步机制，无需加载组件描述文件即可生效。
配置含义：
当组件触发 source 指定的事件时，引擎自动提取事件负载（Payload）中的值，并更新到对应的属性状态中。
配置结构：
meta.sync 下定义键值对，键为组件属性名，值为监听规则。
source: 监听的组件事件名（如 onChange）。
path: 从 payload 中提取数据的路径。
解析规则：
若组件事件定义了 payload（如 target.value），则按 path 提取。
若未定义 payload，则直接使用事件回调的第一个参数作为值。
执行结果：
引擎将提取的值，写入 propsEx.属性名 所绑定的状态中。
组件定义参考：
组件描述文件中的 events 定义了数据结构，用于确定 path。
示例：{ "name": "onChange", "payload": "target.checked" } 表示取 payload.target.checked。
