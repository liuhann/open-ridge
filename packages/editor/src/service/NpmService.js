/**
 * 与标准NPM服务器通信、相关数据获取服务
 */
import axios from 'axios'
const GLOBAL_NPM_REGISTRY = 'https://registry.npmjs.org'

export default class NpmService {
  async getPackage (packageName) {
    const packageInfo = await axios.get(`${GLOBAL_NPM_REGISTRY}/${packageName}`)
    return packageInfo.data
  }
}
