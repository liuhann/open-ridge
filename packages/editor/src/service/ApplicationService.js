import NeCollection from './NeCollection.js'
import debug from 'debug'
import Localforge from 'localforage'
import { blobToDataUrl, dataURLtoBlob, dataURLToString, stringToDataUrl, saveAs } from '../utils/blob.js'
import { getFileTree, filterTree, mapTree } from '../panels/files/buildFileTree.js'
import { basename, dirname, extname, nanoid } from '../utils/string.js'
import { getByMimeType } from '../utils/mimeTypes.js'
import JSZip from 'jszip'

const trace = debug('ridge:app-service')

export default class ApplicationService {
  constructor (appId) {
    this.appId = appId
    this.collection = new NeCollection('ridge.app.' + appId)
    this.store = Localforge.createInstance({ name: 'ridge-store-' + appId })
    this.dataUrls = {}
    this.dataUrlByPath = new Map()
    this.fileTree = null
    this.appPackageJSONObject = null // 缓存 package.json
  }

  getFileTree () {
    return this.fileTree
  }

  mapFileTree (map) {
    return mapTree(this.fileTree, map)
  }

  filterFiles (filter) {
    return filterTree(this.fileTree, filter)
  }

  getFile (id) {
    if (id == null) return null
    const filtered = filterTree(this.fileTree, f => f.path === id || f.id === id)
    return filtered[0]
  }

  // 修复拼写错误：cacheLoacalFileContents → cacheLocalFileContents
  async cacheLocalFileContents (files) {
    for (const file of files) {
      if (!file.mimeType) continue
      await this.loadFileTContent(file)
    }
  }

  async loadFileTContent (file) {
    if (file.mimeType.includes('image')) {
      file.url = await this.store.getItem(file.id)
    }

    if (file.mimeType.includes('text')) {
      const dataUrl = await this.store.getItem(file.id)
      file.textContent = await dataURLToString(dataUrl)
      if (file.mimeType === 'text/json') {
        try {
          file.json = JSON.parse(file.textContent)
        } catch (e) {}
      }
    }
  }

  async updateAppFileTree (updateContent = true) {
    trace('Update File Tree')
    const files = await this.getFiles()
    if (updateContent) {
      await this.cacheLocalFileContents(files)
    }
    this.fileTree = getFileTree(files, file => {
      if (file.json && file.json.version && file.json.elements) {
        file.type = 'page'
      }
    })
  }

  async createDirectory (parent, name) {
    trace('createDirectory', parent, name)
    const one = await this.collection.findOne({ parent, name })
    if (one) throw new Error('File existed: ' + name)

    const dirObject = {
      parent,
      id: nanoid(10),
      name,
      type: 'directory'
    }
    const dir = await this.collection.insert(dirObject)
    await this.updateAppFileTree(false)
    return dir
  }

  // ==============================
  // 🔥 核心：自动生成唯一文件名（完美保留后缀）
  // ==============================
  async getUniqueFileName (parentId, originalName) {
  // 1. 拆分文件名 + 后缀（只切最后一个 . 作为后缀）
    const lastDotIndex = originalName.lastIndexOf('.')
    let baseName = originalName
    let ext = ''

    if (lastDotIndex !== -1) {
      baseName = originalName.slice(0, lastDotIndex)
      ext = originalName.slice(lastDotIndex) // 保留 .
    }

    let counter = 1
    let newName = originalName

    // 2. 循环查找，直到找到不存在的文件名
    while (true) {
      const exists = await this.collection.findOne({
        parent: parentId,
        name: newName
      })

      if (!exists) break

      // 3. 拼接新名称：base-1.ext
      newName = `${baseName}-${counter}${ext}`
      counter++

      // 安全锁
      if (counter > 1000) {
        throw new Error('文件名冲突过多，无法自动重命名')
      }
    }

    return newName
  }

  async createFile (parentId, name, blob, mimeType, renOnConflict) {
    trace('createFile', parentId, name)

    let finalName = name

    // ==============================
    // 🔥 自动重命名（完美保留后缀）
    // ==============================
    if (renOnConflict) {
      finalName = await this.getUniqueFileName(parentId, name)
    } else {
      const one = await this.collection.findOne({ parent: parentId, name: finalName })
      if (one) throw new Error('File existed: ' + finalName)
    }

    const id = nanoid(10)
    const dataUrl = await blobToDataUrl(blob, mimeType)
    await this.store.setItem(id, dataUrl)

    let mtype = blob.type || mimeType
    if (!mtype) {
      mtype = getByMimeType(extname(name))
    }

    const inserted = await this.collection.insert({
      id,
      mimeType: mtype,
      size: blob.size,
      name: finalName, // ✅ 使用不冲突的文件名
      parent: parentId
    })

    await this.updateAppFileTree()
    return inserted
  }

  async updateFileContent (key, content) {
    trace('updateFileContent', key, content)
    const file = this.getFile(key)
    if (file) {
      file.textContent = content
      await this.store.setItem(key, await stringToDataUrl(content, file.mimeType))
      if (file.mimeType === 'text/json') {
        try {
          file.json = JSON.parse(content)
        } catch (e) {}
      }
    }
  }

  async rename (id, newName) {
    const existed = await this.collection.findOne({ id })
    if (!existed) return -1
    if (existed.name === newName) return 0

    const nameDuplicated = await this.collection.findOne({
      parent: existed.parent,
      name: newName
    })
    if (nameDuplicated) return -1

    await this.collection.patch({ id }, { name: newName })
    await this.updateAppFileTree() // 修复：刷新树
    return 1
  }

  checkNewNameValid (id, newName) {
    const file = this.getFile(id)
    if (!file) return false
    const same = this.filterFiles(node =>
      node.parent === file.parent && node.id !== id && node.name === newName
    )
    return same.length === 0
  }

  async move (id, newParent) {
    const existed = await this.collection.findOne({ id })
    if (!existed || existed.parent === newParent) return false

    const nameDup = await this.collection.findOne({ parent: newParent, name: existed.name })
    if (nameDup) return false

    await this.collection.patch({ id }, { parent: newParent })
    await this.updateAppFileTree()
    return true
  }

  async copy (id) {
    const existed = await this.collection.findOne({ id })
    if (!existed) return

    const newId = nanoid(10)
    const newObject = {
      id: newId,
      name: existed.name + '_' + newId,
      type: existed.type,
      parent: existed.parent,
      mimeType: existed.mimeType,
      copyFrom: id
    }
    await this.collection.insert(newObject)

    const content = await this.store.getItem(existed.id)
    if (content) await this.store.setItem(newId, content)
    await this.updateAppFileTree(true)
  }

  async deleteFile (id) {
    let file = null
    if (typeof id === 'string') {
      file = await this.collection.findOne({ id })
    } else {
      file = id
    }
    if (!file) return false

    if (file.type !== 'directory') {
      await this.store.removeItem(file.id)
    }

    const children = await this.collection.find({ parent: file.id })
    for (const child of children) {
      await this.deleteFile(child.id)
    }

    await this.collection.remove({ id: file.id })
    await this.updateAppFileTree(true)
    return true
  }

  async deleteFileByPath (path) {
    const file = this.getFile(path)
    if (file) return await this.deleteFile(file)
    return false
  }

  async getFiles (filter) {
    const query = filter ? { name: new RegExp(filter) } : {}
    return await this.collection.find(query)
  }

  async ensureDir (filePath) {
    const parentNames = filePath.split('/').filter(Boolean)
    let parentId = -1
    let currentFile = null

    for (const fileName of parentNames) {
      currentFile = await this.collection.findOne({ parent: parentId, name: fileName })
      if (!currentFile) {
        currentFile = await this.createDirectory(parentId, fileName)
      }
      parentId = currentFile.id
    }
    return currentFile
  }

  async isParent (parent, child) {
    let node = await this.getFile(child)
    while (node && node.parent !== -1) {
      if (node.parent === parent) return true
      node = await this.getFile(node.parent)
    }
    return false
  }

  getFileUrl (path) {
    const file = this.getFile(path)
    return file?.url || null
  }

  async zipFolder (zip, files) {
    for (const file of files) {
      if (file.type === 'directory') {
        const zf = zip.folder(file.name)
        await this.zipFolder(zf, file.children)
      } else {
        const dataUrl = await this.store.getItem(file.id)
        zip.file(file.name, await dataURLtoBlob(dataUrl))
      }
    }
  }

  async getAppArchiveFileBlob () {
    const zip = new JSZip()
    const files = await this.getFiles()
    this.fileTree = getFileTree(files)
    await this.zipFolder(zip, this.fileTree)
    return await zip.generateAsync({ type: 'blob' })
    // saveAs(await zip.generateAsync({ type: 'blob' }), pjson.description || pjson.name + '.zip')
  }

  async exportAppArchive () {
    const appArchiveBlob = await this.getAppArchiveFileBlob()
    const pjson = await this.getAppPackageJSON()
    saveAs(appArchiveBlob, pjson.description || pjson.name + '.zip')
  }

  async exportPage (id) {
    const document = await this.collection.findOne({ id })
    const content = await this.store.getItem(id)
    if (document && content) {
      saveAs(await dataURLtoBlob(content), document.name)
    }
  }

  // 修复：zip.forEach 不支持 async → 改用 for 循环
  async importAppArchive (file) {
    const zip = new JSZip()
    try {
      await zip.loadAsync(file)
    } catch (e) {
      console.error('invalid zip file', e)
      return false
    }

    await this.collection.clean()
    await this.store.clear()
    const entries = []
    zip.forEach((path, entry) => entries.push({ path, entry }))

    for (const { path, entry } of entries) {
      if (entry.dir) {
        await this.ensureDir(dirname(path))
      } else {
        await this.importZipEntryFile(path, entry)
      }
    }

    await this.updateAppFileTree()
    const pkg = await this.getAppPackageJSON()

    if (!pkg || !pkg.name) {
      await this.updateAppPackageJSON({
        name: 'ridge-' + this.appId,
        version: '1.0.0',
        description: '未命名应用'
      })
    }
  }

  // 修复：package.json 读取逻辑
  async getAppPackageJSON () {
    if (this.appPackageJSONObject) return this.appPackageJSONObject
    const file = this.getFile('/package.json')
    if (file) {
      if (!file.json) {
        await this.loadFileTContent(file)
      }
      if (file.json) {
        this.appPackageJSONObject = file.json
        if (!this.appPackageJSONObject.description) {
          this.appPackageJSONObject.description = '未命名应用'
        }
        return file.json
      }
    }
    return {}
  }

  // 修复：createFile 传入正确 Blob 格式
  async updateAppPackageJSON (packageJSONObject) {
    const file = this.getFile('/package.json')
    const content = JSON.stringify(packageJSONObject, null, 2)

    if (!file) {
      await this.createFile(
        -1,
        'package.json',
        new Blob([content], { type: 'text/json' }),
        'text/json'
      )
    } else {
      await this.updateFileContent(file.id, content)
    }

    this.appPackageJSONObject = JSON.parse(content)
  }

  async importZipEntryFile (filePath, zipObject) {
    const dirNode = await this.ensureDir(dirname(filePath))
    const parentId = dirNode?.id || -1
    const filename = basename(zipObject.name)
    const ext = extname(zipObject.name)
    const mimeType = getByMimeType(ext)
    const blob = await zipObject.async('blob')

    await this.createFile(parentId, filename, blob, mimeType)
  }

  /**
 * 导出单个文件 / 整个文件夹
 * @param {string} id 文件/文件夹id
 * @returns {Promise<boolean>}
 */
  async exportFile (id) {
  // 先查当前节点
    const node = this.getFile(id)
    if (!node) return false

    // 单个文件：直接下载
    if (node.type !== 'directory') {
      const dataUrl = await this.store.getItem(node.id)
      if (!dataUrl) return false
      const blob = await dataURLtoBlob(dataUrl)
      saveAs(blob, node.name)
      return true
    }

    // 文件夹：递归收集当前目录下整棵子树，复用已有 zipFolder
    const zip = new JSZip()
    // 直接用当前 node 整棵树结构（自带 children）
    await this.zipFolder(zip, [node])
    const blob = await zip.generateAsync({ type: 'blob' })
    saveAs(blob, `${node.name}.zip`)
    return true
  }

  async clear () {
    await this.collection.clean()
    await this.store.clear()
  }

  setIconUrl (iconUrl) {
    this.iconUrl = iconUrl
  }

  getIconUrl () {
    return this.iconUrl
  }

  // 修复：删除不存在的 backUpService 调用
  async importFromNpmRegistry (packageName, version) {
    console.warn('importFromNpmRegistry 未实现')
    return null
  }
}
