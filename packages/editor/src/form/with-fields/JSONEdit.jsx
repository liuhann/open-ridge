import React, { useState } from 'react'
import { withField, Button, Modal, JsonViewer } from '@douyinfe/semi-ui'

const JSONEdit = ({
  value,
  sample,
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
              const jsonValue = JSON.parse(output)
              onChange && onChange(jsonValue)
              setVisible(false)
            } catch (e) {

            }
          }
        }}
      >
        <JsonViewer ref={ref} height={480} width={790} value={value ? JSON.stringify(value, null, 2) : ''} />
      </Modal>
      <Button
        size='small' type='tertiary' onClick={() => {
          console.log('json edit', value)
          setVisible(true)
        }}
      >编辑
      </Button>
    </div>
  )
}

export default withField(JSONEdit)
