import React, { useState, useMemo, useEffect } from 'react'
import { withField } from '@douyinfe/semi-ui'
import appStore from '../../store/app.store.js'
import ImageSelector from '../component/ImageSelector.jsx'
import { flattenTree } from '../../panels/files/buildFileTree.js'
import { trimLeadingSlash, addStringPrefix } from 'ridgejs/src/utils/string.js'

export const ImageSelect = ({
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

  return (
    <ImageSelector
      value={addStringPrefix('/', value)}
      imageList={imageList}
      onChange={val => {
        // 传出值时：统一加上前缀
        if (val) {
          onChange(trimLeadingSlash(val))
        } else {
          onChange(val)
        }
      }}
    />
  )
}

export default withField(ImageSelect)
