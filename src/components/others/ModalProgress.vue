<template>
  <Modal
    v-model="value"
    :title="`${dataKey}导入`"
    :showFooter="false" :showClose="successStatus"
    @cancel="close"
    class="modal-padding-45 modal-progress"
  >
    <el-progress
      :stroke-width="10"
      color="#52BBFF"
      :status="successStatus ? 'success': ''"
      :percentage="result.per || 0"
    />
    <div v-if="!successStatus">正在导入{{dataKey}}数据...…</div>
    <div v-else>
      <p>导入完成，共{{result.total}}条，导入成功<span class="success-text">{{result.total-result.error}}</span>条，导入失败<span span class="error-text">{{result.error}}</span>条，</p>
      <p v-if='result.error'><a :href="`${api.AICall.getImportReport}?hash=${this.hash}`">下载错误报告</a>，查看失败原因。</p>
    </div>
  </Modal>
</template>

<script>
import api from '@/service/api'
import request from '@/utils/request'

export default {
  name: 'progress-modal',
  props: {
    value: {
      type: Boolean,
      default: false
    },
    dataKey: {
      type: String
    },
    title: {
      type: String,
      default: '导入'
    },
    importUrl: String,
    // type: String,
    importData: Object,
    getList: Function,
    onError: Function
  },
  data () {
    return {
      api,
      hash: null,
      result: {}
    }
  },
  computed: {
    successStatus () {
      return this.result.per === 100
    }
  },
  watch: {
    value (val) {
      if (val) {
        this.startImport()
      }
    }
  },
  methods: {
    startImport () {
      // console.log(Object.entries(this.importData))
      const formData = new FormData()
      Object.entries(this.importData).map((data) => {
        formData.append(data[0], data[1])
      })
      const xhr = new XMLHttpRequest()
      xhr.open('POST', this.importUrl, true)
      xhr.send(formData)

      xhr.onload = async (e) => {
        if (xhr.readyState === 4 && xhr.status === 200) {
          const response = JSON.parse(xhr.responseText || xhr.response)
          if (response.status === 0) {
            this.hash = response.data.hash
            this.getProgress()
          } else {
            if (this.onError) {
              this.onError(response.info)
            } else {
              this.$messageTip.$error({
                content: response.info
              })
            }
            this.close()
          }
        }
      }
    },
    async getProgress () {
      let timer = null
      const response = await request(api.AICall.getProgress, { hash: this.hash })
      this.result = response.data
      if (response.status === 10004) { // 上传错误
        this.close()
        return
      }
      if (Number(response.data.per) !== 100) {
        timer = setTimeout(() => {
          this.getProgress()
          clearTimeout(timer)
        }, 1000)
      } else {
        if (!response.data.error) {
          setTimeout(() => {
            this.close()
          }, 2000)
        }
        if (response.data.total - response.data.error) {
          this.getList()
        }
      }
    },
    close () {
      this.$emit('input', false)
    }
  }
}
</script>

<style lang="scss">
@import '../../assets/css/core.scss';
.modal.modal-progress{
  color:$primary-text-color;
  .modal-body{
    padding-bottom: 40px;
  }
  .el-progress{
    &-bar{
      padding-right: 45px;
      margin-right: -45px;
      // &__inner{
      //   transition: all 0.35s linear;
      // }
    }
    &__text{
      font-size: 14px!important;
      margin-left: 6px;
      .el-icon-circle-check{
        font-size: 17px;
      }
    }
  }
}
.modal-progress{
  a{
    &:hover{
      text-decoration: underline;
    }
  }
}

</style>
