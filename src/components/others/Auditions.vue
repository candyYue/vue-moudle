<template>
    <div class="call-audio upload-audio">
        <audio :src="audioSrc" :ref='uniqueId' controls @ended='play=false' :data-key="uniqueId" hidden></audio>
        <div class="audio-control" @click="togglePlay" :class="{'loading-btn':saveLoading}">
          <Loading v-if="saveLoading"/>
          <i v-else :class="play ? 'el-icon-audiopause':'el-icon-audioplay'"></i>
        </div>
        <transition name="fade-in">
          <div v-show='audioShow' class="toggle-show">
            <el-slider v-model="slidervalue" :show-tooltip="false" @change='changeSlider'></el-slider>
            <span>{{currentTime.toFixed(0) |formatSecond}}</span> / <span>{{duration.toFixed(0) | formatSecond}}</span>
            <span class="audio-close"><i class="el-icon-close" @click='closeAudio'></i></span>
          </div>
        </transition>
        <!-- <Loading v-show="saveLoading"/> -->
    </div>
</template>

<script>
import { uniqueId } from '@/utils/helper/assist'
import Loading from '@/components/feedback/Loading'
import api from '@/service/api'
// import request from '@/utils/request'
export default {
  name: 'auditions',
  props: {
    fileInfo: Object
  },
  data () {
    return {
      uniqueId: uniqueId(),
      audioShow: false,
      audioSrc: '',
      play: false,
      slidervalue: 0,
      currentTime: 0,
      duration: 0,
      saveLoading: false
    }
  },
  computed: {
    audioElement () {
      return this.$refs[this.uniqueId]
    }
  },
  components: {
    Loading
  },
  watch: {
    fileInfo (val) {
      this.audioShow = false
      this.audioSrc = ''
      this.unbindPlay()
    }
  },
  methods: {
    // async getAudioUrl () {
    //   this.saveLoading = true
    //   const response = await request(api.AICall.listen, { id: this.fileInfo.audio_id })
    //   console.log(this.audioSrc)
    //   this.audioSrc = response.status === 0 ? response.data.url : ''
    //   this.audioElement.src = this.audioSrc
    //   return this.audioSrc
    // },
    async togglePlay () {
      // 开始暂停
      const audioElement = this.audioElement
      if (!this.play) {
        if (this.audioSrc) {
          this.bindPlay()
          this.pauseOthers(this)
        } else {
          // this.audioSrc = await this.getAudioUrl()
          this.audioSrc = `${api.AICall.listen}?id=${this.fileInfo.audio_id}`
          console.log(this.audioSrc)
          audioElement.addEventListener('canplay', () => {
            this.bindPlay()
            this.pauseOthers(this)
            this.saveLoading = false
          }, {
            once: true
          })
        }
      } else {
        this.unbindPlay()
      }
    },
    pauseOthers (except) {
      var audios = document.querySelectorAll('audio');
      [].forEach.call(audios, audio => {
        if (audio.dataset['key'] !== except.uniqueId) {
          audio.pause()
        }
      })
    },
    changeSlider (val) {
      this.audioElement.currentTime = val / 100 * this.duration
      this.currentTime = this.audioElement.currentTime
    },
    onProgress () {
      console.log('timeupdate')
      const audioRecord = this.audioElement
      const _currentTime = audioRecord ? audioRecord.currentTime : 0
      this.currentTime = _currentTime
      this.slidervalue = _currentTime / this.duration * 100
    },
    onError (e) {
      console.log(e)
      // this.audioShow = false
    },
    onPause () {
      this.play = false
      console.log('onPause')
      console.log(this.callaudio)
    },
    closeAudio () {
      this.audioShow = false
      this.audioElement.currentTime = 0
      this.audioElement.pause()
    },
    bindPlay () {
      console.log('bindPlay')
      this.play = true
      this.audioShow = true
      this.duration = this.audioElement.duration
      console.log(this.audioElement)
      this.audioElement.play()
      this.audioElement.addEventListener('error', this.onError)
      this.audioElement.addEventListener('timeupdate', this.onProgress)
      this.audioElement.addEventListener('pause', this.onPause)
    },
    unbindPlay () {
      console.log('unbindPlay')
      const audioElement = this.audioElement
      this.play = false
      if (audioElement) {
        audioElement.pause()
        audioElement.removeEventListener('timeupdate', this.onProgress)
        audioElement.removeEventListener('pause', this.onPause)
      }
    }
  },
  destroyed () {
    this.unbindPlay()
  }
}
</script>
<style lang="scss">
@import "@/assets/css/views/record.scss";
.audio-control{
  .el-loading-spinner{
      margin-top: -8px;
  }
  .el-loading-spinner .circular{
    width: 12px;
    height: 12px;
    vertical-align: 8px;
  }
  .el-loading-spinner .path{
    stroke:#fff
  }
  &.loading-btn{
    background: rgba(82, 187, 255,.5);
    cursor: not-allowed;
    pointer-events: none;
  }
}

</style>
