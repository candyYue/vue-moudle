const User = {
  login: '/aicall/identity/login',
  logout: '/aicall/identity/logout',
  adminLogin: '/super/identity/login',
  adminLogout: '/super/identity/logout'
}
const Admin = {
  getAllEs: '/super/enterprise/getAllEs',
  getScripts: '/super/script/getScriptsByPageParams',
  copyScripts: '/super/Script/copyScripts',
  getConfig: '/super/enterprise/getConfig',
  setConfig: '/super/enterprise/setConfig',
  getApiKey: '/super/enterprise/getApiKey'
}
const AICall = {
  getEnterprise: '/aicall/enterprise/getEnterprise',
  getConfig: '/aicall/enterprise/getConfig',
  getSystemConfigs: '/aicall/enterprise/getSystemConfigs',
  // 话术
  getScripts: '/aicall/script/getScriptsByPageParams',
  scriptItem: '/aicall/script/getScriptById',
  scriptDetail: '/aicall/script/getScriptContentDetailById',
  setScript: '/aicall/script/setScriptByData',
  delScripts: '/aicall/script/deleteScriptById',
  // 聚类
  getClusters: '/aicall/script/getClustersByPageParams',
  setCluster: '/aicall/script/setClusterByData',
  delClusters: '/aicall/script/deleteClusterById',
  impClusters: '/aicall/enterprise/importData',
  // 字段
  getFields: '/aicall/script/getFieldsByPageParams',
  setFields: '/aicall/script/setFieldByData',
  delFields: '/aicall/script/deleteFieldById',
  // 标签
  getLabels: '/aicall/script/getLabelsByPageParams',
  setLabels: '/aicall/script/setLabelByData',
  delLabels: '/aicall/script/deleteLabelById',
  labelItem: '/aicall/script/getLabelById',
  // 短信
  getMessages: '/aicall/script/getMessagesByPageParams',
  setMessages: '/aicall/script/setMessageByData',
  delMessages: '/aicall/script/deleteMessageById',
  // 任务
  getTasks: '/aicall/task/getTasks',
  setTask: '/aicall/task/saveTask',
  importAITask: '/aicall/enterprise/getImportPercent', // 导入进度
  deleteTasks: '/aicall/task/deleteTasks',
  controlTask: '/aicall/task/controlTask',
  taskClues: '/aicall/task/getTaskCluesByTaskId', // 任务线索列表
  deleteTaskClues: '/aicall/task/deleteRecords',
  taskStatistics: '/aicall/task/getTaskStatistics',
  reCall: '/aicall/task/recall',
  recallByType: '/aicall/task/recallByType', // 重新呼叫全部已联系线索
  recordDetail: '/aicall/task/getRecord', // 通话详情
  delRecords: '/aicall/task/deleteRecords', // 删除通话记录
  getRecordUrl: '/aicall/task/getRecordUrl', // 录音试听、下载
  // getTaskClues: '/aicall/task/taskClues', // 下载线索
  getGlobalKeywordByTaskId: '/aicall/task/getGlobalKeywordByTaskId', // 获取全语境关键词

  // 问题
  getQuestions: '/aicall/question/getQuestionsByWhere',
  questionDetail: '/aicall/question/getQuestionById',
  setQuestion: '/aicall/question/setQuestionByData',
  delQuestions: '/aicall/question/deleteQuestionById',
  impQuestions: '/aicall/enterprise/importData',
  // 数据统计
  getStatistics: '/aicall/enterprise/getStatistics',
  // 其他
  getCallNumbers: '/aicall/enterprise/getCallNumbers  ', // 获取外呼号码
  getfree: '/aicall/enterprise/getFreeAccount', // 空闲机器人数
  getServiceGroups: '/aicall/enterprise/getGroups', // 获取技能组
  uploadFile: '/aicall/file/uploadAudioFile', // 上传录音
  listen: '/aicall/file/getAudioFileById', // 试听
  getProgress: '/aicall/enterprise/getImportPercent',
  getImportReport: '/aicall/enterprise/getImportReport', // 下载错误报告

  // download
  tmpClusters: '/template/聚类导入模板.xlsx',
  tmpQuestions: '/template/问题导入模板.xlsx',
  tmpCustoms: '/template/客户导入模板.xlsx'
}

const api = {
  AICall,
  Admin,
  User
}

export default api
// module.exports = api
