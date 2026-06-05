Input.OTP (验证码输入框)
用途：用于短信验证码、邮箱验证码、两步验证等一次性密码输入，自动聚焦、自动切换输入格。
组件路径 (Path): ridge-antd/Input.OTP
属性 (Props) 配置：
value: string，默认空。验证码内容。
length: number，默认6。输入框位数。
size: string，默认medium。组件大小：small、medium、large。
variant: string，默认outlined。样式形态：outlined、borderless、filled、underlined。
disabled: boolean，默认false。是否禁用。
mask: boolean，默认false。是否开启掩码隐藏内容。
status: string，默认空。校验状态：error、warning。
事件 (Events)：
onChange: 输入内容改变时触发，返回完整验证码字符串。
onInput: 实时输入时触发，返回每一位输入的数组。