const compositeLayers = compositeRootEl => {
  const els = compositeRootEl.querySelectorAll('.ridge-element')
  els.forEach(el => {
    const bcr = el.getBoundingClientRect()
    el.dataset.bcr = JSON.stringify(bcr)
    el.dataset.countRidgeParents = countRidgeParents(el, compositeRootEl)
  })

  els.forEach(el => {
    compositeRootEl.appendChild(el)
    const bcr = JSON.parse(el.dataset.bcr)

    el.style.position = 'absolute'
    el.style.left = bcr.left + 'px'
    el.style.top = bcr.top + 'px'
    el.style.width = bcr.width + 'px'
    el.style.height = bcr.height + 'px'
    el.style.zIndex = Number(el.dataset.countRidgeParents) * 100
  })
}

function countRidgeParents (el, compositeRootEl) {
  let count = 0
  let currentParent = el.parentNode
  while (currentParent !== compositeRootEl && currentParent !== document.body) {
    if (currentParent.classList.contains('ridge-element')) {
      count++
    }
    currentParent = currentParent.parentNode
  }
  return count
}

export {
  compositeLayers
}
