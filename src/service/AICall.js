import api from './api'
import request from '@/utils/request'

export const login = (data) => {
  return request(api.User.login, data, 'post')
}
// 企业信息
export const getEnterprise = (data) => {
  return request(api.AICall.getEnterprise, data)
}
export const getConfig = (data) => {
  return request(api.AICall.getConfig, data)
}
export const getSystemConfigs = (data) => {
  return request(api.AICall.getSystemConfigs, data)
}
// 话术管理
export const getScripts = (data) => {
  return request(api.AICall.getScripts, data)
}
export const delScripts = (data) => {
  return request(api.AICall.delScripts, data)
}
export const scriptDetail = (data) => {
  return request(api.AICall.scriptDetail, data)
}
export const saveScripts = (data) => {
  return request(api.AICall.setScript, data, 'post')
}
// 聚类
export const getClusters = (data) => {
  return request(api.AICall.getClusters, data)
}
// 标签
export const loadLabels = (data) => {
  return request(api.AICall.getLabels, data)
}
// 短信
export const loadMessages = (data) => {
  return request(api.AICall.getMessages, data)
}
