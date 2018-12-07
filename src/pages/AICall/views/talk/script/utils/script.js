import {
  deepCopy,
  handleXml
} from '@/utils/helper/assist'
import {
  getProps
} from './treeDataHelper'
import {
  getLabel
} from './scriptHelper'
import { Id2FieldText } from '../../../../../../utils/helper/xmlHelper'

import Store from '@/store'

class BasicScript {
  constructor (id) {
    this.__cache = Store.getters['AICall/scriptsCache']
    this.id = id
    this.tree = {}
  }
  getXml () {
    Store.dispatch('AICall/saveScriptsCache', {
      id: this.id,
      content: new Promise((resolve) => {
        resolve(Store.dispatch('AICall/scriptDetail', {
          id: this.id
        }))
      }).then(res => {
        const {
          title,
          script,
          tts_flag: tts,
          script_data: scriptData
        } = res.data
        const fieldList = scriptData.fields || []
        const scriptXml = Id2FieldText(script, fieldList)
        Store.dispatch('AICall/saveScriptsCache', {
          id: this.id,
          content: { /** content内容为保存在cache中的值 */
            scriptTitle: title,
            tts: tts,
            xmlTree: handleXml(scriptXml).ivrtree[0],
            scriptData: scriptData
          }
        })
        return Store.getters['AICall/scriptsCache'][this.id]
      })
    })
    return Store.getters['AICall/scriptsCache'][this.id]
  }

  pareseNodes (initIvrnode, ivrnodes = initIvrnode[0]) {
    const copyIvrnodes = deepCopy(ivrnodes)
    if (copyIvrnodes.choice) {
      const restIvrnode = initIvrnode.slice(1)
      copyIvrnodes.$children = []
      copyIvrnodes.choice.forEach(choice => {
        const childId = choice.attr.next.value
        const child = restIvrnode.find(item => item.attr.id.value === childId)
        copyIvrnodes.$children = [].concat(copyIvrnodes.$children, this.pareseNodes(restIvrnode, child))
      })
    }

    return [{
      value: copyIvrnodes.attr.id.value,
      label: copyIvrnodes.prompt[0].audio[0].text,
      children: copyIvrnodes.$children || null
    }]
  }
  parseTree (initIvrnode, ivrnodes = initIvrnode[0]) {
    const {
      'AICall/labelsOptions': labelsList,
      'AICall/messagesList': messagesList,
      'AICall/serviceGroups': serviceGroups
    } = Store.getters
    // 处理节点数据
    initIvrnode.map(ivr => {
      let {
        labelId,
        manualPid,
        smsTemplateId,
        script: text
      } = getProps(ivr)

      ivr.prompt[0].tts = [{
        text
      }]
      if (!getLabel(labelId, labelsList)) { // 处理 标签删除情况
        ivr.attr.label_id.value = ''
      }
      if (!messagesList.find(d => d.id === smsTemplateId)) { // 处理 短信删除情况
        ivr.attr.instruct_sms.value = false
        ivr.attr.sms_template_id.value = ''
      }
      if (!serviceGroups.find(d => d.gid === manualPid)) { // 处理 技能组删除情况
        ivr.attr.instruct_manual.value = false
        ivr.attr.manual_pid.value = ''
      }
      // FIXED: 兼容新增属性
      !ivr.attr.default && (ivr.attr.default = {
        value: false
      })
    })
    // 递归
    if (ivrnodes.choice) {
      const restIvrnode = initIvrnode.slice(1)
      ivrnodes.children = []
      ivrnodes.choice.forEach(choice => {
        const childId = choice.attr.next.value
        const child = restIvrnode.find(item => item.attr.id.value === childId)
        ivrnodes.children.push(child)
        if (child.choice) {
          return this.parseTree(restIvrnode, child)
        }
      })
    }
    return [ivrnodes]
  }
}
const __scripts = {}

export const getScriptNodeName = (id) => {
  const idChain = id.split('-')
  if (!__scripts[idChain[0]]) {
    console.warn(`请先创建话术id为${idChain[0]}的ScriptNodes对象`)
  }
  return __scripts[idChain[0]]['NodesMap'][idChain[idChain.length - 1]]
}
export const getScriptName = (sriptId) => {
  if (!__scripts[sriptId]) {
    console.warn(`请先创建话术id为${sriptId}的ScriptNodes对象`)
  }
  return __scripts[sriptId]['title']
}

export class ScriptNodes extends BasicScript {
  constructor (id) {
    super()
    this.id = id
    this.AllNodes = {}
    this.NodesMap = {}
  }
  flattenNodes (initIvrnode) {
    initIvrnode.forEach(ivr => {
      const id = ivr.attr.id.value
      const text = ivr.prompt[0].audio[0].text
      this.NodesMap[id] = text
    })
  }
  getAllNodes () {
    if (__scripts[this.id]) {
      this.AllNodes = __scripts[this.id].AllNodes
      this.tts = __scripts[this.id].tts
      return this.AllNodes
    }
    return new Promise((resolve, reject) => {
      const result = this.__cache[this.id] || this.getXml()
      resolve(result)
    }).then((result) => {
      this.title = result.scriptTitle
      this.scriptData = result.scriptData
      this.tts = result.tts
      this.flattenNodes(result.xmlTree.ivrnode)
      const allNodes = {
        value: this.id,
        label: result.scriptTitle,
        children: this.pareseNodes(result.xmlTree.ivrnode)
      }
      this.AllNodes = allNodes
      __scripts[this.id] = this
      return allNodes
    }).catch((e) => { // TODO:

    })
  }
}

export class ScriptTree extends BasicScript {
  constructor (id) {
    super()
    this.id = id
  }
  getScriptTree () {
    return new Promise((resolve, reject) => {
      const result = this.__cache[this.id] || this.getXml()
      resolve(result)
    }).then((result) => {
      const {
        labels, messages, groups, fields, clusters
      } = result.scriptData
      Store.commit({
        type: 'AICall/saveScriptContent',
        state: result
      })
      Store.commit({
        type: 'AICall/loadClusters',
        state: clusters
      })
      Store.commit({
        type: 'AICall/loadFields',
        state: fields
      })
      Store.commit({
        type: 'AICall/loadLabels',
        state: labels
      })
      Store.commit({
        type: 'AICall/loadMessages',
        state: messages
      })
      Store.commit({
        type: 'AICall/getServiceGroups',
        state: groups
      })
      this.title = result.scriptTitle
      this.tts = result.tts
      this.tree = result.xmlTree
      this.scriptData = result.scriptData

      return this.parseTree(result.xmlTree.ivrnode)
    })
  }
}
