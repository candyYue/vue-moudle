import api from '@/service/api'
import request from '@/utils/request'

/**
 * @description 聚类
 */
const getClusters = async (context, payload) => {
  const data = Object.assign({}, payload)
  const res = await request(api.AICall.getClusters, data)
  context.commit({
    type: 'getClusters',
    state: res.data
  })
  return res
}
const delClusters = (context, payload) => (
  request(api.AICall.delClusters, {
    id: payload.id
  })
)
const saveClusters = (context, payload) => (
  request(api.AICall.setCluster, payload, 'post')
)
/**
 * @description 字段
 */
const getFields = async (context, payload) => {
  const data = Object.assign({}, payload)
  const res = await request(api.AICall.getFields, data)
  context.commit({
    type: 'getFields',
    state: res.data
  })
  return res
}
const delFields = (context, payload) => (
  request(api.AICall.delFields, {
    id: payload.id
  })
)

const saveFields = (context, payload) => (
  request(api.AICall.setFields, payload, 'post')
)

/**
 * @description 标签
 */
const getLabels = async (context, payload) => {
  const data = Object.assign({}, payload)
  const res = await request(api.AICall.getLabels, data)
  context.commit({
    type: 'getLabels',
    state: res.data
  })
  return res
}
const delLabels = (context, payload) => (
  request(api.AICall.delLabels, {
    id: payload.id
  })
)

const saveLabels = (context, payload) => (
  request(api.AICall.setLabels, payload, 'post')
)
/**
 * @description 短信
 */
const getMessages = async (context, payload) => {
  const data = Object.assign({}, payload)
  const res = await request(api.AICall.getMessages, data)
  context.commit({
    type: 'getMessages',
    state: res.data
  })
  return res
}
const delMessages = (context, payload) => (
  request(api.AICall.delMessages, {
    id: payload.id
  })
)

const saveMessages = (context, payload) => (
  request(api.AICall.setMessages, payload, 'post')
)

/**
 * @description 任务
 */
const getTasks = async (context, payload) => {
  const res = await request(api.AICall.getTasks, payload)
  if (res.data) {
    context.commit({
      type: 'getTasks',
      state: res.data
    })
  } else {
    context.commit({
      type: 'getTasks',
      state: []
    })
  }
}

const deleteTasks = (context, payload) => {
  return request(api.AICall.deleteTasks, payload, 'POST', {
    'Content-Type': 'application/json'
  })
}

const controlTask = (context, payload) => {
  return request(api.AICall.controlTask, payload)
}

const saveTask = (context, payload) => {
  // return new Promise((resolve, reject) => {
  //   const request = new XMLHttpRequest()
  //   request.open('POST', api.AICall.setTask, true)
  //   request.send(payload)
  // })
  request(api.AICall.setTask, payload, 'POST')
}
// 导入
const importAITask = (context, payload) => {
  return request(api.AICall.importAITask, payload)
}

const taskStatistics = (context, payload) => {
  return request(api.AICall.taskStatistics, payload)
}

const taskClues = async (context, payload) => {
  const res = await request(api.AICall.taskClues, payload)
  context.commit({
    type: 'taskClues',
    state: res.data
  })
  return res
}

const deleteTaskClues = (context, payload) => {
  return request(api.AICall.deleteTaskClues, payload)
}
const delRecords = (context, payload) => {
  return request(api.AICall.delRecords, payload, 'POST', {
    'Content-Type': 'application/json'
  })
}
const reCall = (context, payload) => {
  return request(api.AICall.reCall, payload, 'POST', {
    'Content-Type': 'application/json'
  })
}
const recallByType = (context, payload) => {
  return request(api.AICall.recallByType, payload, 'POST')
}

const recordDetail = async (context, payload) => {
  const res = await request(api.AICall.recordDetail, payload)
  if (res.data) {
    context.commit({
      type: 'recordDetail',
      state: res.data
    })
  };
  return res
}
const getRecordUrl = (context, payload) => {
  return request(api.AICall.getRecordUrl, payload)
}
/**
 * @description 问题
 */
const getQuestions = async (context, payload) => {
  const res = await request(api.AICall.getQuestions, payload)

  if (res.data) {
    context.commit({
      type: 'getQuestions',
      state: res.data
    })
  }
}

const delQuestions = (context, payload) => {
  return request(api.AICall.delQuestions, { id: payload.id })
}
const questionDetail = (context, payload) => {
  return request(api.AICall.questionDetail, payload)
}
const setQuestion = (context, payload) => {
  return request(api.AICall.setQuestion, payload, 'POST')
}
/**
 * @description 空闲机器人数
 */
const getfree = async (context, payload) => {
  const res = await request(api.AICall.getfree)
  if (res.data) {
    context.commit({
      type: 'getfree',
      state: res.data
    })
  } else {
    context.commit({
      type: 'getfree',
      state: 0
    })
  }
}

const getServiceGroups = async (context, payload) => {
  const res = await request(api.AICall.getServiceGroups, payload)
  if (res.data) {
    context.commit({
      type: 'getServiceGroups',
      state: res.data
    })
  } else {
    context.commit({
      type: 'getServiceGroups',
      state: []
    })
  }
  return res
}

const getCallNumbers = async (context, payload) => {
  const res = await request(api.AICall.getCallNumbers)
  if (res.data) {
    context.commit({
      type: 'getCallNumbers',
      state: res.data
    })
  } else {
    context.commit({
      type: 'getCallNumbers',
      state: []
    })
  }
}

const scriptItem = async (context, payload) => {
  const res = await request(api.AICall.scriptItem, {
    id: payload
  })
  return res
}

const labelItem = async (context, payload) => {
  const res = await request(api.AICall.labelItem, {
    id: payload
  })
  return res
}

const getGlobalKeywordByTaskId = async (context, payload) => {
  const res = await request(api.AICall.getGlobalKeywordByTaskId, payload)
  if (res.data) {
    context.commit({
      type: 'getGlobalKeywordByTaskId',
      state: res.data
    })
  } else {
    context.commit({
      type: 'getGlobalKeywordByTaskId',
      state: []
    })
  }
}

export default {
  getClusters,
  saveClusters,
  getFields,
  delFields,
  saveFields,
  getLabels,
  delLabels,
  saveLabels,
  delClusters,
  getMessages,
  delMessages,
  saveMessages,
  getTasks,
  deleteTasks,
  controlTask,
  saveTask,
  importAITask,
  taskStatistics,
  taskClues,
  deleteTaskClues,
  delRecords,
  reCall,
  recallByType,
  recordDetail,
  getRecordUrl,
  getQuestions,
  delQuestions,
  questionDetail,
  setQuestion,
  getfree,
  getServiceGroups,
  getCallNumbers,
  scriptItem,
  labelItem,
  getGlobalKeywordByTaskId
}
