import React, { useMemo } from 'react'
import { Table } from 'antd'

const RidgeTable = (props) => {
  const {
    columns,
    dataSource,
    rowKey,
    bordered = false,
    size = 'large',
    loading = false,
    pagination = false,
    showHeader = true,
    selectionType,
    width,
    height,
    onChange,
    ...rest
  } = props

  return (
    <Table
      {...rest}
      columns={columns}
      dataSource={dataSource}
      rowKey={rowKey}
      bordered={bordered}
      size={size}
      rowSelection={{
        type: selectionType,
        onChange: (selectedRowKeys, selectedRows) => {
          onChange && onChange(selectedRows)
        }
      }}
      loading={loading}
      scroll={{
        y: height
      }}
      pagination={pagination}
      showHeader={showHeader}
    />
  )
}

export default RidgeTable
