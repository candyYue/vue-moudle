import api from '@/service/api'
import request from '@/utils/request'
// import { UserType } from '../../utils/config/types'

const actions = {
  adminLogin: async (context, payload) => {
    const res = await request(api.User.adminLogin, payload, 'post')
    if (res.status === 0) {
      localStorage.setItem('nickname', res.data.nickname)
      localStorage.setItem('type', res.data.type)
    }
    return res
  },
  logout: async (context, payload) => {
    let res
    if (localStorage.getItem('type') === '1') {
      res = await request(api.User.logout)
      if (res.status === 0) {
        localStorage.removeItem('type')
        localStorage.removeItem('nickname')
      }
    } else {
      res = await request(api.User.adminLogout)
      if (res.status === 0) {
        localStorage.removeItem('type')
        localStorage.removeItem('nickname')
      }
    }
    return res
  }
}
export default {
  namespaced: true,
  actions
}
