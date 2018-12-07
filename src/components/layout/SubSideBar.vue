<template>
  <nav class="navgation">
    <h6>{{navTitle}}</h6>
    <ul>
      <router-link v-for="(router,index) in navRouter" :key="`${router.key}-${index}`"
        :to="{name: router.key, params: router.params, query: router.query}" tag="li" :title="router.name">
        {{ router.name }}
      </router-link>
    </ul>
  </nav>
</template>

<script>
export default {
  name: 'sub-side-bar',
  props: {
    navTitle: {
      type: String,
      default: '导航列表'
    },
    navRouter: {
      type: Array,
      default: () => []
    }
  }
}
</script>

<style lang='scss'>
@import "../../assets/css/core";
$navgation-width : 160px;
.navgation{
  width: $navgation-width;
  height: calc(100vh - 54px);
  background: #fff;
  border-top: 1px solid #efefef;
  h6{
    @include text-vertical-center(30px);
    padding-left: 20px;
    font-size: 12px;
    color: #838990;
  }
  ul{
    height: calc(100vh - 85px);
    overflow: auto;
    li{
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      @include text-vertical-center(50px);
      font-size: 14px;
      color: #5A6978;
      padding-left: 39px;
      border-left: 3px solid #fff;
      cursor: pointer;
      &.active{
        background:mix($theme, #fff, 10%);
        color: $theme;
        border-left: 3px solid $theme;
      }
    }
  }
  &.enterprise-side{
    ul li{
      padding-left:33px;
      padding-right: 30px;
    }
    ul{
      li{
        padding-left:33px;
        padding-right: 30px;
      }
      &::-webkit-scrollbar-track{
        background: #fff;
      }
    }
  }
}

</style>
