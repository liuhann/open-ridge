Steps (步骤条)
用途：用于展示多步骤流程进度，如表单填写、订单状态、任务办理等，支持切换步骤与状态展示。
组件路径 (Path): ridge-antd/Steps
属性 (Props) 配置：
items: array，默认包含3个示例步骤。配置步骤列表，每一项支持 title、content、status。
current: number，默认值0。当前激活步骤，从 0 开始计数。
initial: number，默认值0。步骤起始序号。
status: string，默认值process。步骤状态：wait(等待)、process(处理中)、finish(完成)、error(错误)。
orientation: string，默认值horizontal。步骤方向：horizontal(水平)、vertical(垂直)。
type: string，默认值default。类型：default、dot、inline、navigation、panel。
variant: string，默认值filled。样式：filled(填充)、outlined(描边)。
titlePlacement: string，默认值horizontal。标题位置：horizontal(右侧)、vertical(下方)。
size: string，默认值medium。尺寸：medium(标准)、small(迷你)。
事件 (Events)：
onChange: 点击步骤切换时触发，返回当前步骤序号 current。