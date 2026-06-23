# 常见交互模式参考

本文档提供 Open-Ridge 应用中常见的交互模式示例，根据用户需求识别对应模式并参考生成。

---

## 模式 1：表单输入 + 提交

**适用场景**：登录、注册、反馈、设置

### 组件需求
- Input/InputNumber（输入框）
- Checkbox（复选框）
- Button（提交按钮）
- Typography.Text（标签/错误提示）

### 核心实现

**状态**：
```javascript
state: {
  username: "",
  password: "",
  agreed: false,
  errorMsg: ""
}
```

**事件绑定**：
```json
"propEx": { "value": "MyApp.state.username" },
"meta": { "sync": { "value": { "source": "onChange" } } }
```

```json
"events": {
  "onClick": [{ "id": "action_submit", "key": "MyApp.actions.handleSubmit" }]
}
```

**动作**：
```javascript
actions: {
  handleSubmit() {
    if (!this.state.username || !this.state.password) {
      this.state.errorMsg = "请填写完整信息";
      return;
    }
    // 处理提交逻辑
    this.state.errorMsg = "";
  }
}
```

---

## 模式 2：数据展示 + 动态更新

**适用场景**：数据看板、仪表盘、计时器

### 组件需求
- Typography.Title（标题）
- Typography.Text（数据展示）
- Button（刷新/操作按钮）

### 核心实现

**状态**：
```javascript
state: {
  currentTime: null,
  dataValue: 0,
  statusText: "运行中"
}
```

**setup 定时器**：
```javascript
setup() {
  this.state.currentTime = new Date();
  setInterval(() => {
    this.state.currentTime = new Date();
  }, 1000);
}
```

**绑定到 propEx**：
```json
"propEx": { "children": "MyApp.state.currentTime" }
```

---

## 模式 3：列表/选项 + 动态结果

**适用场景**：配置生成器、参数设置、密码生成器

### 组件需求
- InputNumber（数字设置）
- Checkbox（多选选项）
- Button（生成按钮）
- Input（结果显示）
- Typography.Text（标签）

### 核心实现

**状态**：
```javascript
state: {
  count: 10,
  optionA: true,
  optionB: true,
  optionC: false,
  result: ""
}
```

**动作**：
```javascript
actions: {
  generate() {
    let pool = "";
    if (this.state.optionA) pool += "ABC";
    if (this.state.optionB) pool += "123";
    if (this.state.optionC) pool += "xyz";
    if (!pool) {
      this.state.result = "请至少选择一项";
      return;
    }
    let output = "";
    for (let i = 0; i < this.state.count; i++) {
      output += pool[Math.floor(Math.random() * pool.length)];
    }
    this.state.result = output;
  },

  copyResult() {
    const text = this.state.result;
    if (!text || text === "请至少选择一项") return;
    navigator.clipboard.writeText(text);
  }
}
```

---

## 模式 4：切换/显隐控制

**适用场景**：显示/隐藏区域、步骤切换、展开收起

### 状态
```javascript
state: {
  isExpanded: false,
  currentStep: 1,
  showDetail: false
}
```

**styleEx 绑定显隐**：
```json
"styleEx": { "visible": "MyApp.state.isExpanded" }
```

**动作**：
```javascript
actions: {
  toggle() {
    this.state.isExpanded = !this.state.isExpanded;
  },
  nextStep() {
    if (this.state.currentStep < 3) this.state.currentStep++;
  }
}
```

---

## 模式 5：随机/计算生成

**适用场景**：随机密码、随机数生成、抽奖、换算器

### 通用技巧

- 随机数：`Math.random()`
- 字符串截取：`String.slice()`, `String.charAt()`
- 固定长度随机：`for` 循环逐个取字符
- 剪贴板：`navigator.clipboard.writeText()`

---

## 组件路径对照表

| 用户说 | 组件路径 |
|--------|----------|
| 按钮 / 点击 | `@douyinfe/semi-ui/Button` |
| 标题 / 标题 | `@douyinfe/semi-ui/Typography.Title` |
| 文本 / 文字 | `@douyinfe/semi-ui/Typography.Text` |
| 输入框 / 输入 | `@douyinfe/semi-ui/Input` |
| 数字输入 | `@douyinfe/semi-ui/InputNumber` |
| 复选框 / 勾选 | `@douyinfe/semi-ui/Checkbox` |

> **注意**：以上为常见映射，实际使用时**必须**以用户提供的组件清单中的 Path 为准。
