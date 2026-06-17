import Composite from './node/Composite.js'
import './style.css'
import './normalize.css'
import Element from './node/Element.js'
import ValtioStore from './store/ValtioStore.js'
import ReactComposite from './framework/ReactComposite.jsx'
import RuntimeAppService from './node/RuntimeAppService.js'
import Loader from './loader/Loader.js'
const ELEMENT_SCHEMA_URL = 'https://ridge-ui.com/schemas/element'
const COMPOSITE_SCHEMA_URL = 'https://ridge-ui.com/schemas/composite'

const VERSION = '2.0.0'
const ridgeBaseUrl = window.RIDGEUI_BASE_URL || '/npm'
// 应用内文件url统一前缀
const loader = new Loader(ridgeBaseUrl)

const loadPage = async (domElementId, appZipBlobFile, pagePath, properties) => {
  const appService = new RuntimeAppService()
  await appService.load(appZipBlobFile)
  const file = await appService.getFile(pagePath)
  const previewComposite = new Composite({
    loader,
    appService,
    appName: 'local',
    properties,
    config: file.json
  })
  await previewComposite.mount(document.querySelector(domElementId))
}

export {
  loadPage,
  loader,
  ridgeBaseUrl,
  VERSION,
  ELEMENT_SCHEMA_URL,
  COMPOSITE_SCHEMA_URL,
  Composite,
  Element,
  ValtioStore,
  ReactComposite
}
