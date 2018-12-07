<template>
<div>
  <script-nav :navList="navList"></script-nav>
  <router-view></router-view>
</div>
</template>

<script>
import ScriptNav from '@/components/layout/ScriptNav'
export default {
  components: {
    ScriptNav
  },
  data () {
    return {
      navList: [
        {
          label: '话术',
          name: 'Admin-List'
        },
        {
          label: '配置',
          name: 'Admin-Setting'
        }
      ]
    }
  }
}
</script>

<style scoped>
.el-tabs{
  height: 100%;
}
</style>
