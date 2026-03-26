import React, { useEffect, useState } from 'react'
import { Tabs, TabPane, Spin, List, Typography, Select, Space, Image } from '@douyinfe/semi-ui'
import context from '../../service/RidgeEditorContext.js'
import SvgLoader from '../../utils/SVGFromSrc.js'
import { extname } from '../../utils/string.js'
import './index.less'

const trace = require('debug')('ridge:cl')
const { Text } = Typography

export default ({
  packageObject,
  appPackageObject
}) => {
  const [componentList, setComponentList] = useState([])

  const renderComponentIcon = (base, url) => {
    if (url.$$typeof) {
      return url
    }
    const ext = extname(url)
    // <img className={label ? '' : 'img-only'} src={context.baseUrl + '/' + component.packageName + '/' + icon} />
    if (ext === 'svg') {
      return <SvgLoader src={base + url} />
    } else if (['jpg', 'jpeg', 'png', 'gif', 'webp', 'bmp', 'tiff', 'ico'].indexOf(ext) > -1) {
      return <img src={base + url} />
    } else {
      return <i className={url + ' font-icon'} />
    }
  }

  const changePackageTheme = (packageName, themeUrl) => {
    appPackageObject.themes = {}
    appPackageObject.themes[packageName] = themeUrl

    context.services.appService.savePackageJSONObject(appPackageObject)

    context.loader.loadPackageTheme(packageName, themeUrl)
  }

  const renderComponentItem = (item, pkg) => {
    let itemObject = item
    let content = null

    if (itemObject.cover) {
      content = (<div className='cover-icon'> <img src={context.baseUrl + '/' + pkg.name + '/' + itemObject.cover} /> </div>)
    } else if (itemObject.icon) {
      content = (
        <div className='image-icon'>
          {renderComponentIcon(context.baseUrl + '/' + packageObject.name + '/', itemObject.icon)}
          {itemObject.title && <Text>{itemObject.title} </Text>}
        </div>
      )
    }

    if (itemObject) {
      return (
        <List.Item>
          <div
            style={{
              color: packageObject.iconFill ?? ''
            }}
            draggable
            onDragStart={ev => dragStart(ev, Object.assign(itemObject, {
              componentPath: (packageObject.name + '/' + itemObject.path).replace(/\/+/g, '/')
            }))}
            className='component-container'
          >
            {content}
            {/* {renderComponentIcon(itemObject.icon, itemObject.title, itemObject)} */}
          </div>
        </List.Item>
      )
    } else {
      return (
        <List.Item>
          <div
            className='component-container loading'
          />
        </List.Item>
      )
    }
  }
  const dragStart = (ev, info) => {
    context.draggingComponent = info
    window.dragComponent = info

    ev.dataTransfer.setData('text/plain', JSON.stringify(info))

    const img = new window.Image()
    img.src = info.iconUrl
    img.style.width = '50px'
    img.style.height = '50px'

    const canvas = document.createElement('canvas')
    canvas.width = canvas.height = 50

    const ctx = canvas.getContext('2d')
    ctx.drawImage(img, 0, 0, 50, 50)

    trace('drag start', info, img)

    ev.dataTransfer.setDragImage(canvas, 25, 25)
  }

  useEffect(async () => {
    await context.loader.confirmPackageDependencies(packageObject.name)
    const pkg = packageObject
    if (pkg.ridgeDist) {
      // 包内组件都包含在一个js文件中
      if (!pkg.distLoaded) {
        await context.loader.loadScript(pkg.name + '/' + pkg.ridgeDist)
        // 从全局变量枚举加载类
        const pp = window[pkg.name]
        const components = []
        for (const name in pp) {
          const p = pp[name]
          p.componentName = p.name
          p.componentPath = name
          components.push(p)
          await context.loader.prepareComponent(p, {
            packageName: pkg.name,
            path: name
          })
        }
        setComponentList(components)
      }
    } else if (pkg.components) {
      // 每个组件一个定义文件
      for (const componentName of pkg.components) {
        const componentPath = pkg.name + '/' + componentName
        if (this.loadedComponents.filter(component => component.componentPath === componentPath).length === 0) {
          context.loadComponent(componentPath).then(componentLoaded => {
            if (!componentLoaded) {
              return
            }
            componentLoaded.packageName = pkg.name
            componentLoaded.componentName = componentName
            componentLoaded.componentPath = componentPath
            setComponentList([...componentList, componentLoaded])
          })
        }
      }
    }
  }, [])

  return (
    <>
      {packageObject.themes &&
        <Space>
          <Text>主题</Text><Select
            style={{ width: 120 }}
            onChange={val => {
              changePackageTheme(packageObject.name, val)
            }}
            value={appPackageObject.themes ? appPackageObject.themes[packageObject.name] : ''}
            size='small'
            optionList={Object.keys(packageObject.themes).map(name => ({
              label: name,
              value: packageObject.themes[name]
            }))}
                         />
        </Space>}

      <List
        loading={componentList.length === 0}
        grid={{
          gutter: 6,
          span: 8
        }}
        className='component-list'
        dataSource={componentList}
        renderItem={item => renderComponentItem(item)}
      />
    </>
  )
}
