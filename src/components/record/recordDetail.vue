<template>
    <div class="record-detail">
      <Modal title="通话详情"
        v-model="recordDetailShow"
        :showFooter='false'
        @cancel='closeRecordDetail'>
        <div class="record-body" v-if="Object.keys(dailyrecord).length">
          <div class="record-date">
            {{timeStamp(recordDetailList.call_time)('YY年MM月DD日')}}
          </div>
          <div class="record-content">
            <div class="dialog">
              <p class="dialog-item">
                <span class="time">{{(recordDetailList.call_time?recordDetailList.call_time:dailyrecord.item[0].attr.timeseconds.value) | formatDate}}</span>
                <span>
                  <i class="record-download" @click="recordAction(1)"></i>
                  <i class="record-listen" @click="recordAction(0)"></i>
                </span>
              </p>
              <div>
                <div v-for="(item,index) in dailyrecord.item" :key='index' class="recorditem">
                  <p :class="typeof(item.text)==='string'?item.attr.user.value:''" :key='index' v-if="typeof(item.text)==='string'">
                    <i></i><span class='calllog' v-html="item.attr.keywords && cluedata.intention===1 && !!item.attr.keywords.value? highlightText(item.text , item.attr.keywords.value.split(';')) : item.text"></span>
                  </p>
                </div>
                <p class="endtime">通话结束 {{(dailyrecord.instruct.length?dailyrecord.item[dailyrecord.item.length-1].attr.timeseconds.value:recordDetailList.hangup_time) | formatDate}}</p>
                <div class="dialog-item" v-if='dailyrecord.instruct.length'>
                  <span class="time">{{dailyrecord.instruct[0].attr.timeseconds.value | formatDate}}</span>
                  <span class="margin-left8" v-if="dailyrecord.instruct[0].attr.status.value==='success'">转为人工坐席</span>
                  <span class="error-text margin-left8"  v-if="dailyrecord.instruct[0].attr.status.value==='fail'">转为人工坐席失败</span>
                  <p class="endtime">通话结束 {{recordDetailList.hangup_time | formatDate}}</p>
                </div>
              </div>
            </div>
          </div>
          <transition name="fade-in">
            <div class="record-audio">
                <Loading v-show="showLoading"/>
                <div class="call-audio " v-show="callaudio">
                  <audio :src="audioSrc" ref="audioRecord" controls autoplay hidden @ended='play=false'></audio>
                  <span>通话录音：</span>

                  <button class="audio-control" @click='togglePlay'><i :class="play ? 'el-icon-audiopause':'el-icon-audioplay'"></i></button>
                  <el-slider v-model="slidervalue" :show-tooltip="false" @change='changeSlider'></el-slider>
                  <span>{{currentTime|formatSecond}}</span> | <span>{{duration | formatSecond}}</span>
                  <span class="audio-close"><i class="el-icon-close" @click='closeaudio'></i></span>
                </div>
            </div>
          </transition>
        </div >
      </Modal>
    </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
import xmlToJSON from '@/assets/js/xmlToJSON'
import Bus from '@/assets/js/bus.js'
import { messageTip } from '@/components/feedback/Message'
import { highlightText } from '@/utils/helper/highlightText'
import { timeStamp } from '@/utils/helper/filter.js'
import Loading from '@/components/feedback/Loading'
export default {
  name: 'recordDetail',
  props: {
    recordDetailShow: {
      type: Boolean,
      default: false
    },
    cluedata: {
      type: Object,
      default: () => {
        return {}
      }
    }
  },
  data () {
    return {
      dailyrecord: [], // 每天的通话记录
      callaudio: false,
      audioSrc: '',
      play: true,
      slidervalue: 0,
      currentTime: 0,
      duration: 0,
      flag: true,
      showLoading: false
    }
  },
  components: {
    Loading
  },
  filters: {
    formatDate: (value) => timeStamp(value)('hh:mm:ss')
    // formatDate: (value) => {
    //   if (value) {
    //     value = +value * 1000
    //     let date = new Date(value)
    //     let h = date.getHours()
    //     h = h < 10 ? ('0' + h) : h
    //     let m = date.getMinutes()
    //     m = m < 10 ? ('0' + m) : m
    //     let s = date.getSeconds()
    //     s = s < 10 ? ('0' + s) : s
    //     return h + ':' + m + ':' + s
    //   } else {
    //     return 0
    //   }
    // }
  },
  computed: {
    ...mapGetters({
      recordDetailList: 'AICall/recordDetailList'
    })
  },
  methods: {
    ...mapActions({
      recordDetail: 'AICall/recordDetail',
      getRecordUrl: 'AICall/getRecordUrl'
    }),
    highlightText: highlightText,
    showRecord () {
      // eslint-disable-next-line
      const regex = /<\?xml.*?>/
      const xmlOptions = {
        textKey: 'text',
        valueKey: 'value',
        attrKey: 'attr'
      }
      this.recordDetailList.record = xmlToJSON.parseString(this.recordDetailList.content, xmlOptions)
      this.recordDetailList.record.calllog[0].instruct = this.recordDetailList.record.calllog[0].item.filter(item => {
        return item.attr.action.value === 'instruct'
      })
      this.recordDetailList.record.calllog[0].match = this.recordDetailList.record.calllog[0].item.filter(item => {
        return item.attr.action.value === 'match'
      })
      this.recordDetailList.record.calllog[0].item = this.recordDetailList.record.calllog[0].item.filter(item => {
        return item.attr.action.value === 'dialog'
      })
      this.dailyrecord = this.recordDetailList.record.calllog[0]
    },
    recordAction (type) {
      // 0试听1下载
      if (type === 0) {
        this.showLoading = true
        this.getRecordUrl({
          cc_number: this.cluedata.cc_number,
          operate: type
        }).then(res => {
          if (res.status === 0) {
            this.play = true
            this.audioSrc = res.data.url
            setTimeout(v => {
              this.resetRecord()
            }, 0)
            this.showLoading = false
            this.callaudio = true
          } else {
            messageTip.$info({
              content: res.info
            })
          }
        })
      }
      if (type === 1) {
        this.getRecordUrl({
          cc_number: this.cluedata.cc_number,
          operate: type
        }).then(res => {
          if (res.status === 0) {
            window.location.href = res.data.url
          } else {
            messageTip.$info({
              content: res.info
            })
          }
        })
      }
    },
    togglePlay () { // 开始暂停
      let method = this.play ? 'pause' : 'play'
      this.play = !this.play
      this.$refs.audioRecord[method]()
    },
    changeSlider (val) {
      this.$refs.audioRecord.currentTime = (val / 100) * this.duration
      let method = this.play ? 'play' : 'pause'
      this.$refs.audioRecord[method]()
    },
    handleProgress () {
      const audioRecord = this.$refs.audioRecord
      const _currentTime = audioRecord && audioRecord.currentTime ? this.duration * audioRecord.currentTime / audioRecord.duration : 0
      this.currentTime = _currentTime
      this.slidervalue = _currentTime / this.duration * 100
    },
    closeaudio () {
      this.$refs.audioRecord.pause()
      this.callaudio = false
    },
    closeRecordDetail () {
      this.$refs.audioRecord.pause()
      this.$emit('closeRecordDetail')
      this.callaudio = false
    },
    resetRecord () {
      this.$refs.audioRecord.addEventListener('error', () => {
        window.open(this.$refs.audioRecord.src)
        return false
      })
      this.$refs.audioRecord.addEventListener('canplay', () => {
        this.duration = this.cluedata.duration
        this.$refs.audioRecord.addEventListener('timeupdate', this.handleProgress)
      })
      this.changeSlider(0)
    }
  },
  mounted () {
    Bus.$on('showRecord', this.showRecord)
  }
}
</script>
<style lang="scss">
@import '../../assets/css/views/record.scss';
</style>
