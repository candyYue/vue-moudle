<template>
  <div>
      <table-pagination name="变量"
      router="AICall-talk-fields" pageKey="fields"
      @handleNew="handleNew"
      :total="fieldsListTotal"
      :getList="getFields"
    >
      <el-table :data="fieldsList" v-loading="tableLoading">
        <el-table-column
          prop="title"
          label="变量"
          align="left"
        />
        <el-table-column
          label="操作"
          width="100"
          class-name="visible-cell"
          align="center">
          <template slot-scope="scope">
            <el-button @click="handleEdit(scope.row)" type="text" icon="el-icon-edit" v-tool-tip="'编辑'"></el-button>
            <el-button @click="handleDelete(scope.row.id)" type="text" icon="el-icon-delete" v-tool-tip="'删除'"></el-button>
          </template>
        </el-table-column>
      </el-table>
      </table-pagination>

      <!-- 变量弹框 -->
      <Modal v-model="fieldsModal" :title="fieldsModalTit[modalType]" :loading="loading" draggable
        @cancel="closeModal" @comfirm="handleSave" :class="['modal-padding-30', {'modal-has-tip': modalType===1}]"
        >
        <p class="modal-tip" v-if="modalType===1">所编辑的变量需要在相应的话术编辑页面进行保存才可生效。</p>
        <el-form ref="fieldsform" :model="fieldsform" :rules="fieldsRules" label-width="80px" @submit.native.prevent="handleSave">
          <el-form-item label="变量名称" prop="title">
            <el-input v-model.trim="fieldsform.title" :maxlength="SystemConfigs.field_length_limit"></el-input>
          </el-form-item>
        </el-form>
      </Modal>
  </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
import { fieldsRules } from '@/utils/rules/AICall'
import Bus from '@/assets/js/bus.js'
import * as types from '@/utils/config/types.js'
export default {
  data () {
    return {
      fieldsRules,
      fieldsModal: false,
      modalType: 0, // 0新建 1 编辑
      fieldsModalTit: {
        0: '新建变量',
        1: '编辑变量'
      },
      fieldsform: {
        id: '',
        title: ''
      },
      loading: false
    }
  },
  computed: {
    ...mapGetters({
      tableLoading: 'tableLoading',
      fieldsListTotal: 'AICall/fieldsListTotal',
      fieldsList: 'AICall/fieldsList',
      SystemConfigs: 'AICall/SystemConfigs'
    })
  },
  methods: {
    ...mapActions({
      getFields: 'AICall/getFields',
      delFields: 'AICall/delFields',
      saveFields: 'AICall/saveFields'
    }),
    handleNew () {
      const fieldCountLimit = Number(this.SystemConfigs.field_count_limit)
      if (this.fieldsListTotal >= fieldCountLimit) {
        this.$messageTip.$warning({
          content: `您的变量数量已达${fieldCountLimit}个，无法新建`
        })
        return false
      }
      this.openModal()
      this.modalType = 0
      this.fieldsform.id = ''
    },
    handleEdit (fileds) {
      const { id, title } = fileds
      this.fieldsform = {
        id,
        title
      }
      this.modalType = 1
      this.openModal()
    },
    handleDelete (id) {
      const self = this
      this.$messageBox.$error({
        title: '删除提示',
        content: '您确定要删除该自定义变量吗？<br/>删除将会影响相应话术的使用。',
        comfirmText: '确定删除',
        btnChange: true,
        successCallback () {
          self.delFields({
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
      const {
        id, title
      } = this.fieldsform
      if (id) {
        const cur = this.fieldsList.find(d => d.id === id)
        if (cur.title === title) { // 内容未做更改 不发出请求
          this.closeModal()
          return false
        }
      }

      this.$refs['fieldsform'].validate((valid) => {
        if (valid) {
          this.loading = true
          this.saveFields(this.fieldsform).then(res => {
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
    openModal () {
      this.fieldsModal = true
      this.$refs['fieldsform'].resetFields()
      this.loading = false
    },
    closeModal () {
      this.fieldsModal = false
    }
  },
  destroyed () {
    Bus.$off('reloadList')
  }
}
</script>
