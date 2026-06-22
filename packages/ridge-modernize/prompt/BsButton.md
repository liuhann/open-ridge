BsButton (Bootstrap按钮)
用途：页面交互基础组件，用于操作触发、表单提交、弹窗确认、数据新增删除等场景，兼容AdminMart Bootstrap后台模板样式，支持实心/浅底色/描边三种外观、多尺寸、多主题色。
组件路径 (Path): ridge-modernize/BsButton
属性 (Props) 配置：
children: string，默认值"Button"。必填，按钮展示文字。
variant: string，默认值"primary"。可选值：primary(主色)、secondary(次要)、success(成功)、info(信息)、warning(警告)、danger(危险)、light(浅灰)、dark(深色)；控制按钮主题配色。
disabled: boolean，默认值false。true为禁用按钮，不可点击。
事件 (Events)：
onClick: 鼠标点击按钮时触发，接收点击事件参数。