/**
 * The Interface extends by each Ridge Element
 * Includes:
 * BaseNode <-- Component <-- EditorComponent
 *          <-- Composite <-- EditorComposite
 *
 **/
class BaseNode {
  async load () {}
  async mount (el) {}
  setProperties (props) {}
  unmount () {}
  invoke () {}

  /**
   * 设置渲染区域提示信息
   **/
  setStatus (status, info) {
    this.status = status

    if (!this.el) return
    // const overlays = this.el.querySelectorAll('.ridge-overlay')
    // for (const overlay of overlays) {
    //   overlay.parentElement.removeChild(overlay)
    // }

    // const layer = document.createElement('div')
    // layer.setAttribute('name', status)
    // layer.classList.add('ridge-overlay')
    // layer.classList.add('status-' + status)
    // if (info) {
    //   layer.innerText = info.code
    //   info.onclick = () => {
    //     console.log(info.code, info.error)
    //   }
    // }

    this.el.classList.add('status-' + status)
    // this.el.innerHTML = ''
    // this.el.appendChild(layer)
  }

  getStatus () {
    return this.status
  }

  removeStatus (name) {
    this.status = null
    if (!this.el) return

    for (const st of this.el.classList) {
      if (name) {
        if (st === 'status-' + name) {
          this.el.classList.remove(st)
        }
      } else {
        if (st.startsWith('status-')) {
          this.el.classList.remove(st)
        }
      }
    }
  }
}

export default BaseNode
