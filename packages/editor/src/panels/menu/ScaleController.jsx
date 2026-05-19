import React from 'react'
import { Slider, Dropdown, Button, Space } from '@douyinfe/semi-ui'
import { IconChevronDown } from '@douyinfe/semi-icons'

/**
 * 缩放控制器
 * @param {number} scale - 当前缩放比例（0.1 ~ 5）
 * @param {(scale: number) => void} onChange - 缩放变化回调
 */
export default function ScaleController ({ scale = 1, onChange }) {
  const options = [
    { label: '10%', value: 0.1 },
    { label: '25%', value: 0.25 },
    { label: '50%', value: 0.5 },
    { label: '75%', value: 0.75 },
    { label: '100%', value: 1 },
    { label: '125%', value: 1.25 },
    { label: '150%', value: 1.5 },
    { label: '200%', value: 2 },
    { label: '300%', value: 3 },
    { label: '500%', value: 5 },
    { label: '适合', value: 'fit' },
    { label: '填满', value: 'fill' }
  ]

  const handleSelect = (value) => {
    onChange(value)
  }

  const handleSliderChange = (value) => {
    onChange(value)
  }

  const displayText =
    scale === 1
      ? '适合'
      : scale === 1.5
        ? '填满'
        : `${Math.round(scale * 100)}%`

  return (
    <Space
      style={{
        width: 200
      }}
      gap={4}
      align='center'
    >
      {/* Slider */}
      <Slider
        value={scale}
        width={120}
        min={0.1}
        max={5}
        step={0.01}
        tooltipVisible={false}
        onChange={handleSliderChange}
        style={{ flex: 1, width: '120px' }}
      />
      {/* Dropdown */}
      <Dropdown
        menu={options.map((o) => ({
          node: 'item',
          name: o.label,
          onClick: () => handleSelect(o.value)
        }))}
        trigger='click'
      >
        <Button theme='borderless' type=''>
          {displayText}
        </Button>
      </Dropdown>

    </Space>
  )
}
