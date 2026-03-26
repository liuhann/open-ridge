import React, { useEffect, useState } from 'react'

import { withField } from '@douyinfe/semi-ui'
import ridgeEditorContext from '../../service/RidgeEditorContext'

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
  const { Component } = options

  return Component({
    context: ridgeEditorContext,
    value,
    onChange
  })
}

export default withField(FontIconEdit)
