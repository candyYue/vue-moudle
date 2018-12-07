import {
  messageTip
} from '@/components/feedback/Message'
import {
  UserType
} from '../config/types'

export default {
  0: response => response,
  40101: (response) => {
    console.log('获取token失败')
  },
  // 鉴权失败
  10302: () => {
    const type = localStorage.getItem('type') // 上次登录的账号类型
    localStorage.removeItem('type')
    window.location.href = UserType[type].login
  },
  // 您没有权限进行此操作
  20103: () => {
    const type = localStorage.getItem('type') // 上次登录的账号类型
    localStorage.removeItem('type')
    window.location.href = UserType[type].login
  },
  // 未登录
  20102: (response) => {
    const type = localStorage.getItem('type') // 上次登录的账号类型
    localStorage.removeItem('type')
    window.location.href = UserType[type].login
  },
  // 企业过期
  101018: (response) => {
    messageTip.$warning({
      content: response.data.info
    })
  },
  'error': (response) => { // 其他错误
    messageTip.$info({
      content: response.data.info
    })
  },
  'timeout': () => {
    messageTip.$info({
      content: '请求超时'
    })
  },
  'network': () => { // 服务器异常
    messageTip.$info({
      content: '网络请求异常'
    })
  }
}
