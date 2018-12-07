<template>
  <div>
    <h1>拨打情况及意向性统计</h1>
    <el-tabs  v-model="activeName" @tab-click="handleClick" class="statistics-header tab-width302">
        <el-tab-pane v-for="(item,index) in tabList" :key="index" :label="item.label" :name="item.name">
        </el-tab-pane>
        <div class="time-picker">
          <label>自定义时间</label>
          <el-date-picker
              v-model="start_time"
              type="date"
              placeholder="开始时间"
              :picker-options="pickerBeginDateBefore"
              format="yyyy-MM-dd"
              value-format="timestamp"
              popper-class="time-select"
              class="time-item"
              @change="clearSearch">
            </el-date-picker>
          <label>至</label>
          <el-date-picker
            v-model="end_time"
            type="date"
            placeholder="结束时间"
            :picker-options="pickerBeginDateAfter"
            format="yyyy-MM-dd"
            value-format="timestamp"
            popper-class="time-select"
            class="time-item"
            @change="clearSearch">
          </el-date-picker>
      </div>
      <el-button type="primary" @click="search" class="search-button">搜索</el-button>
    </el-tabs>
    <div class="content">
    <el-row class="statistics-content">
      <el-col :md="12" :lg="12" :xl="12" class="statistics-content-left">
        <el-row>
          <el-col :sm="{span: 20, offset: 2}" :md="{span: 20, offset: 2}" :lg="{span: 19, offset: 3}" :xl="{span: 19, offset: 3}">
            <ve-ring :data="chartData" :settings="chartSettings" :height="`${chartHeight}px`" :extend="chartExtend" class="ring"
            ref="ring">
              <!-- <transition name="fade">
                <div class="empty-view center-ring" v-if="dataEmpty" :style="centerRingStyle"></div>
              </transition> -->
              <transition name='show-center'>
                <div class="center-ring" v-if="isShow" :style="centerRingStyle">
                    <dl>
                      <dt>通话总量</dt>
                      <dd>{{totalCount}}</dd>
                    </dl>
                    <ul v-html="totalDuration" class="total-duration"></ul>
                </div>
              </transition>
            </ve-ring>
          </el-col>
        </el-row>
      </el-col>
      <el-col :md="12" :lg="12" :xl="12" class="statistics-content-right">
        <el-row class="statistics-content-right-content" :gutter="10">
          <el-col v-for="(item,index) in statisticsList" :key="index"
          :sm="index % 2 === 0 ? {span: 10, offset: 2} : {span: 10, offset: 0}"
          :md="{span: 18, offset: 3}"
          :lg="{span: 12, offset: 0}"
          :xl="index % 2 === 0 ? {span: 11, offset: 1} : {span: 11, offset: 0}"
          >
           <div class="call-image">
              <div :class="item.name"></div>
            </div>
          <div class="call-data">
            <dl>
              <dt :class="item.labelTime == '' ? 'label-tittle' : ''">{{item.label}}</dt>
              <dd v-if="item.labelTime !== ''">{{item.labelTime}}</dd>
            </dl>
            <span>{{item.value}}</span>
          </div>
          </el-col>
        </el-row>
      </el-col>
    </el-row>
    </div>
  </div>
</template>

<script>
import VeRing from 'v-charts/lib/ring.common'
import 'v-charts/lib/style.css'
import { responsive, intentionOptions } from '@/utils/config/types'
import request from '@/utils/request'
import api from '@/service/api'
const initChartData = {
  columns: ['intention', 'value'],
  rows: [
    { 'intention': 'A意向', 'value': 0 },
    { 'intention': 'B意向', 'value': 0 },
    { 'intention': 'C意向', 'value': 0 },
    { 'intention': 'D意向', 'value': 0 },
    { 'intention': 'E意向', 'value': 1 }
  ]
}
export default {
  components: {
    VeRing
  },
  data () {
    this.chartSettings = {
      dimension: 'intention',
      metrics: 'value',
      radius: [97, 125],
      label: {
        show: false
      }
    }
    return {
      winW: document.body.clientWidth,
      centerRingStyle: {},
      isShow: false,
      dataEmpty: true,
      totalCount: 0,
      totalDuration: '0s',
      statisticsList: [
        {
          name: 'statistics-total-connected',
          label: '接听总量',
          labelTime: '',
          value: ''
        },
        {
          name: 'statistics-connected-rate',
          label: '接通率',
          labelTime: '',
          value: ''
        },
        {
          name: 'statistics-avg-duration',
          label: '平均通话时长',
          labelTime: '',
          value: ''
        },
        {
          name: 'statistics-duration',
          label: '通话时间',
          labelTime: '0-30s',
          value: ''
        },
        {
          name: 'statistics-duration',
          label: '通话时间',
          labelTime: '30s-1min',
          value: ''
        },
        {
          name: 'statistics-duration',
          label: '通话时间',
          labelTime: '1min-2min',
          value: ''
        },
        {
          name: 'statistics-duration',
          label: '通话时间',
          labelTime: '>2min',
          value: ''
        }
      ],
      pickerBeginDateBefore: {
        disabledDate: (time) => {
          let curDate = this.nowDate
          let oneYear = 365 * 24 * 3600 * 1000
          let computedTime = curDate - oneYear
          let allowTime = time.getTime() < computedTime
          let beginDateVal = this.end_time
          if (beginDateVal) {
            return time.getTime() > beginDateVal || allowTime
          }
          return time.getTime() > this.nowDate || allowTime
        }
      },
      pickerBeginDateAfter: {
        disabledDate: (time) => {
          let curDate = this.nowDate
          let oneYear = 365 * 24 * 3600 * 1000
          let computedTime = curDate - oneYear
          let allowTime = time.getTime() < computedTime
          let beginDateVal = this.start_time
          if (beginDateVal) {
            return time.getTime() < beginDateVal || allowTime
          }
          return allowTime
        }
      },
      nowDate: (new Date()).getTime(),
      start_time: '',
      end_time: '',
      activeName: '1',
      tabList: [
        {
          label: '今天',
          name: '1'
        },
        {
          label: '昨天',
          name: '2'
        },
        {
          label: '近七天',
          name: '3'
        },
        {
          label: '近30天',
          name: '4'
        }
      ],
      chartData: initChartData
    }
  },
  computed: {
    vertical () {
      return this.winW > responsive.$lg || this.winW < responsive.$md
    },
    chartHeight () {
      return (this.vertical ? '280' : '560')
    },
    chartExtend () {
      const chartData = this.chartData ? this.chartData : initChartData
      const vertical = this.vertical
      return {
        series: {
          center: [vertical ? '30%' : '50%', vertical ? '50%' : '35%']
        },
        legend: {
          orient: vertical ? 'vertical' : 'horizontal',
          x: vertical ? '60%' : 'center',
          y: vertical ? 'bottom' : '65%',
          itemWidth: 16,
          itemHeight: 8,
          itemGap: 12,
          selectedMode: true,
          align: 'left',
          textStyle: {
            rich: {
              intention: {
                width: 38,
                fontSize: 14,
                padding: [0, 7, 0, 3]
              },
              val: {
                fontSize: 14
              }
            }
          },
          data: ['A意向', 'B意向', 'C意向', 'D意向', 'E意向'],
          formatter: function (name) {
            var index = 0
            var clientlabels = intentionOptions.map(i => `${i}意向`)
            clientlabels.forEach((value, i) => {
              if (value === name) {
                index = i
              }
            })
            var arr = [
              '{intention|' + name + '}',
              '{val|' + chartData.rows[index].value + '}'
            ]
            return arr.join(' ')
            // return name + ' ' + chartData.rows[index].value
          }
        },
        tooltip: {
          formatter: '{b} : <br/> {c} ({d}%)',
          padding: [10, 19, 10, 10],
          backgroundColor: 'rgba(0,0,0,0.60)',
          textStyle: {
            fontSize: 16
          }

        },
        color: this.dataEmpty ? ['#F6F7FB'] : ['#FF88BE', '#98AEFF', '#FFCA63', '#52BBFF', '#77D8CC', '#A883FF', '#FFB084', '#91D5FF', '#D9D9D9']
      }
    }
  },
  methods: {
    search () {
      if (this.start_time && this.end_time) {
        let param = {
          start_time: this.start_time / 1000,
          end_time: this.end_time / 1000 + 60 * 60 * 24 - 1
          // type: 5
        }
        this.getStatistics(param)
        this.activeName = ''
      }
    },
    clearSearch (time) {
      if (!(this.start_time || this.end_time)) {
        this.getStatistics({ type: 1 })
        this.activeName = '1'
      }
    },
    handleClick (tab) {
      this.start_time = ''
      this.end_time = ''
      let param = {
        type: tab.name // type : 1,2,3,4,5:自定义时间
      }
      this.getStatistics(param)
    },
    async getStatistics (param) {
      const res = await request(api.AICall.getStatistics, param)
      if (res.status === 0) {
        this.isShow = true
        if (res.data.total_call_count) {
          this.dataEmpty = false
          // console.log(res.data)
          const intentionDistribute = res.data.intention_distribute
          this.chartData.rows.forEach((v, i) => {
            v.value = Object.values(intentionDistribute)[i]
          })
          const durationDistribute = res.data.duration_distribute
          const count = {
            connectedCallCount: res.data.connected_call_count,
            connectedRate: `${res.data.connected_rate}%`,
            avgCallDuration: `${res.data.avg_call_duration}s`
          }
          const statisticsTemp = Object.assign(count, durationDistribute)
          this.statisticsList.forEach((v, i) => {
            v.value = Object.values(statisticsTemp)[i]
          })
          this.totalCount = res.data.total_call_count
          this.totalDuration = this.formatSecond(res.data.total_call_duration)
        } else {
          this.statisticsList.forEach((v, i) => {
            v.value = 0
          })
          this.chartData.rows.forEach((v, i) => {
            v.value = 0
          })
          this.dataEmpty = true
          this.totalCount = 0
          this.totalDuration = '0s'
        }
      }
    },
    formatSecond (value) {
      return value ? this.duration(value)('hhh<i></i>mmmin<i></i>sss') : '0s'
    },
    caclCenterRingStyle () {
      this.winW = document.body.clientWidth
      const ringWidth = this.$refs.ring && this.$refs.ring.$el.clientWidth
      const ringHeight = this.chartHeight
      this.centerRingStyle = {
        left: this.vertical ? `${ringWidth * 0.3}px` : `${ringWidth * 0.5}px`,
        top: this.vertical ? `${ringHeight * 0.5}px` : `${ringHeight * 0.35}px`
      }
    }
  },
  mounted () {
    this.getStatistics({ type: 1 })
    this.caclCenterRingStyle()
    window.addEventListener('resize', this.caclCenterRingStyle)
  },
  destroyed () {
    window.removeEventListener('resize', this.caclCenterRingStyle)
  }
}
</script>
<style lang="scss">
.tab-width302{
  .el-tabs__header{
    // width: 302px default;
    float: left;
    margin: 0;
    .el-tabs__nav-wrap{
      &::after{
        width:0;
      }
      &.is-top{
        height: 36px;
        padding: 0;
        // border: 1px solid #D7DBE6;
        border-radius: 3px;
        span{
          display: none;
        }
        .el-tabs__nav-scroll{
          height: 36px;
          line-height: 36px;
          .el-tabs__active-bar{
            display: none;
          }
          .el-tabs__nav{
            .el-tabs__item{
              width: 75px;
              height: 36px;
              line-height: 36px;
              text-align: center;
              font-size: 14px;
              padding: 0;
              border: 1px solid #D7DBE6;
              margin-left: -1px;
              &:nth-child(2){
                margin-left: 0;
                border-top-left-radius: 3px;
              }
              &:last-child{
                border-bottom-right-radius: 3px;
                border-top-right-radius: 3px;
              }
              &:hover{
                color: #52bbff;
                background: #fff;
                border-color:#D7DBE6;
              }
              &.is-active{
                color: #fff;
                background: #52bbff;
                border-color: #52bbff;
                z-index: 1;
              }
              &::before{
                content: none;
              }
              &::after{
                content: none;
              }
            }
          }
        }
      }
    }
  }
  .el-tabs__content{
    // min-width: 968px;
    // height: 628px;
    height: 36px;
    float: left;
    overflow-x: auto;
  }
}
.time-select{
  height: 332px;
  .el-picker-panel__content{
    width: 315px;
    padding-left: 7px;
  }
}
.total-duration{
  i{
    display: inline-block;
    width: 8px;
  }
}
.ring.ve-ring div:first-child {
    z-index: 1;
}
@media screen and (min-width:992px) and (max-width: 1330px){
  .tab-width302{
    .el-tabs__header{
      width: 258px!important;
      .is-top{
      .el-tabs__item{
        width: 65px!important;
      }
    }
    }
  }
}
</style>

<style scoped lang='scss'>
@import '~@/assets/css/core.scss';
@import '~@/assets/css/sprite/statistics.scss';
$left-max-width:868px;
$left-min-width:710px;
$right-width:700px;
div{
  h1{
    height: 22px;
    line-height: 22px;
    font-size: 16px;
    &:after{
      content: '';
      display: block;
      width: 100%;
      border-bottom: 1px solid #D7DBE6;
      margin-top: 12px;
    }
  }
  .statistics-header{
      margin-top: 36px;
      width:100%;
      @include clearfix();
      .time-picker{
      margin-left:35px;
      float: left;
      label{
        margin-right:12px;
        &:last-child{
          margin-left:12px;
        }
      }
      .time-item{
        width:136px;
        margin-right:12px;
        .el-date-editor.el-input{
          width:136px;
        }
      }
    }
    .search-button{
      height: 34px;
      margin-left:18px;

    }
    }
  .content{
    margin-top: 30px;
    .el-row{
      margin-bottom: 32px;
    }
    .statistics-content{
        &-left{
          position: relative;
          height: 100%;
          .ring{
            // margin:10px auto;
            .empty-view{
              // background:#fff url('../../../../assets/images/statistics-no-data.png') no-repeat;
            }
          }
          .center-ring{
            position: absolute;
            @include size(250px);
            left: 30%;
            top: 50%;
            transform: translate(-50%,-50%);
            @media screen and (min-width: $--md) and (max-width: $--lg) {
              left: 50%;
              top: 35%;
            }
            dl{
              margin-top: 80px;
              text-align:center;
              dt{
                font-size:16px;
                color:#303133;
              }
              dd{
                font-size:18px;
                color:#52BBFF;
              }
              &:after{
                content:'';
                display: inline-block;
                width:138px;
                border-top:1px solid #d7dbe6;
              }
            }
            ul{
              font-size:14px;
              color:#606265;
              margin-top:7px;
              text-align: center;
            }
            span{
              display:inline-block;
              width:138px;
              font-size:14px;
              color:#606265;
              margin-top:7px;
              text-align:center;
            }
          }
        }
        &-right{
            margin-top: -10px;
          .el-col{
            margin-top: 10px;
          }
          .call-image{
                width:80px;
                height: 60px;
                display: flex;
                justify-content: center;
                align-items:center;
                background:#EBEFF9;
                @include retina-sprites($retina-groups);
                float: left;
              }
              .call-data{
                height: 60px;
                display:flex;
                align-items: center;
                background:#F6F7FB;
                dl{
                  width:84px;
                  margin-left:16px;
                  dt{
                    font-size:14px;
                    color: #666666;
                  }
                  dd{
                    font-size:13px;
                    color:#2A2A2A;
                  }
                  .label-tittle{
                    line-height:40px;
                  }
                }
                span{
                  font-size: 20px;
                  color: #303133;
                  line-height:40px;
                  margin-left:25px;
                }
              }
        }
      }

  }
  .fade-enter{
    opacity: 0;
  }
  .fade-enter-active{
    transition:.2s cubic-bezier(0, 1, 0.99, 1.41);
  }
  .fade-leave-active{
    transition:.1s cubic-bezier(0.15, 0.43, 0.6, 0.19);
  }
  .show-center-enter{
    opacity: 0;
  }
  .show-center-enter-active{
    transition:1s cubic-bezier(0.15, 0.43, 0.6, 0.19);
  }

  @media screen and (min-width:992px) and (max-width: 1330px){
    .statistics-header .time-picker{
      margin-left:12px;
    }
    .statistics-content-right{
      ul{
        margin-top:-7px!important;
      }
    }
  }
}
</style>
