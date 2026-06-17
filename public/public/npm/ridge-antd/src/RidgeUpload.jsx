import React, { useState } from 'react'
import { Upload, Button } from 'antd'
import { InboxOutlined, PlusOutlined } from '@ant-design/icons'

const RidgeUpload = (props) => {
  const {
    value,
    type = 'button',
    accept,
    disabled = false,
    buttonText = '点击上传',
    buttonType = 'primary',
    onChange
  } = props

  const [fileList, setFileList] = useState([])

  const commonProps = {
    fileList,
    accept,
    disabled,
    multiple: false, // ✅ 强制单选
    maxCount: 1, // ✅ 强约束
    beforeUpload: () => false,
    showUploadList: type !== 'button',
    onChange: ({ fileList: newList, file }) => {
      setFileList(newList)
      onChange?.(file)
    },
    onRemove: () => {
      setFileList([])
      onChange?.(null)
    }
  }

  /* ===== 拖拽上传 ===== */
  if (type === 'drag') {
    return (
      <Upload.Dragger {...commonProps}>
        <p className='ant-upload-drag-icon'>
          <InboxOutlined />
        </p>
        <p className='ant-upload-text'>点击或拖拽文件到此区域</p>
        <p className='ant-upload-hint'>仅支持单个文件</p>
      </Upload.Dragger>
    )
  }

  /* ===== 图片卡片 ===== */
  if (type === 'picture-card') {
    const uploadButton = (
      <div>
        <PlusOutlined />
        <div style={{ marginTop: 8 }}>上传</div>
      </div>
    )

    return (
      <Upload {...commonProps} listType='picture-card'>
        {fileList.length === 0 && uploadButton}
      </Upload>
    )
  }

  /* ===== 按钮上传 ===== */
  return (
    <Upload {...commonProps}>
      <Button type={buttonType} disabled={disabled}>
        {buttonText}
      </Button>
    </Upload>
  )
}

export default RidgeUpload
