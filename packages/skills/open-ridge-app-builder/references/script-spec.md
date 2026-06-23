# 页面脚本 JS 格式参考

## 基本结构

```javascript
export default {
  name: "ScriptName",
  state: {
    // 页面状态数据
  },
  computed: {},
  setup() {
    // 初始化逻辑
  },
  actions: {
    // 事件处理函数
  }
};
```

| 字段 | 类型 | 必填 | 说明 |
|------|------|------|------|
| name | string | 是 | 脚本名称，用于 propEx/styleEx/events 中引用 |
| state | object | 是 | 页面状态数据，所有驱动 UI 的数据在此定义 |
| computed | object | 否 | 计算属性（通常为空） |
| setup | function | 否 | 初始化函数，页面加载时自动执行 |
| actions | object | 是 | 动作方法，由组件事件触发调用 |

## 状态（state）

状态是页面数据核心，所有通过 `propEx`/`styleEx` 绑定的数据都必须在此定义：

```javascript
state: {
  name: "",               // 文本类型
  count: 0,               // 数字类型
  isVisible: true,        // 布尔类型
  items: [],              // 数组类型
  user: null,             // 对象类型（初始为 null 或对象）
  currentTime: new Date() // 日期类型
}
```

**状态默认值原则**：
- 文本类：默认为空字符串 `""`
- 数字类：根据场景设默认值（如 `0`、`12`、`100`）
- 布尔类：`true` 或 `false`
- 列表类：`[]`
- 对象类：`null` 或 `{}`

## 动作（actions）

动作是修改状态的方法，通过 `this.state.xxx` 读写状态：

```javascript
actions: {
  // 简单状态修改
  toggleVisibility() {
    this.state.isVisible = !this.state.isVisible;
  },

  // 带参数的处理
  updateValue(value) {
    this.state.inputValue = value;
  },

  // 复杂逻辑
  generateData() {
    let result = "";
    for (let i = 0; i < this.state.count; i++) {
      result += String.fromCharCode(65 + i);
    }
    this.state.result = result;
  },

  // 异步操作（如 clipboard API）
  async copyContent() {
    const text = this.state.content;
    if (!text) return;
    await navigator.clipboard.writeText(text);
  }
}
```

### 动作编写规则

1. 通过 `this.state.xxx` 读写状态
2. 方法名使用驼峰命名（camelCase）
3. 可直接使用标准 JS API（如 `setTimeout`、`Math.random`、`navigator.clipboard` 等）
4. **禁止直接操作 DOM**（如 `document.getElementById`、`innerHTML` 等）
5. 异步操作使用 `async/await`
6. 如果动作需要从事件中获取参数，方法可以接收参数

## 初始化（setup）

`setup()` 在页面加载时自动执行，用于：

```javascript
setup() {
  // 设置默认值
  this.state.count = 10;

  // 启动定时器
  this.state.currentTime = new Date();
  setInterval(() => {
    this.updateClock();
  }, 1000);

  // 初始化数据
  this.state.items = ["选项A", "选项B", "选项C"];
}
```

## 第三方依赖

禁止使用 `import` 语法。如需第三方库：

- 库必须是 UMD 格式
- 在脚本中直接使用 UMD 全局变量名称
- 在页面脚本注释中注明 CDN 下载地址

```javascript
// 依赖：https://cdn.example.com/library.umd.js （需要手动添加到页面）
export default {
  name: "MyApp",
  state: {},
  setup() {
    // 直接使用全局变量
    const result = SomeLibrary.doSomething();
  },
  actions: {}
}
```

## 示例：完整脚本

```javascript
export default {
  name: "CounterApp",
  state: {
    count: 0,
    step: 1,
    message: ""
  },
  computed: {},
  setup() {
    this.state.message = "准备就绪";
  },
  actions: {
    increment() {
      this.state.count += this.state.step;
      this.state.message = `当前值: ${this.state.count}`;
    },
    decrement() {
      this.state.count -= this.state.step;
      this.state.message = `当前值: ${this.state.count}`;
    },
    reset() {
      this.state.count = 0;
      this.state.message = "已重置";
    }
  }
};
```
