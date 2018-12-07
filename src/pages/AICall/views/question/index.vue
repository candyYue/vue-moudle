<template>
  <div class="question">
    <table-pagination name="问题"
      router="AICall-question" pageKey="question"
      @handleNew="handleNew('new')"
      :total="questionListTotal"
      :getList="getQuestions"
      ref="tablepagination"
    >
     <div slot='new' class="action-column">
        <!-- <el-select v-model="script_id" placeholder="请选择话术"  @change='changeScript'  popper-class="select-width154">
          <el-option :label="item.title" :value="item.id" v-for="(item, index) in queSelectList" :key="index" :title="item.title"></el-option>
        </el-select> -->
        <LazyLoadSelect
          v-model="script_id"
          placeholder="请选择话术"
          popper-class="select-width154"
          allChoice="全部问题"
          listKey = "scripts"
          :defalut-opt="defaultScript"
          :loadList = "loadScripts"
          @change='changeScript'
        >
        </LazyLoadSelect>
        <div class="float-right">
          <el-button type="primary" icon="el-icon-plus" @click="handleNew('new')">新建问题</el-button>
          <el-button icon="el-icon-import" @click="handleImport" type="info">导入问题</el-button>
        </div>
     </div>
      <el-table
        :height='tableHeight'
        :data="questionList"
        v-loading="tableLoading"
        ref="questiontable"
        @row-click='showdetail'>
        <el-table-column
          width="20"
          class-name="visible-cell">
          <template slot-scope="scope">
            <el-tooltip placement="top" v-if="scope.row.audio_id===0" content="未上传语音" effect="light" popper-class="noaudio-tootip">
              <i class="el-icon-tip"></i>
            </el-tooltip>
          </template>
        </el-table-column>
        <el-table-column
          class-name="standard-question"
          label="标准问题"
          align='left'
          prop="standard"/>
        <el-table-column
          class-name="answer-question"
          label="机器人回答"
          align='left'
          prop="answer"
          width="450">
          <template slot-scope="scope">
            <p v-html="fieldsVale(scope.row)"></p>
          </template>
          </el-table-column>
        <el-table-column
          label="所属话术"
          prop="scripts"
          align="center"
          min-width="150">
          <template slot-scope="scope">
            <span :title="scope.row.scripts?scope.row.scripts.map(v=>v.name).join(' / '):''">{{scope.row.scripts?scope.row.scripts.map(v=>v.name).join(' / '):''}}</span>
          </template>
        </el-table-column>
        <el-table-column
          label="标签"
          prop="label"
          align="center"/>
        <el-table-column
          label="指令"
          prop="order"
          align="center">
          <template slot-scope="scope">
            <span>{{orderValue(scope.row)}}</span>
          </template>
        </el-table-column>
        <el-table-column
          label="操作"
          width="100"
          prop="action"
          align="center"
          class-name="visible-cell">
          <template slot-scope="scope">
            <el-button @click.stop="handleNew(scope.row.id)" type="text" icon="el-icon-edit" v-tool-tip="'编辑'"></el-button>
            <el-button @click.stop="handleDelete(scope.row.id)" type="text" icon="el-icon-delete" v-tool-tip="'删除'"></el-button>
          </template>
        </el-table-column>
      </el-table>
    </table-pagination>
    <transition name="fade-in">
      <div class="showdetail" v-if="detailcard">
        <div class="card-header">
          <h3 class="card-title">问题详情</h3>
          <span class="card-close" @click='detailcard=false'><i class="el-icon-close"></i></span>
        </div>
        <hr>
        <div class="card-body">
          <div class=" overflow-hidden standard">
            <span>标准问题：</span>{{detail.standard}}
            <div class="card-action">
              <el-button type="text" icon="el-icon-edit" @click='handleNew(detail.id)'></el-button>
              <el-button type="text" icon="el-icon-delete" @click='handleDelete(detail.id)'></el-button>
            </div>
          </div>
          <hr>
          <div>
            <h6>相似问题：</h6>
            <div class="text-box">
                <p v-for="(item, index) in detail.common" :key="index" >{{item}}</p>
            </div>
          </div>
          <hr>
          <div>
            <h6>智能外呼机器人回答：</h6>
            <p v-html="fieldsVale(detail)"></p>
          </div>
          <div>
            <h6>所属话术：</h6>
            <p>{{detail.scripts?detail.scripts.map(v=>v.name).join(' / '):''}}</p>
          </div>
          <div v-if="detail.jump_type===2">
            <h6>跳转至话术节点：</h6>
            <div class=" text-box">
              <p class='jump-node' v-for="(item, index) in detail.scripts" :key="index">
                <span v-if="item.jump_node">{{item.jump_node?item.name + '/'+item.jump_node.name:''}}</span>
              </p>
            </div>

          </div>
          <div>
            <h6>标签：</h6>
            <p>{{detail.label}}</p>
          </div>
        </div>
      </div>
    </transition>

    <modal-import
      type='2'
      v-model="questionImport"
      data-key="问题"
      :template-url="api.AICall.tmpQuestions"
      :import-url="api.AICall.impQuestions"
      :get-list="getImportList"
    />
  </div>
</template>

<script>
import api from '@/service/api'
import { mapActions, mapGetters } from 'vuex'
import { messageBox, messageTip } from '@/components/feedback/Message'
import ModalImport from '@/components/others/ModalImport'
import Bus from '@/assets/js/bus.js'
import * as types from '@/utils/config/types.js'
export default {
  data () {
    return {
      api,
      detailcard: false,
      detail: {
        id: null,
        standard: '',
        common: [''],
        answer: '',
        scripts: '',
        label: ''
      },
      questionImport: false,
      // script_id: +this.$route.query.script_id || '',
      script_id: '',
      queSelectList: [{ id: '', title: '全部问题' }],
      tableHeight: document.body.clientHeight - 310,
      defaultScript: []
    }
  },
  components: {
    ModalImport
  },
  computed: {
    ...mapGetters({
      tableLoading: 'tableLoading',
      questionList: 'AICall/questionList',
      questionListTotal: 'AICall/questionListTotal',
      scriptList: 'AICall/scriptList',
      fieldsList: 'AICall/fieldsList'
    }),
    limit () {
      return this.$refs.tablepagination.limit || 10
    }
  },
  // updated () {
  //   this.$nextTick(_ => {
  //     this.resizeTableHeight()
  //   })
  // },
  methods: {
    ...mapActions({
      getQuestions: 'AICall/getQuestions',
      delQuestions: 'AICall/delQuestions',
      getScripts: 'AICall/getScripts',
      getFields: 'AICall/getFields',
      loadScripts: 'AICall/loadScripts',
      scriptItem: 'AICall/scriptItem',
      SystemConfigs: 'AICall/SystemConfigs'
    }),
    handleImport () {
      this.questionImport = true
    },
    changeScript (val) {
      Bus.$emit('reloadList', types.PAGE_HANDLER.SEARCH, {
        script_id: val
      })
    },
    getImportList () {
      Bus.$emit('reloadList', types.PAGE_HANDLER.ADD)
    },
    orderValue (row) {
      const onhook = row.onhook === 1 ? '结束后挂机' : ''
      const repeat = row.repeat === 1 ? '重复回答' : ''
      const manual = row.manual === 1 ? '转为人工坐席' : ''
      const interrupt = row.interrupt === 1 ? '允许打断' : ''
      const sendSms = row.send_sms === 1 ? '发送短信' : ''
      const temparr = [onhook, repeat, manual, interrupt, sendSms].filter(v => {
        return v !== ''
      })
      return temparr.join('，')
    },
    fieldsVale (row) {
      // console.log(row.answer)
      const customRegex = /\${[1-9]\d*}/g
      if (customRegex.test(row.answer)) {
        row.answer = row.answer.replace(customRegex, ($1) => {
          const id = $1.slice(2, $1.length - 1)
          const filed = row.answer_fields.find(d => d.id === +id)
          return `<span class="fields-color">
                    ${filed ? `@${filed.title}` : ''}
                  </span>`
        })
      } else {
        return row.answer
      }
    },
    showdetail (row, event, column) {
      if (column.property === 'action') {
        return false
      } else {
        this.detailcard = true
        this.detail = row
      }
    },
    handleNew (id) {
      const questionCountLimit = Number(this.SystemConfigs.question_count_limit)
      if (id === 'new' && this.questionListTotal && this.questionListTotal >= questionCountLimit) {
        messageTip.$warning({
          content: '您的标准问题数量已达2000个，无法创建'
        })
        return false
      } else {
        this.$router.push({ name: 'AICall-question-id', params: { id } })
      }
    },
    handleDelete (id) {
      const self = this
      messageBox.$error({
        title: '删除提示',
        content: '您确定要删除该问题吗？',
        successCallback () {
          self.delQuestions({
            id
          }).then(res => {
            if (res.status === 0) {
              Bus.$emit('reloadList', types.PAGE_HANDLER.DEL)
              messageTip.$success({
                content: '删除成功'
              })
              self.detailcard = false
            }
          })
        }
      })
    },
    resizeTableHeight () {
      const height = this.$refs.questiontable.$el.offsetHeight
      const currentheight = document.body.clientHeight - 310
      if (this.limit === this.questionList.length) {
        this.tableHeight = currentheight
      } else {
        if (height > currentheight) {
          this.tableHeight = currentheight
        } else {
        // 不固定高度
          this.tableHeight = ''
        }
      }
    }
  },
  async mounted () {
    // await this.getScripts()
    // await this.getFields()
    this.queSelectList = [...this.queSelectList, ...this.scriptList]
    this.script_id = +this.$route.query.script_id || ''
    window.onresize = this.resizeTableHeight
    window.onresize()
    if (this.$route.query.script_id) {
      await this.scriptItem(this.$route.query.script_id).then(_ => {
        this.defaultScript = [ _.data ]
      })
    }
  },
  destroyed () {
    Bus.$off('reloadList')
    window.onresize = null
  }
}
</script>
<style lang="scss" scoped>
@import '../../../../assets/css/core/mixin.scss';
.question{
  min-height: calc(100vh - 128px);
  .el-select{
    width: 154px;
  }
  .showdetail{
    // width: 600px;
    position: fixed;
    right: 0px;
    top: 194px;
    bottom:0px;
    z-index: 9;
    background-color: #fff;
    border-radius: 3px;
    box-shadow: 0 2px 6px 0 rgba(0,0,0,.3);
    hr{
      height: 1px;
      width: 100%;
      border: none;
      border-top: 1px solid #d8dce5;
      margin-bottom: 0px;
      margin-top: 0px;
    }
    h6,.standard span{
      font-weight: normal;
      color:#303133;
      font-size: 14px;
    }
    .card-header{
      margin: 13px 0;
      text-align: center;
      position: relative;
      .card-title{
        line-height: 22px;
        font-size: 16px;
        font-weight: 700;
      }
      .card-close{
        box-shadow: -2px 0px 0px 0px rgba(0, 0, 0, 0.1);
        @include size(30px);
        background: #fff;
        position: absolute;
        left: -16px;
        top: 0px;
        cursor: pointer;
        transition: all .2s linear;
        z-index: 10;
        border-radius: 50%;
        &:hover{
          color: #999ca1;
        }
        &:active{
          color: #b1b6c3;
        }
        i{
          position: absolute;
          top: 5px;
          left: 5px;
          color: #999CA1;
          vertical-align: middle;
          font-size: 18px
        }
      }
    }
    .card-action{
      float: right;
      position: relative;
      .el-button{
        vertical-align: middle;
        padding: 0;
        font-size:0;
        margin: 0;
      }
      .el-button:nth-of-type(1){
        margin-right: 20px;
      }
    }
    .card-body{
      color: #606265;
      padding: 0 44px 5px 35px;
      position: absolute;
      left: 0;
      right: 0;
      bottom: 0;
      top: 47px;
      overflow: auto;
      >div{
        margin-top: 10px;
      }
      >div:last-child{
        margin-bottom: 20px;
      }
      hr{
        border-top: 1px dashed #d8dce5;
        opacity: .78;
      }
      .standard{
        margin: 23px 0 9px
      }

      .text-box{
        max-height: 128px;
        min-height: 34px;
        background: #F6F6F6;
        overflow: auto;
        padding:5px 12px;
        margin-bottom: 16px;
        line-height: 24px
      }
    }
  }
  @media screen and (max-width: 1366px) { /*小于1366px*/
    .showdetail {
      width: 600px;
    }
  }
  @media screen and (min-width: 1366px) { /*屏幕尺寸大于1366pxpx*/
    .showdetail {
      width: 800px;
    }
  }
}
</style>
<style lang="scss">
.fields-color {
  color: #52bbff;
}
 .el-table {
   .standard-question{
      .cell{
        padding-left:5px;
      }
    }
 }
.noaudio-tootip.el-tooltip__popper{
  height: 28px;
  font-size: 12px;
  line-height:7px;
  border: 1px solid #E4E7ED;
  box-shadow: 0 1px 1px 0px rgba(0,0,0,0.2);
  border-radius: 4px 4px 4px 0 0 0 4px;
  transform: translateY(5px);
  &.is-light[x-placement^="top"] .popper__arrow{
    border-top-color:#E4E7ED;
  transform: translateX(-2px);
  }
}
.question .el-table{
  overflow-y:auto;
}
</style>
