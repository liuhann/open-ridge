class Database {
  /**
     * 获取数据库所有集合
     */
  async getCollections () {}

  /**
   * 获取集合
   * @param name
   */
  async getCollection (name) {}

  /**
   * 删除数据集合
   * @param name
   */
  async removeCollection (name) {}

  /**
   * 创建数据集合
   */
  async createCollection (name) {}

  /**
     * 复制数据库到另一个位置
     */
  async clone (destPath) {}

  /**
     * 删除数据库 (有多个集合同时也删除)
     */
  async drop () {}
}
module.exports = Database
