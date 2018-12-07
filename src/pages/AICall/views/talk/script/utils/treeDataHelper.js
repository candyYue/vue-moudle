import update from 'immutability-helper'
import uuid from 'uuid'
import { deepCopy, uniqueId } from '@/utils/helper/assist'
import { hierarchy } from 'd3'
import * as TYPES from '@/utils/config/types'
import {
  messageDispaly
} from '@/utils/config'
import {
  messageTip
} from '@/components/feedback/Message'

export const attrEntries = function * (attr) {
  const propKeys = Reflect.ownKeys(attr)
  for (const propKey of propKeys) {
    yield {
      [propKey]: attr[propKey].value
    }
  }
}

const handler = TYPES.TREE_HANDLER

const initTreeData = {
  prompt: [{
    tts: [{
      text: '',
      attr: {
        src: {
          value: ''
        },
        audio_id: {
          value: ''
        },
        duration: {
          value: ''
        },
        file_name: {
          value: ''
        }
      }
    }],
    audio: [{
      text: ''
    }],
    attr: {
      bargein: {
        value: false
      }
    }
  }],
  attr: {
    id: {
      value: ''
    },
    type: {
      value: 'normal'
    },
    cluster_id: {
      value: ''
    },
    default: {
      value: false
    },
    label_id: {
      value: ''
    },
    instruct_manual: {
      value: false
    },
    manual_pid: {
      value: ''
    },
    instruct_sms: {
      value: false
    },
    sms_template_id: {
      value: ''
    },
    process_end: {
      value: ''
    },
    allow_jump: {
      value: false
    }
  }
}
const initRootData = update(initTreeData, {
  attr: {
    type: {
      value: {
        $set: 'root'
      }
    },
    id: {
      value: {
        $set: 0
      }
    }
  }
})

// 获取节点全部属性
export const getProps = (data) => {
  // TODO: 考虑没有value的情况
  // console.log(data)

  const attr = data.attr
  const prompt = data.prompt[0]
  const audio = (prompt.tts && prompt.tts[0].attr) || (prompt.audio && prompt.audio[0].attr)
  const script = (prompt.tts && String(prompt.tts[0].text)) || (prompt.audio ? String(prompt.audio[0].text) : '')
  const {
    id,
    type,
    cluster_id: clusterId,
    label_id: labelId,
    default: mainprocess,
    instruct_manual: instructManual,
    manual_pid: manualPid,
    instruct_sms: instructSms,
    sms_template_id: smsTemplateId,
    process_end: processEnd,
    allow_jump: allowJump,
    edited
  } = attr
  return {
    id: id.value,
    type: type.value,
    clusterId: clusterId.value,
    labelId: labelId.value,
    default: mainprocess?.value || false,
    instructManual: instructManual.value,
    manualPid: manualPid.value,
    instructSms: instructSms.value,
    smsTemplateId: smsTemplateId.value,
    processEnd: processEnd?.value || false,
    allowJump: allowJump?.value || false,
    bargein: prompt.attr.bargein.value,
    custom: prompt.attr?.custom?.value,
    script,
    edited: edited?.value || false,
    audio: {
      duration: audio?.duration?.value || '',
      // eslint-disable-next-line
      audio_id: audio?.audio_id?.value || '',
      // eslint-disable-next-line
      file_name: audio?.file_name?.value || '',
      src: audio?.src?.value || ''
    }
  }
}
class Tree {
  constructor () {
    this.treeData = deepCopy(initRootData)
  }

  initData (treeData) {
    this.treeData = treeData
  }

  resetData () {
    this.treeData = deepCopy(initRootData)
  }

  getNode (id) {
    const treeNodes = hierarchy(this.treeData).descendants()
    const filter = treeNodes.filter(node => node.data.id === id)
    return filter[0]
  }

  updateAttr (node, attr) {
    node.map(item => {
      item.attr[attr].value = false
    })
  }

  // 新增节点
  [handler['ADD']] (formData, tree = [this.treeData]) {
    const id = formData.id
    tree.forEach(node => {
      if (node.id === id) {
        const insert = this.updateNode(initTreeData, formData)
        if (node.children && node.children.length !== 0) {
          if (formData.default) {
            this.updateAttr(node.children, 'default')
          }
          node.children.push(insert)
        } else {
          node.children = [insert]
        }
      } else {
        node.children && this[handler['ADD']](formData, node.children)
      }
    })
  }
  // 编辑节点
  [handler['EDIT']] (formData, tree = [this.treeData]) {
    const id = formData.id
    tree.forEach(node => {
      if (node.id === id) {
        if (formData.default) {
          this.updateAttr(tree, 'default')
        }
        let update = this.updateNode(node, formData)
        console.log(update)
        if (formData.instruct_manual) {
          update.children = []
        }
        node = Object.assign(node, update)
      } else {
        node.children && this[handler['EDIT']](formData, node.children)
      }
    })
  }
  // 删除节点
  [handler['REMOVE']] (formData, tree = [this.treeData]) {
    const id = formData.id
    tree.forEach(node => {
      if (node.id === id) {
        const idx = tree.findIndex(item => item.id === id)
        tree.splice(idx, 1)
      } else {
        node.children && this[handler['REMOVE']](formData, node.children)
      }
    })
  }
  // 粘贴节点
  [handler['PASTE']] (targetId, sourceId, tree = [this.treeData]) {
    const sourceData = deepCopy(this.getNode(sourceId).data)
    if (sourceData.attr.type.value === 'root') {
      sourceData.attr.type.value = 'normal'
    }
    this.copyNode([sourceData])
    this.handlePaste(targetId, sourceData, tree)
  }

  copyNode (node) {
    node.map(item => {
      item.id = uuid.v4()
      item.attr.id.value = uniqueId()
      if (item.children && item.children.length !== 0) {
        this.copyNode(item.children)
      }
    })
  }

  handlePaste (targetId, sourceData, tree) {
    tree.forEach(node => {
      if (node.id === targetId) {
        if (node.children && node.children.length !== 0) {
          if (checkOnlyAttr(node, 'default')) {
            this.updateAttr(node.children, 'default')
          }
          node.children.push(sourceData)
        } else {
          node.children = [sourceData]
        }
      } else {
        node.children && this.handlePaste(targetId, sourceData, node.children)
      }
    })
  }

  updateNode = (initdata, formData) => {
    const {
      cluster_id: clusterId,
      label_id: labelId,
      default: mainprocess,
      script,
      audio: {
        src = '',
        audio_id: audioId = '',
        duration = 0,
        file_name: fileName = ''
      },
      bargein,
      instruct_manual: instructManual,
      manual_pid: manualPid,
      instruct_sms: instructSms,
      sms_template_id: smsTemplateId,
      process_end: processEnd,
      allow_jump: allowJump
    } = formData
    // console.log(formData)
    const id = initdata.attr.id.value
    const newNode = update(initdata, {
      prompt: [{
        $merge: {
          tts: [{
            text: script,
            attr: {
              src: {
                value: src || ''
              },
              audio_id: {
                value: audioId || ''
              },
              duration: {
                value: duration || 0
              },
              file_name: {
                value: fileName || ''
              }
            }
          }],
          attr: {
            bargein: {
              value: bargein
            }
          }
        }
      }],
      attr: {
        $merge: {
          id: {
            value: id.length ? id : uniqueId()
          },
          cluster_id: {
            value: clusterId
          },
          label_id: {
            value: labelId.join('-')
          },
          default: {
            value: mainprocess
          },
          instruct_manual: {
            value: instructManual
          },
          manual_pid: {
            value: manualPid
          },
          instruct_sms: {
            value: instructSms
          },
          sms_template_id: {
            value: smsTemplateId
          },
          process_end: {
            value: processEnd
          },
          allow_jump: {
            value: allowJump
          },
          edited: {
            value: true
          }
        }
      }
    })
    return newNode
  }

  checkTree (clustersMap) {
    const treeNodes = hierarchy(this.treeData).descendants()
    let errorFlag = 0
    const checkCluster = treeNodes.every(node => {
      const clusterId = node.data.attr.cluster_id.value
      return clustersMap.find(d => d.id === clusterId)
      // return !!clustersMap[clusterId]
    })
    const checkScript = treeNodes.every(node => {
      return node.data.prompt[0].tts[0].text
    })
    if (!checkCluster) {
      errorFlag = TYPES.IVRNODE_ERROR.CLUSTER
    }
    if (!checkScript) {
      errorFlag = TYPES.IVRNODE_ERROR.SCRIPT
    }
    if (!checkCluster && !checkScript) {
      errorFlag = TYPES.IVRNODE_ERROR.CLUSTER_SCRIPT
    }
    if (errorFlag) {
      messageTip.$warning({
        content: messageDispaly.script.treeError[errorFlag]
      })
    }
    return errorFlag
  }
}

export default new Tree()

// 检查 父节点的 children中 是否有兄弟节点中唯一的属性
export const checkOnlyAttr = (ivrnodeTree, attr) => {
  if (ivrnodeTree.children) {
    return ivrnodeTree.children.some(node => node.attr[attr]?.value)
  }
  return false
}
