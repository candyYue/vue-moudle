import {
  xmlValidator,
  xmlValidatorPattern
} from './index'

const requiredContent = {
  required: true,
  message: '请输入话术内容',
  trigger: ['blur', 'change']
}
// 话术校验规则
const scriptRules = {
  'title': [
    {
      required: true,
      message: '请输入话术名称',
      trigger: ['blur', 'change']
    },
    {
      validator: (rule, value, callback) => {
        if (xmlValidatorPattern.test(value)) {
          callback(new Error('请不要输入非法字符'))
        } else {
          callback()
        }
      },
      trigger: ['blur', 'change']
    }
  ],
  'noinput[0].text': [requiredContent, xmlValidator],
  'noinput[1].text': [requiredContent, xmlValidator],
  'noinput[2].text': [requiredContent, xmlValidator],
  'nomatch[0].text': [requiredContent, xmlValidator],
  'nomatch[1].text': [requiredContent, xmlValidator],
  'nomatch[2].text': [requiredContent, xmlValidator],
  'intention': {
    validator: (rule, value, callback) => {
      if (value.value && !value.text) {
        return callback(new Error('请输入话术'))
      }
      callback()
    },
    trigger: ['blur', 'change']
  },
  'session': {
    validator: (rule, value, callback) => {
      console.log(value)
      if (value.value && !value.text) {
        return callback(new Error('请输入话术'))
      }
      callback()
    },
    trigger: ['blur', 'change']
  }
}
// 话术节点校验规则
const ivrnodeRules = {
  cluster_id: {
    required: true,
    message: '请选择聚类名称',
    trigger: ['blur', 'change']
  },
  script: [{
    required: true,
    message: '请输入话术',
    trigger: ['blur', 'change']
  },
  {
    validator: (rule, value, callback) => {
      if (!value.trim().length) {
        callback(new Error('请输入话术'))
      }
      if (xmlValidatorPattern.test(value)) {
        callback(new Error('请不要输入非法字符'))
      } else {
        callback()
      }
    },
    trigger: ['blur', 'change']
  }
  ]
}
// 聚类校验规则
const clusterRules = {
  title: [{
    required: true,
    message: '请输入聚类名称',
    trigger: ['blur', 'change']
  }, xmlValidator]
}
// 字段校验规则
const fieldsRules = {
  title: [{
    required: true,
    message: '请输入字段内容',
    trigger: ['blur', 'change']
  },
  xmlValidator]
}
// 标签校验规则
const labelsRules = {
  title: [{
    required: true,
    message: '请输入标签内容',
    trigger: ['blur', 'change']
  }, xmlValidator]
}
// 短信校验规则
const messagesRules = {
  title: [
    {
      required: true,
      message: '请输入短信名称',
      trigger: ['blur', 'change']
    },
    xmlValidator],
  content: [{
    required: true,
    message: '请输入短信内容',
    trigger: ['blur', 'change']
  }, xmlValidator]
}
export {
  scriptRules,
  ivrnodeRules,
  clusterRules,
  fieldsRules,
  labelsRules,
  messagesRules
}
