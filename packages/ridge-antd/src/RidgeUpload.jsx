import React from 'react'
import { Upload, Button } from 'antd'

const RidgeUpload = ({
  // 文件配置
  fileList = [],
  multiple = true,
  listType = 'text',
  showUploadList = true,
  maxCount,
  accept,
  disabled = false,
  // 按钮配置
  buttonText = '点击上传',
  buttonType = 'primary',
  // 事件
  onChange,
  onRemove,
  // 样式
  className,
  style
}) => {
  return (
    <Upload
      className={className}
      style={style}
      fileList={fileList}
      multiple={multiple}
      listType={listType}
      showUploadList={showUploadList}
      maxCount={maxCount}
      accept={accept}
      disabled={disabled}
      // 关键：关闭自动上传，纯本地选择
      beforeUpload={() => false}
      onChange={onChange}
      onRemove={onRemove}
    >
      <Button
        type={buttonType}
        disabled={disabled}
      >
        {buttonText}
      </Button>
    </Upload>
  )
}

export default RidgeUpload
