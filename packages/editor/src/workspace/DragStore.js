// DragStore.js
class DragStore {
  constructor () {
    this.data = null
  }

  /**
   * 设置拖拽数据
   * @param {any} data - 拖拽数据
   */
  setDragData (data) {
    this.data = data
  }

  /**
   * 获取并消费拖拽数据
   * @returns {any} 拖拽数据
   */
  consumeDragData () {
    const data = this.data
    this.data = null // 消费后清空
    return data
  }

  /**
   * 检查是否有拖拽数据
   * @returns {boolean}
   */
  getDragData () {
    return this.data
  }

  /**
   * 清空拖拽数据
   */
  clear () {
    this.data = null
  }
}

// 创建单例实例
const dragStore = new DragStore()

export default dragStore
