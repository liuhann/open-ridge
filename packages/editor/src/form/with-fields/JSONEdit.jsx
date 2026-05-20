import React, { useState } from 'react'
import { withField, Button, Modal, JsonViewer } from '@douyinfe/semi-ui'

const JSONEdit = withField(({
  value,
  onChange
}) => {
  const [visible, setVisible] = useState(false)
  const ref = React.createRef()

  return (
    <div>
      {/* {renderTree()} */}
      <Modal
        closeOnEsc={false}
        lazyRender={false}
        onCancel={() => {
          setVisible(false)
        }}
        width={840}
        height={640}
        keepDOM
        title='编辑JSON数据'
        visible={visible}
        onOk={() => {
          if (ref.current) {
            const output = ref.current.getValue()
            try {
              JSON.parse(output)
              onChange && onChange(output)
            } catch (e) {

            }
          }
        }}
      >
        <JsonViewer ref={ref} height={600} width={700} value={value} />
      </Modal>
      <Button
        size='small' type='tertiary' onClick={() => {
          setVisible(true)
        }}
      >编辑
      </Button>
    </div>
  )
})

export default JSONEdit
