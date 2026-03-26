import { VERSION } from 'ridgejs'

const PAGE_JSON_TEMPLATE = {
  version: VERSION,
  style: Object.assign({
    width: 1280,
    height: 960
  }),
  properties: {},
  jsFiles: [],
  elements: []
}

const APP_PACKAGE_JSON = {
  name: 'ridge-hello-app',
  version: '1.0.0',
  description: 'Hello Ridge应用',
  keywords: ['ridge-webapp']
}

const STORE_TEMPLATE = `
export default {
  name: 'Store',
  state: {
    name: 'World' //姓名
  },
  actions: {
  }
}
`

export {
  STORE_TEMPLATE,
  PAGE_JSON_TEMPLATE,
  APP_PACKAGE_JSON
}
