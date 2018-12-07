import xmlToJSON from '@/assets/js/xmlToJSON'

/**
 * @description 判断参数是否是其中之一
 * @param {*} value
 * @param {*} valueList
 */
export const oneOf = (value, valueList) => {
  return valueList.some(item => item === value)
}
/**
 * @description 判断数据类型
 * @param {*} obj
 */
export const typeOf = (obj) => {
  const toString = Object.prototype.toString
  const map = {
    '[object Boolean]': 'boolean',
    '[object Number]': 'number',
    '[object String]': 'string',
    '[object Function]': 'function',
    '[object Array]': 'array',
    '[object Date]': 'date',
    '[object RegExp]': 'regExp',
    '[object Undefined]': 'undefined',
    '[object Null]': 'null',
    '[object Object]': 'object'
  }
  return map[toString.call(obj)]
}
/**
 * @description 深度克隆
 * @param {*} data
 */
export const deepCopy = (data) => {
  const t = typeOf(data)
  let o

  if (t === 'array') {
    o = []
  } else if (t === 'object') {
    o = {}
  } else {
    return data
  }

  if (t === 'array') {
    for (let i = 0; i < data.length; i++) {
      o.push(deepCopy(data[i]))
    }
  } else if (t === 'object') {
    for (let i in data) {
      o[i] = deepCopy(data[i])
    }
  }
  return o
}
/**
 * @description 遍历有值的对象
 */
export const filterOpts = function * foo (opts) {
  for (const key in opts) {
    if (opts[key]) {
      yield {
        [key]: opts[key]
      }
    }
  }
}
/**
 * @description 随机生成字符串
 */
export const uniqueId = () => {
  return Math.random().toString(36).substring(7)
}

export const stringToId = (str) => {
  let strId = []
  for (let ch of str) {
    strId.push(ch.codePointAt(0))
  }
  return strId.join('_')
}

export const handleXml = (xml) => {
  const regex = /<\?xml.*?>/
  const xmlOptions = {
    textKey: 'text',
    valueKey: 'value',
    attrKey: 'attr'
  }
  return xmlToJSON.parseString(xml.replace(regex, ''), xmlOptions)
}

export const CompareDate = function (t1, t2) {
  var date = new Date()
  var a = t1.split(':')
  var b = t2.split(':')
  return (date.setHours(a[0], a[1]) < new Date().getTime() && new Date().getTime() < date.setHours(b[0], b[1]))
}
