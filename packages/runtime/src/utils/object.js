import objectSet from 'lodash/set'

const cloneDeep = src => {
  return JSON.parse(JSON.stringify(src))
}

export {
  cloneDeep,
  objectSet
}
