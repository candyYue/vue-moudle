<template>
  <div>
    <table-pagination name="短信"
      router="AICall-talk-messages" pageKey="message"
      @handleNew="handleNew"
      :total="messagesListTotal"
      :getList="getMessages"
    >
      <el-table :data="messagesList" v-loading="tableLoading">
        <el-table-column
          prop="title"
          label="短信名称"
          align="left"
          width="200"
        />
        <el-table-column
          label="短信内容"
          class-name="tags-cell"
          align="center"
          >
          <template slot-scope="scope">
            <span :title="scope.row.content">{{scope.row.content}}</span>
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
      <Modal v-model="messagesModal" :title="messagesModalTit[modalType]" class="modal-padding-30" draggable
        @cancel="closeModal" @comfirm="handleSave" :loading="loading"
        >
        <el-form ref="messagesform" :model="messagesform" :rules="messagesRules" label-width="80px">
          <el-form-item label="短信名称" prop="title">
            <el-input v-model.trim="messagesform.title" :maxlength="SystemConfigs.msg_title_length_limit"></el-input>
          </el-form-item>
          <el-form-item label="短信内容" prop="content">
              <el-input v-model.trim="messagesform.content" rows="4" type="textarea" :maxlength="SystemConfigs.msg_content_length_limit"></el-input>
          </el-form-item>
        </el-form>
      </Modal>
  </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
import { messagesRules } from '@/utils/rules/AICall'
import Bus from '@/assets/js/bus.js'
import * as types from '@/utils/config/types.js'

export default {
  data () {
    return {
      messagesRules,
      messagesModal: false,
      modalType: 0, // 0新建 1 编辑
      messagesModalTit: {
        0: '新建短信',
        1: '编辑短信'
      },
      messagesform: {
        id: '',
        title: '',
        content: ''
      },
      loading: false
    }
  },
  computed: {
    ...mapGetters({
      tableLoading: 'tableLoading',
      messagesListTotal: 'AICall/messagesListTotal',
      messagesList: 'AICall/messagesList',
      SystemConfigs: 'AICall/SystemConfigs'
    })
  },
  methods: {
    ...mapActions({
      getMessages: 'AICall/getMessages',
      delMessages: 'AICall/delMessages',
      saveMessages: 'AICall/saveMessages'
    }),
    handleNew () {
      const msgCountLimit = Number(this.SystemConfigs.msg_count_limit)
      if (this.messagesListTotal >= msgCountLimit) {
        this.$messageTip.$warning({
          content: `您的短信模板数量已达${msgCountLimit}个，无法新建`
        })
        return false
      }
      this.openModal()
      this.modalType = 0
      this.messagesform.id = ''
    },
    handleEdit (label) {
      const { id, title, content } = label
      this.openModal()
      this.modalType = 1
      this.messagesform = {
        id,
        title,
        content
      }
    },
    handleDelete (id) {
      const self = this
      this.$messageBox.$error({
        title: '删除提示',
        content: '您确定要删除该短信模板吗？<br/>删除可能会导致无法发送相关短信。',
        comfirmText: '确定删除',
        btnChange: true,
        successCallback () {
          self.delMessages({
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
      const { id, content, title } = this.messagesform
      const opts = { id, content, title }
      this.$refs['messagesform'].validate((valid) => {
        if (valid) {
          this.loading = true
          this.saveMessages(opts).then(res => {
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
      this.messagesModal = true
      this.$refs['messagesform'].resetFields()
      this.messagesform.content = ''
      this.loading = false
    },
    closeModal () {
      this.messagesModal = false
    }
  },
  destroyed () {
    Bus.$off('reloadList')
  }
}
</script>
