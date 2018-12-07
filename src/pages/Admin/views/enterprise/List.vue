<template>
  <div class="company">
     <table-pagination name="话术"
      router="AICall-talk-script" pageKey="script"
      :total="CompanyScriptTotal"
      :getList="getCompanyScripts"
      :listOpts="{eid}"
      :newToolBar='false'
      >
      <el-table :data="CompanyScriptList">
        <el-table-column
          prop="title"
          label="话术名称"
          align="left"
          width="200">
          <template slot-scope="scope">
            <span><i></i>{{scope.row.title}}</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="create_time"
          label="创建时间"
          align="center">
          <template slot-scope="scope">
            {{scope.row.create_time | formatTime}}
          </template>
        </el-table-column>
        <el-table-column
          label="操作"
          width="100"
          class-name="visible-cell">
          <template slot-scope="scope">
            <el-button type="text" icon="el-icon-share" @click="shareAction(scope.row.id)">分享</el-button>
          </template>
        </el-table-column>
      </el-table>
    </table-pagination>
    <Modal v-model="shareModal" title="选择企业" comfirmText='确定' draggable
      @cancel="closeModal" @comfirm="handleSave"
      :loading="loading"
      :showLine='true'>
      <div class="chooseCompany">
        <el-checkbox-group v-model="checkedCompanies" @change="checkedCompaniesChange">
          <el-checkbox v-for="company in companies" :label="company.id" :key="company.id" :title="company.name">{{company.name}}</el-checkbox>
        </el-checkbox-group>
      </div>
      <el-checkbox :indeterminate="isIndeterminate" v-model="checkAll" @change="checkAllChange">全部企业</el-checkbox>
    </Modal>
  </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
import Bus from '@/assets/js/bus.js'
export default {
  data () {
    return {
      shareModal: false,
      loading: false,
      checkAll: false,
      checkedCompanies: [],
      companies: [],
      isIndeterminate: false,
      script_id: null,
      repeatScriptComId: []
    }
  },
  computed: {
    ...mapGetters({
      tableLoading: 'tableLoading',
      CompanyScriptTotal: 'Admin/CompanyScriptTotal',
      CompanyScriptList: 'Admin/CompanyScriptList',
      AllEsTotalList: 'Admin/AllEsTotalList'
    }),
    eid () {
      return +this.$route.params.id || 0
    }
  },
  methods: {
    ...mapActions({
      getCompanyScripts: 'Admin/getCompanyScripts',
      getAllEs: 'Admin/getAllEs',
      copyScripts: 'Admin/copyScripts'
    }),
    async shareAction (id) {
      const companies = this.AllEsTotalList || await this.getAllEs()
      this.companies = [...companies]
      const currentIndex = this.companies.findIndex(v => v.id === +this.$route.params.id)
      if (currentIndex >= 0) {
        this.companies.splice(currentIndex, 1)
      }
      this.script_id = id
      this.shareModal = true
      this.checkedCompanies = []
      this.checkAll = false
      this.isIndeterminate = false
    },
    closeModal () {
      this.loading = false
      this.shareModal = false
      setTimeout(() => {
        this.companies = []
      }, 500)
    },
    handleSave () {
      if (this.checkedCompanies.length === 0) {
        this.$messageTip.$warning({
          content: '请选择企业'
        })
        return false
      }
      this.loading = true
      this.copyScripts({
        src_eid: this.$route.params.id,
        script_id: this.script_id,
        des_eid: this.checkedCompanies
      }).then(res => {
        if (res.status === 0) {
          this.$messageTip.$success({
            content: '话术分享成功'
          })
          this.shareModal = false
          this.loading = false
        } else {
          this.$messageTip.$error({
            content: res.info
          })
          this.loading = false
        }
      })
    },
    checkAllChange (val) {
      this.checkedCompanies = val ? this.companies.map(v => {
        return v.id
      }) : []
      this.isIndeterminate = false
    },
    checkedCompaniesChange (value) {
      this.checkedCompanies = value
      let checkedCount = value.length
      this.checkAll = checkedCount === this.companies.length
      this.isIndeterminate = checkedCount > 0 && checkedCount < this.companies.length
    }
  },
  destroyed () {
    Bus.$off('reloadList')
  }
}
</script>

<style lang="scss">
@import '../../../../assets/css/views/company.scss';
</style>
