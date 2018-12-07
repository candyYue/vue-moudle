import { stringToId } from '@/utils/helper/assist'

import * as AICallService from '@/service/AICall'

export const state = {
  // 话术
  scriptListTotal: 0,
  scriptList: [],
  scriptContent: {},
  scriptsCache: {},
  // 聚类
  clustersListTotal: 0,
  clustersList: [],
  // 字段
  fieldsListTotal: 0,
  fieldsList: [],
  // 标签
  labelsListTotal: 0,
  labelsList: [],
  labelsOptions: [],
  // 短信
  messagesListTotal: 0,
  messagesList: []
}

export const getters = {
  scriptListTotal: state => state.scriptListTotal,
  scriptList: state => state.scriptList,
  scriptContent: state => state.scriptContent,
  scriptsCache: state => state.scriptsCache,
  clustersListTotal: state => state.clustersListTotal,
  clustersList: state => state.clustersList,
  clustersMap: state => {
    const map = new Map()
    state.clustersList.map(cluster => {
      map.set(cluster.id, cluster.title)
    })
    return map
  },
  fieldsListTotal: state => state.fieldsListTotal,
  fieldsList: state => state.fieldsList,
  labelsListTotal: state => state.labelsListTotal,
  labelsList: state => state.labelsList,
  labelsOptions: state => {
    const opts = state.labelsList.map(labels => {
      return {
        value: String(labels.id),
        label: labels.title,
        children: labels.content && labels.content.map(label => ({
          value: stringToId(label),
          label
        }))
      }
    }) || []
    return opts
  },
  messagesListTotal: state => state.messagesListTotal,
  messagesList: state => state.messagesList
}

export const mutations = {
  getScripts (state, payload) {
    if (payload.state) {
      state.scriptListTotal = +payload.state.count || 0
      state.scriptList = payload.state.scripts || []
    }
  },
  loadScripts (state, payload) {
    state.scriptList = payload.state
  },
  saveScriptsCache (state, payload) {
    state.scriptsCache[payload.state.id] = payload.state.content
  },
  saveScriptContent (state, payload) {
    state.scriptContent = payload.state
  },
  loadClusters (state, payload) {
    state.clustersList = payload.state
  },
  getClusters (state, payload) {
    if (payload.state) {
      state.clustersListTotal = +payload.state.count || 0
      state.clustersList = payload.state.clusters || []
    }
  },
  getFields (state, payload) {
    if (payload.state) {
      state.fieldsListTotal = +payload.state.count || 0
      state.fieldsList = payload.state.fields || []
    }
  },
  loadFields (state, payload) {
    state.fieldsList = payload.state
  },
  loadLabels (state, payload) {
    state.labelsList = payload.state
  },
  getLabels (state, payload) {
    if (payload.state) {
      state.labelsListTotal = +payload.state.count || 0
      state.labelsList = payload.state.labels || []
    }
  },
  loadMessages (state, payload) {
    state.messagesList = payload.state
  },
  getMessages (state, payload) {
    if (payload.state) {
      state.messagesListTotal = +payload.state.count || 0
      state.messagesList = payload.state.messages || []
    }
  }
}

export const actions = {
  getScripts: async (context, payload) => {
    const data = Object.assign({}, payload)
    const res = await AICallService.getScripts(data)
    context.commit({
      type: 'getScripts',
      state: res.data
    })
    return res
  },
  delScripts: (context, payload) => {
    return AICallService.delScripts({
      id: payload.id
    })
  },
  scriptDetail: (context, payload) => {
    return AICallService.scriptDetail(payload)
  },
  saveScripts: (context, payload) => {
    return AICallService.saveScripts(payload)
  },
  saveScriptsCache: (context, payload) => {
    context.commit({
      type: 'saveScriptsCache',
      state: payload
    })
  },
  // 话术
  loadScripts: async (context, payload) => {
    const rsp = await AICallService.getScripts(payload)
    return rsp.data
  },
  // 聚类
  loadClusters: async (context, payload) => {
    const rsp = await AICallService.getClusters(payload)
    return rsp.data
  },
  // 标签
  loadLabels: async (context, payload) => {
    const rsp = await AICallService.loadLabels(payload)
    return rsp.data
  },
  // 短信
  loadMessages: async (context, payload) => {
    const rsp = await AICallService.loadMessages(payload)
    return rsp.data
  }
}
