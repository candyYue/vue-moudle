<template>
  <div class="voice-upload">
    <el-upload
        accept=".wav" :show-file-list="false"
        :before-upload="beforeUpload"
        :on-change="onChange"
        :on-progress="onProgress"
        :action="action"
        :disabled='disabled'
        ref="voiceUpload"
       >
        <slot>
          <el-button type="primary" plain icon="el-icon-circle-plus-outline" class="upload-voice-btn" :disabled="disabled">上传语音</el-button>
        </slot>
        <el-tooltip placement="top" content="请选择小于5M、WAV格式的语音" effect="light" popper-class="audio-tootip">
          <i class="format-tip"></i>
        </el-tooltip>
        <div slot="tip" class="voice-upload__tip" v-show="fileTip !== 'undefined'">
          <p :title="fileTip">{{fileTip}}</p>
        </div>
        <Auditions slot="tip" ref="Auditions" :fileInfo="fileInfo" v-if="fileTip && fileTip !== 'undefined' && !disabled"/>
        <p slot="tip" v-if="hasError" class="failed">{{errorTip}}</p>
    </el-upload>
    <!-- <Auditions  ref="Auditions" :fileInfo="fileInfo" v-if="fileTip && !disabled"/> -->
    <Modal class="modal-padding-45" title="进度提示" :showFooter="false" :showClose="false"
    v-model="progressModal">
      <el-progress :percentage="file.percentage ? Math.trunc(file.percentage) : 0"  :stroke-width="10"></el-progress>
      <p class="progress-tip">正在导入{{file && file.name}}……</p>
    </Modal>
  </div>
</template>

<script>
import api from '@/service/api'
import Auditions from './Auditions'
import { xmlValidatorPattern } from '@/utils/rules'
export default {
  name: 'voice-upload',
  data () {
    return {
      progressModal: false,
      file: this.fileInfo || {},
      hasError: this.errorInfo || false,
      fileTip: this.fileInfo && this.fileInfo.file_name,
      errorTip: this.errorInfo,
      fileSrc: ''
    }
  },
  props: {
    disabled: Boolean,
    errorInfo: String,
    fileInfo: Object
  },
  components: {
    Auditions
  },
  watch: {
    fileInfo (val) {
      this.fileTip = (val && val.file_name) || ''
    },
    errorInfo (val) {
      if (val) {
        this.hasError = true
        this.errorTip = this.errorInfo
      } else {
        this.hasError = false
      }
    }
  },
  computed: {
    action () {
      return api.AICall.uploadFile
    }
  },
  methods: {
    resetUpload () {
      this.errorTip = ''
      this.hasError = false
    },
    beforeUpload (file) {
      if (xmlValidatorPattern.test(file.name)) {
        this.hasError = true
        this.errorTip = `文件名不能包含特殊: &<>'"等 `
        return false
      } else if (file.size > 5242880 || file.name.substring(file.name.length - 4) !== '.wav') {
        this.hasError = true
        this.errorTip = '请选择小于5M、WAV格式的文件'
        return false
      } else {
        this.hasError = false
        this.progressModal = true
        this.file.name = file.name
        this.file.raw = file
      }
    },
    onChange (state) {
      this.$refs.voiceUpload.$el.querySelector('button').blur()
      if (state.status === 'success') {
        this.progressModal = false
        if (state.response.status === 0) {
          this.$emit('getUploadInfo', { ...state.response.data, file_name: this.file.raw.name })
        } else if (state.response.status === 101018) {
          this.$messageTip.$warning({
            content: state.response.info
          })
        } else {
          this.hasError = true
          this.errorTip = state.response.info
        }
      }
      if (state.status === 'error') {
        this.progressModal = false
      }
    },
    onProgress (e) {
      // console.log(e)
      if (e.total > 0) {
        e.percent = e.loaded / e.total * 100
        this.$set(this.file, 'percentage', e.percent)
      }
    }
  }
}
</script>

<style scoped lang="scss">
@import '../../assets/css/core.scss';
.voice-upload{
  display: inline-block;
  vertical-align: top;
  position: relative;
  font-size: 0;
  margin-left: 10px;
  // &.next-line{
    // margin-left: 0;
    // margin-top: 24px;
    // display: inline-block;
  // }
  @media only screen and (max-width:($--lg - 1)){
    margin-left: 0;
    margin-top: 24px;
    display: block;
  }
  // 文件信息
  &__tip {
    color: $info-text-color;
    display: inline-block;
    margin-left: 14px;
    margin-right: 16px;
    vertical-align: top;
    line-height: $input-height;
    font-size: 12px;
    p {
      max-width: 200px;
      @include ellipsis();
    }
    p:not(.failed):not(:empty):before{
        content: '';
        display: inline-block;
        width: 14px;
        height: 14px;
        background: url('../../assets/icons/file.png') no-repeat center;
        background-size: contain;
        vertical-align: -2px;
        margin-right: 4px;
    }
  }
}

.upload-voice-btn {
  padding: 10px 13px;
  border-radius: 3px;
  border-color: #CAE4FF;
  background: #ECF5FF;
  &:hover{
    background: $theme;
    border-color: $theme;
  }
  &:active{
    background: mix(#000000,$theme,8%);
    border-color:mix(#000000,$theme,8%);
  }
}
.format-tip{
  display: inline-block;
    width:14px;
    height:14px;
    margin-left: 8px;
    background: url("../../assets/icons/tool-tip-icon.png") no-repeat center/contain;
    vertical-align: middle;
    cursor: pointer;
}

.failed{
    min-width: 235px;
    height: 23px;
    line-height: 23px;
    font-size: 12px;
    display: inline-block;
    // text-align: left;
    color: $danger;
    position: absolute;
    bottom: -23px;
    left: 0;
}
</style>
<style lang="scss">
@import '../../assets/css/core.scss';

.modal-header{
  color: $colorText;
  line-height: 22px;
}
.el-progress__text{
  font-size: 14px!important;
  color:#333333;
  // vertical-align: 0;
}
.modal.modal-padding-45 .modal-body {
    padding: 30px 33px 32px;
}
.modal p.progress-tip{
  @include ellipsis();
  height: 20px;
  line-height: 20px;
  color: #606266;
  font-size: 14px;
}
.audio-tootip.el-tooltip__popper{
  height: 42px;
  line-height: 23px;
  font-size: 12px;
  color: #606266;
  border: 1px solid #E4E7ED;
  box-shadow: 0 2px 12px 0 rgba(0,0,0,0.06);
  border-radius: 4px 4px 4px 0 0 0 4px;
  transform: translateY(5px);
  &.is-light[x-placement^="top"] .popper__arrow{
    border-top-color:#E4E7ED;
  transform: translateX(-2px);
  }
}
</style>
