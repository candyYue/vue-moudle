<template>
     <el-select
      v-model="selectValue"
      v-bind="$attrs" filterable
      v-on="listeners"
      :remote="remote"
      :remote-method="remoteMethod"
      :loading="loading"
      @focus.once="initList"
      value-key
      clearable
      @clear="clear"
    >
      <el-option v-for="listItem in list" :key="listItem[optionData.label]"
        :label="listItem[optionData.label]"
        :value="listItem[optionData.value]"
        :title="disabledOpt.includes(listItem[optionData.value]) ? disabledTip : listItem[optionData.label]"
        :disabled="disabledOpt.includes(listItem[optionData.value])"
      >
      </el-option>
      <infinite-loading spinner="spiral" @infinite="onInfinite" :distance="100" v-if="!end">
          <div slot="no-more" class="no-more">我到底啦~~底线</div>
          <div slot="no-results"></div>
      </infinite-loading>
    </el-select>
</template>

<script>
import InfiniteLoading from 'vue-infinite-loading'
import { uniqBy } from 'lodash'
export default {
  name: 'lazy-load-select',
  components: {
    InfiniteLoading
  },
  inheritAttrs: false,
  props: {
    value: [Array, String, Number],
    optionData: {
      type: Object,
      default: () => ({
        value: 'id',
        label: 'title'
      })
    },
    allChoice: { /** 显示全部的title */
      type: String,
      default: ''
    },
    countKey: {
      type: String,
      default: 'count'
    },
    listKey: {
      type: String,
      required: true
    },
    defalutOpt: {
      type: Array,
      default: () => []
    },
    limit: { /** 懒加载每页显示页数 */
      type: Number,
      default: 10
    },
    lazyLoad: { /** 是否使用懒加载  将废弃 */
      type: Boolean,
      default: true
    },
    loadList: { /** 加载方法 */
      type: Function,
      required: true
    },
    disabledOpt: {
      type: Array,
      default: () => []
    },
    disabledTip: {
      type: String
    }
  },
  data () {
    return {
      selectValue: this.value,
      selected: this.defalutOpt,
      query: '',
      page: 1,
      list: this.reserveOpts,
      totalList: [],
      loading: true,
      remote: true,
      end: false
    }
  },
  computed: {
    listeners () {
      return {
        ...this.$listeners,
        change: value => {
          this.$emit('input', value)
          this.$emit('change', value)
        }
      }
    },
    reserveOpts () {
      let reserveOpts = []
      if (this.allChoice) {
        reserveOpts.push({
          id: '',
          title: this.allChoice
        })
      }
      if (this.selectValue) {
        reserveOpts = reserveOpts.concat(this.selected)
      }
      return uniqBy(reserveOpts, this.optionData.value)
    }
  },
  watch: {
    value (val) {
      this.selectValue = val
    },
    defalutOpt (val) {
      this.selected = val
      this.totalList.length ? this.list = this.totalList : this.list = this.reserveOpts
    }
  },
  methods: {
    clearList () {
      this.query = ''
      this.page = 1
      this.loading = true
    },
    clear () {
      this.clearList()
      this.list = this.totalList
      this.loading = false
    },
    remoteMethod (query) {
      console.log('搜索' + query)
      this.query = query
      if (query !== '') {
        this.loading = true
        this.page = 1
        this.list = []
        this.startLoad().then((result) => {
          this.loading = false
          this.list = uniqBy(this.list.concat(result.list), this.optionData.value)
          this.end = result.count <= this.list.length
        })
      } else {
        this.end = false
        this.list = this.totalList
      }
    },
    // 加载第一页
    initList () {
      this.clearList()
      this.startLoad().then((result) => {
        this.end = result.count <= this.list.length
        this.loading = false
        if (this.lazyLoad) {
          this.list = uniqBy(this.list.concat(result.list), this.optionData.value)
        } else {
          this.list = result.list
          this.remote = false
          this.end = true
        }
        this.totalList = this.list
      })
    },
    // 懒加载
    onInfinite ($state) {
      this.startLoad($state).then((result) => {
        this.list = uniqBy(this.list.concat(result.list), this.optionData.value)
        if (!this.query) {
          this.totalList = this.list
        }
        this.end = result.count <= this.list.length

        if (this.end) {
          $state.complete()
          if (!this.query) {
            this.remote = false
          }
        } else {
          $state.loaded()
        }
      })
    },
    async startLoad ($state) {
      const {
        countKey: count,
        listKey: list
      } = this.$props
      const result = await this.loadList({
        name: this.query,
        page: this.lazyLoad ? this.page : '',
        limit: this.lazyLoad ? 10 : ''
      })
      this.page = this.page + 1

      return {
        count: result[count],
        list: result[list]
      }
    }
  },
  mounted () {
    this.list = this.reserveOpts
  },
  destroyed () {
  }
}
</script>

<style lang="scss">
@import '~@/assets/css/core.scss';
.loading-spiral{
  border: 2px solid $theme-color!important;
}
.no-more{
  padding-top: 5px;
  font-size: 12px;
  color: $info-text-color;
}
</style>
