import React, { useState } from 'react'
import { ReactComposite } from 'ridgejs'
import { withField, Button, Modal } from '@douyinfe/semi-ui'

const IconEdit = ({
  value,
  onChange
}) => {
  const [visible, setVisible] = useState(false)
  const [val, setVal] = useState(value)

  const handleOk = () => {
    onChange(val)
    setVisible(false)
  }

  const onInput = item => {
    const svg = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ' + item.width + ' ' + item.height + '">' + item.body + '</svg>'
    setVal(svg)
  }

  return (
    <>
      <Button
        size='small'
        type='tertiry'
        icon={<div style={{ width: 18, marginRight: 24, color: 'var(--semi-color-primary)' }} dangerouslySetInnerHTML={{ __html: val }} />} aria-label='截屏' onClick={() => {
          setVisible(true)
        }}
      >选择
      </Button>
      <Modal
        style={{ width: 1000 }}
        title='从yesicon选择图标'
        visible={visible}
        centered
        bodyStyle={{ width: 1000, height: 730 }}
        onCancel={() => {
          setVisible(false)
        }}
        onOk={handleOk}
      >
        <ReactComposite
          app='ridgebot-app-platform'
          path='src/FormSelectIcon'
          value={value}
          input={onInput}
        />
      </Modal>
    </>
  )
}

export default withField(IconEdit)
