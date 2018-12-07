export default{

  intentionOptions: ['A', 'B', 'C', 'D', 'E', 'F'],

  // 关键词意向性 默认值
  intentionSettings: {
    type: '',
    inKeywords: [],
    num: '',
    outKeywords: [],
    sessionNum: '',
    duration: {
      type: '',
      area: ['', '']
    }
  },
  //
  ivrnodeFormSettings: {
    id: null,
    cluster_id: '',
    // default: false,
    script: ''
    // audio: null,
    // voiceError: '',
    // label_id: [],
    // bargein: false,
    // instruct_manual: false,
    // manual_pid: '',
    // instruct_sms: false,
    // sms_template_id: '',
    // process_end: false,
    // allow_jump: false,
    // node_end: true // 节点是否为当前分支的 end 节点
  }
}
