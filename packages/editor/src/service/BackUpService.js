/* global Blob File */
import JSZip, { version } from 'jszip'
import NeCollection from './NeCollection.js'
import Localforge from 'localforage'
import { dataURLtoBlob, saveAs } from '../utils/blob'
import { basename, dirname, extname, formateDate, nanoid } from '../utils/string.js'
import { buildFileTree, getFileTree } from '../panels/files/buildFileTree.js'
import axios from 'axios'
import { TarReader } from '../utils/tarball.js'
import { getByMimeType } from '../utils/mimeTypes.js'
import helloZipApp from '../ridge-app-hello-1.0.0.zip'

const pako = require('pako')

export default class BackUpService {
  constructor (appService) {
    this.appService = appService
    this.coll = appService.collection

    this.backUpStorage = Localforge.createInstance({ name: 'ridgeui-hisgtory-store' })

    this.store = appService.store
    this.archiveColl = new NeCollection('ridge.backup.db')
  }

  // 备份当前应用内容到本地存储历史库
  async backup () {
    const appPackageObject = await this.appService.getPackageJSONObject()

    if (appPackageObject) {
      const date = formateDate()
      const backUpName = `${appPackageObject.name}-${appPackageObject.version}-${date}`

      const appBlob = await this.getAppBlob()

      await this.backUpStorage.setItem(backUpName, appBlob)
      const historyObject = {
        backUpName,
        name: appPackageObject.name,
        d: date,
        version: appPackageObject.version
      }
      await this.archiveColl.insert(historyObject)
    }
  }

  async recover (name) {
    const appBlob = await this.backUpStorage.getItem(name)
    if (appBlob) {
      await this.importAppArchive(appBlob)
    }
  }

  async listAllHistory () {
    return await this.archiveColl.find({})
  }

  async deleteHistory (id) {
    const historyObject = await this.archiveColl.findOne({
      backUpName: id
    })
    if (historyObject) {
      await this.archiveColl.remove({
        backUpName: id
      })
      await this.backUpStorage.removeItem(id)
    }
  }

  /**
   * 导出一个文件(文件夹)归档
   * @param {*} coll
   * @param {*} key
   * @param {*} store
   */
  async exportFileArchive (id) {
    const document = await this.coll.findOne({
      id
    })

    if (document.type === 'directory') { // 导出文件夹
      const files = await this.coll.find({})
      const zip = new JSZip()
      const treeData = buildFileTree(document, null, files)
      await this.zipFolder(zip, [treeData])
      const blob = await zip.generateAsync({ type: 'blob' })
      saveAs(blob, document.name + '.zip')
    } else {
      const content = await this.store.getItem(id)

      if (content) {
        if (document.type === 'page') {
          saveAs(new Blob([JSON.stringify(content, null, 2)]), document.name + '.json')
        } else {
          saveAs(await dataURLtoBlob(content), document.name)
        }
      }
    }
  }

  async importFileArchive (parent, file) {
    const { appService } = this
    if (file.name.endsWith('.json')) { // 对json文件判断是否为图纸，是图纸则导入
      const jsonObject = JSON.parse(await file.text())
      if (jsonObject.elements) {
        await appService.createPage(parent, basename(file.name, '.json'), jsonObject)
      } else {
        await appService.createFile(parent, new File([JSON.stringify(jsonObject)], file.name, {
          type: 'text/json'
        }))
      }
    } else {
      await appService.createFile(parent, file)
    }
  }

  async getAppBlob () {
    const zip = new JSZip()
    const files = await this.coll.find({})

    const treeData = getFileTree(files)

    await this.zipFolder(zip, treeData)
    const blob = await zip.generateAsync({ type: 'blob' })
    return blob
  }

  /**
   * 导出应用归档
   * @param {*} coll
   * @param {*} store
   */
  async exportAppArchive () {
    const blob = await this.getAppBlob()
    saveAs(blob, packageJSON.name + '-' + packageJSON.version + '.zip')
  }

  /**
   * 递归将目录压缩到zip包中
   * @param {*} zip
   * @param {*} files
   */
  async zipFolder (zip, files) {
    for (const file of files) {
      if (file.type === 'directory') {
        const zipFolder = zip.folder(file.label)
        await this.zipFolder(zipFolder, file.children)
      } else {
        const content = await this.store.getItem(file.key)
        if (file.type === 'page') {
          zip.file(file.label + '.json', JSON.stringify(content, null, 2))
        } else {
          zip.file(file.label, await dataURLtoBlob(content))
        }
        // zip.file(file.label, JSON.stringify(file.raw))
      }
    }
  }

  async importHelloArchive () {
    const response = await fetch(helloZipApp)
    const buffer = await response.arrayBuffer()
    await this.importAppArchive(buffer)
  }

  /**
   * 导入应用的存档
   * @param {*} file 选择的文件
   * @param {*} appService 应用管理服务
   */
  async importAppArchive (file) {
    const zip = new JSZip()

    try {
      await zip.loadAsync(file)
    } catch (e) {
      console.error('invalid zip file', e)
      return false
    }

    const { appService } = this

    await this.coll.clean()
    await this.store.clear()
    const fileMap = []
    zip.forEach(async (filePath, zipObject) => {
      fileMap.push({
        filePath,
        zipObject
      })
    })

    for (const { filePath, zipObject } of fileMap) {
      if (!zipObject.dir) {
        await this.importSingleFile(filePath, zipObject)
      } else {
        await appService.ensureDir(filePath)
      }
    }
    return fileMap
  }

  // 导入文件夹归档到指定目录
  async importFolderArchive (file, parent) {
    const zip = new JSZip()
    try {
      await zip.loadAsync(file)
    } catch (e) {
      console.error('invalid zip file', e)
      return false
    }
    const { appService } = this
    const fileMap = []
    zip.forEach(async (filePath, zipObject) => {
      fileMap.push({
        filePath,
        zipObject
      })
    })
    for (const { filePath, zipObject } of fileMap) {
      if (!zipObject.dir) {
        await this.importSingleFile(parent + '/' + filePath, zipObject)
      } else {
        await appService.ensureDir(parent + '/' + filePath)
      }
    }

    return fileMap
  }

  async importSingleFile (filePath, zipObject) {
    const { appService } = this
    const dirNode = await appService.ensureDir(dirname(filePath))
    const parentId = dirNode ? dirNode.id : -1
    const filename = basename(zipObject.name)
    const ext = extname(zipObject.name)
    if (filePath.endsWith('.json')) { // 对json文件判断是否为图纸，是图纸则导入
      const jsonObject = JSON.parse(await zipObject.async('text'))
      if (jsonObject.elements) {
        await appService.createComposite(parentId, basename(filename, '.json'), jsonObject)
      } else {
        await appService.createFile(parentId, filename, new File([JSON.stringify(jsonObject, null, 2)], filename), 'text/json')
      }
    } else {
      const mimeType = getByMimeType(ext)
      await appService.createFile(parentId, filename, new File([await zipObject.async('blob')], filename, {
        type: mimeType
      }), getByMimeType(ext))
    }
  }

  async getPackageLatestVersion (appPkgName, version) {

  }

  async importFromRidgeCloud (url) { // 从Ridge服务器导入应用
    try {
      const zipData = (await axios.get(`/api/app/storage/share/${url}`, {
        responseType: 'arraybuffer'
      })).data
      await this.importAppArchive(zipData)
    } catch (e) {
      return null
    }
  }

  /**
   * 从npm仓库导入应用，会清空当前应用
   * @param {*} appPkgName 应用包名
   * @param {*} version 版本号
   */
  async importFromNpmRegistry (appPkgName, version = '1.0.0') {
    const imported = await axios.get(`https://registry.npmjs.org/${appPkgName}/-/${appPkgName}-${version}.tgz`, {
      responseType: 'arraybuffer'
    })
    const pakoArray = pako.ungzip(imported.data)

    const tr = new TarReader()

    const res = await tr.readFile(new Blob([pakoArray.buffer], { type: 'application/gzip' }))

    const { appService } = this

    await appService.collection.clean()
    await appService.store.clear()

    for (const file of res) {
      if (file.name.startsWith('package')) {
        const filePath = file.name.substring(7)
        const fileBlob = tr.getFileBlob(file.name)

        const dirNode = await appService.ensureDir(dirname(filePath))
        const parentId = dirNode ? dirNode.id : -1
        const filename = basename(filePath)
        const ext = extname(filePath)

        if (filePath.endsWith('.json')) { // 对json文件判断是否为图纸，是图纸则导入
          const jsonObject = JSON.parse(tr.getTextFile(file.name))
          if (jsonObject.elements) {
            await appService.deleteFileByPath(filePath.substring(0, filePath.length - 5))
            await appService.createComposite(parentId, basename(filename, '.json'), jsonObject)
          } else {
            await appService.deleteFileByPath(filePath)
            await appService.createFile(parentId, filename, new File([JSON.stringify(jsonObject)], filename), 'text/json')
          }
        } else {
          await appService.deleteFileByPath(filePath)
          await appService.createFile(parentId, filename, new File([fileBlob], filename, {
            type: getByMimeType(ext)
          }), getByMimeType(ext))
        }
      }
    }

    await appService.updateAppFileTree()
    //    const fileMap = await this.importAppArchive()
    //  return fileMap
  }
}
