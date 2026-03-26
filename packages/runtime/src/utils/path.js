const resolve = (source, target) => {
  if (target.startsWith('/')) return target
  const parts = (source.endsWith('/') ? source : source.slice(0, source.lastIndexOf('/') + 1))
    .split('/').filter(part => part)
  target.split('/').forEach(part => {
    if (part === '..') parts.pop()
    else if (part !== '.' && part) parts.push(part)
  })
  return '/' + parts.join('/')
}

export {
  resolve
}
