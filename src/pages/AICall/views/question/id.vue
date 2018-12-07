<template>
  <div class="question-id">
    <!-- <Breadcrumb pathKey="question"/> -->
    <el-form :model="questionForm" :rules="questionRules" ref="questionForm" label-width="100px">
      <el-form-item prop="standard" label="标准问题">
        <el-input v-model.trim="questionForm.standard" placeholder="请输入客户可能问的问题" :maxlength="SystemConfigs.question_title_length_limit"></el-input>
      </el-form-item>
      <!-- 相似问题 -->
      <el-form-item v-for="(item, index) in questionForm.common" :key="`common[${index}]`" class="commons_input"
        :label="index === 0 ? '相似问题': ''"
        :prop="`common[${index}]`"
        :rules="commonrule">
          <el-input v-model.trim="questionForm.common[index]" placeholder="请输入与标准问题相似的问题" ref='questionArr' :maxlength="SystemConfigs.question_title_length_limit" @keyup.enter.native="addcommon"></el-input>
          <el-button @click.prevent="removecommon(item)" icon='el-icon-minus' class="button__del"></el-button>
      </el-form-item>
      <el-form-item>
        <div v-if='showButton' :class="isNarrow ? 'narrow':'addquestion'">
            <el-button @click="addcommon" icon='el-icon-circle-plus-outline' class="addcommon" type="primary" plain>添加相似问题</el-button>
        </div>
      </el-form-item>
      <el-form-item prop="bindscript" label="所属话术" class="bindscript" :rules="scriptrule">
        <!-- <el-select v-model="questionForm.bindscript" multiple placeholder="请选择话术"
          @change='changescript'
          @remove-tag='removeScript'
          @focus.once='getScripts'>
          <el-option :label="item.title" :value="item.id" v-for="(item, index) in scriptList" :key="index"
          :title="item.title"
          :disabled="disabledScript.filter(v=> v===item.id).includes(item.id)"></el-option>
        </el-select> -->
        <LazyLoadSelect
          v-model="questionForm.bindscript"
          multiple
          placeholder="请选择话术"
          listKey = "scripts"
          :defalut-opt="defaultScript"
          :loadList = "loadScripts"
          @change='changescript'
          @remove-tag='removeScript'
          ref="bindscripts"
        >
        </LazyLoadSelect>
      </el-form-item>
      <!-- 机器人回答 -->
      <el-form-item
        prop="answer"
        label='机器人回答'
        class="robot"
        :show-message='showanswermessage'
        :rules="answerrule">
        <div>
          <p class="tip">重复回答为机器人重复上一节点的话术，勾选后，机器人回答部分无法输入。</p>
          <!-- <el-input type="textarea"  :rows="7" placeholder="请输入回答" v-model.trim="questionForm.answer" maxlength='200'  :disabled="questionForm.repeat"></el-input> -->
          <editable-textarea v-model="questionForm.answer" :selectList="fieldsList"
          :getList="getFields"
          placeholder='请输入回答' :autosize='{ minRows:7, maxRows: 7}'
          :disabled="questionForm.repeat" :maxLength="Number(SystemConfigs.question_answer_length_limit)"/>
        </div>
      </el-form-item>
      <el-form-item
        v-if="audioShow"
        class="audio"
        prop="audio_id"
        :show-message='false'
        :rules="audioShow?audiorule:''">
        <voice-upload class="voice-upload" @getUploadInfo="getUploadInfo(arguments, 1)"
        :disabled='disabled'  :errorInfo='errorInfo' :fileInfo='fileInfo'/>
      </el-form-item>

      <el-form-item prop="label" label="标签" class="select-width">
        <el-cascader
          filterable
          clearable
          :show-all-levels="false"
          :options="labelsOptions"
          v-model="questionForm.label"
          popper-class="cascader-width149"
          placeholder="请选择标签"
          @focus='getLabels'>
        </el-cascader>
      </el-form-item>
      <el-form-item label="跳转至话术">
        <el-select placeholder="请选择跳转类型" clearable class="select-width" popper-class="select-width300" v-model="questionForm.jump_type" @change="changeJumpType">
          <el-option :label="item.label" :value="item.value" v-for="(item, index) in jumpscript" :key="index"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item
        class="inline-block"
        label="话术内容"
        v-if="questionForm.jump_type===1"
        prop="jump_text"
        :rules="scripttextrule">
        <el-input placeholder="请输入话术内容" maxlength="60" v-model="questionForm.jump_text" style='width:300px'></el-input>
      </el-form-item>
      <el-form-item
        class="scriptfileaudio"
        v-if="questionForm.jump_type===1&&audioShow"
        prop="jump_file"
        :show-message='false'
        :rules="audioShow?jump_filerule:''">
        <voice-upload
          @getUploadInfo="getUploadInfo(arguments, 2)"
          :fileInfo="scriptfileInfo"
          :errorInfo="scripterrorInfo"
        />
      </el-form-item>
      <div v-if="questionForm.jump_type===2" class="el-form-item">
        <el-form-item class="select-width" label="话术节点"
          v-for="(item, index) in questionForm.scriptnode" :key="`scriptnode${index}`"
          :prop="`scriptnode[${index}]`"
          :rules="scriptnoderule">
          <el-cascader
            :ref="`cascader-${index}`"
            :show-all-levels=false
            clearable
            expand-trigger="hover"
            v-model="questionForm.scriptnode[index]"
            :options="filterScriptsArr(index)"
            @active-item-change="activeItemChange(arguments, index)"
            popper-class="cascader-width300"
            placeholder="请选择话术节点">
          </el-cascader>
          <el-button icon='el-icon-minus' class="button__del cascader-button__del" @click='jumpNode(-1,index)' v-if="index!==0"/>
        </el-form-item>
      </div>
      <el-form-item v-if="questionForm.jump_type===2&&questionForm.bindscript.length>1">
        <el-button type="primary" icon='el-icon-circle-plus-outline' plain @click='jumpNode(1)'>增加跳转节点</el-button>
      </el-form-item>
      <el-form-item label='指令'
       class="questionOrder">
        <el-checkbox v-model="questionForm.onhook" :disabled='questionForm.repeat||questionForm.interrupt||questionForm.manual'>结束后挂机</el-checkbox>
        <el-checkbox v-model="questionForm.repeat" @change='repeatChange' :disabled='questionForm.onhook||questionForm.interrupt||questionForm.manual||questionForm.send_sms'>重复回答</el-checkbox>
        <div class="serviceGroups" v-if="callcenter">
          <el-checkbox v-model="questionForm.manual"  :disabled='questionForm.repeat||questionForm.onhook||questionForm.interrupt'>转为人工坐席</el-checkbox>
          <ServiceGroupSelect
            placeholder="请选择技能组"
            popper-class="select-width170"
            class="select-groups"
            v-model="serviceGroupsId"
            v-show="questionForm.manual"
          >
          </ServiceGroupSelect>
          <!-- <el-select v-model="serviceGroupsId" placeholder="请选择技能组" class="select-groups" v-show="questionForm.manual" popper-class="select-width170"
          @focus="getServiceGroups">
            <el-option
              v-for="item in serviceGroups"
              :key="item.gid"
              :label="item.name"
              :value="item.gid"
              :title="item.name">
            </el-option>
          </el-select> -->
        </div>
        <el-checkbox v-model="questionForm.interrupt" style="width:94px"  :disabled='questionForm.repeat||questionForm.onhook||questionForm.manual'>允许打断</el-checkbox>
        <div class="message" v-if="EpInfo.sms_count">
          <el-checkbox v-model="questionForm.send_sms"  :disabled='questionForm.repeat'>发送短信</el-checkbox>
          <LazyLoadSelect
            v-show="questionForm.send_sms"
            v-model="sendMessageId"
            placeholder="请选择短信"
            :lazyLoad = "false"
            popper-class="select-width170"
            listKey = "messages"
            :defalut-opt="defaultMessage"
            :loadList = "loadMessages"
            class="select-groups"
          >
          </LazyLoadSelect>
        </div>
      </el-form-item>
      <el-form-item class="savequestion">
        <el-button type="primary" @click="submitForm('questionForm')" class="save-btn" :disabled="saveLoading" :class="{'loading-btn':saveLoading}">
            保存<Loading v-show="saveLoading"/>
        </el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
import { messageTip } from '@/components/feedback/Message'
import Loading from '@/components/feedback/Loading'
import VoiceUpload from '@/components/others/VoiceUpload'
import { ScriptNodes, getScriptNodeName, getScriptName } from '@/pages/AICall/views/talk/script/utils/script.js'
import { deepCopy } from '@/utils/helper/assist'
import { xmlValidatorPattern, xmlValidator } from '@/utils/rules'
import EditableTextarea from '@/components/others/EditableTextarea'
export default {
  data () {
    return {
      scriptsArr: [],
      cascaderList: {},
      questionForm: {
        common: [''],
        standard: '',
        answer: '',
        audio_id: '',
        file_name: '',
        src: '',
        duration: '',
        label: [],
        group_id: '',
        bindscript: [],
        scriptnode: [[]],
        jump_text: '',
        jump_type: '',
        jump_file: '',
        jump_audio_id: '',
        jump_audio_name: '',
        onhook: false, // 1:挂机,0:不挂机
        repeat: false, // 1:重复,0:不重复
        manual: false, // 1:转人工,0:不转人工
        manual_pid: '', // 技能组id
        send_sms: false, // 1 发送,0 不发
        message_id: '',
        interrupt: false // 1 允许,0 不允许
      },
      defaultMessage: [],
      audioShow: true,
      disabledScript: [],
      jumpscript: [{
        value: 1,
        label: '跳转至话术文本'
      }, {
        value: 2,
        label: '跳转至话术节点'
      }],
      questionRules: {
        standard: [
          {
            required: true,
            message: '请输入客户可能问的问题',
            trigger: ['change', 'blur']
          },
          {
            validator: (rule, value, callback) => {
              if (value && xmlValidatorPattern.test(value)) {
                return callback(new Error('请不要输入非法字符'))
              }
              if (this.questionForm.common.includes(value)) {
                return callback(new Error('相似问题已有同样问题'))
              }
              callback()
            },
            trigger: ['change', 'blur']
          }
        ]
      },
      answerrule: [{ required: true, message: '请输入机器人回答', trigger: 'blur' }, xmlValidator],
      scriptrule: [{ required: true, message: '请选择问题话术' }],
      audiorule: [{ required: true }],
      scriptnoderule: [{ validator: (rule, value, callback) => {
        if (this.questionForm.bindscript.length === 0) {
          return callback(new Error('所属话术不能为空'))
        }
        if (!value.length || value.length === 1) {
          return callback(new Error('请选择话术节点'))
        }
        callback()
      } }, { required: true }],
      scripttextrule: [{ required: true, message: '请输入话术内容', trigger: 'blur' }, xmlValidator],
      commonrule: [{
        validator: (rule, value, callback) => {
          if (value && xmlValidatorPattern.test(value)) {
            return callback(new Error('请不要输入非法字符'))
          }
          if (this.questionForm.standard && value === this.questionForm.standard) {
            return callback(new Error('相似问题不能和标准问题相同'))
          }
          const index = +rule.field.slice(7, -1)
          const rest = this.questionForm.common.filter((d, i) => i !== index)
          if (value && rest.includes(value)) {
            return callback(new Error('该相似问题已存在'))
          }
          callback()
        },
        trigger: ['change', 'blur']
      }],
      jump_filerule: [{ required: true }],
      showanswermessage: true,
      serviceGroupsId: '',
      sendMessageId: '',
      saveLoading: false,
      isNarrow: false,
      disabled: false,
      errorInfo: '',
      fileInfo: { audio_id: '', file_name: '', src: '', duration: '' },
      scriptfileInfo: {},
      scripterrorInfo: '',
      defaultScript: [],
      bindscripts: []
    }
  },
  components: {
    Loading,
    VoiceUpload,
    EditableTextarea
  },
  watch: {
    questionForm: {
      handler: function (val, oldVal) {
        if (val.common.length === 0) {
          this.isNarrow = true
        } else {
          this.isNarrow = false
        }
      },
      deep: true
    }
  },
  computed: {
    ...mapGetters({
      serviceGroups: 'AICall/serviceGroups',
      EpInfo: 'AICall/EpInfo',
      messagesListTotal: 'AICall/messagesListTotal',
      messagesList: 'AICall/messagesList',
      scriptList: 'AICall/scriptList',
      labelsList: 'AICall/labelsList',
      fieldsList: 'AICall/fieldsList',
      scriptsCache: 'AICall/scriptsCache',
      SystemConfigs: 'AICall/SystemConfigs',
      EpConfig: 'AICall/EpConfig'
    }),
    labelsOptions () {
      const options = this.labelsList.map(labels => {
        return {
          value: labels.id,
          label: labels.title,
          children: labels.content ? labels.content.map(label => ({ label, value: label })) : ''
        }
      }) || []
      return options
    },
    showButton () {
      let questionSimilarCountLimmit = Number(this.SystemConfigs.question_similar_count_limit)
      if (this.questionForm.common.length < questionSimilarCountLimmit) {
        return true
      }
    },
    callcenter () { // 呼叫中心企业
      return +this.EpInfo.enterprise_type === 1
    }
  },
  methods: {
    ...mapActions({
      questionDetail: 'AICall/questionDetail',
      setQuestion: 'AICall/setQuestion',
      getServiceGroups: 'AICall/getServiceGroups',
      getMessages: 'AICall/getMessages',
      getScripts: 'AICall/getScripts',
      getLabels: 'AICall/getLabels',
      getFields: 'AICall/getFields',
      loadMessages: 'AICall/loadMessages',
      loadScripts: 'AICall/loadScripts'
    }),
    activeItemChange (args, index) {
      if (!this.cascaderList[index]) {
        const $thisCascader = this.$refs[`cascader-${index}`][0]
        const $menu = $thisCascader.menu.$el
        this.cascaderList[index] = {
          menu: $menu
        }
        $menu.addEventListener('click', (e) => {
          // e.stopPropagation()
          // e.preventDefault()
          const node = this.cascaderList[index]['path'] ? deepCopy(this.cascaderList[index]['path']) : args[0]
          // console.log(node)
          if (node.length === 1) {
            return false
          }
          if (e.target.nodeName.toUpperCase() === 'LI') {
            $thisCascader.handlePick(node, true)
          }
        }, false)
        $menu.addEventListener('mouseover', (e) => {
          if (e.target.nodeName.toUpperCase() === 'LI') {
            e.target.setAttribute('title', e.target.innerText)
          }
        }, false)
      } else {
        this.cascaderList[index]['path'] = args[0]
      }
    },
    changeJumpType () {
      this.scripterrorInfo = ''
      if (this.questionForm.jump_type === 2) {
        this.$refs.questionForm.clearValidate(['jump_text'])
        this.changescript(this.questionForm.bindscript)
      }
      if (this.questionForm.jump_type === 1) {
        this.jump_filerule = [{ required: true }]
      }
    },
    repeatChange (val) {
      if (this.audioShow) {
        if (val) {
          this.answerrule = [{ required: false }]
          this.audiorule = [{ required: false }]
          this.showanswermessage = false
          this.disabled = true
          this.errorInfo = ''
        } else {
          this.answerrule = [{ required: true, message: '请输入机器人回答', trigger: 'blur' }]
          this.audiorule = [{ required: true }]
          this.showanswermessage = true
          this.$refs.questionForm.validateField('answer')
          this.$refs.questionForm.validateField('audio_id')
          this.disabled = false
        }
      }
    },
    removeScript (val) {
      this.questionForm.scriptnode.map((i, index) => {
        if (i[0] === val) {
          this.questionForm.scriptnode[index] = []
          if (index === 0) {
            this.questionForm.scriptnode[index] = []
          } else {
            this.questionForm.scriptnode.splice(index, 1)
          }
        }
      })
    },
    jumpNode (type, index) {
      switch (type) {
        case 1:
          if (this.questionForm.scriptnode.length < this.questionForm.bindscript.length) {
            this.questionForm.scriptnode.push([])
          }
          break
        case -1:
          this.questionForm.scriptnode.splice(index, 1)
          break
      }
    },
    getUploadInfo (args, type) {
      console.log(args[0])
      if (type === 1) {
        this.fileInfo = args[0]
        this.questionForm = { ...this.questionForm, ...args[0] }
        this.audiorule = [{ required: false }]
      }
      if (type === 2) {
        this.scriptfileInfo = args[0]
        this.jump_filerule = [{ required: false }]
        this.questionForm.jump_audio_id = args[0].audio_id
        this.questionForm.jump_audio_name = args[0].file_name
      }
    },
    submitForm (formName) {
      if (this.callcenter && this.questionForm.manual && this.serviceGroupsId === '') {
        messageTip.$error({
          content: '请选择技能组'
        })
        return false
      }
      if (this.questionForm.send_sms && this.sendMessageId === '') {
        messageTip.$error({
          content: '请选择短信'
        })
        return false
      }
      this.$refs[formName].validate(async (valid, unpass) => {
        if (valid) {
          this.errorInfo = ''
          this.saveLoading = true
          const regex = /@([a-zA-Z0-9_\u4e00-\u9fa5]+[ ]?)(?=([\s.,@?]))?/g
          if (regex.test(this.questionForm.answer)) {
            await this.getFields()
          }
          // await this.getScripts()
          // eslint-disable-next-line
          const {standard, common, answer, audio_id, src, duration ,bindscript,jump_text,jump_type,jump_audio_id,jump_audio_name} = this.questionForm
          let scriptsAll = []
          let scripts = []
          this.questionForm.bindscript.filter(v => {
            this.$refs.bindscripts.list.filter(val => {
              if (v === val.id) {
                scriptsAll.push({ id: val.id, name: val.title })
              }
            })
          })
          if (this.questionForm.jump_type === 2) {
            this.questionForm.scriptnode.forEach((node) => {
              const nodeId = node.join('-')
              scripts.push({
                id: node[0],
                name: getScriptName(node[0]),
                jump_node: {
                  id: nodeId, name: getScriptNodeName(nodeId)
                } })
            })
            scriptsAll.filter(v => {
              if (!scripts.map(val => val.id).includes(v.id)) {
                scripts.push(v)
              }
              return scripts
            })
          } else {
            scripts = [...scriptsAll]
          }
          // debugger
          const questiondata = {
            standard,
            common,
            answer,
            audio_id,
            jump_text,
            jump_type,
            jump_audio_id,
            jump_audio_name,
            scripts: JSON.stringify(scripts),
            // eslint-disable-next-line
            label:this.questionForm.label.length?encodeURI(encodeURI(this.questionForm.label [this.questionForm.label.length-1])):'',
            // eslint-disable-next-line
            group_id:this.questionForm.label.length?this.questionForm.label[0]:'',
            onhook: this.questionForm.onhook === true ? 1 : 0,
            repeat: this.questionForm.repeat === true ? 1 : 0,
            manual: this.questionForm.manual === true ? 1 : 0,
            manual_pid: this.serviceGroupsId, // 技能组id
            send_sms: this.questionForm.send_sms === true ? 1 : 0,
            message_id: this.sendMessageId, // 短信id
            interrupt: this.questionForm.interrupt === true ? 1 : 0
          }
          // eslint-disable-next-line
          let { limit, page,script_id = '' } = this.$route.meta.query
          if (this.$route.params.id !== 'new') {
            questiondata.id = this.$route.params.id
          } else {
            page = 1
          }
          questiondata.answer = questiondata.answer.replace(regex, ($1) => {
            const fieldId = this.fieldsList.find(d => d.title === $1.substring(1).trim())
            if (fieldId) {
              return '${' + fieldId.id + '}'
            }
            return $1
          })
          console.log(this.questionForm.jump_file)
          this.setQuestion(questiondata).then(res => {
            if (res.status === 0) {
              messageTip.$success({
                content: '保存成功！'
              })
              this.saveLoading = false
              // eslint-disable-next-line
              if (script_id) {
                this.$router.push({ name: 'AICall-question', query: { limit, page, script_id } })
              } else {
                this.$router.push({ name: 'AICall-question', query: { limit, page } })
              }
            } else {
              messageTip.$error({
                content: res.info
              })
              this.saveLoading = false
            }
          })
        } else {
          if (unpass.audio_id) {
            this.errorInfo = '请上传语音'
          }
          if (unpass.jump_file) {
            this.scripterrorInfo = '请上传语音'
          }
          return false
        }
      })
    },
    removecommon (item) {
      var index = this.questionForm.common.indexOf(item)
      if (index !== -1) {
        this.questionForm.common.splice(index, 1)
      }
    },
    addcommon () {
      this.questionForm.common.push('')
      this.$nextTick(function () {
        this.$refs.questionArr[this.$refs.questionArr.length - 1].focus()
      })
    },
    changescript (val) {
      // TTS:1:开启，0：关闭。全部是1才false
      if (val.length && this.EpConfig.tts_status === 1) {
        Promise.all(val.map(i => this.getScript(i))).then((result) => {
          this.scriptsArr = []
          result.forEach(item => {
            this.scriptsArr.push(item.AllNodes)
          })
          this.audioShow = result.some(item => item.tts === 0)
        })
      } else {
        Promise.all(val.map(i => this.getScript(i))).then((result) => {
          this.scriptsArr = []
          result.forEach(item => {
            this.scriptsArr.push(item.AllNodes)
          })
        })
        this.audioShow = true
      }
    },
    filterScriptsArr (index) {
      const selected = this.questionForm.scriptnode.map(s => s[0])
      const scriptsArr = deepCopy(this.scriptsArr)
      scriptsArr.map((s, i) => {
        if (s.value !== selected[index] && selected.includes(s.value)) {
          s.disabled = true
        }
      })
      return scriptsArr
    },
    async getScript (id) {
      const script = new ScriptNodes(id)
      await script.getAllNodes()
      return script
      // this.scriptsArr.push(nodes)
      // return script['__cache'][id]
    }
    // currentbindscript (arr) {
    //   const currentbindscript = []
    //   this.scriptList.filter(v => {
    //     arr.filter((val) => {
    //       if (v.id === val.id) {
    //         currentbindscript.push(val)
    //       }
    //     })
    //   })
    //   console.log(currentbindscript)
    //   return currentbindscript
    // }
  },
  async mounted () {
    // this.getScripts()
    // this.getLabels()
    // this.getFields()
    if (this.$route.params.id !== 'new') {
      this.fullLoading = this.$loading({
        lock: true,
        background: 'rgba(180, 188, 205, 0.35)'
      })
      const id = this.$route.params.id
      const that = this
      await this.questionDetail({ id }).then(res => {
        if (res.status === 0) {
          const initScriptList = res.data.scripts.map(script => {
            return {
              id: script.id,
              title: script.name
            }
          }) || []

          // this.$store.commit({
          //   type: 'AICall/getScripts',
          //   state: { scripts: initScriptList }
          // })
          this.defaultScript = initScriptList
          // eslint-disable-next-line
          const {standard, answer, audio_id, audio_name, src, duration, jump_text, jump_audio_name,scripts} = res.data
          that.questionForm = {
            common: res.data.common ? res.data.common.filter(d => d) : [''],
            standard,
            answer,
            audio_id: res.data.audio_id ? res.data.audio_id : '',
            file_name: res.data.audio_name, // 录音文件
            src,
            label: [],
            duration,
            jump_text,
            jump_type: res.data.jump_type || '',
            jump_audio_id: res.data.jump_audio_id ? res.data.jump_audio_id : '',
            jump_file: res.data.jump_audio_id ? res.data.jump_audio_id : '',
            jump_audio_name,
            scriptnode: [[]],
            scripts,
            onhook: res.data.onhook === 1,
            repeat: res.data.repeat === 1,
            manual: res.data.manual === 1,
            send_sms: res.data.send_sms === 1,
            interrupt: res.data.interrupt === 1,
            bindscript: res.data.scripts && res.data.scripts.length ? initScriptList.map(v => v.id) : []
          }
          const customRegex = /\${[1-9]\d*}/g
          that.questionForm.answer = that.questionForm.answer.replace(customRegex, ($1) => {
            const id = Number($1.slice(2, $1.length - 1))
            const field = res.data.answer_fields.find(d => d.id === id)
            return field ? `@${field.title} ` : ''
          })

          if (res.data.scripts && res.data.scripts.length && res.data.jump_type === 2) {
            let scriptnode = [[]]
            const jumpNodes = res.data.scripts.filter(v => v.jump_node.id)
            if (jumpNodes.length) {
              scriptnode = jumpNodes.map(v => v.jump_node.id).map(v => v.split('-')).map((v, i) => { v[0] = +v[0]; return v })
            }
            that.questionForm.scriptnode = scriptnode
          }
          if (res.data.group_id) {
            const labels = { labels: [ res.data.label_group ] }
            this.$store.commit({
              type: 'AICall/getLabels',
              state: labels
            })
            that.questionForm.label = [+res.data.group_id, decodeURI(res.data.label)]
          }
          that.changescript(that.questionForm.bindscript)
          // eslint-disable-next-line
          if(res.data.manual_pid_data.gid){
            this.$store.commit({
              type: 'AICall/getServiceGroups',
              state: [res.data.manual_pid_data]
            })
            that.serviceGroupsId = +res.data.manual_pid_data.gid
          } else {
            that.serviceGroupsId = ''
          }
          // eslint-disable-next-line
          if(res.data.message_id){
            that.defaultMessage = [res.data.message_data]
            that.sendMessageId = +res.data.message_id
          } else {
            that.sendMessageId = ''
          }
          if (res.data.repeat === 1) {
            that.answerrule = [{ required: false }]
            that.audiorule = [{ required: false }]
            that.showanswermessage = false
            that.disabled = true
          }
          if (res.data.jump_audio_id) {
            that.jump_filerule = [{ required: false }]
          }
          that.fileInfo = { ...that.fileInfo, ...{ audio_id, src, duration } }
          that.fileInfo.file_name = res.data.audio_name
          that.scriptfileInfo = { audio_id: res.data.jump_audio_id, file_name: res.data.jump_audio_name }
        }
        this.fullLoading.close()
      })
    }
    // this.getServiceGroups()
    // this.getMessages()
  }
}
</script>

<style lang="scss" >
@import "@/assets/css/core.scss";
@import '@/assets/css/widget/contextmenu.scss';
.view .view-contain > .question-id{
  padding-bottom: 52px;
}

.question-id{
  .el-breadcrumb{
    margin-top: 0;
  }
  .el-form{
    .el-form-item.audio{
      height: 37px;
       .voice-upload{
         margin-left: 0;
       }
    }
    .el-form-item.audio,.el-form-item.robot,.el-form-item.questionOrder{
      margin-top: 20px;
    }
    .el-input,.el-textarea{
      width: 520px;
    }
    .commons_input + .commons_input{
      margin-top:24px;
    }
    .commons_input{
      .el-button{
        // margin-left: 12px;
      }
    }
    .addquestion{
      line-height: 30px;
      margin-top: -4px;
    }
    .narrow{
      line-height: 30px;
      margin-top: 0px;
    }
    .tip{
      color: #90939A;
    }
    .select-groups{
      margin-left: 8px;
      width: 172px;
      .el-input{
        width: 172px;
        .el-input__inner{
          vertical-align: middle;
          height: 32px;
        }
        .el-input__suffix{
          top: 1px
        }
      }
    }
    .select-width .el-input{
      width: 300px;
    }
    .questionOrder{
      width: 665px;
      .el-form-item__content{
        .el-checkbox + .el-checkbox{
          margin-left: 0px;
        }
        .message,.serviceGroups{
          width: 300px;
          display: inline-block;
          margin-right: 0;

        }
        >div,>label{

          margin-right: 30px;
          margin-bottom: 4px;
        }
      }
    }
  }
  .savequestion{
    margin-top: 27px;
    .save-btn {
      width: 86px;
      position: relative;
      &.loading-btn{
        // font-size: 0;
        color: #a9ddff;
        .el-loading-spinner .path {
          stroke: #fff;
          stroke-width: 4;
        }
      }
    }
  }
  .bindscript{
    .el-tag{
        background: #F9F9F9;
        border: 1px solid #D7DBE6;
        font-size: 14px;
        color: $subsidiary-text-color;
        padding: 1px 10px;
        margin: 3px 0 3px 6px;
        height: 26px;
        &__close.el-icon-close{
            background-color: transparent;
            color: $info-text-color;
            &:hover{
                 color: #fff;
                 background-color:$text-error;
            }
        }
    }
  }
  .inline-block {
    display: inline-block;
  }
  .scriptfileaudio{
    .el-form-item__content{
      margin-left: 0px!important;
    }
  }
  @media screen and (max-width: 1365px) { /*小于1366px*/
    .scriptfileaudio{
      display: block;
      margin-left: 100px;
    }
  }
  @media screen and (min-width: 1366px) { /*屏幕尺寸大于1366pxpx*/
    .scriptfileaudio {
      display: inline-block;
    }
  }
  // .el-form-item.margin-top20{
  //   margin-top: 20px
  // }
  .voice-upload{
    @media only screen and (max-width:($--lg - 1)){
    margin-left: 0;
    margin-top: 0px;
    display: inline-block;
    }
  }

}
</style>
