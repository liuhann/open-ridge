# 页面配置 JSON 格式参考

## 顶层结构

```json
{
  "version": "2.0.0",
  "title": "页面标题",
  "style": { "width": 980, "height": 720 },
  "properties": {},
  "jsFiles": ["appScript.js"],
  "elements": [],
  "name": "PageName",
  "children": []
}
```

| 字段 | 类型 | 必填 | 说明 |
|------|------|------|------|
| version | string | 是 | 固定 `"2.0.0"` |
| title | string | 是 | 页面标题，建议与 AppName 一致 |
| style | object | 是 | 页面整体样式：width, height, background 等 |
| properties | object | 否 | 页面级属性配置，通常为 `{}` |
| jsFiles | string[] | 是 | 页面脚本文件列表，需与生成的 JS 文件名一致 |
| elements | object[] | 是 | 页面元素数组 |
| name | string | 否 | 页面名称，通常与 title 一致 |
| children | string[] | 是 | 页面根组件 ID 列表，决定组件渲染顺序 |

## elements 元素

每个元素对应一个页面组件：

```json
{
  "id": "element_id",
  "title": "元素名称",
  "path": "@douyinfe/semi-ui/Button",
  "style": {
    "visible": true,
    "x": 30,
    "y": 80,
    "width": 120,
    "height": 36
  },
  "props": {
    "children": "按钮文字",
    "type": "primary"
  },
  "propEx": {},
  "styleEx": {},
  "assets": [],
  "events": {},
  "meta": {
    "sync": {},
    "url": [],
    "width": true,
    "height": true
  },
  "children": [],
  "slots": []
}
```

| 字段 | 类型 | 必填 | 说明 |
|------|------|------|------|
| id | string | 是 | 元素唯一标识，建议语义化命名 |
| title | string | 是 | 元素名称，编辑时的显示标识 |
| path | string | 是 | 组件路径，必须与用户提供的组件 Path 严格一致 |
| style | object | 是 | 布局样式：x, y, width, height, visible |
| props | object | 是 | 静态属性值，对应组件 Props |
| propEx | object | 否 | 动态属性，绑定到页面状态 |
| styleEx | object | 否 | 动态样式，绑定到页面状态 |
| assets | string[] | 否 | 资源类型属性标记，如 `["src"]` |
| events | object | 否 | 事件处理配置 |
| meta | object | 是 | 元数据，必须包含 sync, url, width, height |
| children | array | 否 | 子组件 ID 列表（仅容器组件） |
| slots | array | 否 | 插槽配置，通常为 `[]` |

### 布局风格指引

为生成视觉合理的布局，建议遵循以下间距规范：

- **标题位置**：y=20~30，高度 36~44
- **标签与控件间距**：标签在左（y 对齐），输入框在标签右侧间隔 20~40px
- **行间距**：每行组件之间 y 间隔 36~48px
- **复选框**：两个复选框可并排排列，x 间隔 180~200px
- **按钮**：通常在 y 轴间隔 30~50px 的位置放置
- **结果区域**：通常在按钮下方 40~60px
- **页面底部留白**：底部至少保留 20px
