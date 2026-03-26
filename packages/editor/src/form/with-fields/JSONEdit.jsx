import React, { useState } from 'react'
// import { JSONTree } from 'react-json-tree'
import { withField, Button, Modal } from '@douyinfe/semi-ui'

const JSONEdit = withField(({
  value,
  type = 'json',
  onChange
}) => {
  const [visible, setVisible] = useState(false)
  const [errorMsg, setErrorMsg] = useState('')
  const ref = React.createRef()

  const ok = () => {
    try {
      const result = ref.current.editorComposite.state.doc.toString()
      if (result !== '') {
        if (type === 'json') {
          const target = JSON.parse(result)
          onChange(target)
        } else {
          onChange(result)
        }
      } else {
        onChange('')
      }
      setVisible(false)
      setErrorMsg('')
    } catch (e) {
      setErrorMsg(e.message)
    }
  }

  const edit = async () => {
    setVisible(true)
    const div = ref.current
    const { EditorView, basicSetup } = await import(/* webpackChunkName: "codemirror-common" */ 'codemirror')
    const { tooltips, keymap } = await import(/* webpackChunkName: "codemirror-common" */ '@codemirror/view')
    const { json } = await import(/* webpackChunkName: "codemirror-json" */ '@codemirror/lang-json')
    // 初始化编辑器
    if (div.editorComposite) {
      div.editorComposite.destroy()
    }
    let doc = ''
    const extensions = [basicSetup]
    if (value != null) {
      if (type === 'json') {
        doc = JSON.stringify(value, null, 2)
        extensions.push(json())
        extensions.push(tooltips({
          position: 'absolute'
        }))
      } else {
        doc = value
      }
    }
    div.editorComposite = new EditorView({
      doc,
      extensions,
      parent: div
    })
  }

  return (
    <div>
      {/* {renderTree()} */}
      <Modal
        closeOnEsc={false}
        lazyRender={false}
        onCancel={() => {
          setVisible(false)
          setErrorMsg('')
        }}
        width={840}
        height={640}
        keepDOM
        title='编辑数据'
        visible={visible}
        onOk={ok}
      >

        <div>默认值/代码</div>
        <div
          style={{
            border: '1px solid var(--semi-color-border)',
            overflow: 'auto',
            height: '480px',
            width: '100%'
          }} className='code-editor-container' ref={ref}
        />
        <div style={{
          color: 'red'
        }}
        >{errorMsg}
        </div>
      </Modal>
      <Button
        size='small' type='tertiary' onClick={edit}
      >编辑
      </Button>
    </div>
  )
})

export default JSONEdit
