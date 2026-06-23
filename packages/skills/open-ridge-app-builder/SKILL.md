---
name: open-ridge-app-builder
description: 生成 Open-Ridge 零代码前端框架的应用包（.zip）。Open-Ridge 是一个 AI 驱动的零代码页面制作平台，通过 JSON 配置页面结构 + JS 脚本管理状态和交互。内置 ridge-antd 组件库（40+ 组件），AI 根据用户需求自动选择组件。适用场景：根据自然语言需求，自动搭建交互式页面应用并打包为 zip。
---

# Open-Ridge App Builder

## 概述

将用户的需求描述转化为可直接在 Open-Ridge 平台上运行的完整应用包（zip）。**组件库已内置，无需用户提供组件清单**，AI 自动根据需求匹配合适组件。

**输入**：
- 用户提供的需求描述（想要的页面功能、交互方式）

**输出**：
- `{AppName}.json` — 页面配置
- `{appName}.js` — 页面脚本
- `package.json` — 应用描述
- `icon.svg` — **默认应用图标**（内置，自动包含）
- 最终打包为 `.zip` 文件

## 🧩 内置组件库

本 Skill 内置 **ridge-antd** 完整组件库（共 43 个组件），AI 自动从以下分类中匹配合适组件：

| 分类 | 组件 | 使用场景 |
|------|------|----------|
| **基础输入** | Input, InputNumber, Input.TextArea, Input.OTP | 文本/数字/多行/验证码 |
| **选择类** | Checkbox, Checkbox.Group, Radio.Group, Switch, Segmented, Select, Cascader, TreeSelect | 勾选/单选/开关/下拉/级联 |
| **日期时间** | DatePicker, TimePicker, Calendar | 日期/时间选择与展示 |
| **按钮操作** | Button, Dropdown | 点击触发/菜单操作 |
| **数据展示** | Table, Tag, Badge, Statistic, Statistic.Timer, Progress, QRCode, Timeline | 表格/标签/徽标/统计/进度条 |
| **导航** | Breadcrumb, Steps, Pagination | 路径/步骤/分页 |
| **文字展示** | Typography.Title, Typography.Text, Typography.Paragraph | 标题/文本/段落 |
| **媒体** | Image, Avatar, Avatar.Group, Carousel | 图片/头像/轮播 |
| **反馈提示** | Alert, Spin | 提示/加载状态 |
| **其他** | Divider, ColorPicker, Rate, Slider, Upload | 分割线/颜色/评分/滑动/上传 |

**AI 自动选型规则**：
- 读取 `references/components/ridge-antd.md` 获取每个组件的路径、数据属性、事件
- 根据用户需求类别自动选择最合适的组件
- 只使用数据类属性（value、children、disabled、loading 等），不使用样式/展示类属性

## 核心概念

### 数据驱动
页面由 `state`（状态）决定呈现，`actions`（动作）修改状态驱动变化。通过 `propEx` 和 `styleEx` 将组件属性/样式绑定到状态。

### 事件驱动
组件事件（onClick/onChange 等）触发 actions 中的方法，方法修改 state 触发 UI 更新。

### 双向绑定
当组件绑定 `propEx.value` + `meta.sync` 时，运行时自动监听 onChange 事件更新状态。适用于 Input、Select、Checkbox 等输入型组件。

## 工作流程

### 1. 解析用户需求
- 提取应用名称（作为 AppName）
- 确定页面布局和需要的功能区域
- 分析需要哪些交互逻辑和数据流

### 2. 自动选择组件
读取 `references/components/ridge-antd.md`，根据需求自动匹配合适的组件。

**自动选型规则**：
```
用户说"输入姓名" → 自动选 Input
用户说"设置密码位数" → 自动选 InputNumber  
用户说"勾选选项" → 自动选 Checkbox
用户说"点击生成" → 自动选 Button
用户说"展示标题" → 自动选 Typography.Title
用户说"显示结果" → 自动选 Input（只读展示）或 Typography.Text
```

### 3. 生成应用目录

参见参考文件：
- `references/page-config-spec.md` — 页面配置 JSON 格式详解
- `references/script-spec.md` — 页面脚本 JS 格式详解
- `references/patterns.md` — 常见交互模式参考
- `references/components/ridge-antd.md` — 内置组件库（自动选型用）

#### 生成 package.json

```json
{
  "name": "ridge-{随机后缀}",
  "version": "1.0.0",
  "description": "{应用简述}",
  "icon": "icon.svg"
}
```

- `name` 使用前缀 `ridge-` + 随机 6 位小写字母/数字
- `icon` **固定填写 `icon.svg`**，使用内置的默认应用图标
- 内置图标路径：`assets/icon.svg`，打包时自动复制到 zip 中

#### 生成页面配置 JSON（{AppName}.json）

结构概览（完整格式见 `references/page-config-spec.md`）：

```json
{
  "version": "2.0.0",
  "title": "{AppName}",
  "style": { "width": 980, "height": 720 },
  "jsFiles": ["{appName}.js"],
  "elements": [
    {
      "id": "{唯一ID}",
      "title": "{元素名称}",
      "path": "ridge-antd/Button",
      "props": {},
      "propEx": {},
      "styleEx": {},
      "style": { "x": 0, "y": 0, "width": 100, "height": 36, "visible": true },
      "meta": { "sync": {}, "url": [], "width": true, "height": true },
      "events": {},
      "children": [],
      "slots": []
    }
  ],
  "children": ["{元素ID列表}"]
}
```

**关键规则**：
- `path` **必须使用 `ridge-antd/` 前缀**，取自组件库定义中的 Path
- 每个元素必须有唯一的 `id`（语义化命名，如 `btn_generate`、`input_name`）
- `meta` 字段每个元素都需要包含

#### 生成页面脚本（{appName}.js）

结构概览（完整格式见 `references/script-spec.md`）：

```javascript
export default {
  name: "{ScriptName}",
  state: {
    // 所有需要动态绑定的状态
  },
  computed: {},
  setup() {
    // 初始化逻辑（如定时器、数据加载）
  },
  actions: {
    // 事件处理函数
  }
};
```

### 4. 打包输出

将以下文件打包为 `.zip`（**icon.svg 为必含项，从 `assets/icon.svg` 复制**）：
```
{AppName}.json       # 页面配置
{appName}.js         # 页面脚本
package.json         # 应用描述
icon.svg             # 内置默认应用图标（从 assets/icon.svg 复制）
```

## 生成规则详解

### 状态绑定（propEx / styleEx）

- `propEx` 格式：`"{ScriptName}.state.{属性名}"`
- `styleEx` 格式：`"{ScriptName}.state.{属性名}"`

**示例**：
```json
"propEx": {
  "children": "MyApp.state.greeting",
  "value": "MyApp.state.inputValue"
},
"styleEx": {
  "visible": "MyApp.state.isVisible"
}
```

### 事件绑定（events）

- `key` 格式：`"{ScriptName}.actions.{方法名}"`
- 每个事件可绑定多个动作（数组）

```json
"events": {
  "onClick": [
    {
      "id": "action_xxx",
      "key": "MyApp.actions.doSomething"
    }
  ]
}
```

### 双向绑定（meta.sync）

当组件需要双向绑定时（如 Input、Checkbox、InputNumber），配置 `meta.sync`：

```json
"propEx": {
  "value": "MyApp.state.name"
},
"meta": {
  "sync": {
    "value": {
      "source": "onChange"
    }
  }
}
```

**不同组件的 sync.path 规则**：
| 组件 | sync 配置 |
|------|-----------|
| Input / InputNumber / TextArea / Select | `{ "source": "onChange" }` — 不需要 path |
| Checkbox | `{ "source": "onChange", "path": "target.checked" }` |

### 资源类型属性

当组件属性为资源类型（如图片地址）时，在元素中标记：

```json
"assets": ["src"]
```

### 页面脚本约束

1. **禁止使用 `import` 语法** — 如需第三方库，使用 UMD 全局变量
2. **禁止直接操作 DOM** — 所有 UI 变化通过状态驱动
3. **状态值类型** — 可以是数字、布尔、字符串、对象等标准 JS 类型
4. **动作中通过 `this.state.xxx` 读写状态**

### 布局设计原则

| 组件类型 | 推荐高度 |
|----------|----------|
| 标题 | 36~44px |
| 标签/文本 | 24~30px |
| 输入框 | 32~36px |
| 按钮 | 32~40px |
| 复选框 | 28~32px |

- 推荐页面宽度：650~980px
- 组件间距：x/y 方向保持 8~16px 内边距
- 行间距：每组组件之间 y 间隔 36~50px
- 复选框或开关可并排，x 间隔 180~200px
- 输入框计算结果通常放在生成按钮下方 50~60px

## 组件结构说明

### 元素 `meta` 字段

```json
"meta": {
  "sync": {},    // 双向绑定配置（见上方规则）
  "url": [],     // 依赖 URL 资源
  "width": true,  // 允许调整宽度
  "height": true  // 允许调整高度
}
```

每个元素都需要包含 `meta` 字段。

### 容器组件

只有组件明确说明为容器类型且 children 类型为子节点时，才能包含子组件。普通组件 `children: []`。
