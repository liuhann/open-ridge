import React, { useEffect, lazy, Suspense, useRef, useState, useErro } from 'react'
import { withField, Button, Popover } from '@douyinfe/semi-ui'

/**
 * 自定义配置项接入组件
 * 如何自定义组件的属性配置？
 *
 * 1、提供control字段，类型为函数（支持异步）,函数提供 ({ value, onChange, el })属性，其中value用于字段当前值, onChange为配置变更传出值， el为配置界面挂载的Element元素
 * 2、btnText字段， 可空，默认为“配置”，可修改
 * 3、inline 字段， 可空，默认为 false
 * 4. preload字段， 可空，配置后，可加载指定preload内容并传给自定义配置组件实例
 *  inline为true时，直接渲染到属性栏（空间可能受限）。否则提供按钮， 点击在pop中配置数据
 *
 * @param {*} param0
 * @returns
 */
const CustomControlEdit = ({
  value,
  onChange,
  options
}) => {
  const [visible, setVisible] = useState(false)
  const [preloadData, setPreloadData] = useState(null)

  const isLazy = options.controlFunc.toString().startsWith('()')

  const spreads = {
    preload: preloadData,
    value,
    onChange: val => {
      onChange && onChange(val)
      if (!options.inline) {
        setVisible(false)
      }
    }
  }

  // let ConfigContent = null
  // if (options.controlFunc.toString().startsWith('()')) {
  //   const LazyComponent = React.lazy(options.controlFunc)
  //   ConfigContent = () => <Suspense fallback={<div>配置加载中</div>}><LazyComponent {...spreads} /></Suspense>
  // } else {
  //   ConfigContent = () => {
  //     return options.controlFunc(spreads)
  //   }
  // }
  let LazyComponent = <></>
  if (isLazy) {
    LazyComponent = React.lazy(options.controlFunc)
  }

  useEffect(() => {
    if (options.preload && !preloadData) {
      options.preload().then(d => {
        console.log('preloaded', d)
        setPreloadData(d.default)
      }).catch(() => {
      })
    }
  }, [options.preload])

  if (options.inline) {
    if (isLazy) {
      return <Suspense fallback={<div>配置加载中</div>}><LazyComponent {...spreads} /></Suspense>
    } else {
      return options.controlFunc(spreads)
    }
    // return <ConfigContent />
  } else {
    return (
      <Popover
        position='leftTop'
        trigger='custom'
        style={{
          padding: '5px'
        }}
        visible={visible}
        onClickOutSide={() => {
          setVisible(false)
        }}
        content={isLazy ? <Suspense fallback={<div>配置加载中</div>}><LazyComponent {...spreads} /></Suspense> : options.controlFunc(spreads)}
      >
        <Button
          size='small' onClick={() => {
            setVisible(true)
          }}
        >{options.controlBtnText || '配置'}
        </Button>
      </Popover>
    )
  }
}

export default withField(CustomControlEdit)
