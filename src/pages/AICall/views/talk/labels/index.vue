<template>
  <div>
    <table-pagination name="标签组"
      router="AICall-talk-labels" pageKey="label"
      @handleNew="handleNew"
      :total="labelsListTotal"
      :getList="getLabels"
    >
    <el-table :data="labelsList" v-loading="tableLoading">
        <el-table-column
          prop="title"
          label="标签组名称"
          width="200"
        />
        <el-table-column
          label="标签集合"
          class-name="tags-cell"
          align="center"
          >
          <template slot-scope="scope">
            <span :title="scope.row.content && scope.row.content.join(' / ')">{{scope.row.content && scope.row.content.join(' / ')}}</span>
          </template>
        </el-table-column>
        <el-table-column
          label="操作"
          width="100"
          class-name="visible-cell"
          align="center"
          >
          <template slot-scope="scope">
            <el-button @click="handleEdit(scope.row)" type="text" icon="el-icon-edit" v-tool-tip="'编辑'"></el-button>
            <el-button @click="handleDelete(scope.row.id)" type="text" icon="el-icon-delete" v-tool-tip="'删除'"></el-button>
          </template>
        </el-table-column>
      </el-table>
    </table-pagination>

      <!-- 标签弹框 -->
      <Modal v-model="labelsModal" :title="labelsModalTit[modalType]" :class="['modal-padding-25', {'modal-has-tip': modalType===1}]"
        @cancel="closeModal" @comfirm="handleSave" :loading="loading" draggable
        >
        <p class="modal-tip" v-if="modalType===1">所编辑的标签需要在相应的话术编辑页面进行保存才可生效。</p>
        <el-form ref="labelsform" :model="labelsform" :rules="labelsRules" label-width="100px">
          <el-form-item label="标签组名称" prop="title">
            <el-input v-model.trim="labelsform.title" :maxlength="SystemConfigs.label_group_title_length_limit"></el-input>
          </el-form-item>
          <el-form-item label="标签集合" prop="labelsTemp" class="required-form" ref="labelsTemp">
            <div class="flex-layout-form">
              <el-input v-model.trim="labelsform.labelsTemp" :maxlength="SystemConfigs.labels_text_length_limit" @keyup.enter.native="addLabels"></el-input>
              <el-button icon='el-icon-add' @click="addLabels"></el-button>
            </div>
          </el-form-item>
          <div class="tags-collection" v-if="labelsform.content && labelsform.content.length">
            <span v-for="(item,index) in labelsform.content" :key="index" class="text-tag">
              {{ item }}
              <i class="el-icon-close" @click="removeLabels(index)"></i>
           </span>
          </div>
        </el-form>
      </Modal>
  </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
import { labelsRules } from '@/utils/rules/AICall'
import Bus from '@/assets/js/bus.js'
import * as types from '@/utils/config/types.js'
import { xmlValidatorPattern } from '@/utils/rules'

export default {
  data () {
    const checkLabelsContent = (rule, value, callback) => {
      if (value && xmlValidatorPattern.test(value)) {
        return callback(new Error('请不要输入非法字符'))
      }
      if (this.labelsform.content.length === 0) {
        return callback(new Error('请输入标签'))
      }
      if (value && xmlValidatorPattern.test(value)) {
        return callback(new Error('请不要输入非法字符'))
      }
      if (value && this.labelsform.content.includes(value)) {
        return callback(new Error('标签文本不能相同'))
      }
      if (this.labelsform.content.length === this.labelsLimit) {
        return callback(new Error(`此标签组已达${this.labelsLimit}个标签，无法继续添加`))
      }
      callback()
    }
    return {
      labelsLimit: 20, // 一个标签组标签数
      labelsRules: Object.assign(labelsRules, {
        labelsTemp: { validator: checkLabelsContent, trigger: 'none' }
      }),
      labelsModal: false,
      modalType: 0, // 0新建 1 编辑
      labelsModalTit: {
        0: '新建标签组',
        1: '编辑标签组'
      },
      labelsform: {
        id: '',
        title: '',
        labelsTemp: '',
        content: []
      },
      loading: false
    }
  },
  computed: {
    ...mapGetters({
      tableLoading: 'tableLoading',
      labelsListTotal: 'AICall/labelsListTotal',
      labelsList: 'AICall/labelsList',
      SystemConfigs: 'AICall/SystemConfigs'
    })
  },
  methods: {
    ...mapActions({
      getLabels: 'AICall/getLabels',
      delLabels: 'AICall/delLabels',
      saveLabels: 'AICall/saveLabels'
    }),
    handleNew () {
      const labelCountLimit = Number(this.SystemConfigs.label_group_count_limit)
      if (this.labelsListTotal >= labelCountLimit) {
        this.$messageTip.$warning({
          content: `您的字段数量已达${labelCountLimit}个，无法新建`
        })
        return false
      }
      this.openModal()
      this.modalType = 0
      this.labelsform.id = ''
    },
    handleEdit (label) {
      const { id, title, content } = label
      this.openModal()
      this.modalType = 1
      this.labelsform = {
        id,
        title,
        content
      }
    },
    handleDelete (id) {
      const self = this
      this.$messageBox.$error({
        title: '删除提示',
        content: '您确定要删除该标签组吗？',
        successCallback () {
          self.delLabels({
            id
          }).then(res => {
            if (res.status === 0) {
              Bus.$emit('reloadList', types.PAGE_HANDLER.DEL)
              self.$messageTip.$success({
                content: '删除成功'
              })
            }
          })
        }
      })
    },
    handleSave () {
      const { id, content, title } = this.labelsform
      const opts = { id, content, title }
      this.$refs['labelsform'].validate((valid) => {
        if (valid) {
          this.loading = true
          this.saveLabels(opts).then(res => {
            if (res.status === 0) {
              this.closeModal()
              this.$messageTip.$success({
                content: '保存成功'
              })
              if (this.modalType === 0) {
                Bus.$emit('reloadList', types.PAGE_HANDLER.ADD)
              } else {
                Bus.$emit('reloadList', types.PAGE_HANDLER.EDIT)
              }
            }
            this.loading = false
          })
        } else {
          return false
        }
      })
    },
    addLabels () {
      const labelsLen = this.labelsform.content ? this.labelsform.content.length : 0
      const content = this.labelsform.content ? this.labelsform.content : []
      this.$refs['labelsTemp'].clearValidate()
      if (this.labelsform.labelsTemp) {
        if (labelsLen >= 1) {
          this.$refs['labelsform'].validateField('labelsTemp')
          if (labelsLen === this.labelsLimit) {
            return false
          }
        }
        if (xmlValidatorPattern.test(this.labelsform.labelsTemp)) {
          this.$refs['labelsform'].validateField('labelsTemp')
          return false
        }
        const labels = [...content]
        labels.unshift(this.labelsform.labelsTemp)
        this.labelsform.labelsTemp = ''
        this.labelsform.content = [...new Set(labels)]
      } else {
        this.$refs['labelsform'].validateField('labelsTemp')
      }
    },
    removeLabels (idx) {
      const labels = [...this.labelsform.content]
      labels.splice(idx, 1)
      this.labelsform.content = labels
    },
    openModal () {
      this.labelsModal = true
      this.$refs['labelsform'].resetFields()
      this.labelsform.content = []
      this.loading = false
    },
    closeModal () {
      this.labelsModal = false
    }
  },
  mounted () {
    this.$nextTick(() => {
      this.labelsLimit = Number(this.SystemConfigs.labels_count_limit)
    })
  },
  destroyed () {
    Bus.$off('reloadList')
  }
}
</script>
<style lang="scss" scoped>
.el-input{
  width: 284px;
}
.tags-collection {
   margin-left: 100px;
}
</style>
