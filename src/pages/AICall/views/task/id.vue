<template>
    <div class='task-id'>
      <div>
        <div style="width: 100%">
          <el-row class="statistics overflow-hidden">
            <el-col v-for="(item,index) in statistics" :key="index" :span="6" :class="['statistics-item',{'statistics-hidden': item.hidden}]">
              <div :class="['statistic-img','call-'+item.name]"></div>
              <div class="statistic-descr">
                <p>{{item.lable}}</p>
                <p>{{item.value}}</p>
              </div>
            </el-col>
          </el-row>
          <div class="clue-table">
            <div class="table-search">
              <el-form :inline="true" :model="formInline" label-position='left'>
                <el-row :gutter="32">
                  <el-col :xs="12" :sm="12" :md="8" :lg="6" :xl="4">
                      <el-form-item label="客户号码" class="flex-item">
                        <el-input v-model.trim="formInline.mobile" placeholder="请输入号码"  v-number-only></el-input>
                      </el-form-item>
                  </el-col>
                  <el-col :xs="12" :sm="12" :md="8" :lg="6" :xl="4">
                      <el-form-item label="话术名称" class="flex-item">
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
                  <el-col :xs="12" :sm="12" :md="8" :lg="6" :xl="4">
                      <el-form-item label="客户标签" class="flex-item">
                        <el-cascader
                          :disabled='formInline.call_status===0'
                          @focus='cascaderAction'
                          filterable
                          clearable
                          :show-all-levels="false"
                          :options="labelsOptions"
                          v-model="formInline.label"
                          placeholder="请选择标签">
                        </el-cascader>
                      </el-form-item>
                  </el-col>
                  <el-col :xs="12" :sm="12" :md="8" :lg="6" :xl="4">
                      <el-form-item label="联系进度" class="flex-item">
                        <el-select v-model="formInline.call_status" placeholder="请选择联系进度" filterable clearable>
                          <el-option :label="item.label" :value="item.value" v-for="(item, index) in call_status" :key="index" ></el-option>
                        </el-select>
                      </el-form-item>
                  </el-col>
                  <el-col :xs="12" :sm="12" :md="8" :lg="6" :xl="4">
                      <el-form-item label="联系结果" class="flex-item">
                        <el-select v-model="formInline.call_result" placeholder="请选择结果" filterable clearable :disabled='formInline.call_status===0'>
                          <el-option :label="item.label" :value="item.value" v-for="(item, index) in call_result" :key="index" ></el-option>
                        </el-select>
                      </el-form-item>
                  </el-col>
                  <el-col :xs="12" :sm="12" :md="8" :lg="6" :xl="4" v-show="callcenter">
                      <el-form-item label="转为人工坐席" class="flex-item">
                        <el-select v-model="formInline.manual_status" placeholder="请选择结果" filterable clearable :disabled='formInline.call_status===0'>
                          <el-option :label="item.label" :value="item.value" v-for="(item, index) in manual_status_list" :key="index"></el-option>
                        </el-select>
                      </el-form-item>
                  </el-col>
                  <el-col :sm="24" :lg="12" :xl="24">
                    <div class="search-date flex-item">
                      <el-form-item label="呼出时间" class="narrow flex-item">
                        <el-date-picker
                          :disabled='formInline.call_status===0'
                          v-model="formInline.time.beginTime"
                          type="date"
                          :picker-options="pickerBeginDateBefore"
                          format="yyyy-MM-dd"
                          value-format="timestamp"
                          placeholder="开始时间"
                          >
                        </el-date-picker>
                      </el-form-item>
                      <el-form-item label="至" class="flex-item">
                        <el-date-picker
                          :disabled='formInline.call_status===0'
                          v-model="formInline.time.endTime"
                          type="date"
                          :picker-options="pickerBeginDateAfter"
                          format="yyyy-MM-dd"
                          value-format="timestamp"
                          placeholder="结束时间"
                          >
                        </el-date-picker>
                      </el-form-item>
                    </div>
                  </el-col>
                </el-row>
                <div class="last-item">
                    <el-form-item label="客户意向性" class="intention flex-item">
                      <template slot="label">
                        客户意向性
                        <Tooltip class="intention-tooltip">
                          <dl v-for="(item,index) in intentionTips" :key="index" slot="tipContent">
                            <dt>{{item.type}}</dt>
                            <dd>{{item.note}}</dd>
                          </dl>
                        </Tooltip>
                      </template>
                      <el-checkbox :indeterminate="isIndeterminate" v-model="intentionAll" @change="handleCheckAllChange" :disabled='formInline.call_status===0'>全选</el-checkbox>
                      <el-checkbox-group v-model="formInline.intention" @change="handleCheckedIntentionChange">
                        <el-checkbox v-for="intention in intentions" :label="intention.label" :key="intention.label" :disabled='formInline.call_status===0'>{{intention.value}}</el-checkbox>
                      </el-checkbox-group>
                    </el-form-item>
                    <el-form-item label="通话时长" class="duration">
                      <el-checkbox-group v-model="formInline.duration">
                        <el-checkbox label="5-10" :disabled='formInline.call_status===0'>5-10秒</el-checkbox>
                        <el-checkbox label="30-60" :disabled='formInline.call_status===0'>30-60秒</el-checkbox>
                        <el-checkbox label="60-120" :disabled='formInline.call_status===0'>60-120秒</el-checkbox>
                        <el-checkbox label="120" :disabled='formInline.call_status===0'>超过120秒</el-checkbox>
                      </el-checkbox-group>
                      <el-button type="primary" @click="onSearch" class="search">搜索</el-button>
                    </el-form-item>
                </div>
              </el-form>
            </div>
            <hr class="horizontal-line">
            <div class="table_btn">
              <el-button type="primary" :icon="starticon" @click="taskstatusAction" :disabled="task_status===2" class="tasks-tatus">{{startBtn}}</el-button>
              <!-- <el-button icon="el-icon-play" @click="taskstatusAction('start')" :disabled="task_status===1||task_status===2||task_status===7" type="primary">{{startBtn}}</el-button> -->
              <div class="float-right">
                  <el-button type="primary" icon="el-icon-call" @click="reCallaction">重新呼叫</el-button>
                  <el-button icon="el-icon-close" @click='deleteClues' class='btn-error' type="info">批量删除</el-button>
                  <el-button icon="el-icon-export"  @click='exportAction(1)' type="info" ref="exportList">导出客戶列表</el-button>
                  <el-button icon="el-icon-exporttxt"  @click='exportAction(2)' type="info" ref="exportText" :disabled="formInline.call_status===0 || formInline.call_result===3">导出通话文本</el-button>
              </div>
            </div>
            <div class="table-clues">
              <el-table
                ref="cluesTable"
                :data="CluesList"
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
                  label="客户号码"
                  min-width="120"
                  prop="mobile"
                  align="center"/>
                <el-table-column
                  label="联系进度"
                  min-width="100"
                  prop="call_count"
                  align="center">
                  <template slot-scope="scope">
                      <span v-if="!scope.row.call_count">未联系</span>
                      <span v-if="scope.row.call_count>0">已联系</span>
                  </template>
                </el-table-column>
                <el-table-column
                  label="话术名称"
                  prop="script_name"
                  align="center"
                  min-width="110"/>
                <el-table-column
                  label="呼叫时间"
                  prop="call_time"
                  min-width='150'
                  align="center">
                  <template slot-scope="scope">
                    <span v-if="scope.row.call_count">{{scope.row.call_time | formatTime}}</span>
                  </template>
                </el-table-column>
                <el-table-column
                  label="通话时长"
                  prop="duration"
                  align="center">
                  <template slot-scope="scope">
                    <span v-if="scope.row.call_count">{{scope.row.duration | formatSecond}}</span>
                  </template>
                </el-table-column>
                <el-table-column
                  label="联系结果"
                  min-width='90'
                  prop="call_result"
                  align="center">
                  <template slot-scope="scope">
                    <span v-if="scope.row.call_count && scope.row.call_result===1">接听后挂掉</span>
                    <span v-if="scope.row.call_count && scope.row.call_result===2">通话成功</span>
                    <span v-if="scope.row.call_count && scope.row.call_result===3">未接听</span>
                    <span v-if="scope.row.call_count && scope.row.call_result===4">呼叫异常</span>
                  </template>
                </el-table-column>
                <el-table-column
                  label="转为人工坐席"
                  min-width='120'
                  prop="manual_status"
                  v-if="callcenter"
                  align="center">
                  <template slot-scope="scope">
                    <span v-if="scope.row.manual_status===1" class="error">转接失败</span>
                    <span v-if="scope.row.manual_status===2" class="success">转接成功</span>
                  </template>
                </el-table-column>
                <el-table-column
                  label="意向性"
                  prop="intention"
                  align="center">
                  <template slot-scope="scope">
                    <span v-if="scope.row.call_count">{{intentionValue(scope.row)}}</span>
                  </template>
                </el-table-column>
                <el-table-column
                  label="标签"
                  prop="label"
                  align="center">
                  <template slot-scope="scope">
                    <span v-if="scope.row.call_count">{{scope.row.label}}</span>
                  </template>
                </el-table-column>
                <el-table-column
                  :label="item"
                  prop="label"
                  min-width="100"
                  align="center"
                  v-for="(item, key ,index) in GlobalKeyword" :key="index">
                  <template slot-scope="scope">
                    <span>{{scope.row.match_global_keyword[key]}}</span>
                  </template>
                </el-table-column>
                <el-table-column
                  label="呼叫次数"
                  prop="call_count"
                  align="center">
                  <template slot-scope="scope">
                    <span v-if="scope.row.call_count">第{{scope.row.call_count}}次</span>
                  </template>
                </el-table-column>
                <el-table-column
                  label="操作"
                  fixed='right'
                  prop="action"
                  align="center"
                  class-name="visible-cell">
                  <template slot-scope="scope">
                    <el-button type="text" icon="el-icon-detail"
                    :disabled="!(scope.row.call_result===1||scope.row.call_result===2)"
                    @click="recordDetailAction(scope.row)" v-tool-tip="'通话详情'"></el-button>
                  </template>
                </el-table-column>
              </el-table>
            </div>
            <el-pagination
              v-if="taskCluesList && taskCluesList.length>0"
              @size-change="handleSizeChange"
              @current-change="handleCurrentChange"
              :current-page='currentpage'
              :page-size="currentlimit"
              background
              :page-sizes="[10, 20, 50, 100]"
              layout="total, sizes, prev, pager, next"
              :total="taskCluesListTotal">
            </el-pagination>
          </div>
        </div>
      </div>
      <recordDetail
        :cluedata='cluedata'
        :recordDetailShow='recordDetailShow'
        @closeRecordDetail="closeRecordDetail">
      </recordDetail>
    </div>
</template>

<script>
/* eslint-disable */
import Breadcrumb from '@/components/layout/Breadcrumb'
import recordDetail from '@/components/record/recordDetail'
import Tooltip from '@/components/feedback/Tooltip'
import {messageBox, messageTip} from '@/components/feedback/Message'
import { mapActions, mapGetters } from 'vuex'
import { formatSecond } from '@/utils/helper/filter'
import Loading from '@/components/feedback/Loading'
import Bus from '@/assets/js/bus.js';
import { numberOnly } from '@/utils/directives'
import { CompareDate } from '@/utils/helper/assist'
import api from '@/service/api'
const intentionOptions = [{label:1,value:"意向性A"},{label:2,value:"意向性B"},{label:3,value:"意向性C"},{label:4,value:"意向性D"},{label:5,value:"意向性E"}];
export default {
  data () {
    return {
      intentionTips:[
        {type:'A类高意向：', note:'四个或四个以上问题互动、主流程走完、通话时间2分钟以上。'},
        {type:'B类一般意向：', note:'一般意向：两个问题以上互动、通话时间1~2分钟、开场白下回在忙、发我短信、在开车、开会、晚点打过来 。'},
        {type:'C类低意向：', note:'一个问题互动、通话时长30s~60s、开场白+活动介绍听完后挂机的（2个节点挂机）。'},
        {type:'D类没意向：', note:'明确拒绝（不需要、不用）、不需要即挂机、总机传真。'},
        {type:'E类没意向：', note:'接通后没有声音直到挂机，通话中、无人接听。'},
        // {type:'F类未接听：',note:'空号、停机、说脏话'}
      ],
      pickerBeginDateBefore:{
        disabledDate:(time)=>{
          let beginDateVal = this.formInline.time.endTime;
          if(beginDateVal){
            return time.getTime()>beginDateVal
          }else{
            return time.getTime()>Date.now()
          }
        }
      },
      pickerBeginDateAfter:{
        disabledDate:(time)=>{
          let beginDateVal = this.formInline.time.beginTime;
          if(beginDateVal){
            return time.getTime()<beginDateVal||time.getTime()>Date.now()
          }else{
            return time.getTime()>Date.now()
          }
        }
      },
      task_id:parseInt(this.$route.params.id),
      clue_id:null,
      // task_status:'',
      //操作栏
      statistics:[
        {name:'progress',lable:'任务进度：',value:'',hidden:false},
        {name:'rate',lable:'接通率：',value:'',hidden:false},
        {name:'average',lable:'平均通话时长：',value:'',hidden:false},
        {name:'count',lable:'转人工次数：',value:'',hidden:true},
      ],
      //搜索
      formInline: {
        mobile: '',
        script_id: '',
        manual_status:'',
        // time: '',
        time:{
          beginTime:'',
          endTime:''
        },
        call_status:'',
        call_result:'',
        label:[],
        intention: [],
        duration:[]
      },
      intentionAll: false,
      intentions:intentionOptions,
      isIndeterminate: false,
      call_status: [
        { value: 0, label: '未联系' },
        { value: 1, label: '已联系' },
      ],
      call_result: [
        { value: 2, label: '通话成功' },
        { value: 3, label: '未接听' },
        { value: 1, label:  '接听后挂掉'}
      ],
      manual_status_list:[
        { value: 2, label: '转接成功' },
        { value: 1, label: '转接失败' }
      ],
      //页码
      currentpage:1,
      // currentlimit: 10,
      pageKey: 'taskId',
      //详情弹框
      recordDetailShow:false,
      //选择框
      multipleSelection:[],
      cluedata:{},
      CluesList:[],
      starticon:'el-icon-pause',
      defaultScript: []
    }
  },
  components: {
    Breadcrumb,
    Tooltip,
    recordDetail,
    Loading
  },
  computed: {
    ...mapGetters({
      EpInfo: 'AICall/EpInfo',
      free: 'AICall/free',
      scriptList: 'AICall/scriptList',
      taskCluesListTotal: 'AICall/taskCluesListTotal',
      taskCluesList: 'AICall/taskCluesList',
      task_status: 'AICall/task_status',
      ai_count: 'AICall/ai_count',
      labelsList: 'AICall/labelsList',
      recordDetailList: 'AICall/recordDetailList',
      limitMap: 'limitMap',
      GlobalKeyword: 'AICall/GlobalKeyword',
    }),
    currentlimit () {
      return this.limitMap[this.pageKey] || 10
    },
    callcenter () { // 呼叫中心企业
      return +this.EpInfo.enterprise_type === 1
    },
    startBtn(){
      //暂停 :task_status=3、5、6
      //开始：0
      //继续：task_status=1、7
      //完成 2
      //定时任务 8
      if(this.task_status===-1||this.task_status===0||this.task_status===8){
        this.starticon='el-icon-play'
        return '开始任务'
      }
      if(this.task_status===3||this.task_status===5||this.task_status===6){
        this.starticon='el-icon-play'
        return '继续任务'
      }
      if(this.task_status===1||this.task_status===2||this.task_status===7){
        this.starticon='el-icon-pause'
        return '暂停任务'
      }
    },
    labelsOptions () {
      // this.labelsList.unshift({title: '全部标签', id: null})
      const options = this.labelsList.map(labels => {
        return {
          value: labels.id,
          label: labels.title,
          children: labels.content?labels.content.map(label => ({label, value: label})) : ''
        }
      })|| []
      return options
    },
    opts(){
      const opts = {
        task_id:parseInt(this.$route.params.id),
        mobile:this.formInline.mobile, 
        script_id:this.formInline.script_id,
        call_status:this.formInline.call_status,
        call_result:this.formInline.call_result,
        manual_status:this.formInline.manual_status,
        duration:this.formInline.duration,
        intention:this.formInline.intention,
        start_time:this.formInline.time.beginTime,
        end_time:this.formInline.time.endTime,
        label:this.formInline.label,
        page:this.currentpage,
        limit:this.currentlimit
      }
      for (var o in opts) {
        if (opts[o] === '' || opts[o] === undefined || opts[o] === null|| opts[o].length === 0) {
          delete opts[o]
        }
      }
      return opts
    }
  },
  directives: { numberOnly },
  watch:{
    '$route':'handlePage',
    formInline: {
      handler: function (val, oldVal) {
        if(val.intention.length===this.intentions.length){
          this.intentionAll = true;
          this.isIndeterminate = false;
        }else if(val.intention.length===0){
          this.intentionAll = false;
          this.isIndeterminate = false;
        }else{
          this.intentionAll = false;
          this.isIndeterminate = true;
        }
      },
      deep: true
    },
    taskCluesList(val){
      if(val.length){
        this.CluesList=val
      }else{
        this.CluesList=[]
      }
    }
  },
  methods: {
    ...mapActions({
      getLabels: 'AICall/getLabels',
      getScripts: 'AICall/getScripts',
      taskStatistics: 'AICall/taskStatistics',
      taskClues: 'AICall/taskClues',
      controlTask: 'AICall/controlTask',
      reCall: 'AICall/reCall',
      recallByType: 'AICall/recallByType',
      recordDetail: 'AICall/recordDetail',
      // deleteTaskClues: 'AICall/deleteTaskClues',
      delRecords: 'AICall/delRecords',
      getfree: 'AICall/getfree',
      changeLimit: 'changeLimit',
      loadScripts: 'AICall/loadScripts',
      getGlobalKeywordByTaskId: 'AICall/getGlobalKeywordByTaskId',
      scriptItem: 'AICall/scriptItem',
      labelItem: 'AICall/labelItem',
    }),
    intentionValue(row){
      const type={
        1:'A类',
        2:'B类',
        3:'C类',
        4:'D类',
        5:'E类',
        6:'F类',
        7:'G类',
        8:'H类',
        9:'I类',
      }
      return type[row.intention_type]
    },
    //全选反选
    handleCheckAllChange(val) {
      this.formInline.intention = val ? intentionOptions.map(v=>{
        return v.label
      }) : [];
      this.isIndeterminate = false;
    },
    handleCheckedIntentionChange(value) {
      let checkedCount = value.length;
      this.intentionAll = checkedCount === this.intentions.length;
      this.isIndeterminate = checkedCount > 0 && checkedCount < this.intentions.length;
    },
    gettaskStatistics(){
      this.taskStatistics({task_id:this.$route.params.id}).then(v=>{
        const temp=[`${v.data.completed} / ${v.data.total}`,`${v.data.success_rate} %`,this.duration(v.data.avg_duration)('hh:mm:ss'),`${v.data.manual_times}次`]
        this.statistics.forEach((v,i)=>{
          v.value=temp[i]
        })
      })
      if(this.callcenter){
        this.statistics[3].hidden=false
      }else{
        this.statistics[3].hidden=true
      }
    },
    handlePage(){
      let opts;
      if(this.formInline.call_status===0){
        const page = +this.$route.query.page || 1
        const limit = +this.$route.query.limit || this.currentlimit
        const mobile= +this.$route.query.mobile || ''
        const script_id= +this.$route.query.script_id || ''
        const call_status= this.$route.query.call_status==0?0:+this.$route.query.call_status
        this.currentpage = page
        this.formInline.mobile = mobile
        this.formInline.script_id = script_id
        this.formInline.call_status = call_status
        this.changeLimit({
          key: this.pageKey,
          limit
        })
        opts = {
          limit,
          task_id:parseInt(this.$route.params.id),
          mobile, script_id,call_status,page
        }
      }else{
        const page = +this.$route.query.page || 1
        const limit = +this.$route.query.limit || this.currentlimit
        const mobile= +this.$route.query.mobile || ''
        const script_id= +this.$route.query.script_id || ''
        const call_status= +this.$route.query.call_status || ''
        const call_result= +this.$route.query.call_result || ''
        const manual_status= +this.$route.query.manual_status || ''
        const duration= this.$route.query.duration?
        (typeof(this.$route.query.duration)==='string'?[this.$route.query.duration]:this.$route.query.duration.map(v=>{return v})): []
        const intention= this.$route.query.intention?
        (typeof(this.$route.query.intention)==='string'?[+this.$route.query.intention]:this.$route.query.intention.map(v=>{return +v})) : []
        const start_time= +this.$route.query.start_time || ''
        const end_time= +this.$route.query.end_time || ''
        const label= this.$route.query.label?[+this.$route.query.label[0],this.$route.query.label[1]]: []
        this.currentpage = page
        this.formInline={...this.formInline,...{mobile,script_id,call_status,call_result,manual_status,duration,intention,label}}
        this.formInline.time.beginTime = start_time
        this.formInline.time.endTime = end_time
        this.changeLimit({
          key: this.pageKey,
          limit
        })
        opts = {
          task_id:parseInt(this.$route.params.id),
          mobile, script_id, manual_status,call_status,call_result,duration,intention,page,
          limit,
          start_time:start_time?start_time/1000:'',
          end_time:end_time?end_time/1000+60*60*24-1:'',
          label:label.length?encodeURI(encodeURI(label[label.length-1])):'',
        }
      }
      for (var o in opts) {
        if (opts[o] === '' || opts[o] === undefined || opts[o] === null || opts[o].length === 0) {
          delete opts[o]
        }
      }
      this.taskClues(opts).then(()=>{
        this.fullLoading.close()
      })
    },
    handleCurrentChange (val) {
      this.currentpage = val;
      this.$router.push({name: 'AICall-task-id',query:this.opts})
    },
    handleSizeChange (limit) {
      this.changeLimit({
        key: this.pageKey,
        limit
      })
      this.onSearch ()
    },
    onSearch(){
      this.currentpage = 1
      this.$router.push({name: 'AICall-task-id',query:this.opts})
    },
    exportAction(type){
      delete this.opts.page
      delete this.opts.limit
      const exportOpts={...this.opts}
      if(exportOpts.end_time){
        exportOpts.start_time=exportOpts.start_time/1000
      }
      if(exportOpts.end_time){
        exportOpts.end_time=exportOpts.end_time/1000+60*60*24-1
      }
      let dataStr = '' // 数据字符串拼接
      Object.keys(exportOpts).forEach(key => {
        if(typeof(exportOpts[key])==='object'&&exportOpts[key].length===0){
        }else if(key==='label'){
          dataStr += `${key}=${exportOpts[key][exportOpts[key].length-1]}&`
        }else{
          dataStr += `${key}=${exportOpts[key]}&`
        }
      })
      if (dataStr.length) {
        dataStr = dataStr.substr(0, dataStr.length - 1)
      }
      // 导出客户列表
      if(type === 1){
        dataStr=dataStr+'&export=1'
        window.location.href=`${api.AICall.taskClues}?${dataStr}`
        this.$refs.exportList.$el.blur()
      }
      if(type === 2){
        dataStr=dataStr+'&export=2'
        window.location.href=`${api.AICall.taskClues}?${dataStr}`
        this.$refs.exportText.$el.blur()
      }
    },
    async cascaderAction(){
      await this.getLabels()
      setTimeout(v=>{
        if(this.labelsList.length===0){
          const cascaderNodata=document.querySelector(".el-cascader-menus")
          cascaderNodata.classList.add("el-cascader-nodata");
          cascaderNodata.innerHTML='无数据'
        }
      },0)
    },
    deleteClues(){
      if(this.multipleSelection.length===0){
        messageTip.$warning({
          content: '请您选择需要删除的客户号码。'
        })
        return false;
      }else{
        var TaskCluesID=this.multipleSelection.map(v=>{return {'clue_id':v.id,'calllog_id':v.calllog_id}})
        const self = this
        messageBox.$error({
        title: '删除提示',
        content: '您确定要删除已选择的客户号码吗？',
        successCallback () {
          self.delRecords({
            task_id:self.task_id,
            records: TaskCluesID,
            }).then(res => {
              if(res.status===0){
                if (self.taskCluesList.length === TaskCluesID.length && self.currentpage > 1) {
                  self.handleCurrentChange(self.currentpage - 1)
                } else {
                  self.handlePage()
                }
                messageTip.$success({
                content: '删除成功！'
                })
                self.gettaskStatistics()
              }
            })
          }
        })
      }
    },
    recordDetailAction(row){
      const self=this
      this.cluedata=row
      this.recordDetail({
        cc_number:row.cc_number,
        task_id:self.task_id
      }).then(res=>{
        if(res.status===0){
          this.recordDetailShow=true;
          Bus.$emit('showRecord')
        }
      })
    },
    closeRecordDetail(){
      this.recordDetailShow=false;
    },
    handleSelectionChange(val) {
      this.multipleSelection=val
      // this.multipleSelection = [...val,...this.expandSelect]
    },
    reCallaction(){
      if(this.multipleSelection.filter(v=>v.call_count===0).length){
        messageTip.$warning({
          content: '您的选择包含未联系的客户，请选择已联系的客户进行再次呼叫'
        })
        return false;
      }
      if(!CompareDate(this.EpInfo.daily_start_time,this.EpInfo.daily_end_time)){
        messageTip.$warning({
          content: '现在是非外呼时间段，机器人无法进行外呼任务'
        })
        return false;
      }
      // 重呼全部已联系
      if(this.multipleSelection.length===0){
        const self = this
        messageBox.$warning({
        title: '呼叫提示',
        extraClass:"reCallaction",
        content: '您确定要对全部已联系的号码进行重新呼叫吗？',
        successCallback () {
          self.recallByType({
            task_id:self.task_id,
            recall_type: 1,
            }).then(res => {
              if(res.status ===0){
                messageTip.$success({
                  content: '已将客户号码添加到任务队列中'
                })
                self.handlePage()
              }
            })
          }
        })
      }
      if(this.multipleSelection.length>=1){
        const clues = Array.from(new Set(this.multipleSelection.map(v=>v.id)))
        const self = this
        messageBox.$warning({
          title: '呼叫提示',
          content: '您确定要进行再次呼叫吗？',
          successCallback () {
            self.reCall({
              task_id:self.task_id,
              clues
            }).then(res => {
              if(res.status ===0){
                messageTip.$success({
                  content: '已将客户号码添加到任务队列中'
                })
                self.handlePage()
              }
            })
          }
        })
      }
    },
    async taskstatusAction(){
      const self = this
      if (this.task_status===1||this.task_status===7) {
        const type='pause'
        messageBox.$error({
          title: '暂停提示',
          content: '您确定要暂停该任务吗？',
          successCallback () {
            self.controlTask({
              task_id: self.task_id,
              operate: type
            }).then(res => {
              if(res.status===0){
                messageTip.$success({
                  content: '操作成功！'
                })
                // self.task_status=3;
                self.handlePage()
              }
            })
          }
        })
      }
      if(this.task_status===0||this.task_status===3||this.task_status===5||this.task_status===6){
        const type='start'
        if(!CompareDate(this.EpInfo.daily_start_time,this.EpInfo.daily_end_time)){
          messageTip.$warning({
            content: '现在是非外呼时间段，机器人无法进行外呼任务'
          })
          return false;
        }else{
          await this.getfree()
          if(this.free===0){
            messageBox.$warning({
              comfirmText:'继续执行',
              title: '任务提示',
              content: `当前没有空闲的机器人可以执行任务，如需${this.ai_count}个执行任务，请先暂停或修改其他任务。点击继续，机器人将在空闲时自动加入任务。`,
              successCallback () {
                self.controlTask({
                  task_id: self.task_id,
                  operate: type
                }).then(res => {
                  if(res.status===0){
                    messageTip.$success({
                      content: '操作成功！'
                    })
                    self.handlePage()
                  }
                })
              }
            })
            return false;
          }else if(this.ai_count>this.free && this.taskCluesListTotal>this.free){
            messageBox.$warning({
              comfirmText:'继续执行',
              title: '任务提示',
              content: `当前只有${this.free}个空闲外呼机器人可以执行任务，如需${this.ai_count}个执行任务，请先暂停或修改其他任务。点击继续，将以${this.free}个机器人执行任务，待余下的机器人空闲时自动加入任务。`,
              successCallback () {
                self.controlTask({
                  task_id: self.task_id,
                  operate: type,
                  ai_count:self.free
                }).then(res => {
                  if(res.status===0){
                    messageTip.$success({
                      content: '操作成功！'
                    })
                    self.handlePage()
                  }
                })
              }
            })
            return false;
          }else if(this.ai_count<this.free && this.taskCluesListTotal>this.ai_count){
            messageBox.$warning({
              comfirmText:'快速呼出',
              cancelText:'普通呼出',
              title: '任务提示',
              content: `当前空闲机器人数为${this.free}个，可以全部执行任务，进行快速呼出，提高任务效率。`,
              successCallback () {
                self.controlTask({
                  task_id: self.task_id,
                  operate: type,
                  ai_count:self.free
                }).then(res => {
                  if(res.status===0){
                    messageTip.$success({
                      content: '操作成功！'
                    })
                    self.handlePage()
                  }
                })
              },
              cancelCallback () {
                self.controlTask({
                  task_id: self.task_id,
                  operate: type
                }).then(res => {
                  if(res.status===0){
                    messageTip.$success({
                      content: '操作成功！'
                    })
                    self.handlePage()
                  }
                })
              }
            })
            return false;
          }else{
            this.controlTask({
              task_id: self.task_id,
              operate: type,
            }).then(res => {
              if(res.status===0){
                messageTip.$success({
                  content: '操作成功！'
                })
                self.handlePage()
              }
            })
          }
        }
      }
    }
  },
  async mounted () {
    this.fullLoading = this.$loading({
      lock: true,
      background: 'rgba(180, 188, 205, 0.35)'
    })
    await this.getGlobalKeywordByTaskId({task_id:this.$route.params.id})
    this.handlePage()
    this.gettaskStatistics()
    if(this.$route.query.script_id){
      this.scriptItem(this.$route.query.script_id).then(_ => {
        this.defaultScript = [ _.data ]
      })
    }
    if(this.$route.query.label){
      await this.labelItem(+this.$route.query.label[0]).then(_ => {
        _.labels=[_.data]
        this.$store.commit({
          type: 'AICall/getLabels',
          state: _
        })
      })
    }
  }
}
</script>
<style lang="scss">
.intention-tooltip .tool-tip-content{
    width: 385px;
    dl{
      dt{
        color: #333333;
      }
      dd{
        color: #666666;
      }
    }
}
.reCallaction.modal.message-box .message-content{
  max-width: 250px;
}
</style>

<style lang="scss">
@import '@/assets/css/views/task.scss';

$imgsrcs: progress, rate, average,count ;
  @each $imgsrc in $imgsrcs {
    .call-#{$imgsrc} {
      background: url(~@/assets/images/call-#{$imgsrc}.png) no-repeat center/contain
    }
}
</style>

