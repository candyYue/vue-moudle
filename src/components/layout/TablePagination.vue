<template>
  <div>
    <slot name="new" v-if="newToolBar">
      <div class="text-align-right">
        <el-button icon="el-icon-import" @click="$emit('handleImport')" v-if="importAction" type="info">导入{{name}}</el-button>
        <el-button type="primary" icon="el-icon-plus" @click="$emit('handleNew')">新建{{name}}</el-button>
      </div>
    </slot>
    <slot></slot>
    <el-pagination v-if="total" :total="total" popper-class="pagination-width"
        background layout="total, sizes, slot, prev, pager, next"
        :page-sizes="[10, 20, 50, 100]" :page-size="limit"
        :current-page="currentPage"
        @size-change="handleSizeChange"
        @current-change="handlePageChange"
        >
        <span class="unit">条</span>
    </el-pagination>
  </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
import { filterOpts } from '@/utils/helper/assist'
import Bus from '@/assets/js/bus.js'
import * as types from '@/utils/config/types.js'

export default {
  name: 'table-pagination',
  props: {
    name: String,
    newToolBar: {
      type: Boolean,
      default: true
    },
    router: {
      type: String,
      required: true
    },
    pageKey: {
      type: String,
      required: true
    },
    total: {
      type: Number,
      default: 0
    },
    importAction: {
      type: Boolean,
      default: false
    },
    listOpts: {
      type: Object,
      default: () => {}
    },
    getList: Function
  },
  data () {
    return {
      currentPage: 1
    }
  },
  computed: {
    ...mapGetters(['limitMap']),
    limit () {
      // console.log(this.limitMap)
      return this.limitMap[this.pageKey] || 10
    }
  },
  watch: {
    $route: {
      handler () {
        this.handlePage()
      },
      immediate: true
    }
  },
  methods: {
    ...mapActions(['changeLimit', 'changeLoading']),
    /**
     * @description 增删操作分页逻辑
      * - 新增，页面回到第一页
      * - 编辑、删除，一般情况刷新在当前页
      * - 删除，如果删除当前页面的最后一条数据，页面前进页面
      * - 搜索，页面回到第一页
     */
    reloadList (type, opts) {
      switch (type) {
        case types.PAGE_HANDLER.DEL:
          if (this.total % this.limit === 1 && this.currentPage > 1) {
            this.handlePageChange(this.currentPage - 1)
          } else {
            this.handlePage()
          }
          break
        case types.PAGE_HANDLER.ADD:
          this.handlePageChange(1)
          break
        case types.PAGE_HANDLER.SEARCH:
          this.currentPage = 1
          if (filterOpts(opts).next().value) {
            this.$router.push({ name: this.$route.name, query: Object.assign(...filterOpts(opts)) })
          } else {
            this.$router.push({ name: this.$route.name })
          }
          break
        default:
          this.handlePage()
          break
      }
    },
    handlePage () {
      const page = +this.$route.query.page || 1
      const limit = +this.$route.query.limit || this.limit
      this.changeLimit({
        key: this.pageKey,
        limit
      })
      this.currentPage = page
      this.changeLoading(true)
      this.getList({
        ...this.listOpts,
        ...this.$route.query,
        page,
        limit
      }).then((result) => {
        this.changeLoading(false)
      }).catch((err) => {
        this.changeLoading(false)
        console.log(err)
      })
      // this.$emit('getList', {
      //   ...this.listOpts,
      //   ...this.$route.query,
      //   page,
      //   limit
      // })
    },
    handleSizeChange (limit) {
      this.changeLimit({
        key: this.pageKey,
        limit
      })
      setTimeout(() => {
        this.$router.push({ name: this.$route.name, query: { ...this.$route.query, limit: this.limit, page: this.currentPage } })
      }, 0)
    },
    handlePageChange (val) {
      this.currentPage = val
      if (+this.$route.query.page === val) {
        this.handlePage()
      } else {
        this.$router.push({ name: this.$route.name, query: { ...this.$route.query, page: this.currentPage } })
      }
    }
  },
  mounted () {
    Bus.$on('reloadList', this.reloadList)
  }
}
</script>

<style scoped>
.el-button + .el-button {
    margin-left: 20px;
}
</style>
