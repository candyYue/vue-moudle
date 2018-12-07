import api from '@/service/api'
import request from '@/utils/request'
const state = {
  // 所有企业
  AllEsTotalList: [],
  // 获取企业的话术
  CompanyScriptList: [],
  CompanyScriptTotal: 0,
  // 企业配置
  getAccessKey: '',
  getSecretKey: ''
}

const getters = {
  AllEsTotalList: state => state.AllEsTotalList,
  CompanyScriptList: state => state.CompanyScriptList,
  CompanyScriptTotal: state => state.CompanyScriptTotal,
  EpSetting: state => state.EpSetting,
  getAccessKey: state => state.getAccessKey,
  getSecretKey: state => state.getSecretKey
}

const mutations = {
  getAllEs (state, payload) {
    if (payload.state) {
      state.AllEsTotalList = payload.state || []
    }
  },
  getCompanyScripts (state, payload) {
    if (payload.state) {
      state.CompanyScriptList = payload.state.scripts || []
      state.CompanyScriptTotal = payload.state.count || 0
    }
  },
  getApiKey (state, payload) {
    if (payload.state) {
      state.getAccessKey = payload.state.access_key || ''
      state.getSecretKey = payload.state.secret_key || ''
    }
  }
}

const actions = {
  getAllEs: async (context, payload) => {
    const res = await request(api.Admin.getAllEs, payload)
    if (res.status === 0) {
      context.commit({
        type: 'getAllEs',
        state: res.data
      })
    }
  },
  // getCompanyScripts: async (context, payload) => {
  //   const res = await request(api.Admin.getScripts, payload)
  // },
  getCompanyScripts: async (context, payload) => {
    const res = await request(api.Admin.getScripts, payload)
    if (res.status === 0) {
      context.commit({
        type: 'getCompanyScripts',
        state: res.data
      })
    }
  },
  copyScripts: (context, payload) => {
    return request(api.Admin.copyScripts, payload, 'post')
  },
  getConfig: async (context, payload) => {
    return request(api.Admin.getConfig, payload)
  },
  setConfig: async (context, payload) => {
    return request(api.Admin.setConfig, payload)
  },
  getApiKey: async (context, payload) => {
    const res = await request(api.Admin.getApiKey, payload)
    if (res.status === 0) {
      context.commit({
        type: 'getApiKey',
        state: res.data
      })
    }
  }
}
export default {
  namespaced: true,
  state,
  getters,
  mutations,
  actions
}
