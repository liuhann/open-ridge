// 设置上浮类，返回是否设置成功
const setPseudoClassList = (el, pseudo, isRemove) => {
  const classList = el.classList
  let isHoverable = false
  for (let i = 0; i < classList.length; i++) {
    if (classList[i].startsWith(pseudo + ':')) {
      isHoverable = true
      const pseduoClassName = classList[i].substring(pseudo.length + 1) // 提取 hover: 后面的内容
      const pseduoParts = pseduoClassName.split('-') // 拆解出类似  bg-xxx 这样前部
      if (isRemove) {
        el.classList.remove(pseduoClassName)
      } else {
        if (pseduoParts.length > 1) {
          const sameParts = Array.from(el.classList).filter(className => className.startsWith(pseduoParts[0] + '-'))

          if (sameParts.length > 1) {
            el.setAttribute('cache-pseduo-' + pseduoParts[0], sameParts.join(','))
            for (const sp of sameParts) {
              el.classList.remove(sp)
            }
          }
        }
        el.classList.add(pseduoClassName)
      }
    }
  }
  return isHoverable
}

/**
 * 当父元素满足pseudo时,同时也应用子元素的对应样式
 * @param {*} el
 * @param {*} pseudo
 * @param {*} isRemove
 */
const forceDOMElementState = (el, pseudo, isRemove) => {
  const pseudoEls = el.querySelectorAll('.has-pseudo-' + pseudo)

  if (el.classList.contains('has-pseudo-' + pseudo)) {
    setPseudoClassList(el, pseudo, isRemove)
  }
  for (const pseudoEl of pseudoEls) {
    // if (pseudoEl.closest('.ridge-element') === el) {
    setPseudoClassList(pseudoEl, pseudo, isRemove)
    // }
  }
}

/*
 处理对类似
 [
    "ridge-bootstrap/bg-warning",
    "ridge-bootstrap/text-primary"
    "ridge-bootstrap/hover:text-primary"
]
这样的属性, 逻辑如下:

1. 根据 ridge-bootstrap 即斜线左侧加载对应组件库提供样式
2. 返回斜线右侧 (bg-warning) 这也的类列表:后续组件会附加到el的class上面
3. 对于右侧 hover:text-primary类似的写法, 增加一个 has-pseudo-hover的类, 这个类指示鼠标上浮时,再增加 text-primary

第二个参数为composite负责加载处理
*/
const handleClassListPropValue = (configValue, composite) => {
  if (Array.isArray(configValue)) {
    const pseudos = []
    const classList = configValue.map(styleName => {
      const [packageName, className] = styleName.split('/')
      if (className) {
        // load package style
        composite.loader.confirmPackageDependencies(packageName)
        return handlePseudoClass(className, pseudos)
      } else {
        return handlePseudoClass(styleName, pseudos)
      }
    })

    // 增加了一个机制： 如果配置了 hover:开头的样式，则设置为 has-pseudo- 当触发pseudo或取消时，hover:后面的样式会被附加到整体样式中
    for (const pseudo of pseudos) {
      classList.push('has-pseudo-' + pseudo)
    }
    return classList
  } else {
    return []
  }
}

// 提取重复逻辑到一个独立的函数
const handlePseudoClass = (className, pseudos) => {
  const [pseudo, actualName] = className.split(':')
  if (actualName) {
    pseudos.push(pseudo)
  }
  return className
}

export {
  handleClassListPropValue,
  setPseudoClassList,
  forceDOMElementState,
  handlePseudoClass
}
