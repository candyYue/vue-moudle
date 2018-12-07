
/**
 * @description 变量文本转变量id
 * @param {String} script 话术文本
 * @param {Array} fieldsList 变量列表
 */
export const FieldText2Id = (script, fieldsList) => {
  const regex = /@([a-zA-Z0-9_\u4e00-\u9fa5]+[ ]?)(?=([\s.,@?]))?/g
  script = script.replace(regex, ($1) => {
    const fieldId = fieldsList.find(d => d.title === $1.substring(1).trim())
    if (fieldId) {
      return '${' + fieldId.id + '}'
    }
    return $1
  })
  return script
}

/**
 * @description id文本转化为变量文本
 * @param {String} text 话术文本
 * @param {Array} fieldsList 变量列表
 */
export const Id2FieldText = (text, fieldsList) => {
  const customRegex = /\${[1-9]\d*}/g
  text = text.replace(customRegex, ($1) => {
    const id = Number($1.slice(2, $1.length - 1))
    const field = fieldsList.find(d => d.id === id)
    return field ? `@${field.title} ` : ''
  })
  return text
}
