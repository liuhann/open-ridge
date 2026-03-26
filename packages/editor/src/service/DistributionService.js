import JSZip from 'jszip'
import axios from 'axios'
import { saveAs } from '../utils/blob.js'
import { rollup } from '@rollup/browser'
import { convertToValidVariableName } from 'ridgejs'

export default class DistributionService {
  constructor (context) {
    this.context = context
    this.appService = context.services.appService
  }

  /**
   * 工具方法：计算相对路径（从当前文件路径指向目标路径）
   * @param {string} fromPath 当前文件路径（如：pages/home/index.json.html）
   * @param {string} toPath 目标文件路径（如：npm/react/umd/react.min.js）
   * @returns {string} 相对路径
   */
  getRelativePath (fromPath, toPath) {
    // 处理路径分隔符
    const fromParts = fromPath.replace(/\\/g, '/').split('/')
    const toParts = toPath.replace(/\\/g, '/').split('/')

    // 移除当前文件名，只保留目录部分
    fromParts.pop()

    const relativeParts = []
    let i = 0

    // 找到公共路径部分
    while (i < fromParts.length && i < toParts.length && fromParts[i] === toParts[i]) {
      i++
    }

    // 向上回退到公共目录
    for (let j = i; j < fromParts.length; j++) {
      relativeParts.push('..')
    }

    // 向下进入目标路径
    for (let j = i; j < toParts.length; j++) {
      relativeParts.push(toParts[j])
    }

    return relativeParts.join('/')
  }

  /**
   * 打包单个页面（直接使用fullPath.html作为页面路径）
   * @param {string} id 页面ID
   * @param {JSZip} [zip] 外部传入的zip实例（用于多页面打包复用）
   * @returns {Promise<{html: string, fullPath: string, htmlFilePath: string}>} 页面信息
   */
  async distributePage (id, zip = null) {
    // 多页面打包时复用外部传入的zip，单页面则新建
    const currentZip = zip || new JSZip()
    const includeFilesAndContents = []

    // ===== 原有逻辑：加载公共依赖 =====
    includeFilesAndContents.push(await this.fetchUrlFile('npm/react@18.3.1/umd/react.production.min.js'))
    includeFilesAndContents.push(await this.fetchUrlFile('npm/react-dom@18.3.1/umd/react-dom.production.min.js'))
    includeFilesAndContents.push(await this.fetchUrlFile('npm/ridgejs/build/webstart.min.js'))

    const packageJSONObjct = await this.appService.getPackageJSONObject('/package.json')
    includeFilesAndContents.push({
      type: 'json',
      filePath: `npm/${packageJSONObjct.name}/package.json`,
      textContent: JSON.stringify(packageJSONObjct, null, 2)
    })

    // ===== 获取文件和完整路径 =====
    const file = await this.appService.getFile(id)
    const fullPath = await this.appService.getFilePath(file) // 完整路径（如：pages/home/index.json）
    // 直接使用fullPath + .html作为HTML文件路径
    const htmlFilePath = `${fullPath}.html`

    // ===== 原有逻辑：打包页面复合内容 =====
    const compositeFiles = await this.rollupComposite(file.content, packageJSONObjct.name, fullPath)
    includeFilesAndContents.push(...compositeFiles)

    // ===== 原有逻辑：加载主题文件 =====
    if (packageJSONObjct.themes) {
      for (const key in packageJSONObjct.themes) {
        if (!Object.hasOwn(packageJSONObjct.themes, key)) continue
        const themeUrl = packageJSONObjct.themes[key]
        includeFilesAndContents.push(await this.fetchUrlFile('npm/' + themeUrl))
      }
    }

    // ===== 生成页面HTML =====
    let html = `<!DOCTYPE html>
    <html>
    <head>
    <meta charset="utf-8" />
    <link rel="icon" type="image/png" href="${this.getRelativePath(htmlFilePath, 'favicon-32x32.png')}">
    <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=yes"></meta>
    <title>${file.name}</title>`

    html += `<script>
                window.RIDGE_NPM_REPO = './npm'
                window.RIDGE_HOME_APP = '${packageJSONObjct.name}'
                window.RIDGE_HOME_PATH = '${fullPath}'
            </script>
        </head>
        <body>
          <noscript>You need to enable JavaScript to run this app.</noscript>
          <div id="app"></div>`

    // ===== 将资源添加到ZIP并生成HTML引用 =====
    for (const includeFile of includeFilesAndContents) {
      switch (includeFile.type) {
        case 'js':
          currentZip.file(includeFile.filePath, includeFile.textContent)
          // 计算当前HTML到JS文件的相对路径
          const jsRelativePath = this.getRelativePath(htmlFilePath, includeFile.filePath)
          html += `<script src="${jsRelativePath}" ></script>`
          break
        case 'arraybuffer':
          currentZip.file(includeFile.filePath, includeFile.data)
          const resourceRelativePath = this.getRelativePath(htmlFilePath, includeFile.filePath)
          if (includeFile.filePath.endsWith('.js')) {
            html += `<script src="${resourceRelativePath}" ></script>`
          }
          if (includeFile.filePath.endsWith('.css')) {
            html += `<link rel='stylesheet' href='${resourceRelativePath}' type='text/css' />`
          }
          break
        case 'json':
          const jsonJsPath = includeFile.filePath + '.js'
          const jsonRelativePath = this.getRelativePath(htmlFilePath, jsonJsPath)
          currentZip.file(jsonJsPath, `globalThis['json://./${includeFile.filePath}'] = ` + includeFile.textContent)
          html += `<script src="${jsonRelativePath}" ></script>`
          break
        default:
          break
      }
    }

    html += `
        </body>
      </html>`

    // ===== 存储页面HTML（直接使用fullPath.html）=====
    currentZip.file(htmlFilePath, html)

    // 单页面时直接生成ZIP并下载
    if (!zip) {
      const blob = await currentZip.generateAsync({ type: 'blob' })
      saveAs(blob, file.name + '.zip')
    }

    // 返回页面完整信息
    return {
      html,
      fullPath,
      htmlFilePath,
      fileName: file.name
    }
  }

  /**
   * 打包多个页面
   * @param {string[]} ids 多个页面ID的数组
   * @param {string} [zipName] 最终下载的ZIP文件名（默认：multi-pages.zip）
   */
  async distributeMultiplePages (ids, zipName = 'multi-pages.zip') {
    if (!Array.isArray(ids) || ids.length === 0) {
      throw new Error('请传入有效的页面ID数组（不能为空）')
    }

    // 初始化全局ZIP实例（所有页面共享）
    const zip = new JSZip()
    const pageInfos = []

    // 循环处理每个页面，复用同一个ZIP实例
    for (const id of ids) {
      try {
        const pageInfo = await this.distributePage(id, zip)
        pageInfos.push(pageInfo)
        console.log(`页面 ${id}（${pageInfo.fileName}）打包完成`)
      } catch (error) {
        console.error(`页面 ${id} 打包失败：`, error.message)
        // 可选择：抛出错误终止全部打包 / 跳过当前页面继续打包
        // throw error // 终止模式
        continue // 跳过模式
      }
    }

    // 生成汇总的index.html（可选：方便用户快速访问所有页面）
    let indexHtml = `<!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8" />
      <title>多页面汇总</title>
      <style>
        body { font-family: Arial, sans-serif; padding: 20px; }
        .page-item { margin: 10px 0; padding: 10px; border: 1px solid #eee; border-radius: 4px; }
        a { color: #1890ff; text-decoration: none; }
        a:hover { text-decoration: underline; }
      </style>
    </head>
    <body>
      <h1>打包页面列表</h1>
      <div class="page-list">
    `

    // 为每个页面生成访问链接
    pageInfos.forEach(page => {
      indexHtml += `
        <div class="page-item">
          <a href="./${page.htmlFilePath}" target="_blank">${page.htmlFilePath}</a>
        </div>
      `
    })

    indexHtml += `
      </div>
    </body>
    </html>
    `
    // 将汇总页面添加到ZIP根目录
    zip.file('_nav_all.html', indexHtml)

    // 生成最终的ZIP文件并下载
    const blob = await zip.generateAsync({
      type: 'blob',
      compression: 'DEFLATE', // 开启压缩，减小文件体积
      compressionOptions: { level: 6 } // 压缩级别（1-9，6为平衡）
    })

    saveAs(blob, zipName)
    console.log(`多页面打包完成，共打包 ${pageInfos.length} 个页面`)
    return {
      success: true,
      count: pageInfos.length,
      zipName
    }
  }

  async distributeApp () {
    const fileIds = await this.appService.filterFiles(file => file.type === 'page').map(file => file.id)
    await this.distributeMultiplePages(fileIds, 'app.zip')
  }

  /**
   * 打包composite内容
   * @param {*} content
   * @param {*} compositePath
   * @returns [{
   *    type: 'js/json/img/...',
   *    filePath: '文件路径',
   *    textContent: '',
   * }]
   */
  async rollupComposite (content, pkgName, pagePath) {
    const files = []
    const context = this.context
    if (Array.isArray(content.jsFiles)) {
      for (const jsFile of content.jsFiles) {
        // 使用rollup，将脚本js打包
        const rolluped = await rollup({
          input: jsFile,
          plugins: [
            {
              resolveId (source, importer) {
                console.log(source)
                return source
              },
              async load (id) {
                if (id.startsWith('/')) {
                  const result = await fetch(id)
                  const text = await result.text()
                  return text
                } else {
                  const Module = await context.loadModule(null, id)
                  if (Module) {
                    return Module.jsContent
                  }
                }
              }
            }
          ]
        })
        const generated = await rolluped.generate({
          format: 'iife',
          name: convertToValidVariableName(jsFile.startsWith('composite://') ? `/${pkgName}/${jsFile.substr('composite://'.length + 1)}` : jsFile)
        })
        const theCode = generated.output[0].code

        files.push({
          type: 'js',
          filePath: jsFile.startsWith('composite://') ? `npm/${pkgName}/${jsFile.substr('composite://'.length + 1)}` : jsFile,
          textContent: theCode
        })
      }
    }

    // 打包组件的源代码
    if (Array.isArray(content.elements)) {
      const componentPkgNames = Array.from(new Set(content.elements.map(el => el.path).filter(n => n).map(pt => pt.split('/')[0])))
      for (const componentPkgName of componentPkgNames) {
        const packageJSONObject = await this.fetchJSON(`/npm/${componentPkgName}/package.json`)
        if (Array.isArray(packageJSONObject.externals)) {
          for (const ex of packageJSONObject.externals) {
            files.push(await this.fetchUrlFile(`npm${ex}`))
          }
        }
        files.push(await this.fetchUrlFile(`npm/${componentPkgName}/${packageJSONObject.ridgeDist}`))
      }
    }

    files.push({
      type: 'json',
      filePath: `npm/${pkgName}/${pagePath}.json`,
      textContent: JSON.stringify(content, null, 2)
    })
    return files
  }

  // 将 基于baseUrl 的 baseUrl+path路径的web资源，压缩到 zip的 path路径上， zip为  new JSZip()实例 下载使用axios
  async fetchUrlFile (url) {
    try {
      // 构建完整的URL
      const fullUrl = '/' + url

      // 配置axios请求，获取二进制数据
      const response = await axios.get(fullUrl, {
        responseType: 'arraybuffer',
        headers: {
          Accept: '*/*'
        }
      })

      // 检查响应状态
      if (response.status !== 200) {
        throw new Error(`Failed to fetch ${fullUrl}, status code: ${response.status}`)
      }

      return {
        type: 'arraybuffer',
        filePath: url,
        data: response.data
      }
    } catch (error) {
      console.error(`Error fetching ${url}:`, error.message)
      return {
        success: false,
        url,
        message: error.message
      }
    }
  }

  // 将 基于baseUrl 的 baseUrl+path路径的web资源，压缩到 zip的 path路径上， zip为  new JSZip()实例 下载使用axios
  async fetchUrlFileIntoZip (url, zip) {
    try {
      // 构建完整的URL
      const fullUrl = '/' + url

      // 配置axios请求，获取二进制数据
      const response = await axios.get(fullUrl, {
        responseType: 'arraybuffer',
        headers: {
          Accept: '*/*'
        }
      })

      // 检查响应状态
      if (response.status !== 200) {
        throw new Error(`Failed to fetch ${fullUrl}, status code: ${response.status}`)
      }

      // 将获取到的内容添加到zip中，使用指定的path作为zip内部路径
      zip.file(url, response.data)

      // 返回成功信息
      return {
        success: true,
        url,
        message: `Successfully added ${url} to zip`
      }
    } catch (error) {
      console.error(`Error fetching ${url}:`, error.message)
      return {
        success: false,
        url,
        message: error.message
      }
    }
  }

  async fetchJSON (url) {
    const response = await window.fetch(url, {
      mode: 'cors',
      credentials: 'include'
    })
    if (response.ok) {
      return await response.json()
    } else {
      return null
    }
  }
}
