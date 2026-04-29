import React, { useState, useMemo, useEffect } from 'react'
import { withField, Button, Modal, Image, Grid } from '@douyinfe/semi-ui'
import appStore from '../../store/app.store.js'
import ImageSelector from '../component/ImageSelector.jsx'
import { flattenTree } from '../../panels/files/buildFileTree.js'
import { IN_APP_FILE_PREFIEX } from 'ridgejs'

const ImageSelect = ({
  value,
  onChange
}) => {
  const currentAppFilesTree = appStore(state => state.currentAppFilesTree)

  const [imageList, setImageList] = useState([])

  useEffect(() => {
    setImageList(flattenTree(currentAppFilesTree).map(file => {
      if (file.mimeType && file.mimeType.indexOf('image') > -1) {
        return {
          label: file.name,
          value: file.path,
          url: file.url
        }
      } else {
        return null
      }
    }).filter(Boolean))
  }, [currentAppFilesTree])

  // 计算传给 ImageSelector 的值：去掉前缀
  const selectorValue = useMemo(() => {
    if (!value) return ''
    if (typeof value === 'string' && value.startsWith(IN_APP_FILE_PREFIEX)) {
      return value.substring(IN_APP_FILE_PREFIEX.length)
    }
    return value
  }, [value])

  return (
    <ImageSelector
      value={selectorValue}
      imageList={imageList}
      onChange={val => {
        // 传出值时：统一加上前缀
        if (val) {
          onChange(IN_APP_FILE_PREFIEX + val)
        } else {
          onChange(val)
        }
      }}
    />
  )
}

export default withField(ImageSelect)
