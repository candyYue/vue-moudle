<template>
  <el-tabs v-model="activeName" @tab-click="handleClick">
    <el-tab-pane v-for="nav in navList" :key="nav.name"
    :label="nav.label" :name="nav.name"
    >
    </el-tab-pane>
  </el-tabs>
</template>

<script>
export default {
  data () {
    return {
      activeName: this.$route.name,
      routerList: this.navList
    }
  },
  props: {
    navList: {
      type: Array,
      default () {
        return []
      }
    }
  },
  watch: {
    navList (val) {
      this.routerList = val
    },
    $route: {
      handler () {
        this.routerListener()
      },
      immediate: true
    }
  },
  methods: {
    handleClick (tab) {
      if (tab.name.includes('Admin-List')) {
        this.$router.push({ name: tab.name,
          query: {
            eid: this.$route.params.id
          } })
      } else {
        this.$router.push({ name: tab.name })
      }
    },
    routerListener () {
      if (this.$route.name.indexOf('AICall-talk-script') > -1) {
        this.activeName = 'AICall-talk-script'
      } else {
        this.activeName = this.$route.name
      }
    }
  }
}
</script>
<style lang="scss">
.el-tabs{
  margin-top: -19px;
  .el-tabs__item{
    height: 51px;
  }
}
</style>
