// export const xmlValidatorPattern = /[<>&'"]{1,}/
const configStr = JSON.parse(localStorage.getItem('systemConfigs')).preg_name_global
const strPattern = configStr.slice(1, configStr.length - 1)
const configRegx = new RegExp(strPattern)
// eslint-disable-next-line
// const configRegx = eval(configStr)
export const xmlValidatorPattern = configRegx
export const xmlValidator = {
  validator: (rule, value, callback) => {
    const $pattern = xmlValidatorPattern
    if (value && $pattern.test(value)) {
      callback(new Error('请不要输入非法字符'))
    }
    callback()
  },
  trigger: ['change', 'blur']
}
