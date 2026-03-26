import React, { useEffect, useRef } from 'react'

export const withRidgePlugin = (WrappedComponent, propKey = 'effect') => {
  const WithEffectComponent = (props) => {
    const { __applyEffect, ...restProps } = props
    const domRef = useRef(null) // 用于存储 DOM 元素引用

    // 应用 effect 到 DOM 元素
    useEffect(() => {
      if (__applyEffect) {
        __applyEffect(props[propKey], domRef.current)
      }
    }, [props[propKey]])

    return <WrappedComponent {...restProps} ridgePluginRef={domRef} />
  }

  WithEffectComponent.displayName = `withRidgePlugin(${WrappedComponent.displayName || WrappedComponent.name || 'Component'})`

  return WithEffectComponent
}
