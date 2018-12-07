<template>
    <div class="el-breadcrumb" v-if="show">
      <span
          v-for="(path,index) in pathArray" :key="path.name"
          class="el-breadcrumb__item"
      >
        <template v-if="index !== pathArray.length -1">
          <router-link tag="span" class="path-name" :to="{name: path.name}">{{ path.title }}</router-link>
          <span role="presentation" class="el-breadcrumb__separator">/</span>
        </template>
        <template v-else>
          <span class="el-breadcrumb__item">
            {{ path.title }}
          </span>
        </template>
      </span>
    </div>
</template>

<script>
import {
  AICallRouter
} from '@/utils/config'
export default {
  name: 'breadcrumb',
  data () {
    return {
      show: false,
      pathArray: []
    }
  },
  watch: {
    $route: {
      handler () {
        this.getBreadcrumb()
      },
      immediate: true
    }
  },
  methods: {
    getBreadcrumb () {
      const { meta: { title, newTitle }, params: { id }, name } = this.$route
      const pathArray = []
      if (!name.includes('id')) {
        this.show = false
        return
      }
      this.show = true
      name.split('-').slice(1).reduce((config, item) => {
        if (item.includes('id')) {
          pathArray.push({
            title: id === 'new' ? newTitle : title,
            name
          })
        } else {
          const { title, name } = config[item]
          pathArray.push({
            title,
            name
          })
          return config[item].children
        }
      }, AICallRouter)
      this.pathArray = pathArray
    }
  }
}
</script>
<style lang="scss">
@import '~@/assets/css/core';
// 面包屑
.el-breadcrumb{
  color: $subsidiary-text-color;
  margin-top: -10px;
  margin-bottom: 10px;
  .el-breadcrumb__separator{
    width: 14px;
    height: 14px;
  }
}
.path-name{
  color:  $info-text-color;
  cursor: pointer;
  &:hover{
    color: $theme;
  }
}
</style>
