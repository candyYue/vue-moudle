import {
  hierarchy
} from 'd3'
import { getProps } from './treeDataHelper'

export const TreeNodes = (ivrnodeTree) => (hierarchy(ivrnodeTree[0]).descendants())

const toValue = (value, defaultValue = '') => {
  if (value === null || value === undefined || value === 'undefined' || value === 'null') {
    return defaultValue
  }
  return value
}

const oneLine = (template, ...expressions) => {
  let result = template.reduce((prev, next, i) => {
    let expression = expressions[i - 1]
    return prev + expression + next
  })

  result = result
    .replace(/(\n\s*)/g, ' ').replace(/>\s</g, '><')
  result = result.trim()

  return result
}
/**
 *
 * @param {*} context
 * @param {*} id
 * @param {*} custom
 */
const renderInnerPrompt = (context, custom) => {
  // if (promptType === TYPES.PROMPT.MIX && !custom) {
  const {
    audio: {
      src = '',
      audio_id: audioId = '',
      duration = 0,
      file_name: fileName = ''
    },
    text
  } = context

  return (`<audio src="${toValue(src)}" audio_id="${toValue(audioId)}" duration="${toValue(duration, 0)}"  file_name="${toValue(fileName)}">${text}</audio>`)
}

const calcCatch = (catchForm) => {
  let {
    noinput,
    nomatch,
    instruct,
    intention,
    session
  } = catchForm
  const directive = instruct.find(d => d[0] !== 'none')
  const directiveIndex = instruct.findIndex(d => d[0] !== 'none')
  const noinputStr = `
  <catch event="noinput">
  ${noinput.map((item, idx) => (
    `<prompt>${renderInnerPrompt(item)}</prompt>`
  )).join('')}
  </catch>
    `
  const nomatchStr = `
  <catch event="nomatch" instruct="${directive[0]}" manual_pid="${toValue(directive[1])}">
  ${nomatch.slice(0, directiveIndex + 1).map((item, idx) => (
    `<prompt>${renderInnerPrompt(item)}</prompt>`
  )).join('')}
  </catch>
    `
  const intentionStr = intention.value ? `
    <catch event="intention" rank="${intention.value}" instruct="${intention.instruct[0]}" manual_pid="${intention.instruct[1]}">
      <prompt>${renderInnerPrompt(intention)}</prompt>
    </catch>` : ''
  const sessionStr = session.value ? `
    <catch event="session" rank="${session.value}" instruct="${session.instruct[0]}" manual_pid="${session.instruct[1]}">
      <prompt>${renderInnerPrompt(session)}</prompt>
    </catch>` : ''
  return nomatchStr + noinputStr + intentionStr + sessionStr
}

const calcIvrnode = (ivrnodeTree, opts) => {
  const treeNodes = TreeNodes(ivrnodeTree)
  // console.log(treeNodes)
  const {
    clustersMap,
    clustersList,
    labelsList,
    fieldsList
  } = opts

  const ivrnodeStr = treeNodes.map(treeNode => {
    const ivrnode = treeNode.data
    // const prompt = ivrnode.prompt[0]
    const regex = /@([a-zA-Z0-9_\u4e00-\u9fa5]+[ ]?)(?=([\s.,@?]))?/g
    let {
      id,
      type,
      clusterId,
      labelId,
      default: mainprocess,
      instructManual,
      manualPid,
      instructSms,
      smsTemplateId,
      bargein,
      script,
      audio,
      processEnd,
      allowJump
    } = getProps(treeNode.data)

    let custom = false
    const matchCustom = script.match(regex)
    const choices = ivrnode.children
    const label = getLabel(labelId, labelsList)
    if (matchCustom) {
      script = script.replace(regex, ($1) => {
        const fieldId = fieldsList.find(d => d.title === $1.substring(1).trim())
        if (fieldId) {
          custom = true
          return '${' + fieldId.id + '}'
        }
        return $1
      })
    }
    if (type !== 'root') {
      if (!ivrnode.children || (ivrnode.children && ivrnode.children.length === 0)) {
        type = 'end'
      } else {
        type = 'normal'
        processEnd = false
      }
    }
    const context = {
      text: script,
      audio: audio
    }
    // console.log(mainprocess)
    return (
      `<ivrnode id="${id}" type="${type}"
            cluster_id = "${clusterId}"
            cluster_name = "${clustersMap.get(clusterId)}"
            default="${mainprocess}"
            label_id="${labelId || ''}" label="${label || ''}"
            instruct_manual="${instructManual}" manual_pid="${manualPid || ''}" 
            instruct_sms="${instructSms}" sms_template_id="${smsTemplateId || ''}"
            process_end="${processEnd}"
            allow_jump="${allowJump}"
          >
          <prompt bargein="${bargein}" custom="${custom}">
            ${renderInnerPrompt(context, custom)}
          </prompt>
         ${choices ? calcChoice(choices, clustersList, mainprocess) : ''}
        </ivrnode>
        `
    )
  }).join('')
  return ivrnodeStr
}

const calcChoice = (choices, clustersList, mainprocess) => {
  return choices.map(choice => {
    return `
        <choice next="${choice.attr.id.value}" default="${choice.attr.default.value}">
        </choice>
        `
  }).join('')
}
// ${ calcMatch(choice.attr.cluster_id.value, clustersList) }
// const calcMatch = (id, clustersList) => {
//   const clusters = clustersList.find(item => +item.id === +id)
//   if (clusters) {
//     return clusters.content.map(cluster => (
//       `<match>${cluster}</match>`
//     )).join('')
//   }
// }

export const getLabel = (id, labelsList) => {
  let labelValue = ''
  if (id) {
    const labelId = id.split('-')
    const labels = labelsList.find(d => d.value === labelId[0])
    if (labels) {
      const label = labels.children.find(d => d.value === labelId[1])
      labelValue = label ? label.label : ''
    }
  }
  return labelValue
}

const calcIntention = (form) => {
  const renderKeywords = keyword => `<item>${keyword}</item>`
  return form.intentionType.filter(d => d.type).map(item =>
    `
      <intention-type type="${item.type}" session-num="${item.sessionNum}" duration-area="${item.duration.area.map(d => d || '#').join(',')}">
        <in-clusters num="${item.num}">
            ${item.inKeywords.map(renderKeywords).join('')}
        </in-clusters>
        <out-clusters>
            ${item.outKeywords.map(renderKeywords).join('')}
        </out-clusters>
      </intention-type>
      `
  ).join('')
}

const calcGrobal = (globalKeyword) => {
  return globalKeyword.length ? `<global-keyword id="${globalKeyword}"></global-keyword>` : ''
}

export const calcTreeXML = (scriptForm, treeData, opts) => {
  const { globalKeyword } = scriptForm
  const catchXml = calcCatch(scriptForm)
  const intentionXml = calcIntention(scriptForm)
  const ivrnodeXml = calcIvrnode(treeData, opts)
  const grobalXml = calcGrobal(globalKeyword)
  const treeXml =
  `
    <?xml version="1.0" encoding="utf-8"?>
    <ivrtree>
    ${catchXml} 
    ${intentionXml}
    ${grobalXml}
    ${ivrnodeXml}
    </ivrtree>
  `
  return oneLine`${treeXml}`
}
