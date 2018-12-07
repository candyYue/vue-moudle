<template>
  <div>
    <Modal class="modal-padding-40 modal-import"
      :title="`${dataKey}导入`" v-model="value"
      comfirmText="开始导入"
      @comfirm="handleSave"
      @cancel="close"
    >
      <div class="modal-import__descr">
        <p>1、请按照导入模板的格式来准备要导入的数据。<a :href="templateUrl">下载导入模板</a></p>
        <p>2、选择需要导入的CSV文件</p>
      </div>
      <p>
        <el-button @click="importFile" type="info" ref="fileButton">选择文件</el-button>
        <span class="modal-import__info modal-import__file-name" v-if="!errorInfo">{{file && file.name}}</span>
        <span class="modal-import__info modal-import__error" v-else>{{errorInfo}}</span>
      </p>
      <input ref="fileInput" type="file" hidden :accept="accept" @change="handleChange"/>
    </Modal>

    <modal-progress
      :type='type'
      :data-key="dataKey"
      v-model="progressModal"
      :import-url="importUrl"
      :import-data="importData"
      :getList="getList"
    />
  </div>

</template>

<script>
import ModalProgress from './ModalProgress.vue'
export default {
  name: 'import-modal',
  components: {
    ModalProgress
  },
  props: {
    value: {
      type: Boolean,
      default: false
    },
    type: {
      type: String
    },
    dataKey: {
      type: String
    },
    title: {
      type: String,
      default: '导入'
    },
    templateUrl: String,
    importUrl: String,
    accept: {
      type: String,
      default: '.csv'
    },
    getList: Function
  },
  data () {
    return {
      modal: true,
      progressModal: false,
      file: null,
      importData: {},
      errorInfo: ''
    }
  },
  methods: {
    importFile () {
      this.$refs.fileInput.click()
      this.$refs.fileButton.$el.blur()
    },
    handleChange (ev) {
      this.errorInfo = ''
      const file = ev.target.files[0]
      if (file.name.slice(-4) !== this.accept) {
        this.errorInfo = `请选择${this.accept}格式的文件`
        return
      }
      this.file = file
      this.importData = {
        file: file,
        type: this.type
      }
    },
    handleSave () {
      if (!this.file) {
        this.errorInfo = '请选择需要导入的文件'
        return
      }
      this.progressModal = true
      this.close()
    },
    close () {
      this.$emit('input', false)
      this.$refs.fileInput.value = null
      this.file = null
    }
  }
}
</script>

<style lang="scss">
@import '../../assets/css/core.scss';
.modal.modal-import{
  // .modal-body{
  //   padding: 17px 26px 32px 24px;
  // }
  .modal-footer{
    .el-button{
      padding: 8px 13px;
    }
  }
}

.modal-import{
  &__descr{
    color:$primary-text-color;
    margin-bottom: 6px;
    p{
      margin-top: 4px;
    }
    a{
      margin-left: 2px;
      &:hover{
        text-decoration: underline;
      }
    }
  }
  .el-button{
    padding: 8px 14px;
  }
  &__info{
    font-size: 12px;
    margin-left: 8px;
  }
  &__file-name{
    color: $info-text-color;
  }
  &__error{
    color: $text-error;
  }
}
</style>
