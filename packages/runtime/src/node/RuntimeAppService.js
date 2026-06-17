import JSZip from 'jszip'
import { getFileTree } from 'ridge-editor/src/panels/files/buildFileTree.js'
import { basename, dirname, extname } from 'ridge-editor/src/utils/string.js'
import { getByMimeType } from 'ridge-editor/src/utils/mimeTypes.js'
import { dataURLToString, blobToDataUrl } from 'ridge-editor/src/utils/blob.js'

class RuntimeAppService {
  constructor () {
    // 内存文件树缓存
    this.fileTree = null
    // 内存文件映射 key: fileId / path => file 对象
    this.fileMap = new Map()
    // package.json 缓存
    this.appPackageJSONObject = null
  }

  /**
   * 加载zip二进制Blob，解析所有文件，构建内存文件树，不持久化存储
   * @param {Blob} zipFileBlob 压缩包二进制
   */
  async load (zipFileBlob) {
    const zip = new JSZip()
    await zip.loadAsync(zipFileBlob)

    const fileList = []
    const entries = []
    zip.forEach((path, entry) => entries.push({ path, entry }))

    // 遍历zip内所有条目，生成内存文件对象
    for (const { path, entry } of entries) {
      const fileName = basename(path)
      const parentPath = dirname(path)
      const ext = extname(fileName)
      const mimeType = getByMimeType(ext)
      const id = path // 运行时直接用完整路径作为唯一ID，无需nanoid

      if (entry.dir) {
        // 目录节点
        fileList.push({
          id,
          path,
          name: fileName,
          parent: parentPath === '' ? -1 : parentPath,
          type: 'directory'
        })
      } else {
        // 文件节点：读取blob、转dataUrl、文本预解析
        const blob = await entry.async('blob')
        const dataUrl = await blobToDataUrl(blob, mimeType)
        const fileItem = {
          id,
          path,
          name: fileName,
          parent: parentPath === '' ? -1 : parentPath,
          type: 'file',
          mimeType,
          size: blob.size,
          blob,
          url: dataUrl,
          textContent: null,
          json: null
        }

        // 文本类文件预解析文本内容
        if (mimeType.includes('text')) {
          fileItem.textContent = await dataURLToString(dataUrl)
          if (mimeType === 'text/json') {
            try {
              fileItem.json = JSON.parse(fileItem.textContent)
              // 缓存根package.json
              if (path === 'package.json') {
                this.appPackageJSONObject = fileItem.json
              }
            } catch (e) {}
          }
        }

        fileList.push(fileItem)
      }
    }

    // 生成树结构，同时填充fileMap方便快速查询
    this.fileTree = getFileTree(fileList, (file) => {
      if (file.json && file.json.version && file.json.elements) {
        file.type = 'page'
      }
    })

    // 构建索引映射：path / id 双向索引
    this.fileMap.clear()
    for (const f of fileList) {
      this.fileMap.set(f.id, f)
      this.fileMap.set('/' + f.path, f)
    }
  }

  /**
   * 获取package.json配置对象
   * @returns {object}
   */
  getAppPackageJSON () {
    return this.appPackageJSONObject || {}
  }

  /**
   * 根据文件ID / 文件路径获取文件对象
   * @param {string} idOrPath 文件完整路径 或 path作为的id
   * @returns {object|null} file对象（携带blob、textContent、json、url等）
   */
  getFile (idOrPath) {
    if (idOrPath == null) return null
    return this.fileMap.get(idOrPath) || null
  }
}

export default RuntimeAppService
