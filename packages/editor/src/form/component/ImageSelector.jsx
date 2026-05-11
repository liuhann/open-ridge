import React, { useState, useEffect } from 'react'
import { Button, Modal, Image } from '@douyinfe/semi-ui'

const ImageSelector = ({
  value,
  imageList = [],
  onChange
}) => {
  const [visible, setVisible] = useState(false)
  const currentItem = imageList.find(item => item.value === value)

  // 弹窗内临时选中的值（点确定才提交）
  const [tempValue, setTempValue] = useState(value)

  // 打开弹窗时，同步当前值
  useEffect(() => {
    if (visible) {
      setTempValue(value)
    }
  }, [visible, value])

  const openSelector = () => setVisible(true)

  // 点确定 → 提交
  const handleOk = () => {
    onChange?.(tempValue)
    setVisible(false)
  }

  // 点取消 → 关闭不提交
  const handleCancel = () => {
    setVisible(false)
  }

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
      {/* 当前选中图片预览 */}
      <div
        style={{
          width: 60,
          height: 60,
          border: '1px solid var(--semi-color-border)',
          borderRadius: 4,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          overflow: 'hidden'
        }}
      >
        {currentItem?.url
          ? (
            <Image
              src={currentItem.url}
              imgStyle={{ width: '100%', height: '100%', objectFit: 'cover' }}
              alt={currentItem.label}
            />
            )
          : (
            <span style={{ color: 'var(--semi-color-text-3)' }}>无</span>
            )}
      </div>

      <Button theme='solid' onClick={openSelector}>选择图片</Button>

      {/* 图片选择弹窗 */}
      <Modal
        title='选择图片'
        visible={visible}
        onCancel={handleCancel}
        onOk={handleOk}
        width={940}
      >
        <div
          style={{
            height: '480px',
            overflowY: 'auto',
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(120px, 1fr))',
            gap: '12px',
            padding: '8px 0'
          }}
        >
          {imageList.map((item) => (
            <div
              key={item.value}
              onClick={() => setTempValue(item.value)}
              style={{
                border: item.value === tempValue
                  ? '2px solid var(--semi-color-primary)'
                  : '1px solid var(--semi-color-border)',
                borderRadius: 4,
                padding: '8px',
                cursor: 'pointer',
                textAlign: 'center',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                height: '120px'
              }}
            >
              <Image
                className='object-scale-down'
                src={item.url}
                alt={item.label}
                imgStyle={{ width: '100%', height: '100%', objectFit: 'cover' }}
                style={{
                  width: '100%',
                  height: '80px'
                }}
                preview={false}
              />
              <div style={{ marginTop: 6, fontSize: 12, lineHeight: '1.2' }}>
                {item.label}
              </div>
            </div>
          ))}
        </div>
      </Modal>
    </div>
  )
}

export default ImageSelector
