import { List, Button, Typography, Modal, Pagination, Input } from '@douyinfe/semi-ui'
import { useState } from 'react'
import './select-icon-modal.css'

const { Text } = Typography

export default ({
  value,
  iconList,
  onChange
}) => {
  let SelectedIcon = null
  const [visible, setVisible] = useState(false)
  const [filter, setFilter] = useState('')
  const [page, setPage] = useState(0)
  const [selectKey, setSelectedKey] = useState(value)

  const pageSize = 72
  if (value) {
    SelectedIcon = iconList.find(icon => icon.key === value)?.Component
  }

  const onItemClick = key => {
    setSelectedKey(key)
  }
  const onPageChange = current => {
    setPage(current - 1)
  }

  const onFilterChange = val => {
    setPage(0)
    setFilter(val)
  }

  const filteredList = iconList.filter(icon => icon.key && icon.label.toLowerCase().indexOf(filter.toLowerCase()) > -1)

  const itemListData = filteredList.slice(page * pageSize, (page + 1) * pageSize)

  const handleOk = () => {
    onChange && onChange(selectKey)
    setVisible(false)
  }

  const handleCancel = () => {
    setVisible(false)
  }

  return (
    <div className='rg-select-icon-place'>
      {SelectedIcon}
      <Text
        ellipsis={{
          showTooltip: {
            opts: { content: value }
          }
        }}
        style={{ flex: 1 }}
      >
        {value}
      </Text>
      <Button
        theme='borderless'
        icon={<i className='bi bi-pencil-square' />}
        size='small'onClick={() => {
          setVisible(true)
        }}
      />
      {SelectedIcon && <Button
        type='danger'
        theme='borderless'
        icon={<i className='bi bi-trash' />}
        size='small' onClick={() => {
          onChange && onChange('')
        }}
                       />}
      <Modal
        title='选择图标'
        width={960}
        height={680}
        visible={visible}
        onOk={handleOk}
        onCancel={handleCancel}
      >
        <Input
          showClear
          placeholder='输入图标名称查找'
          style={{
            width: '400px'
          }}
          suffix={<i className='bi bi-search' />}
          value={filter} onChange={onFilterChange}
        />
        <List
          width={886}
          height={440}
          className='rg-select-icon-list'
          grid={{
            gutter: 8,
            span: 2
          }}
          dataSource={itemListData}
          renderItem={item => {
            const Component = item.Component
            if (Component) {
              return (
                <div
                  className={'list-item ' + (item.key === selectKey ? ' item-selected' : '')}
                  onClick={() => {
                    onItemClick(item.key)
                  }}
                >
                  {Component}
                  <Text
                    ellipsis={{
                      showTooltip: {
                        opts: { content: item.label }
                      }
                    }}
                    style={{ width: 64, textAlign: 'center' }}
                  >
                    {item.label}
                  </Text>

                  {/* <Component
                      onClick={() => {
                        setSelectedKey(item.key)
                        // onChange && onChange(item.key)
                      }}
                    /> */}
                </div>
              )
            } else {
              return <div>1</div>
            }
          }}
        />
        <Pagination
          total={filteredList.length} pageSize={pageSize} currentPage={page + 1}
          onPageChange={onPageChange}
        />
      </Modal>
    </div>
  )
}
