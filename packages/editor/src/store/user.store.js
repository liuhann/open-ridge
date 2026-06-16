import { create } from 'zustand'
import axios from 'axios'
import { Toast } from '@douyinfe/semi-ui'

const userStore = create((set, get) => ({
  // 当前登录用户信息
  logonUser: null,
  // 会话 token
  sess: '',
  // 全局加载态
  loading: false,

  /**
   * 初始化当前登录态（页面刷新后恢复登录）
   */
  initCurrentLogon: async () => {
    try {
      const sess = localStorage.getItem('user_sess')
      if (!sess) {
        set({ logonUser: null, sess: '' })
        return
      }
      // 根据 sess 查询用户信息
      const { data } = await axios.get(`/api/user/current?sess=${sess}`)
      if (data.code === '0' && data.data.user) {
        set({
          logonUser: data.data.user,
          sess
        })
      } else {
        // 会话失效，清空本地
        localStorage.removeItem('user_sess')
        set({ logonUser: null, sess: '' })
      }
    } catch (err) {
      console.error('初始化登录态失败：', err)
      localStorage.removeItem('user_sess')
      set({ logonUser: null, sess: '' })
    }
  },

  /**
   * 登录
   * @param {Object} params { mobile, password }
   */
  login: async (params) => {
    const { mobile, password } = params
    set({ loading: true })
    try {
      const res = await axios.post('/api/user/login', { mobile, password })
      if (res.data.code === 0) {
        const { sess, user } = res.data
        // 本地存储会话
        localStorage.setItem('user_sess', sess)
        set({
          logonUser: user,
          sess,
          loading: false
        })
        Toast.success('登录成功')
        return true
      } else {
        Toast.error(res.data.msg || '登录失败')
        set({ loading: false })
        return false
      }
    } catch (err) {
      const msg = err?.response?.data?.msg || '请求异常'
      Toast.error(msg)
      set({ loading: false })
      return false
    }
  },

  /**
   * 注册
   * @param {Object} params { mobile, password, inviteCode }
   */
  register: async (params) => {
    const { mobile, password, inviteCode } = params
    set({ loading: true })
    try {
      const res = await axios.post('/api/user/register', { mobile, password, inviteCode })
      if (res.data.code === 0) {
        const { sess, user } = res.data
        localStorage.setItem('user_sess', sess)
        set({
          logonUser: user,
          sess,
          loading: false
        })
        Toast.success('注册成功')
        return true
      } else {
        Toast.error(res.data.msg || '注册失败')
        set({ loading: false })
        return false
      }
    } catch (err) {
      const msg = err?.response?.data?.msg || '请求异常'
      Toast.error(msg)
      set({ loading: false })
      return false
    }
  },

  /**
   * 登出
   */
  logout: async () => {
    const { sess } = get()
    set({ loading: true })
    try {
      await axios.post('/api/user/logout', { sess })
    } catch (err) {
      console.error('登出接口请求异常', err)
    } finally {
      // 无论接口成败，清空本地状态
      localStorage.removeItem('user_sess')
      set({
        logonUser: null,
        sess: '',
        loading: false
      })
      Toast.success('已退出登录')
    }
  },

  /**
   * 生成邀请码
   * @param {string} mobile 有权限手机号
   * @returns {Promise<string|null>} 邀请码
   */
  generateInviteCode: async (mobile) => {
    set({ loading: true })
    try {
      const res = await axios.post('/user/generate-invite', { mobile })
      if (res.data.code === 0) {
        Toast.success('邀请码生成成功')
        set({ loading: false })
        return res.data.inviteCode
      } else {
        Toast.error(res.data.msg || '生成失败')
        set({ loading: false })
        return null
      }
    } catch (err) {
      const msg = err?.response?.data?.msg || '请求异常'
      Toast.error(msg)
      set({ loading: false })
      return null
    } finally {
      set({ loading: false })
    }
  }
}))

export default userStore
