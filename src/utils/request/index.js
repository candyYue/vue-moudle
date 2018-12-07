import axios from 'axios'
import errorHandler from './statusHandler'
import api from '@/service/api'
const CancelToken = axios.CancelToken
const sources = CancelToken.source()
const stringify = (data) => {
  let dataStr = ''
  if (data) {
    Object.keys(data).forEach(key => {
      dataStr += `${key}=${data[key]}&`
    })
    if (dataStr.length) {
      dataStr = dataStr.substr(0, dataStr.length - 1)
    }
  }
  return dataStr
}
const requestList = []
const Axios = axios.create({
  timeout: 60000
})
Axios.interceptors.request.use((config) => {
  const {
    method, url, data
  } = config
  // 超时时间设置列表
  const timeoutList = {
    [api.Admin.copyScripts]: 120000
  }
  config.timeout = timeoutList[url.slice(0, url.indexOf('?'))] || config.timeout

  // 请求地址
  const request = method.toLowerCase() === 'get' ? url + stringify(data) : url
  config.cancelToken = new CancelToken((cancel) => {
    sources[request] = cancel
  })
  if (requestList.includes(request)) {
    sources[request]('cancel:已拦截重复请求')
  } else {
    requestList.push(request)
  }
  // console.log(requestList)
  return config
}, (error) => {
  return Promise.reject(error)
})
Axios.interceptors.response.use((response) => {
  const request = response.url + stringify(response.data)
  requestList.splice(requestList.findIndex(item => item === request), 1)
  const status = response.data.status
  if (errorHandler[status]) {
    errorHandler[status](response)
  } else {
    errorHandler['error'](response)
  }
  return response
}, (error) => {
  const errorMsg = error.message
  if (axios.isCancel(error)) {
    throw new axios.Cancel('cancel request')
  } else {
    requestList.length = 0
    if (errorMsg.includes('timeout')) {
      errorHandler['timeout']()
    } else {
      errorHandler['network']()
    }
  }
  return Promise.reject(error)
})

export default async (url = '', data = {}, method = 'GET', headers) => {
  method = method.toUpperCase()
  const options = {
    method,
    url,
    mode: 'cors',
    cache: 'force-cache',
    credentials: 'include'
  }
  const dataStr = stringify(data)
  switch (method) {
    case 'POST':
      options.headers = Object.assign({}, {
        'Content-Type': 'application/x-www-form-urlencoded',
        'enctype': 'multipart/form-data'
      }, headers)
      if (options.headers['Content-Type'] === 'application/json') {
        options.data = data
      } else {
        options.data = dataStr
      }
      break
    default:
      options.headers = Object.assign({}, {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      }, headers)
      options.url = dataStr.length ? (url + '?' + dataStr) : url
  }
  const response = await Axios(options)
  return response.data
}
