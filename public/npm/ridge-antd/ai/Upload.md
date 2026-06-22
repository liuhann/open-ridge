Upload (文件上传/选择)
用途：用于本地文件选择、预览、管理，支持多选、格式限制、数量限制，选中的文件可直接绑定到变量，供低代码脚本处理，无服务器上传功能。
组件路径 (Path): ridge-antd/Upload
属性 (Props) 配置：
value: file对象，默认空，表示已选择的文件
listType: string，默认text。展示样式：text(文本)、picture(图片)、picture-card(图片卡片)。
accept: string，默认空。限制可选择的文件类型，如 .jpg,.png,.pdf,.docx。
disabled: boolean，默认false。是否禁用组件。
事件 (Events)：
onChange: 当前选中文件变化时触发，参数为当前选择的文件，注意这个文件时浏览器标准File Blob对象，可以直接使用File API进行操作