import AICallActions from '../../actions/AICall'

import * as EpInfo from './EpInfo'
import * as Script from './Script'
const state = {
  ...EpInfo.state,
  ...Script.state,
  // 任务
  taskListTotal: 0,
  taskList: [],
  taskCluesListTotal: 0,
  taskCluesList: [],
  task_status: 0,
  ai_count: 0,
  recordDetailList: [],
  recordDetailTotal: 0,
  // 问题
  questionListTotal: 0,
  questionList: [],
  free: 0, // 空闲机器人数
  ai_call_end_time: '',
  // common
  serviceGroups: [], // 技能组
  // 数据统计
  statistics: [],
  // 外呼号码
  call_number: [],
  GlobalKeyword: []
}

const getters = {
  ...EpInfo.getters,
  ...Script.getters,
  taskListTotal: state => state.taskListTotal,
  taskList: state => state.taskList,
  taskCluesListTotal: state => state.taskCluesListTotal,
  taskCluesList: state => state.taskCluesList,
  task_status: state => state.task_status,
  ai_count: state => state.ai_count,
  recordDetailList: state => state.recordDetailList,
  recordDetailTotal: state => state.recordDetailTotal,
  questionList: state => state.questionList,
  questionListTotal: state => state.questionListTotal,
  free: state => state.free,
  serviceGroups: state => state.serviceGroups,
  statistics: state => state.statistics,
  call_number: state => state.call_number,
  GlobalKeyword: state => state.GlobalKeyword
}

const mutations = {
  ...EpInfo.mutations,
  ...Script.mutations,
  getTasks (state, payload) {
    if (payload.state) {
      state.taskListTotal = +payload.state.count || 0
      state.taskList = payload.state.tasks || []
    }
  },
  recordDetail (state, payload) {
    if (payload.state) {
      state.recordDetailList = payload.state || []
      state.recordDetailTotal = +payload.state.count || 0
    }
  },
  getfree (state, payload) {
    if (payload.state) {
      state.free = +payload.state || 0
    }
  },
  getQuestions (state, payload) {
    if (payload.state) {
      state.questionListTotal = +payload.state.count || 0
      state.questionList = payload.state.questions || []
    }
  },
  taskClues (state, payload) {
    if (payload.state) {
      state.taskCluesListTotal = +payload.state.count || 0
      state.taskCluesList = payload.state.clues || []
      state.task_status = +payload.state.task_status || 0
      state.ai_count = +payload.state.ai_count || 0
    }
  },
  getServiceGroups (state, payload) {
    if (payload.state) {
      state.serviceGroups = payload.state || []
    }
  },
  getStatistics (state, payload) {
    if (payload.state) {
      state.serviceGroups = payload.state || []
    }
  },
  getCallNumbers (state, payload) {
    if (payload.state) {
      state.call_number = payload.state || []
    }
  },
  getGlobalKeywordByTaskId (state, payload) {
    if (payload.state) {
      state.GlobalKeyword = payload.state || []
    }
  }
}

const actions = {
  ...EpInfo.actions,
  ...Script.actions,
  // 聚类
  getClusters: AICallActions.getClusters,
  delClusters: AICallActions.delClusters,
  saveClusters: AICallActions.saveClusters,
  // 字段
  getFields: AICallActions.getFields,
  delFields: AICallActions.delFields,
  saveFields: AICallActions.saveFields,
  // 标签
  getLabels: AICallActions.getLabels,
  delLabels: AICallActions.delLabels,
  saveLabels: AICallActions.saveLabels,
  // 短信
  getMessages: AICallActions.getMessages,
  delMessages: AICallActions.delMessages,
  saveMessages: AICallActions.saveMessages,
  // 任务
  getTasks: AICallActions.getTasks,
  deleteTasks: AICallActions.deleteTasks,
  saveTask: AICallActions.saveTask,
  importAITask: AICallActions.importAITask,
  controlTask: AICallActions.controlTask,
  taskStatistics: AICallActions.taskStatistics,
  taskClues: AICallActions.taskClues, // 任务线索列表
  deleteTaskClues: AICallActions.deleteTaskClues,
  delRecords: AICallActions.delRecords,
  reCall: AICallActions.reCall,
  recallByType: AICallActions.recallByType,
  recordDetail: AICallActions.recordDetail,
  getRecordUrl: AICallActions.getRecordUrl,
  getGlobalKeywordByTaskId: AICallActions.getGlobalKeywordByTaskId,
  // 问题
  getQuestions: AICallActions.getQuestions,
  delQuestions: AICallActions.delQuestions,
  questionDetail: AICallActions.questionDetail,
  setQuestion: AICallActions.setQuestion,
  getfree: AICallActions.getfree, // 空闲机器人数
  getServiceGroups: AICallActions.getServiceGroups, // 技能组
  getCallNumbers: AICallActions.getCallNumbers, // 外呼号码
  // 搜索 (id获取)
  scriptItem: AICallActions.scriptItem, // 根据id获取话术
  labelItem: AICallActions.labelItem // 根据id获取标签
}

export default {
  namespaced: true,
  state,
  getters,
  mutations,
  actions
}
