<template>
  <div>
    <table-pagination name="话术"
      router="AICall-talk-script" pageKey="script"
      @handleNew="handleNew"
      :total="scriptListTotal"
      :getList="getScripts"
    >
    <el-table :data="scriptList" v-loading="tableLoading">
        <el-table-column
          prop="title"
          label="话术名称"
          header-align="left"
          width="200"
        />
        <el-table-column
          prop="create_time"
          label="创建时间"
          align="center">
          <template slot-scope="scope">
            {{scope.row.create_time | formatTime}}
          </template>
        </el-table-column>
        <el-table-column
          prop="tts_flag"
          label="语音类型"
          align="center">
          <template slot-scope="scope">
            {{EpConfig.tts_status ? (scope.row.tts_flag ? "TTS" : "录音") : "录音"}}
          </template>
        </el-table-column>
        <el-table-column
          label="操作"
          width="100"
          class-name="visible-cell"
          align="center">
          <template slot-scope="scope">
            <el-button @click="handleEdit(scope.row.id)" type="text" icon="el-icon-edit" v-tool-tip="'编辑'"></el-button>
            <el-button @click="handleDelete(scope.row.id)" type="text" icon="el-icon-delete" v-tool-tip="'删除'"></el-button>
          </template>
        </el-table-column>
      </el-table>
    </table-pagination>
  </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
import Bus from '@/assets/js/bus.js'
import * as types from '@/utils/config/types.js'
export default {
  computed: {
    ...mapGetters({
      tableLoading: 'tableLoading',
      scriptListTotal: 'AICall/scriptListTotal',
      scriptList: 'AICall/scriptList',
      SystemConfigs: 'AICall/SystemConfigs',
      EpConfig: 'AICall/EpConfig'
    })
  },
  methods: {
    ...mapActions({
      getScripts: 'AICall/getScripts',
      delScripts: 'AICall/delScripts'
    }),
    handleEdit (id) {
      const self = this
      this.$messageBox.$warning({
        title: '编辑提示',
        content: '如您自行编辑话术文本，将会导致机器人无法正常使用，请联系客户经理进行修改。',
        comfirmText: '继续编辑',
        btnChange: true,
        successCallback () {
          self.$router.push({ name: 'AICall-talk-script-id', params: { id } })
        }
      })
    },
    handleDelete (id) {
      const self = this
      this.$messageBox.$error({
        title: '删除提示',
        content: '您确定要删除该话术吗？<br/>删除将会影响相应的外呼任务。',
        comfirmText: '确定',
        btnChange: true,
        successCallback () {
          self.delScripts({
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
    handleNew () {
      const self = this
      const scriptCountLimit = Number(this.SystemConfigs.script_count_limit)
      if (this.scriptListTotal >= scriptCountLimit) {
        this.$messageTip.$warning({
          content: `您的话术数量已达${scriptCountLimit}个，无法新建`
        })
        return false
      }
      this.$messageBox.$warning({
        title: '新建提示',
        content: '如您自行创建话术，将会导致机器人无法正常使用，请联系客户经理创建话术。',
        comfirmText: '继续新建',
        btnChange: true,
        successCallback () {
          self.$router.push({ name: 'AICall-talk-script-id', params: { id: 'new' } })
        }
      })
    }
  },
  destroyed () {
    Bus.$off('reloadList')
  }
}
</script>
