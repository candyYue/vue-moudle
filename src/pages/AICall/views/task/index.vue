/* eslint-disable */
<template>
  <div class="task">
    <div>
      <div style="width: 100%">
        <div class="table-search">
          <el-form :inline="true" :model="formInline" class="demo-form-inline">
            <el-row :gutter="32">
              <el-col :xs="12" :sm="12" :md="9" :lg="6" :xl="4">
                <el-form-item label="任务名称" class="flex-item">
                  <el-input v-model.trim="formInline.task_name" placeholder="请输入任务名称"  maxlength='20'></el-input>
                </el-form-item>
              </el-col>
              <el-col :xs="12" :sm="12" :md="9" :lg="6" :xl="4">
                <el-form-item label="话术名称" class="flex-item">
                  <!-- <el-select v-model="formInline.script_id" placeholder="请输入话术名称" filterable clearable popper-class="select-width176">
                    <el-option :label="item.title" :value="item.id" v-for="(item, index) in scriptList" :key="index" :title="item.title"></el-option>
                  </el-select> -->
                  <LazyLoadSelect
                    popper-class="select-width176"
                    v-model="formInline.script_id"
                    placeholder="请选择话术名称"
                    listKey = "scripts"
                    :defalut-opt="defaultScript"
                    :loadList = "loadScripts"
                  >
                  </LazyLoadSelect>
                </el-form-item>
              </el-col>
              <el-col :xs="24" :sm="24" :md="24" :lg="12" :xl="16">
                <div class="flex-item">
                  <el-form-item label="创建时间" class="narrow flex-item">
                    <el-date-picker
                      v-model="formInline.time.beginTime"
                      type="date"
                      :picker-options="pickerBeginDateBefore"
                      format="yyyy-MM-dd"
                      value-format="timestamp"
                      placeholder="开始时间"
                      />
                  </el-form-item>
                  <el-form-item label="至" class="flex-item">
                    <el-date-picker
                      v-model="formInline.time.endTime"
                      type="date"
                      :picker-options="pickerBeginDateAfter"
                      format="yyyy-MM-dd"
                      value-format="timestamp"
                      placeholder="结束时间"
                      />
                  </el-form-item>
                  <el-button type="primary" @click="onSearch" class="search">搜索</el-button>
                </div>
              </el-col>
            </el-row>
          </el-form>
        </div>
        <hr class="horizontal-line">
        <div class="overflow-hidden creat-task">
          <el-select v-model="currentstatus" @change='changecurrentstatus'>
            <el-option  :label="item.label" :value="item.value" v-for="(item, index) in taskCategory" :key="index" ></el-option>
          </el-select>
          <div class="float-right">
            <el-button @click="creatTask(1,'ruleForm')" type="primary" icon="el-icon-plus" >创建任务</el-button>
            <el-button @click='deletetask' icon="el-icon-close" class="delete-task btn-error" type="info">批量删除</el-button>
          </div>
        </div>
        <el-table
          :data="taskList"
          ref="multipleTable"
          @selection-change="handleSelectionChange">
          <el-table-column
            type="selection"
            width="45"/>
          <el-table-column
          label="序号"
          width="70"
          align="center">
            <template slot-scope="scope">
                <span>{{(currentpage-1)*currentlimit+(scope.$index+1)}}</span>
            </template>
          </el-table-column>
          <el-table-column
            label="任务名称"
            prop="task_name"
            width="160"
            align="left">
          </el-table-column>
          <el-table-column
            label="话术名称"
            prop="script_title"
            width="160"
            align="left"/>
          <el-table-column
            prop="clue_count"
            label="客户数量"
            min-width="100"
            align="center"/>
          <el-table-column
            prop="create_time"
            label="创建时间"
            min-width='160'
            align="center">
            <template slot-scope="scope">
              <span>{{scope.row.create_time | formatTime}}</span>
            </template>
          </el-table-column>
          <el-table-column
            prop="start_time"
            label="实际开始时间"
            min-width='160'
            align="center">
            <template slot-scope="scope">
              <span>{{scope.row.start_time | formatTime}}</span>
            </template>
          </el-table-column>
          <el-table-column
            prop="end_time"
            label="结束时间"
            min-width='160'
            align="center">
            <template slot-scope="scope">
              <span>{{scope.row.end_time  | formatTime}}</span>
            </template>
          </el-table-column>
          <el-table-column
            label="任务状态"
            min-width="80"
            align="center">
            <template slot-scope="scope">
                <span v-if="scope.row.status=== 0 || scope.row.status === -1 || scope.row.status === 8" class="info">未开始</span>
                <span v-if="scope.row.status=== 1" class="primary">进行中</span>
                <span v-if="scope.row.status=== 2" class="success">已完成</span>
                <span v-if="scope.row.status=== 3 || scope.row.status === 5 || scope.row.status === 6" class="warning">已暂停</span>
                <span v-if="scope.row.status=== 7" class="waiting">待开始</span>
            </template>
          </el-table-column>
          <el-table-column
            fixed='right'
            label="操作"
            width="186"
            align="center"
            class-name="visible-cell multiple-actions">
            <template slot-scope="scope">
              <el-button type="text" icon="el-icon-edit" @click="handleAction('edit',scope.row)" v-tool-tip="'编辑'" :disabled='scope.row.status===1||scope.row.status===2||scope.row.status===6||scope.row.status===7'></el-button>
              <el-button type="text" icon="el-icon-pause" @click="handleAction('pause',scope.row)" v-tool-tip="'暂停'" :disabled='scope.row.status!==1 && scope.row.status!==7'></el-button>
              <el-button type="text" icon="el-icon-play" @click="handleAction('start',scope.row)" v-tool-tip="'开始'" :disabled='scope.row.status===1||scope.row.status===2||scope.row.status===4||scope.row.status===7'></el-button>
              <el-button type="text" icon="el-icon-show" @click="handleAction('show',scope.row)" v-tool-tip="'任务详情'" :disabled='scope.row.status===-1||scope.row.status===4'></el-button>
              <el-button type="text" icon="el-icon-download" @click="handleAction('download',scope.row)" v-tool-tip="'导出任务详情'" :disabled='scope.row.status===-1||scope.row.status===4'></el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </div>

    <el-pagination
      v-if="taskList&&taskList.length>0"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page='currentpage'
      :page-size="currentlimit"
      popper-class="pagination-width"
      background
      :page-sizes="[10, 20, 50, 100]"
      layout="total, sizes,slot,prev, pager, next"
      :total="taskListTotal">
        <span class="unit">条</span>
    </el-pagination>
    <!-- 创建任务 -->
    <Modal
    :title="taskTitle"
    v-model="taskModal"
    v-on:cancel="cancel"
    :loading="taskloading"
    draggable
    v-on:comfirm="submitForm('ruleForm')">
      <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="131px" class="demo-ruleForm" >
        <el-form-item label="任务名称" prop="task_name" required>
        <el-input v-model.trim="ruleForm.task_name" :maxlength='SystemConfigs.task_title_length_limit' placeholder="请输入任务名称" style='width:300px'></el-input>
      </el-form-item>
      <el-form-item label="话术选择" prop="script_id" required>
        <LazyLoadSelect
          popper-class="select-width300"
          style='width:300px'
          v-model="ruleForm.script_id"
          placeholder="请选择话术"
          listKey = "scripts"
          :defalut-opt="defaultTaskBindScript"
          :loadList = "loadScripts"
          ref='bindScriptName'
        >
        </LazyLoadSelect>
        <!-- <el-select v-model="ruleForm.script_id" placeholder="请选择话术" style='width:300px' filterable popper-class="select-width300">
          <el-option :label="item.title" :value="item.id" v-for="(item, index) in scriptList" :key="index" :title="item.title"></el-option>
        </el-select> -->
      </el-form-item>
      <el-form-item label="客户导入" prop="customer_file" class="customer-file">
        <Tooltip content="请按照数据模板的要求准备要导入的数据。导入文件格式为csv"></Tooltip>
        <label for="input"  class="upload">
          <i class="el-icon-circle-plus-import"></i>
          <input id="input" ref="customer_file"  style="display:none" class="change" type="file" name="customer_file" @change.stop="savefile" accept=".csv"/>
          选取文件
        </label>
        <a :href="api.AICall.tmpCustoms" class="temp-download"><i class="el-icon-downloadtemp"></i>模板下载</a>
        <p v-if='filename' class="file-tip info-text" >已选择：{{filename}}</p>
        <p v-else class="file-tip error-text">{{fileerror}}</p>
      </el-form-item>
      <el-form-item label="外呼机器人数" prop="ai_count" required>
        <el-select v-model="ruleForm.ai_count" placeholder="请选择机器人数量" style='width:300px'>
          <el-option v-for="(item,index) in ai_countOptions" :key="index" :label="item.label" :value="item.value"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="非任务时间段" prop="pause_time" class="pause-time">
        <div style='width:300px'>
          <el-time-picker
            popper-class='picker136'
            v-model="ruleForm.pause_time.start"
            format='HH:mm'
            value-format='HH:mm'
            :picker-options="{
              selectableRange: selectablePause_time
            }"
            placeholder="开始时间">
          </el-time-picker>
          <span class="until">至</span>
          <el-time-picker
            popper-class='picker136'
            v-model="ruleForm.pause_time.end"
            format='HH:mm'
            :picker-options="{
              selectableRange: selectablePause_time
            }"
            value-format='HH:mm'
            placeholder="结束时间"
            @change='pauseEndtime'>
          </el-time-picker>
        </div>
      </el-form-item>
      <el-form-item label="预约任务" prop="schedule_start_time">
        <el-date-picker
          popper-class='picker322'
          style='width:300px'
          format='yyyy-MM-dd HH:mm'
          value-format='timestamp'
          v-model="ruleForm.schedule_start_time"
          type="datetime"
          :default-time='defaultScheduled'
          :picker-options="pickerOption"
          placeholder="请选择任务自动开始时间"
          @focus="changeScheduled">
        </el-date-picker>
      </el-form-item>
      <el-form-item label="外呼号码" prop="call_number">
        <ul class="call_number">
          <li v-for="(item,index) in call_number" :key="index"
            :class="{ 'active-number': ruleForm.call_number.includes(`${item.area_code}${item.outside_callnumber}`) }"
            @click='chooseCallnumber(item,index)'>
            {{item.area_code}}{{item.outside_callnumber}}
          </li>
        </ul>
      </el-form-item>
      </el-form>
    </Modal>
    <!-- 导入 -->
    <Modal
    :title="taskTitle"
    v-model="importModal"
    v-on:cancel="cancelimportModal"
    :showFooter='false'>
    <div class="importbox">
      <el-progress :percentage="percentage" :stroke-width="10" :status="progressstatus"></el-progress>
      <p v-if="percentage!==100">正在导入客户数据...</p>
      <p v-if="percentage===100">导入完成，共<span> {{progresstotal}} </span>条，导入成功<span class="success-text"> {{progresssuccess}} </span>条，导入失败<span class="error-text"> {{progresserror}} </span>条。
        <br><span v-if="progresserror"><a :href="`${api.AICall.getImportReport}?hash=${importhash}`">下载错误报告，</a>查看失败原因。</span>
      </p>
    </div>
    </Modal>
  </div>
</template>

<script>
import Tooltip from '@/components/feedback/Tooltip'
import { mapActions, mapGetters } from 'vuex'
import Modal from '@/components/feedback/Modal'
import { messageBox, messageTip } from '@/components/feedback/Message'
import api from '@/service/api'
import { CompareDate } from '@/utils/helper/assist'
import { xmlValidator } from '@/utils/rules'
export default {
  data () {
    var validatescriptId = (rule, value, callback) => {
      // console.log(this.defaultTaskBindScript)
      if (!this.defaultTaskBindScript.length) {
        callback(new Error('请先在话术管理模块创建一个话术'))
      } else {
        if (!value) {
          callback(new Error('请选择话术模板'))
        }
        callback()
      }
    }
    var validateaiCount = (rule, value, callback) => {
      if (!this.EpInfo.account_num) {
        callback(new Error('当前无机器人'))
      } else {
        if (!value) {
          callback(new Error('请选择机器人数量'))
        }
        callback()
      }
    }
    var validateaiPausetime = (rule, value, callback) => {
      if (!value.start && value.end) {
        callback(new Error('请选择开始时间'))
      }
      if (!value.end && value.start) {
        callback(new Error('请选择结束时间'))
      }
      if (value.start && value.end) {
        const start = new Date().setHours(value.start.split(':')[0], value.start.split(':')[1])
        const end = new Date().setHours(value.end.split(':')[0], value.end.split(':')[1])
        if (end < start) {
          callback(new Error('结束时间不能早于开始时间'))
        }
        callback()
      }
      callback()
    }
    var validateaiScheduledtime = (rule, value, callback) => {
      if (value && this.ruleForm.pause_time.start && this.ruleForm.pause_time.end) {
        let HH = new Date(value).getHours()
        let MM = new Date(value).getMinutes()
        if (HH < 10) { HH = `0${HH}` };
        if (MM < 10) { MM = `0${MM}` };
        const Scheduledtime = new Date().setHours(HH, MM)
        const pausestart = new Date().setHours(this.ruleForm.pause_time.start.split(':')[0], this.ruleForm.pause_time.start.split(':')[1])
        const pauseend = new Date().setHours(this.ruleForm.pause_time.end.split(':')[0], this.ruleForm.pause_time.end.split(':')[1])
        if (pausestart < Scheduledtime && Scheduledtime < pauseend) {
          callback(new Error('请选择非外呼时间段外的时间'))
        } else {
          callback()
        }
      } else {
        callback()
      }
    }
    return {
      api,
      pickerBeginDateBefore: {
        disabledDate: (time) => {
          let beginDateVal = this.formInline.time.endTime
          if (beginDateVal) {
            return time.getTime() > beginDateVal
          } else {
            return time.getTime() > Date.now()
          }
        }
      },
      pickerBeginDateAfter: {
        disabledDate: (time) => {
          let beginDateVal = this.formInline.time.beginTime
          if (beginDateVal) {
            return time.getTime() < beginDateVal || time.getTime() > Date.now()
          } else {
            return time.getTime() > Date.now()
          }
        }
      },
      pickerOption: {
        disabledDate (time) {
          return time.getTime() < Date.now() - 60 * 60 * 24 * 1000
        },
        selectableRange: '09:30-15:30'
      },
      taskTitle: '创建任务',
      taskloading: false,
      formInline: {
        task_name: this.$route.query.task_name || '',
        script_id: +this.$route.query.script_id || '',
        time: {
          beginTime: this.$route.query.start_time * 1000 || '',
          endTime: this.$route.query.end_time * 1000 || ''
        }
      },
      taskCategory: [
        { value: '', label: '全部' },
        { value: 0, label: '未开始' }, // 0,-1
        { value: 7, label: '待开始' },
        { value: 1, label: '进行中' },
        { value: 3, label: '已暂停' }, // 3,5,6
        { value: 2, label: '已完成' }
      ],

      taskModal: false,
      ruleForm: {
        task_name: '',
        script_id: '',
        customer_file: null,
        ai_count: '',
        pause_time: {
          start: '',
          end: ''
        },
        schedule_start_time: '',
        call_number: []
      },
      rules: {
        task_name: [{ required: true, message: '请输入任务名称' }, xmlValidator],
        script_id: [{ validator: validatescriptId, trigger: 'change' }],
        customer_file: [{ required: true, message: '请导入客户表格' }],
        ai_count: [
          { validator: validateaiCount, trigger: 'change' }
        ],
        pause_time: [
          { validator: validateaiPausetime, trigger: 'change' }
        ],
        schedule_start_time: [
          { validator: validateaiScheduledtime, trigger: 'change' }
        ]

      },
      importModal: false,
      time: null,
      progressstatus: null,
      importhash: null,
      percentage: 0,
      progresstotal: 0,
      progresssuccess: 0,
      progresserror: 0,
      ai_countOptions: [],
      currentstatus: this.$route.query.status === undefined ? '' : +this.$route.query.status,
      currentpage: +this.$route.query.page || 1,
      // currentlimit: +this.$route.query.limit || 10,
      pageKey: 'task',
      filename: '',
      fileerror: '',
      multipleSelection: [],
      defaultScript: [],
      defaultTaskBindScript: [],
      taskShowing: true
    }
  },
  components: {
    Modal,
    Tooltip
  },
  computed: {
    ...mapGetters({
      taskList: 'AICall/taskList',
      taskListTotal: 'AICall/taskListTotal',
      scriptList: 'AICall/scriptList',
      free: 'AICall/free',
      EpInfo: 'AICall/EpInfo',
      limitMap: 'limitMap',
      call_number: 'AICall/call_number',
      SystemConfigs: 'AICall/SystemConfigs'
    }),
    selectablePause_time () {
      return `${this.EpInfo.daily_start_time}-${this.EpInfo.daily_end_time}`
    },
    currentlimit () {
      return this.limitMap[this.pageKey] || 10
    },
    defaultScheduled () {
      return this.EpInfo.daily_start_time
    },
    opts () {
      const opts = {
        limit: this.currentlimit,
        page: this.currentpage,
        status: this.currentstatus,
        task_name: this.formInline.task_name,
        script_id: this.formInline.script_id,
        start_time: this.formInline.time.beginTime,
        end_time: this.formInline.time.endTime
      }
      for (var o in opts) {
        if (opts[o] === '' || opts[o] === undefined || opts[o] === null) {
          delete opts[o]
        }
      }
      return opts
    }
  },
  watch: {
    '$route': 'handlePage'
  },
  methods: {
    ...mapActions({
      getTasks: 'AICall/getTasks',
      getScripts: 'AICall/getScripts',
      getfree: 'AICall/getfree',
      saveTask: 'AICall/saveTask',
      importAITask: 'AICall/importAITask',
      controlTask: 'AICall/controlTask',
      deleteTasks: 'AICall/deleteTasks',
      taskClues: 'AICall/taskClues',
      changeLimit: 'changeLimit',
      getCallNumbers: 'AICall/getCallNumbers',
      loadScripts: 'AICall/loadScripts',
      scriptItem: 'AICall/scriptItem'
    }),

    handlePage () {
      const page = +this.$route.query.page || 1
      // const limit = +this.$route.query.limit || 10
      const limit = +this.$route.query.limit || this.currentlimit
      const status = this.$route.query.status === '' || this.$route.query.status === undefined ? '' : +this.$route.query.status
      const taskName = this.$route.query.task_name || ''
      const scriptId = +this.$route.query.script_id || ''
      const startTime = +this.$route.query.start_time || ''
      const endTime = +this.$route.query.end_time || ''
      // this.currentlimit = limit
      this.currentpage = page
      this.currentstatus = status
      this.formInline.task_name = taskName
      this.formInline.script_id = scriptId
      this.formInline.time.beginTime = startTime
      this.formInline.time.endTime = endTime
      this.changeLimit({
        key: this.pageKey,
        // limit: this.currentlimit
        limit
      })
      const opts = {
        page,
        status,
        task_name: taskName,
        // limit: this.currentlimit,
        limit,
        script_id: scriptId,
        start_time: startTime ? startTime / 1000 : '',
        end_time: endTime ? endTime / 1000 + 60 * 60 * 24 - 1 : ''
      }
      for (var o in opts) {
        if (opts[o] === '' || opts[o] === undefined || opts[o] === null) {
          delete opts[o]
        }
      }
      this.getTasks(opts)
    },
    // 搜一搜
    onSearch () {
      this.currentpage = 1
      this.$router.push({ name: 'AICall-task', query: this.opts })
    },
    // 翻页
    handleCurrentChange (val = 1) {
      this.currentpage = val
      this.$router.push({ name: 'AICall-task', query: this.opts })
    },
    handleSizeChange (limit) {
      this.changeLimit({
        key: this.pageKey,
        limit
      })
      // this.currentlimit = val
      this.onSearch()
    },
    changecurrentstatus (val) {
      this.currentstatus = val
      this.onSearch()
    },
    toggleSelection (rows) {
      if (rows) {
        rows.forEach(row => {
          this.$refs.multipleTable.toggleRowSelection(row)
        })
      } else {
        this.$refs.multipleTable.clearSelection()
      }
    },
    // 多选框
    handleSelectionChange (val) {
      this.multipleSelection = val
    },
    async deletetask () {
      if (this.multipleSelection.length === 0) {
        messageTip.$warning({
          content: '请您选择需要删除的任务。'
        })
        return false
      }
      var taskidList = this.multipleSelection.map(v => v.id)
      const self = this
      messageBox.$error({
        title: '删除提示',
        content: '您确定要删除该任务吗？',
        successCallback () {
          self.deleteTasks({
            task_ids: taskidList
          }).then(res => {
            if (res.status === 0) {
              if (self.taskList.length === taskidList.length && self.currentpage > 1) {
                self.handleCurrentChange(self.currentpage - 1)
              } else {
                self.handlePage()
              }
              messageTip.$success({
                content: '删除成功！'
              })
            }
          })
        }
      })
      // 删除前更新任务列表
      // await this.handlePage()
      // if (this.multipleSelection.length === 1 && this.multipleSelection[0].status === 1) {
      //   messageTip.$warning({
      //     content: '您需要先暂停任务，再进行删除。'
      //   })
      //   return false
      // }
      // // 进行中&&暂停中
      // const taskidstatus = this.multipleSelection.filter(v => v.status === 1).length
      // if (taskidstatus) {
      //   messageTip.$warning({
      //     content: '您的选择包含进行中的任务，请选择非进行中的任务再进行删除。'
      //   })
      //   return false
      // } else {

      // }
    },
    changeScheduled () {
      this.$nextTick(_ => {
        const cancelBtn = document.querySelectorAll('.el-picker-panel__link-btn')[0]
        cancelBtn.addEventListener('click', (e) => {
          this.ruleForm.schedule_start_time = ''
        })
      })
    },
    // 创建弹框
    async creatTask (type, formName, row) {
      const taskCountLimit = this.SystemConfigs.task_count_limit
      if (this.taskListTotal >= taskCountLimit) {
        messageTip.$warning({
          content: '您的任务数量已达上限，无法继续创建'
        })
        return false
      }
      this.$refs[formName].clearValidate()
      this.$refs[formName].resetFields()
      this.filename = ''
      this.fileerror = ''
      this.$refs.customer_file.value = ''
      // 1新建2编辑
      this.taskModal = true
      if (type === 1) {
        this.taskTitle = '创建任务'
        const firstData = await this.loadScripts({ page: 1, limit: 1 })
        this.defaultTaskBindScript = firstData.count ? [firstData] : []
        this.rules.customer_file = [{ required: true, message: '请导入客户表格' }]
      } else {
        this.taskTitle = '编辑任务'
        this.rules.customer_file = [{ required: false }]
        // eslint-disable-next-line
        const {id, task_name, script_id, ai_count,call_number} = row
        let scheduledStartTime
        scheduledStartTime = row.scheduled_start_time ? row.scheduled_start_time * 1000 : ''
        const pauseTime = {
          start: row.pause_start_time,
          end: row.pause_end_time
        }
        this.scriptItem(row.script_id).then(async (_) => {
          this.defaultTaskBindScript = [ _.data ]
          if (this.defaultTaskBindScript[0] === '') {
            const firstData = await this.loadScripts({ page: 1, limit: 1 })
            this.defaultTaskBindScript = firstData.count ? [firstData] : []
            this.ruleForm = { ...this.ruleForm, ...{ id, task_name, ai_count, script_id: '', schedule_start_time: scheduledStartTime, call_number, pause_time: pauseTime } }
            this.$refs.ruleForm.validateField('script_id')
          } else {
            this.ruleForm = { ...this.ruleForm, ...row, schedule_start_time: scheduledStartTime, call_number, pause_time: pauseTime }
          }
        })
      }
      await this.getCallNumbers()
      if (parseInt(this.EpInfo.account_num)) {
        this.ai_countOptions = []
        for (var i = 1; i <= parseInt(this.EpInfo.account_num); i++) {
          this.ai_countOptions.push({ value: i, label: i })
        }
      }
      // this.taskModal = true
      this.taskloading = false
    },
    pauseEndtime (val) {
      this.$refs.ruleForm.validateField('pause_time')
    },
    cancel () {
      this.taskModal = false
    },
    getTasksAction () {
      this.handlePage()
      messageTip.$success({
        content: '操作成功！'
      })
    },
    async handleAction (type, row) {
      // 任务状态 0:未开始,1：正在进行,2:已完成,3:暂停,4:已取消,
      // 5:暂停(每天定时暂停)，6：暂停(界面显示暂停，事实上在暂停中)，7：等待运行，-1：未开始（任务还没有创建完成）,8：定时任务

      const self = this
      // 暂停
      if (type === 'pause') {
        messageBox.$warning({
          title: '暂停提示',
          content: '您确定要暂停该任务吗？',
          successCallback () {
            self.controlTask({
              task_id: row.id,
              operate: type
            }).then(res => {
              if (res.status === 0) {
                messageTip.$success({
                  content: '任务已暂停！'
                })
                self.handlePage()
              }
            })
          }
        })
      }
      // 开始
      if (type === 'start') {
        if (!CompareDate(this.EpInfo.daily_start_time, this.EpInfo.daily_end_time)) {
          messageTip.$warning({
            content: '现在是非外呼时间段，机器人无法进行外呼任务'
          })
          return false
        } else {
          await this.getfree()
          if (this.free === 0) {
            messageBox.$warning({
              comfirmText: '继续执行',
              title: '任务提示',
              content: `当前没有空闲的机器人可以执行任务，如需${row.ai_count}个执行任务，请先暂停或修改其他任务。点击继续，机器人将在空闲时自动加入任务。`,
              successCallback () {
                self.controlTask({
                  task_id: row.id,
                  operate: type
                }).then(res => {
                  if (res.status === 0) {
                    self.getTasksAction()
                  }
                })
              }
            })
            return false
          } else if (row.ai_count > this.free && row.clue_count > this.free) {
            messageBox.$warning({
              comfirmText: '继续执行',
              title: '任务提示',
              content: `当前只有${this.free}个空闲外呼机器人可以执行任务，如需${row.ai_count}个执行任务，请先暂停或修改其他任务。点击继续，将以${this.free}个机器人执行任务，待余下的机器人空闲时自动加入任务。`,
              successCallback () {
                self.controlTask({
                  task_id: row.id,
                  operate: type,
                  ai_count: self.free
                }).then(res => {
                  if (res.status === 0) {
                    self.getTasksAction()
                  }
                })
              }
            })
            return false
          } else if (row.ai_count < this.free && row.clue_count > row.ai_count) {
            messageBox.$warning({
              comfirmText: '快速呼出',
              cancelText: '普通呼出',
              title: '任务提示',
              content: `当前空闲机器人数为${this.free}个，可以全部执行任务，进行快速呼出，提高任务效率。`,
              successCallback () {
                self.controlTask({
                  task_id: row.id,
                  operate: type,
                  ai_count: self.free
                }).then(res => {
                  if (res.status === 0) {
                    self.getTasksAction()
                  }
                })
              },
              cancelCallback () {
                self.controlTask({
                  task_id: row.id,
                  operate: type
                }).then(res => {
                  if (res.status === 0) {
                    self.getTasksAction()
                  }
                })
              }
            })
            return false
          } else {
            this.controlTask({
              task_id: row.id,
              operate: type
            }).then(res => {
              if (res.status === 0) {
                self.getTasksAction()
              }
            })
          }
        }
      }
      if (type === 'edit') {
        if (row.status === 1) {
          messageTip.$warning({
            content: '您的任务需要先暂停，再进行编辑'
          })
        } else {
          this.creatTask(2, 'ruleForm', row)
        }
      }
      if (type === 'show') {
        this.$router.push({ name: 'AICall-task-id', params: { id: row.id } })
      }
      if (type === 'download') {
        window.location.href = `${api.AICall.taskClues}?task_id=${row.id}&export=1`
      }
    },
    savefile (e) {
      if (e.target.files[0].name.slice(-4) !== '.csv') {
        this.fileerror = `请选择csv格式的文件`
        this.filename = ''
        return
      }
      this.filename = e.target.files[0].name
      this.ruleForm.customer_file = e.target.files[0]
      this.$refs.ruleForm.validateField('customer_file')
    },
    submitForm (formtitle) {
      this.$refs[formtitle].validate(valid => {
        if (valid) {
          this.taskloading = true
          const formData = new FormData()
          if (this.taskTitle === '编辑任务') {
            formData.append('id', this.ruleForm.id)
          }
          formData.append('task_name', this.ruleForm.task_name)
          formData.append('script_id', this.ruleForm.script_id)
          // eslint-disable-next-line
          const script_title = this.$refs.bindScriptName.list.filter(v => {
            return v.id === this.ruleForm.script_id
          })
          formData.append('script_title', script_title[0].title)
          formData.append('customer_file', this.ruleForm.customer_file)
          formData.append('ai_count', this.ruleForm.ai_count)
          if (this.ruleForm.pause_time.start && this.ruleForm.pause_time.end) {
            formData.append('pause_start_time', this.ruleForm.pause_time.start)
            formData.append('pause_end_time', this.ruleForm.pause_time.end)
          }
          if (this.ruleForm.schedule_start_time) {
            formData.append('schedule_start_time', this.ruleForm.schedule_start_time / 1000)
          }
          if (this.ruleForm.call_number.length) {
            this.ruleForm.call_number.map(v => {
              formData.append('call_number[]', v)
            })
          }
          const request = new XMLHttpRequest()
          request.open('POST', api.AICall.setTask, true)
          request.send(formData)
          request.onreadystatechange = () => {
            if (request.readyState === 4) {
              if (request.status === 200) {
                let response = JSON.parse(request.response)
                if (response.status === 0) {
                  this.taskModal = false
                  if (this.taskTitle === '编辑任务' && !this.ruleForm.customer_file) {
                    this.handlePage()
                    messageTip.$success({
                      content: '修改成功！'
                    })
                  } else {
                    this.importModal = true
                    this.percentage = 0
                    this.progressstatus = null
                    const self = this
                    this.importhash = response.data.hash
                    this.time = setInterval(v => {
                      self.importAITask({ hash: this.importhash }).then(res => {
                        this.percentage = res.data.per

                        if (res.status === 0 && res.data.per === 100) {
                          this.progressstatus = 'success'
                          this.progresstotal = res.data.total
                          this.progresssuccess = res.data.total - res.data.error
                          this.progresserror = res.data.error
                          if (this.progresssuccess && !this.progresserror) {
                            setTimeout(() => {
                              this.importModal = false
                            }, 2000)
                          }
                          clearInterval(self.time)
                          this.currentpage = 1
                          self.handlePage()
                          this.taskloading = false
                        }
                      })
                    }, 2000)
                  }
                } else if (response.status === 103001) {
                  this.filename = ''
                  this.fileerror = response.info
                  this.taskloading = false
                } else if (response.status === 101018) {
                  messageTip.$warning({
                    content: response.info
                  })
                  this.taskloading = false
                } else {
                  messageTip.$error({
                    content: response.info
                  })
                  this.taskloading = false
                }
              }
            }
          }
        } else {
          return false
        }
      })
    },
    cancelimportModal () {
      this.importModal = false
      clearInterval(this.time)
    },
    chooseCallnumber (val, ind) {
      var index = this.ruleForm.call_number.indexOf(`${val.area_code}${val.outside_callnumber}`)
      if (index > -1) {
        this.ruleForm.call_number.splice(index, 1)
      } else {
        this.ruleForm.call_number.push(`${val.area_code}${val.outside_callnumber}`)
      }
    }
  },
  mounted () {
    // this.getScripts()
    this.handlePage()
    if (this.$route.query.script_id) {
      this.scriptItem(this.$route.query.script_id).then(_ => {
        this.defaultScript = [ _.data ]
      })
    }
  }
}
</script>
<style lang="scss">
@import '@/assets/css/views/task.scss';
.el-progress.is-success .el-progress-bar__inner{
  background-color: #52bbff;
}
</style>
<style lang="scss" scoped>
</style>
