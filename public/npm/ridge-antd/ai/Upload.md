Upload (文件上传/选择)
用途：用于本地文件选择、预览、管理，支持多选、格式限制、数量限制，选中的文件可直接绑定到变量，供低代码脚本处理，无服务器上传功能。
组件路径 (Path): ridge-antd/Upload
属性 (Props) 配置：
fileList: array，默认空。已选择的文件列表，可直接绑定到低代码平台变量。
multiple: boolean，默认true。是否支持一次选择多个文件。
listType: string，默认text。展示样式：text(文本)、picture(图片)、picture-card(图片卡片)。
showUploadList: boolean，默认true。是否显示已选文件列表。
maxCount: number，默认空。最多可选择的文件数量。
accept: string，默认空。限制可选择的文件类型，如 .jpg,.png,.pdf,.docx。
disabled: boolean，默认false。是否禁用组件。
事件 (Events)：
onChange: 文件选择、删除后触发，返回最新文件列表，用于更新绑定变量。
onRemove: 删除文件时触发。