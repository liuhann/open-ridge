import React, { useEffect, useState } from 'react'

import PopEdit from '../component/PopEdit.jsx'
import { withField, Space, Input } from '@douyinfe/semi-ui'

/**
 * 选择成套Font Icons 功能
 * @param {*} param0
 * @returns
 */
const FontIconEdit = ({
  value,
  onChange,
  options
}) => {
  const [iconList, setIconList] = useState([])
  useEffect(() => {
    if (typeof options.iconList === 'function') {
      options.iconList().then(d => {
        setIconList(d)
      })
    } else {
      setIconList(options.iconList)
    }
  }, [options])

  return (
    <Space>
      <Input size='small' value={value} onChange={onChange} />
      <PopEdit width={740} height={686} title='请选择图标' value={value} input={onChange} path='icon/FontIconSelect' iconList={iconList} />
    </Space>
  )
}

export default withField(FontIconEdit)
