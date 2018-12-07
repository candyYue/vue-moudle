<template>
  <div>
    <table-pagination name="聚类" :importAction="true"
      router="AICall-talk-clusters" pageKey="clusters"
      @handleNew="handleNew" @handleImport="handleImport"
      :total="clustersListTotal"
      :getList="getClusters"
    >
    <div slot="new" class="cluster-column">
      <el-button @click="handleImport" type="primary"><i class="el-icon-cluster"></i>导入聚类</el-button>
      <el-button type="info" icon="el-icon-plus" @click="handleNew('new')">新建聚类</el-button>
    </div>
      <el-table :data="clustersList" v-loading="tableLoading">
        <el-table-column
          prop="title"
          label="聚类名称"
          width="200px"
        />
        <el-table-column
          prop="content"
          label="文本集合"
          class-name="tags-cell"
          align="center"
        >
          <template slot-scope="scope">
            <span :title="scope.row.content.join(' / ')">{{scope.row.content.join(' / ')}}</span>
            <!-- <TableTags :tags="scope.row.content" :tagKey="scope.row.id" :width="680"/> -->
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

      <!-- 聚类弹框 -->
      <Modal v-model="clusterModal" :title="clusterModalTit[modalType]" :class="{'modal-has-tip': modalType===1}" draggable
        @cancel="closeModal" @comfirm="handleSave" :loading="loading">
        <p class="modal-tip" v-if="modalType===1">所编辑的聚类需要在相应的话术编辑页面进行保存才可生效。</p>
        <el-form ref="clusterform" :model="clusterform" :rules="clusterRules" label-width="110px">
          <el-form-item label="聚类名称" prop="title">
            <el-input v-model.trim="clusterform.title" maxlength="20"></el-input>
          </el-form-item>
          <el-form-item label="聚类文本集合" prop="clustersTemp" class="required-form" ref="clustersTemp">
            <div class="flex-layout-form">
              <el-input v-model.trim="clusterform.clustersTemp" maxlength="15" @keyup.enter.native="addClusters"></el-input>
              <el-button icon="el-icon-add" @click="addClusters"></el-button>
            </div>
          </el-form-item>
          <div class="tags-collection" v-if="clusterform.content.length">
            <span v-for="(item,index) in clusterform.content" :key="index" class="text-tag">
              {{ item }}
              <i class="el-icon-close" @click="removeClusters(index)"></i>
           </span>
          </div>

        </el-form>
      </Modal>
      <modal-import
        type='1'
        v-model="clustersImport"
        data-key="聚类"
        :template-url="api.AICall.tmpClusters"
        :import-url="api.AICall.impClusters"
        :get-list="getImportList"
      />
  </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
import ModalImport from '@/components/others/ModalImport'
import { clusterRules } from '@/utils/rules/AICall'
import { xmlValidatorPattern } from '@/utils/rules'
import Bus from '@/assets/js/bus.js'
import * as types from '@/utils/config/types.js'
import api from '@/service/api'

export default {
  components: {
    ModalImport
  },
  data () {
    const checkClusterContent = (rule, value, callback) => {
      if (value && xmlValidatorPattern.test(value)) {
        return callback(new Error('请不要输入非法字符'))
      }
      if (this.clusterform.content.length === 0) {
        return callback(new Error('请输入聚类文本集合'))
      }
      if (value && xmlValidatorPattern.test(value)) {
        return callback(new Error('请不要输入非法字符'))
      }
      if (value && this.clusterform.content.includes(value)) {
        return callback(new Error('聚类集合文本不能相同'))
      }
      if (this.clusterform.content.length === this.clusterTextLimit) {
        return callback(new Error(`此聚类已达${this.clusterTextLimit}个文本，无法继续添加`))
      }
      callback()
    }
    return {
      api,
      clusterTextLimit: 2000,
      clusterRules: Object.assign(clusterRules, {
        clustersTemp: [
          { validator: checkClusterContent, trigger: 'none' }
        ]
      }),
      clusterModal: false,
      clustersImport: false,
      modalType: 0,
      clusterModalTit: {
        0: '新建聚类',
        1: '编辑聚类'
      },
      clusterform: {
        id: '',
        title: '',
        content: [],
        clustersTemp: ''
      },
      loading: false
    }
  },
  computed: {
    ...mapGetters({
      tableLoading: 'tableLoading',
      clustersListTotal: 'AICall/clustersListTotal',
      clustersList: 'AICall/clustersList',
      SystemConfigs: 'AICall/SystemConfigs'
    })
  },
  methods: {
    ...mapActions({
      getClusters: 'AICall/getClusters',
      delClusters: 'AICall/delClusters',
      saveClusters: 'AICall/saveClusters'
    }),
    addClusters () {
      this.$refs['clustersTemp'].clearValidate()
      const clusterLen = this.clusterform.content.length

      if (this.clusterform.clustersTemp) {
        if (clusterLen >= 1) {
          this.$refs['clusterform'].validateField('clustersTemp')
          if (clusterLen === this.clusterTextLimit) {
            return false
          }
        }
        if (xmlValidatorPattern.test(this.clusterform.clustersTemp)) {
          this.$refs['clusterform'].validateField('clustersTemp')
          return false
        }
        const cluster = [...this.clusterform.content]
        cluster.unshift(this.clusterform.clustersTemp)
        this.clusterform.clustersTemp = ''
        this.clusterform.content = [...new Set(cluster)]
      } else {
        this.$refs['clusterform'].validateField('clustersTemp')
      }
    },
    removeClusters (idx) {
      const cluster = [...this.clusterform.content]
      cluster.splice(idx, 1)
      this.clusterform.content = cluster
    },
    handleImport () {
      this.clustersImport = true
    },
    handleNew () {
      const clusterCountLimit = Number(this.SystemConfigs.cluster_count_limit)
      if (this.clustersListTotal >= clusterCountLimit) {
        this.$messageTip.$warning({
          content: `您的聚类数量已达${clusterCountLimit}个，无法新建`
        })
        return false
      }
      this.openModal()
      this.modalType = 0
      this.clusterform.id = ''
    },
    handleEdit (cluster) {
      const { id, title, content } = cluster
      this.modalType = 1
      this.openModal()
      this.clusterform = {
        id,
        title,
        content
      }
    },
    handleDelete (id) {
      const self = this
      this.$messageBox.$error({
        title: '删除提示',
        content: '您确定要删除该聚类吗？<br/>删除将会影响相应话术的使用。',
        comfirmText: '确定删除',
        btnChange: true,
        successCallback () {
          self.delClusters({
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
      const { id, content, title } = this.clusterform
      const opts = { id, content, title }
      this.$refs['clusterform'].validate((valid) => {
        if (valid) {
          this.loading = true
          this.saveClusters(opts).then(res => {
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
    getImportList () {
      Bus.$emit('reloadList', types.PAGE_HANDLER.ADD)
    },
    openModal () {
      this.clusterModal = true
      this.clusterform.content = []
      this.$refs['clusterform'].resetFields()
      this.loading = false
    },
    closeModal () {
      this.clusterModal = false
    }
  },
  mounted () {
    this.$nextTick(() => {
      this.clusterTextLimit = Number(this.SystemConfigs.cluster_text_length_limit)
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
.cluster-column{
  margin-bottom: 20px;
  text-align: right;
  .el-button{
    .el-icon-cluster{
      width: 14px;
      height: 14px;
      display: inline-block;
      vertical-align: -2px;
      margin-right: 5px;
      &::before{
        content: ''!important;
        width: 14px;
        height: 14px;
        display: inline-block;
        background: url(../../../../../assets/icons/btn-import-hover.png) no-repeat center/contain;
      }
    }
  }
}
</style>
<style>
.el-table__body {
    width: 100%!important;
}
</style>
