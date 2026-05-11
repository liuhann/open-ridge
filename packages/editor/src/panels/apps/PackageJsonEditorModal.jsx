import React, { useState, useEffect, useRef } from 'react'
import { Modal, Form, Input } from '@douyinfe/semi-ui'
import ImageSelect from '../../form/with-fields/ImageSelect.jsx'
import appStore from '../../store/app.store.js'

export default function PackageJsonEditorModal ({
  visible,
  // packageJson, // 传入的 package.json 对象
  onClose
}) {
  const formApiRef = useRef(null)
  const currentAppInfo = appStore((state) => state.currentAppInfo)
  const updateAppInfo = appStore((state) => state.updateAppInfo)

  const [appInfoObject, setAppInfoObject] = useState(null)
  useEffect(() => {
    if (visible) {
      setAppInfoObject(currentAppInfo)
    } else {
      setAppInfoObject(null)
    }
  }, [visible])
  // 提交
  const handleOk = async () => {
    try {
      await formApiRef.current.validate()
      await updateAppInfo(appInfoObject)
      onClose()
    } catch (err) {
      console.log('验证失败', err)
    }
  }

  const getFormApi = (api) => {
    formApiRef.current = api
  }

  return (
    <Modal
      title='编辑应用配置 (package.json)'
      visible={visible}
      onCancel={onClose}
      onOk={handleOk}
      width={600}
    >
      {appInfoObject &&
        <Form
          getFormApi={getFormApi}
          initValues={appInfoObject}
          style={{ padding: 10, width: '100%' }}
          onValueChange={(v) => {
            setAppInfoObject(v)
          }}
        >
          {/* 描述 */}
          <Form.Input
            rules={[
              { required: true, message: '应用名称不能为空' }
            ]}
            field='description'
            label='应用名称'
            placeholder='简单描述这个应用'
            rows={3}
          />

          {/* 名称 - 不可修改 */}
          <Form.Input
            field='name'
            label='应用编码'
            placeholder='自动生成，不可修改'
            disabled
            style={{ cursor: 'not-allowed' }}
          />

          {/* 版本 */}
          <Form.Input
            field='version'
            label='版本号'
            placeholder='例如 1.0.0'
          />

          {/* 图标 - 使用你的图片选择器 */}
          <ImageSelect field='icon' label='应用图标' />

          {/* 作者 */}
          <Form.Input
            field='author'
            label='作者'
            placeholder='请输入作者名称'
          />

        </Form>}
    </Modal>
  )
}
