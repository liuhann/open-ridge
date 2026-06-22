FormFile (文件上传选择框)
用途：表单文件上传组件，原生file输入，基于Bootstrap form-control样式，用于图片、文档、附件选择。
组件路径 (Path): ridge-modernize/FormFile
属性 (Props) 配置：
size: string，默认md。可选sm小号、md中号、lg大号，控制输入框尺寸。
disabled: boolean，默认false。true禁用选择框，无法点击选文件。
accept: string，默认空。限制文件后缀/MIME类型，例：.png,.jpg,.pdf。
multiple: boolean，默认false。true支持一次性多选多个文件。
事件 (Events)：
onChange: 选择文件后触发，回调参数 (files, event)；
multiple=false 时 files 为单个File实例；
multiple=true 时 files 为File对象数组。