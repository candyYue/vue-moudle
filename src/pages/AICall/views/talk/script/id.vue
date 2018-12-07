<template>
  <div>
    <el-form :model="scriptForm"  ref="scriptForm" :rules="scriptRules" label-width="130px" @submit.native.prevent class="form-has-tootip script-form">
      <el-form-item label="话术名称"
       prop="title">
        <el-input v-model.trim="scriptForm.title"  placeholder="请输入话术名称" maxlength="20"></el-input>
      </el-form-item>
      <el-form-item v-if="EpConfig.tts_status">
        <div slot="label">
          TTS
          <Tooltip :content="scriptTooltip.tts"></Tooltip>
        </div>
        <switch-button v-model="scriptForm.tts" :buttons="ttsButton"></switch-button>
      </el-form-item>
      <el-form-item label="话术流程" required>
        <div :class="['tree-process',(rootEmpty && showError) ? 'error' : '']">
          <Tree
            ref="treeContainer"
            :translate="translate"
            :initData="treeData"
            :scaleExtent="{ min: 0.2, max: 1.2}"
            :allowForeignObjects="true"
          >
            <template slot-scope="scope">
              <tree-node :nodeData="scope" :rootEdited="rootEdited" @handleContextMenu="handleContextMenu"/>
            </template>
          </Tree>
          <p class="el-form-item__error" v-if="rootEmpty && showError">请编辑话术流程</p>
        </div>
      </el-form-item>
      <div class="script-form-common">
      <!-- ******************************* 静音超时 ************************************ -->
        <h6 class="is-required">
          <label>静音超时</label>
          <Tooltip :content="scriptTooltip.noinput"></Tooltip>
        </h6>
        <el-form-item
          v-for="(noinput,index) in scriptForm.noinput"
          :key="`noinput-${index}`"
          :label="`第${index+1}遍话术`"
          :prop="`noinput[${index}].text`"
          class="script-form-item"
        >
          <el-input v-model.trim="scriptForm.noinput[index].text"  placeholder="请输入话术内容" maxlength="60"></el-input>
          <voice-upload
            v-if="voiceEnable"
            @getUploadInfo="getUploadInfo(arguments, {type: 'noinput', index})"
            :fileInfo="scriptForm.noinput[index].audio"
            :errorInfo="scriptForm.noinput[index].voiceError"
          />
        </el-form-item>

        <!-- ******************************* 未匹配到聚类 ************************************ -->
        <h6 class="is-required">
          <label>未匹配到聚类</label>
          <Tooltip :content="scriptTooltip.nomatchCall" v-if="callcenter"></Tooltip>
          <Tooltip :content="scriptTooltip.nomatch" v-else></Tooltip>
        </h6>
        <el-form-item
          v-for="(nomatch,index) in scriptForm.nomatch"
          :key="`nomatch-${index}`"
          :label="`第${index+1}次提问`"
          :prop="`nomatch[${index}].text`"
          class="script-form-item"
        >
          <el-input
            v-model.trim="scriptForm.nomatch[index].text"
            placeholder="请输入话术内容"
            maxlength="60"
            :disabled="nomatchDisabled[index]"></el-input>
          <voice-upload
            class="next-line"
            v-if="voiceEnable"
            @getUploadInfo="getUploadInfo(arguments, {type: 'nomatch', index})"
            :fileInfo="scriptForm.nomatch[index].audio"
            :errorInfo="scriptForm.nomatch[index].voiceError"
            :disabled="nomatchDisabled[index]"
          />
          <template v-if="callcenter">
            <el-cascader
              :class="{'next-line':voiceEnable}"
              :disabled="nomatchDisabled[index]" class="nomatch-instruct"
              :show-all-levels="false"
              :options="index==2 ? instructOptions(2) : instructOptions(1)"
              v-model="scriptForm.instruct[index]"
              @focus.once="getServiceGroups"
            />
          </template>

        </el-form-item>

        <!-- ******************************* 转人工坐席设置 ************************************ -->
        <template v-if="callcenter">
          <h6>
            <label>转人工坐席设置</label>
            <Tooltip :content="scriptTooltip.manual"></Tooltip>
          </h6>
            <el-form-item label="根据意向性">
            <el-select v-model="scriptForm.intention.value" class="manual-select">
              <el-option label="关闭" :value="0"/>
              <el-option v-for="intention in intentionOptions" :key="intention" :label="`${intention}类意向性`" :value="intention"/>
              </el-select>
              <el-cascader class="manual-instruct" :show-all-levels="false"
              @focus.once="getServiceGroups"
              :options="instructOptions(2)" v-model="scriptForm.intention.instruct"/>
            </el-form-item>
          <el-form-item label="话术" v-if="scriptForm.intention.value !== 0" prop="intention">
            <el-input v-model="scriptForm.intention.text" placeholder="请输入该意向转人工时播放的话术" maxlength="60"></el-input>
            <voice-upload v-if="voiceEnable"
              @getUploadInfo="getUploadInfo(arguments, {type: 'intention'})"
              :fileInfo="scriptForm.intention.audio"
              :errorInfo="scriptForm.intention.voiceError"/>
          </el-form-item>
          <el-form-item label="根据会话轮数">
            <el-select v-model="scriptForm.session.value" class="manual-select">
              <el-option label="关闭" :value="0"/>
              <el-option v-for="session in 20" :key="`session-${session}`" :label="session" :value="session"></el-option>
            </el-select>
            <el-cascader class="manual-instruct" :show-all-levels="false"
              @focus.once="getServiceGroups"
              :options="instructOptions(2)" v-model="scriptForm.session.instruct"/>
          </el-form-item>
          <el-form-item label="话术" v-if="scriptForm.session.value !== 0" prop="session">
            <el-input v-model="scriptForm.session.text" placeholder="请输入到达该会话轮数转人工时所播放的话术" maxlength="60"></el-input>
            <voice-upload v-if="voiceEnable" @getUploadInfo="getUploadInfo(arguments, {type: 'session'})" :fileInfo="scriptForm.session.audio" :errorInfo="scriptForm.session.voiceError"/>
          </el-form-item>
        </template>
        <!-- ******************************* 关键词意向性设置 ************************************ -->
        <h6>
          <label>意向性设置</label>
          <Tooltip :content="scriptTooltip.intention"></Tooltip>
        </h6>
        <Intention v-model="scriptForm.intentionType"/>

        <!-- ******************************* 关键词意向性设置 ************************************ -->
        <h6>
          <label>全局语境关键词</label>
          <Tooltip :content="scriptTooltip.globalKeyword"></Tooltip>
        </h6>
        <el-form-item label="全语境关键词" class="context">
          <lazy-load-select
            multiple
            v-model="scriptForm.globalKeyword"
            placeholder="请选择标签组"
            listKey = "labels"
            :defalut-opt="defaultGlobal"
            :loadList = "loadLabels"
            :multiple-limit = "10"
          >
          </lazy-load-select>
        </el-form-item>
      </div>
      <el-form-item>
        <el-button type="primary" class="save-btn" @click="saveForm" :disabled="scriptFormLoading" v-if="!scriptFormLoading">
            保存
        </el-button>
        <el-button type="primary" class="save-btn loading-btn" disabled v-else>
            <Loading/>
        </el-button>
      </el-form-item>
    </el-form>

    <!-------------- 新建、编辑话术节点弹框   start ------------>
    <Modal class="modal-padding-16 modal-ivrnode" draggable
          :title="ivrnodeModalTitle" v-model="ivrnodeModal"
          @comfirm="saveIvrnode" @cancel="closeIvrnodeModal">
      <el-form ref="ivrnodeForm" :model="ivrnodeForm" :rules="ivrnodeRules" label-width="88px" class="form-has-tootip">
        <el-form-item prop="cluster_id" class="ivrnode-clusters">
          <span slot="label">聚类
            <Tooltip :content="scriptTooltip.clusters"></Tooltip>
          </span>
          <lazy-load-select
            v-model="ivrnodeForm.cluster_id"
            placeholder="请选择聚类名称"
            listKey = "clusters"
            :defalut-opt="defaultCluster"
            :loadList = "loadClusters"
            ref="LazyLoadClusters"
          >
          </lazy-load-select>
          <div v-if="matchList.content" class="clusters-name-list">
            <label>聚类文本集合</label>
            <div class="tags-pure-collection">
              <span v-for="(match,idx) in matchList.content" :key="`match-${idx}`" class="text-tag">
                {{ match }}
              </span>
            </div>
          </div>
        </el-form-item>

        <el-form-item label="话术" prop="script" >
          <editable-textarea v-model="ivrnodeForm.script" :selectList="fieldsList" :usingFields="!voiceEnable ? true : false"
          :getList="getFields"
          placeholder='示例：喂，您好，我们是XX公司，我们有一批公寓在售。' :autosize='{ minRows:4, maxRows: 4}'/>
        </el-form-item>
        <el-form-item class="form-item-voice-upload" v-if="voiceEnable">
          <voice-upload
          @getUploadInfo="getUploadInfo(arguments, {type: 'node'})" class="ivrnode-voice-upload"
          :fileInfo="ivrnodeForm.audio" :errorInfo="ivrnodeForm.voiceError" ref="ivrnodeUpload">
            <el-button type="primary">选择语音文件</el-button>
          </voice-upload>
        </el-form-item>

        <el-form-item prop="label_id" >
          <span slot="label">标签
            <Tooltip :content="scriptTooltip.labels"></Tooltip>
          </span>
          <el-cascader filterable placeholder="请选择标签"
            clearable
            @focus.once="getLabels"
            :options="labelsOptions" :show-all-levels="false"
            v-model="ivrnodeForm.label_id" popper-class="cascader-width173">
          </el-cascader>
        </el-form-item>

        <el-form-item prop="mainprocess" class="line-height-20">
          <span slot="label">指令
            <Tooltip :content="scriptTooltip.directives"></Tooltip>
          </span>
          <span @click.prevent="mainprocessTip" class="mrr-20">
            <el-checkbox label="未匹配继续流程" v-model="ivrnodeForm.default"/>
          </span>
          <span>
            <el-checkbox label="流程结束节点" v-model="ivrnodeForm.process_end"
            :disabled="!ivrnodeForm.node_end"/>
          </span>
        </el-form-item>

        <el-form-item class="line-height-30 ivrnode-directive directive-artificial" prop="instruct_manual">
            <span class="mrr-20">
              <el-checkbox label="允许打断" v-model="ivrnodeForm.bargein"/>
            </span>
            <span @click.prevent="changeArtificial(!ivrnodeForm.instruct_manual)" v-if="callcenter">
              <el-checkbox label="转为人工坐席" v-model="ivrnodeForm.instruct_manual" :disabled="ivrnodeForm.bargein"/>
              <service-group-select
                v-show="ivrnodeForm.instruct_manual"
                v-model="ivrnodeForm.manual_pid"
                placeholder="请选择技能组"
                popper-class="select-width138"
                class="service-groups"
              />
            </span>
        </el-form-item>
        <el-form-item prop="instruct_sms" class="ivrnode-directive line-height-30">
            <span class="mrr-20">
              <el-checkbox label="允许问题跳转" v-model="ivrnodeForm.allow_jump"/>
            </span>
            <span v-if="EpInfo.sms_count">
              <el-checkbox label="发送短信" v-model="ivrnodeForm.instruct_sms" @change="changeSms"/>
              <lazy-load-select
                v-show="ivrnodeForm.instruct_sms"
                v-model="ivrnodeForm.sms_template_id"
                placeholder="请选择短信"
                listKey = "messages"
                :loadList = "loadMessages"
                :lazyLoad = "false"
                :defalut-opt="defaultMessage"
                popper-class="select-width138"
                class="msm-groups"
              >
              </lazy-load-select>
            </span>

        </el-form-item>
      </el-form>
    </Modal>
    <!-------------- 新建、编辑话术节点弹框   end ------------>

    <!-- 右键菜单 -->
    <contextmenu ref="contextmenu">
      <contextmenu-item @click="openIvrnodeModal(treeHandler['ADD'])">新增</contextmenu-item>
      <contextmenu-item @click="openIvrnodeModal(treeHandler['EDIT'])">编辑</contextmenu-item>
      <contextmenu-item @click="handleCopy">复制</contextmenu-item>
      <contextmenu-item @click="handleTree(treeHandler['PASTE'])" v-if="type === treeHandler['COPY']">粘贴</contextmenu-item>
      <contextmenu-item @click="removeNode">删除</contextmenu-item>
    </contextmenu>
  </div>
</template>

<script>
// import { handleXml } from '@/utils/helper/assist'
import { uniqBy } from 'lodash'
import { ScriptTree } from './utils/script'
import { mapActions, mapGetters } from 'vuex'
import tree, { getProps, checkOnlyAttr, attrEntries } from './utils/treeDataHelper'
import { calcTreeXML } from './utils/scriptHelper'
import { contextmenuPos } from '@/utils/helper/position'
import { tooltip, messageDispaly, types } from '@/utils/config'
import { scriptRules, ivrnodeRules } from '@/utils/rules/AICall'
import Tree from '@/components/tree/Tree'
import Tooltip from '@/components/feedback/Tooltip'
import EditableTextarea from '@/components/others/EditableTextarea'
import Loading from '@/components/feedback/Loading'
import SwitchButton from '@/components/feedback/Switch'
import VoiceUpload from '@/components/others/VoiceUpload'
import ServiceGroupSelect from '@/components/form/ServiceGroupSelect'
import { messageBox, messageTip } from '@/components/feedback/Message'
import Intention from './components/Intention'
import TreeNode from './components/TreeNode'
import {
  Contextmenu,
  ContextmenuItem
} from 'v-contextmenu'
import 'v-contextmenu/dist/index.css'
export default {
  components: {
    Tree,
    TreeNode,
    Contextmenu,
    ContextmenuItem,
    Tooltip,
    EditableTextarea,
    Loading,
    VoiceUpload,
    Intention,
    SwitchButton,
    ServiceGroupSelect
  },
  data () {
    const checkArtificial = (rule, value, callback) => {
      if (value && !this.ivrnodeForm.manual_pid) {
        return callback(new Error('请选择技能组'))
      }
      callback()
    }
    const checkMsm = (rule, value, callback) => {
      if (value && !this.ivrnodeForm.sms_template_id) {
        return callback(new Error('请选择短信'))
      }
      callback()
    }
    const intentionOptions = ['A', 'B', 'C', 'D']
    return {
      fullLoading: true,
      scriptTooltip: tooltip.script,
      messageDispaly: messageDispaly.script,
      treeHandler: types.TREE_HANDLER,
      // tree
      type: null,
      copySource: null,
      treeData: [tree.treeData],
      treeXml: '',
      translate: {
        x: 0,
        y: 0
      },
      ttsButton: [
        {
          label: '启用',
          value: 1
        },
        {
          label: '关闭',
          value: 0
        }
      ],
      // 话术表单
      scriptId: this.$route.params.id,
      scriptRules,
      scriptForm: {
        tts: 0,
        title: '',
        noinput: [
          { text: '喂？您好？', audio: {}, voiceError: '' },
          { text: '请问您在听吗？', audio: {}, voiceError: '' },
          { text: '不好意思，这边听不到您的声音，后期再与您联系，祝您生活愉快，再见。', audio: {}, voiceError: '' }],
        nomatch: [
          { text: '不好意思，您说什么？', audio: {}, voiceError: '' },
          { text: '我这边没听清，您能说的慢一点吗？', audio: {}, voiceError: '' },
          { text: '不好意思，我这边信号不太好，稍后由负责接待您的客户经理给您去电话，再见。', audio: {}, voiceError: '' }],
        instruct: [['none', ''], ['none', ''], ['onhook', '']],
        intention: {
          value: 0,
          text: '',
          audio: {},
          voiceError: '',
          instruct: ['onhook', '']
        },
        session: {
          value: 0,
          text: '',
          audio: {},
          voiceError: '',
          instruct: ['onhook', '']
        },
        intentionType: [
          {
            type: '',
            inKeywords: [],
            num: '',
            outKeywords: [],
            sessionNum: '',
            duration: {
              type: '',
              area: ['', '']
            }
          }
        ],
        globalKeyword: []
      },
      intentionOptions,
      scriptFormLoading: false,
      // selectLoading: true,
      // 话术节点弹框
      ivrnodeRules: Object.assign(ivrnodeRules, {
        instruct_manual: {
          validator: checkArtificial, trigger: 'change'
        },
        instruct_sms: {
          validator: checkMsm, trigger: 'change'
        }
      }),
      ivrnodeModal: false,
      ivrnodeForm: {
        id: null,
        cluster_id: '',
        default: false,
        script: '',
        audio: {},
        voiceError: '',
        label_id: [],
        bargein: false,
        instruct_manual: false,
        manual_pid: '',
        instruct_sms: false,
        sms_template_id: '',
        allow_jump: false,
        process_end: false,
        node_end: true // 节点是否为当前分支的 end 节点
      },
      defaultCluster: [],
      defaultMessage: [],
      defaultGlobal: [],
      targetNode: null,
      showError: false,
      rootEdited: false // 判断是否校验根节点聚类（未编辑过的根节点不校验）
    }
  },
  computed: {
    ...mapGetters({
      scriptContent: 'AICall/scriptContent',
      clustersMap: 'AICall/clustersMap',
      clustersList: 'AICall/clustersList',
      fieldsList: 'AICall/fieldsList',
      labelsList: 'AICall/labelsList',
      labelsOptions: 'AICall/labelsOptions',
      messagesList: 'AICall/messagesList',
      serviceGroups: 'AICall/serviceGroups',
      EpInfo: 'AICall/EpInfo',
      EpConfig: 'AICall/EpConfig'
    }),
    voiceEnable () {
      return !this.scriptForm.tts || !this.EpConfig.tts_status
    },
    ivrnodeModalTitle () {
      const typeTit = {
        [this.treeHandler['ADD']]: '新增节点',
        [this.treeHandler['EDIT']]: '编辑节点'
      }
      return typeTit[this.type]
    },
    nomatchDisabled () {
      let nomatchDisabled = [false, false, false]
      if (this.callcenter) {
        this.scriptForm.instruct.map((instruct, index) => {
          if (instruct[0] === 'manual') {
            nomatchDisabled.fill(true, index + 1, 3)
          }
        })
      }
      return nomatchDisabled
    },
    matchList () {
      const clusterId = this.ivrnodeForm.cluster_id
      const clustersList = this.$refs.LazyLoadClusters?.list || []
      return clustersList.find(d => d.id === clusterId) || []
    },
    rootEmpty () {
      const root = this.treeData[0]
      return root.prompt[0].tts[0].text.length === 0
    },
    callcenter () { // 呼叫中心企业
      return +this.EpInfo.enterprise_type === 1
    },
    newScript () { return this.scriptId === 'new' }
  },
  watch: {
    ivrnodeForm: {
      handler (val) {
        if (this.callcenter) {
          if (val.bargein) {
            this.ivrnodeForm.instruct_manual = false
            this.ivrnodeForm.manual_pid = ''
          }
        }
      },
      deep: true
    }
  },
  methods: {
    ...mapActions({
      getClusters: 'AICall/getClusters',
      loadClusters: 'AICall/loadClusters',
      loadLabels: 'AICall/loadLabels',
      loadMessages: 'AICall/loadMessages',
      getFields: 'AICall/getFields',
      getLabels: 'AICall/getLabels',
      saveScripts: 'AICall/saveScripts',
      saveScriptsCache: 'AICall/saveScriptsCache',
      getServiceGroups: 'AICall/getServiceGroups'
    }),
    getUploadInfo (args, opts) {
      switch (types.CATCH_TYPES[opts.type]) {
        case 0:
          this.ivrnodeForm.audio = args[0]
          break
        case 1:
          this.scriptForm[opts.type][opts.index].audio = args[0]
          break
        case 2:
          this.scriptForm[opts.type].audio = args[0]
          break
      }
    },
    instructOptions (flag) {
      const serviceGroups = this.serviceGroups.map(s => (
        {
          value: s.gid,
          label: s.name
        }
      ))
      const instructDefault = flag === 1 ? {
        value: 'none',
        label: '无指令'
      } : {
        value: 'onhook',
        label: '挂机'
      }
      const instructOptions = [
        instructDefault,
        {
          value: 'manual',
          label: '转为人工坐席',
          children: serviceGroups
        }
      ]
      return instructOptions
    },
    setTreeCenter () {
      const dimensions = this.$refs.treeContainer.$el.getBoundingClientRect()
      this.translate = {
        x: dimensions.width / 2,
        y: 75
      }
    },
    getCatch (globalCatch) {
      const promptLableValue = 'audio'
      globalCatch.map(catchItem => {
        const event = catchItem.attr.event.value
        const type = types.CATCH_TYPES[event]
        if (event === 'nomatch') {
          const { instruct, manual_pid: manualPid } = Object.assign(...attrEntries(catchItem.attr))
          this.scriptForm.instruct.splice(catchItem.prompt.length - 1, 1, [instruct, manualPid])
        }
        switch (type) {
          case 1:
            catchItem.prompt.map((d, i) => {
              const audio = Object.assign(...attrEntries(d[promptLableValue][0].attr))
              this.scriptForm[catchItem.attr.event.value].splice(i, 1, { text: d[promptLableValue][0].text, audio })
            })
            break
          case 2:
            if (event) {
              const { rank, instruct, manual_pid: manualPid } = Object.assign(...attrEntries(catchItem.attr))
              const audio = Object.assign(...attrEntries(catchItem.prompt[0].audio[0].attr))
              this.scriptForm[event] = Object.assign(this.scriptForm[event], {
                value: rank,
                instruct: [instruct, manualPid],
                audio,
                text: catchItem.prompt[0].audio[0].text
              })
            }
            break
        }
      })
    },
    getIntentionType (intentionType) {
      if (intentionType) {
        const intentionTypeArr = []
        intentionType.map(item => {
          const attr = Object.assign(...attrEntries(item.attr))
          const type = attr.type
          const sessionNum = attr['session-num'] || ''
          const duration = attr['duration-area'] || '#,#'
          const durationArea = duration.split(',')

          let durationType = 0
          if (durationArea.indexOf('#') > -1) {
            durationType = ''
            if (durationArea[0] !== '#') {
              durationType = 1
            }
            if (durationArea[1] !== '#') {
              durationType = -1
            }
          }
          intentionTypeArr.push({
            type,
            inKeywords: item['in-clusters'][0].item.map(d => d.text),
            num: item['in-clusters'][0].attr.num.value || '',
            outKeywords: item['out-clusters'][0].item?.map(d => d.text) || [],
            sessionNum,
            duration: {
              type: durationType,
              area: durationArea
            }
          })
          this.scriptForm.intentionType = intentionTypeArr
        })
      }
    },
    getGlobal (globalKeywords) {
      if (globalKeywords) {
        const ids = globalKeywords[0].attr.id.value
        if (ids) {
          this.scriptForm.globalKeyword = String(ids).split(',').map(d => +d)
          this.defaultGlobal = this.labelsList
        } else {
          this.scriptForm.globalKeyword = []
        }
      }
    },
    changeArtificial (value) {
      // console.log(value)
      const self = this
      if (self.ivrnodeForm.bargein) {
        return false
      }
      self.ivrnodeForm.manual_pid = ''
      if (value) {
        if (this.targetNode.children) {
          messageBox.$warning({
            content: self.messageDispaly.manualEdit,
            successCallback () {
              self.ivrnodeForm.instruct_manual = value
              messageTip.$success({
                content: '设置成功'
              })
            }
          })
          return
        }
        this.ivrnodeForm.instruct_manual = value
      } else {
        this.ivrnodeForm.instruct_manual = value
        this.$refs['ivrnodeForm'].validateField('instruct_manual')
      }
    },
    changeSms (value) {
      if (value) {
        this.ivrnodeForm.sms_template_id = ''
      } else {
        this.$refs['ivrnodeForm'].validateField('instruct_sms') // it's use, don't remove
      }
    },
    resetIvrnodeForm () {
      this.$refs['ivrnodeForm'].resetFields()
      Object.assign(this.ivrnodeForm, {
        audio: {},
        voiceError: '',
        default: false,
        label_id: [],
        instruct_manual: false,
        manual_pid: '',
        instruct_sms: false,
        sms_template_id: '',
        bargein: false,
        process_end: false,
        node_end: true,
        allow_jump: false
      })
      if (this.voiceEnable) {
        this.$refs.ivrnodeUpload.resetUpload()
      }
      this.targetNode = null
    },
    closeIvrnodeModal () {
      this.ivrnodeModal = false
    },
    openIvrnodeModal (type) {
      this.resetIvrnodeForm()
      this.targetNode = tree.getNode(this.ivrnodeForm.id)
      console.log(this.targetNode)
      // console.log(this.targetNode)
      const nodeProps = getProps(this.targetNode.data)
      const {
        default: mainprocess,
        clusterId,
        labelId,
        instructManual,
        manualPid,
        instructSms,
        smsTemplateId,
        script,
        audio,
        bargein,
        processEnd,
        allowJump
      } = nodeProps

      if (type === this.treeHandler['ADD']) {
        if (this.rootEmpty) {
          messageTip.$error({ content: this.messageDispaly.rootEmptyAdd })
          return false
        }
        if (instructManual) {
          messageTip.$error({ content: this.messageDispaly.manualEnd })
          return false
        }
      }

      if (type === this.treeHandler['EDIT']) {
        const labelIdValue = labelId ? labelId.split('-') : []
        console.log(nodeProps)
        this.ivrnodeForm = Object.assign(this.ivrnodeForm, {
          cluster_id: clusterId,
          default: mainprocess,
          script,
          label_id: labelIdValue,
          bargein,
          audio,
          instruct_manual: instructManual,
          manual_pid: manualPid,
          instruct_sms: instructSms,
          sms_template_id: smsTemplateId,
          process_end: this.targetNode.children ? false : processEnd,
          node_end: !this.targetNode.children,
          allow_jump: allowJump
        })
        this.defaultCluster = this.clustersList.filter(i => i.id === clusterId)
        this.defaultMessage = this.messagesList.filter(i => i.id === smsTemplateId)
        // FIXED: 聚类删除情况
        !this.defaultCluster.length && (this.ivrnodeForm.cluster_id = '')
      }
      this.type = type
      this.ivrnodeModal = true
    },
    checkVoice (obj, errorTip = '请上传语音') {
      // eslint-disable-next-line
      const uploaded = obj.audio?.audio_id
      if (!uploaded) {
        this.$set(obj, 'voiceError', errorTip)
      }
      return uploaded
    },
    checkForm (name) {
      let checkFormState = false
      this.$refs[name].validate(valid => (checkFormState = valid))
      if (name === 'scriptForm') {
        this.showError = true
        let checkNoinput = true
        let checkNomatch = true
        let checkIntention = true
        let checkSession = true
        if (this.voiceEnable) {
          checkNoinput = this.scriptForm.noinput.reduce((result, item, index) => {
            return this.checkVoice(this.scriptForm.noinput[index]) && result
          }, true)
          checkNomatch = this.scriptForm.nomatch.reduce((result, item, index) => {
            if (this.nomatchDisabled[index]) {
              return result
            }
            return this.checkVoice(this.scriptForm.nomatch[index]) && result
          }, true)
          if (this.scriptForm.intention.value) {
            checkIntention = this.checkVoice(this.scriptForm.intention)
          }
          if (this.scriptForm.session.value) {
            checkSession = this.checkVoice(this.scriptForm.session)
          }
        }
        return checkFormState && checkNoinput && checkNomatch && checkIntention && checkSession
      }
      if (name === 'ivrnodeForm') {
        if (this.voiceEnable) {
          return (this.checkVoice(this.ivrnodeForm, '请选择语音文件') && checkFormState)
        } else {
          return checkFormState
        }
        // return !this.voiceEnable || (this.checkVoice(this.ivrnodeForm, '请选择语音文件') && checkFormState)
      }
    },
    handleCopy () {
      if (this.rootEmpty) {
        messageTip.$error({ content: this.messageDispaly.rootEmptyCopy })
        return false
      }
      this.type = this.treeHandler['COPY']
      this.copySource = this.ivrnodeForm.id
    },
    handleTree (type) {
      this.type = type
      this.rootEdited = true
      if (type === this.treeHandler['PASTE']) {
        const {
          instructManual
        } = getProps(tree.getNode(this.ivrnodeForm.id).data)
        if (instructManual) {
          messageTip.$error({
            content: this.messageDispaly.manualCopy
          })
          return
        }
        tree[type](this.ivrnodeForm.id, this.copySource)
      } else {
        tree[type](this.ivrnodeForm)
      }
      this.treeData = [tree.treeData]
      this.closeIvrnodeModal()
    },
    saveIvrnode () {
      if (this.checkForm('ivrnodeForm')) {
        const preCluster = this.clustersList
        this.$store.commit({
          type: 'AICall/loadClusters',
          state: uniqBy(preCluster.concat(this.matchList), 'id')
        })
        this.handleTree(this.type)
      }
    },
    removeNode () {
      const self = this
      const nodeType = getProps(tree.getNode(this.ivrnodeForm.id).data).type

      if (nodeType === 'root') {
        messageTip.$error({ content: this.messageDispaly.rootRemove })
        return false
      }
      messageBox.$warning({
        title: '删除提示',
        content: this.messageDispaly.removeNode,
        successCallback () {
          self.handleTree(self.treeHandler['REMOVE'])
        }
      })
    },
    mainprocessTip () {
      const self = this
      let parent = null
      const {
        type,
        default: mainprocess
      } = getProps(this.targetNode.data)

      // 判断
      if (this.type === this.treeHandler['ADD']) {
        parent = this.targetNode.data
      }
      if (this.type === this.treeHandler['EDIT']) {
        if (type === 'root') {
          self.ivrnodeForm.default = !self.ivrnodeForm.default
          return
        }
        parent = this.targetNode.parent.data
      }
      if (!mainprocess && checkOnlyAttr(parent, 'default')) {
        messageBox.$warning({
          title: '变更提示',
          content: this.messageDispaly.changeMainProcess,
          successCallback () {
            self.ivrnodeForm.default = true
            messageTip.$success({
              content: '设置成功'
            })
          }
        })
      } else {
        self.ivrnodeForm.default = !self.ivrnodeForm.default
      }
    },
    handleContextMenu ($event, nodeData) {
      const $contextmenu = this.$refs.contextmenu
      const $ivrnodeBox = $event.target
      $contextmenu.show(contextmenuPos($event, $ivrnodeBox))
      this.ivrnodeForm.id = nodeData.id
    },
    * getAudioIds (data, type) {
      switch (type) {
        case 0:
          for (const item of [...data]) {
            if (item.children) {
              yield * this.getAudioIds(item.children, type)
            }
            // eslint-disable-next-line
            yield item.prompt[0].tts[0]?.attr?.audio_id?.value || item.prompt[0].audio[0].attr.audio_id.value
          }
          break
        case 1:
          for (const item of [...data]) {
            yield item.audio.audio_id
          }
          break
      }
    },
    saveForm () {
      this.scriptFormLoading = true
      const self = this
      const treeErrorFlag = tree.checkTree(this.clustersList)
      const flag = this.checkForm('scriptForm') && !this.rootEmpty && (treeErrorFlag === 0)
      console.log(treeErrorFlag)
      if (flag) {
        const treeXml = calcTreeXML(self.scriptForm, self.treeData, {
          clustersMap: self.clustersMap,
          clustersList: self.clustersList,
          labelsList: self.labelsOptions,
          fieldsList: self.fieldsList
        })
        this.treeXml = treeXml
        console.log(treeXml)
        let audioIds = []
        if (this.voiceEnable) {
          audioIds = [...this.getAudioIds(this.treeData, 0), ...this.getAudioIds(this.scriptForm.noinput, 1), ...this.getAudioIds(this.scriptForm.nomatch, 1)]
          console.log(audioIds)
          if (audioIds.some(id => !id)) {
            this.$messageTip.$error({
              content: '请上传完整语音'
            })
            this.scriptFormLoading = false
            return
          }
        }

        const opts = {
          title: self.scriptForm.title,
          script: encodeURI(treeXml),
          audio_ids: audioIds,
          tts_flag: self.scriptForm.tts
        }
        let { limit, page } = self.$route.meta.query
        if (this.scriptId !== 'new') {
          opts.id = this.scriptId
        } else {
          page = 1
        }
        // setTimeout(() => {
        self.saveScripts(opts).then(res => {
          if (res.status === 0) {
            self.saveScriptsCache({
              id: self.scriptId,
              tts: self.scriptForm.tts,
              content: null
            })
            messageTip.$success({
              content: '保存成功',
              callback () {
                self.$router.push({ name: 'AICall-talk-script', query: { limit, page } })
              }
            })
          }
          self.scriptFormLoading = false
        })
        // }, 10)
      } else {
        this.scriptFormLoading = false
      }
    },
    async getScript (id) {
      const script = new ScriptTree(id)
      const treeData = await script.getScriptTree()
      console.log(script)

      // console.log(treeData)
      this.rootEdited = true
      this.scriptForm.title = script.title
      this.scriptForm.tts = script.tts
      this.getCatch(script.tree.catch)
      this.getIntentionType(script.tree['intention-type'])
      this.getGlobal(script.tree['global-keyword'])
      tree.initData(treeData[0])
      this.treeData = treeData
      tree.checkTree(this.scriptContent.scriptData.clusters)
      this.fullLoading.close()
    }
  },
  async mounted () {
    this.setTreeCenter()
    if (!this.newScript) {
      this.fullLoading = this.$loading({
        lock: true,
        background: 'rgba(180, 188, 205, 0.35)'
      })
      this.getScript(this.scriptId)
    }
  },
  destroyed () {
    // this.fullLoading.close()
    tree.resetData()
    this.treeData = [tree.treeData]
  }
}
</script>
<style lang="scss">
@import '~@/assets/css/widget/tree.scss';
@import '~@/assets/css/widget/contextmenu.scss';
@import '~@/assets/css/views/script.scss';
</style>
