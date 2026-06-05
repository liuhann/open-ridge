import React, { useState, useRef, useEffect } from 'react'
import { withField, Button, Modal, TextArea, Toast } from '@douyinfe/semi-ui'

const JSONEdit = ({ value, onChange }) => {
  const [visible, setVisible] = useState(false)
  const [inputValue, setInputValue] = useState('')
  const textareaRef = useRef(null)

  // 打开弹窗时同步最新值
  useEffect(() => {
    if (visible) {
      try {
        setInputValue(value ? JSON.stringify(value, null, 2) : '')
      } catch (e) {
        setInputValue('')
      }
    }
  }, [visible, value])

  // 实时输入更新
  const handleInputChange = (val) => {
    setInputValue(val)
  }

  // 确认：校验 + 提交
  const handleOk = () => {
    const textVal = (inputValue || '').trim()
    if (!textVal) {
      Toast.warning('请输入JSON内容')
      return
    }

    try {
      const json = JSON.parse(textVal)
      onChange?.(json)
      setVisible(false)
      Toast.success('JSON格式正确，已保存')
    } catch (err) {
      Toast.error('JSON格式错误，请检查：引号、逗号、花括号是否配对')
    }
  }

  return (
    <div>
      <Modal
        closeOnEsc
        maskClosable
        title='编辑 JSON 数据'
        visible={visible}
        width={840}
        height={640}
        keepDOM
        onCancel={() => setVisible(false)}
        onOk={handleOk}
      >
        {/* 👇 新手 JSON 规则提示（简洁友好） */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '6px',
          marginBottom: '10px',
          padding: '8px 12px',
          backgroundColor: 'var(--semi-color-fill-0)',
          borderRadius: '6px',
          fontSize: '12px',
          color: 'var(--semi-color-text-1)'
        }}
        >
          <span>JSON 规则：键名必须双引号、逗号分隔、花括号/方括号配对，不支持注释</span>
        </div>

        {/* 👇 实时编辑的 TextArea */}
        <TextArea
          ref={textareaRef}
          value={inputValue}
          onChange={handleInputChange}
          textareaStyle={{ height: '100%' }}
          style={{
            height: 'calc(100% - 50px)',
            fontFamily: 'Monaco, Menlo, monospace'
          }}
          placeholder='请输入合法的JSON内容，例如：
{
  &quot;name&quot;: &quot;test&quot;,
  &quot;list&quot;: [1,2,3]
}'
        />
      </Modal>

      <Button size='small' type='tertiary' onClick={() => setVisible(true)}>
        编辑
      </Button>
    </div>
  )
}

export default withField(JSONEdit)
