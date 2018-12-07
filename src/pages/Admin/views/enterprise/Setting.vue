<template>
  <div>
    <div class="tts-wrap common">
      <dl>
        <dt>TTS</dt>
        <dd>启用后，企业可使用变量，可通过TTS技术进行语音输出</dd>
      </dl>
      <div class="tts-wrap-content">
        <label class="common-label">TTS</label>
        <SwitchButton :auto-change="false" v-model="tts" @change="ttsChange"/>
      </div>
    </div>
    <div class="api-wrap common">
      <dl>
        <dt>API</dt>
        <dd>启用后，可使用API接口</dd>
      </dl>
      <div class="api-wrap-content">
        <label class="common-label">API</label>
        <SwitchButton :auto-change="false" v-model="api" @change="apiChange"/>
        <transition name="keyt" v-if="api">
          <div class="callback-form">
            <ul class="keyt-list">
              <li>access_key="{{appKey}}"</li>
              <li>secret_key="{{appSecret}}"</li>
            </ul>
            <el-form :model="callbackForm" ref="callbackForm" label-width="88px" label-position="left" class="api-callback">
              <el-form-item label="回调地址" prop="domain" :rules="rules">
                <el-input v-model="callbackForm.domain"></el-input>
              </el-form-item>
              <el-button type="primary" class="button" @click="submitForm('callbackForm')">保存</el-button>
            </el-form>
          </div>
        </transition>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
import SwitchButton from '@/components/feedback/Switch.vue'

export default {
  components: {
    SwitchButton
  },
  data () {
    const validateInput = (rule, value, callback) => {
      const reg = /[\u4E00-\u9FA5]/
      if (!value) {
        callback(new Error('请输入地址'))
      } else if (value && reg.test(value)) {
        callback(new Error('不能输入中文'))
      } else if (value && value.substring(0, 4) !== 'http') {
        callback(new Error('回调地址仅支持带有http/https协议头地址'))
      }
      callback()
    }
    return {
      tts: '',
      api: '',
      switchValue: 0,
      callbackForm: {
        domain: ''
      },
      rules: [
        { validator: validateInput, trigger: 'change' }
        // {required: true, message: '回调地址不为空', trigger: 'change'}
        // {pattern: !/^[\u4E00-\u9FA5]{1,}/, message: '不能输入中文'}
      ]
    }
  },
  computed: {
    ...mapGetters({
      appKey: 'Admin/getAccessKey',
      appSecret: 'Admin/getSecretKey'
    })
  },
  methods: {
    ...mapActions({
      getConfig: 'Admin/getConfig',
      setConfig: 'Admin/setConfig',
      getApiKey: 'Admin/getApiKey'
    }),
    ttsChange (val) {
      var params = {
        eid: this.$route.params.id,
        tts_status: val
      }
      this.setConfig(params).then(res => {
        this.tts = val
        if (res.data.tts_status) {
          this.$messageTip.$success({
            content: '启用成功'
          })
        } else {
          this.$messageTip.$success({
            content: '关闭成功'
          })
        }
      }).catch(res => {
        this.$messageTip.$warning({
          content: '操作失败'
        })
        return false
      })
    },

    apiChange (val) {
      var params = {
        eid: this.$route.params.id,
        api_status: val
      }
      this.setConfig(params).then(res => {
        this.api = val
        if (res.data.api_status) {
          this.getApiKey({ eid: this.$route.params.id })
          this.$messageTip.$success({
            content: '启用成功'
          })
        } else {
          this.$messageTip.$success({
            content: '关闭成功'
          })
        }
      }).catch(res => {
        this.$messageTip.$warning({
          content: '操作失败'
        })
        return false
      })
    },
    submitForm (callbackForm) {
      this.$refs[callbackForm].validate((valid) => {
        if (valid) {
          var params = {
            eid: this.$route.params.id,
            api_callback_domain: this.callbackForm.domain
          }
          this.setConfig(params).then((res) => {
            this.$messageTip.$success({
              content: '保存成功'
            })
          })
        } else {
          return false
        }
      })
    },
    getSetting () {
      this.getConfig({ eid: this.$route.params.id }).then(res => {
        this.tts = res.data.tts_status
        this.api = res.data.api_status
        this.callbackForm.domain = res.data.api_callback_domain
        if (res.data.api_status) {
          this.getApiKey({ eid: this.$route.params.id })
        }
      })
    }
  },
  mounted () {
    this.getSetting()
  }
}
</script>

<style scoped lang='scss'>
.common{
  dl{
    dt{
      font-size: 16px;
      color: #4A4A4A;
    }
    dd{
      color: #ADADAD;
    }
    padding-bottom: 19px;
  }
  &-label{
    display: inline-block;
    width: 60px;
    color: #4A4A4A;
  }
}
.api-wrap{
  margin-top: 44px;
  &-content{
    .keyt-list{
      padding: 16px 0 0 63px;
      font-size: 12px;
      color: #8C8C8C;
    }
  }
}
</style>
<style lang="scss">
.api-callback{
  margin-top: 38px;
  .el-input{
    width:360px;
  }
  .el-button{
    width: 86px;
    height: 36px;
    margin-top: 52px;
  }
}
</style>
