import * as AICallService from '@/service/AICall'

export const state = {
  EpInfo: JSON.parse(localStorage.enterprise || '{}'),
  EpConfig: JSON.parse(localStorage.epConfig || '{}'),
  SystemConfigs: JSON.parse(localStorage.systemConfigs || '{}')
}

export const getters = {
  EpInfo: state => state.EpInfo,
  EpConfig: state => state.EpConfig,
  SystemConfigs: state => state.SystemConfigs
}

export const mutations = {
  getEpInfo (state, payload) {
    state.EpInfo = payload.state
  },
  getEpConfig (state, payload) {
    state.EpConfig = payload.state
  },
  getSystemConfigs (state, payload) {
    state.SystemConfigs = payload.state
  }
}

export const actions = {
  login: async (context, payload) => {
    localStorage.removeItem('type')
    const res = await AICallService.login(payload)
    if (res.status === 0) {
      // const eid = res.data.enterprise
      context.dispatch('getEnterprise')
      context.dispatch('getConfig')
      context.dispatch('getSystemConfigs')
      localStorage.setItem('nickname', res.data.nickname)
      localStorage.setItem('type', res.data.type)
      localStorage.setItem('eid', res.data.enterprise || '')
    }
    return res
  },
  getEnterprise: async (context, payload) => {
    const res = await AICallService.getEnterprise(payload)
    if (res.status === 0) {
      context.commit({
        type: 'getEpInfo',
        state: res.data
      })
      localStorage.setItem('enterprise', JSON.stringify(res.data))
    }
    return res
  },
  getConfig: async (context, payload) => {
    const res = await AICallService.getConfig(payload)
    if (res.status === 0) {
      context.commit({
        type: 'getEpConfig',
        state: res.data
      })
      localStorage.setItem('epConfig', JSON.stringify(res.data))
    }
    return res
  },
  getSystemConfigs: async (context, payload) => {
    const res = await AICallService.getSystemConfigs(payload)
    if (res.status === 0) {
      context.commit({
        type: 'getSystemConfigs',
        state: res.data
      })
      localStorage.setItem('systemConfigs', JSON.stringify(res.data))
    }
    return res
  }
}
