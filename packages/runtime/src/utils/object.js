import objectSet from 'lodash/set'

const cloneDeep = src => {
  try {
    return JSON.parse(JSON.stringify(src))
  } catch (e) {
    return src
  }
}

export {
  cloneDeep,
  objectSet
}
