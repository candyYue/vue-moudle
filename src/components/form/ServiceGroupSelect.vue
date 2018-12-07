<template>
    <el-select
       v-model="selectValue" v-bind="$attrs" :loading="loading"
       filterable clearable
       v-on="listeners"
       @focus.once="getList">
        <el-option
        v-for="item in list"
        :key="item.value"
        :label="item.label"
        :value="item.value"
        :title="item.label">
        </el-option>
    </el-select>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
export default {
  name: 'service-group-select',
  props: {
    value: [Array, String, Number]
  },
  data () {
    return {
      selectValue: this.value,
      loading: false
    //   resultList: []
    }
  },
  computed: {
    ...mapGetters({
      serviceGroups: 'AICall/serviceGroups'
    }),
    listeners () {
      return {
        ...this.$listeners,
        change: value => {
          this.$emit('input', value)
          this.$emit('change', value)
        }
      }
    },
    list () {
      const options = this.serviceGroups.map(opt => {
        return {
          value: opt.gid,
          label: opt.name
        }
      }) || []
      return options
    }
  },
  watch: {
    value (val) {
      this.selectValue = val
    },
    defalutOpt (val) {
      this.selected = val
    }
  },
  methods: {
    ...mapActions({
      getServiceGroups: 'AICall/getServiceGroups'
    }),
    getList () {
      this.loading = true
      this.getServiceGroups().then(_ => {
        this.loading = false
      })
    }
  }
}
</script>

<style scoped>

</style>
