function isObject (objValue) {
  return objValue && typeof objValue === 'object' && objValue.constructor === Object
}

function isObjectsEqual (objA, objB) {
  if (objA === objB) return true
  if (typeof objA !== 'object' || objA === null || typeof objB !== 'object' || objB === null) {
    return objA === objB
  }
  const keysA = Object.keys(objA)
  const keysB = Object.keys(objB)
  if (keysA.length !== keysB.length) return false
  for (const key of keysA) {
    if (!keysB.includes(key) || !isObjectsEqual(objA[key], objB[key])) {
      return false
    }
  }
  return true
}

const arrowFunctionCache = new Map()
function isArrowFunction (func) {
  if (arrowFunctionCache.has(func)) {
    return arrowFunctionCache.get(func)
  }
  const result = typeof func === 'function' && /^[^{]*=>/.test(func.toString())
  arrowFunctionCache.set(func, result)
  return result
}

export {
  isObjectsEqual,
  isArrowFunction,
  isObject
}
