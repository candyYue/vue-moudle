<template>
    <div :class="[menuCollapse ? 'collapse' : '', 'sidebar']">
      <div class="menu-list">
        <div class="logo">
          <img src="../../../public/images/sidebar-logo.png" alt="云总机企业后台">
          企业后台
        </div>
        <!-- <router-link :to="{name: 'AICall'}" class="menu-item menu-aicall">米话语音机器人</router-link> -->
        <ul class="menu-item">
          <router-link tag="li" :class="[item.key]"
            v-for="(item,index) in menuItems" :key="index"
            :to="{name: `AICall-${item.key}`}"
          >
          <Tooltip effect='dark' :content="item.name" v-if="menuCollapse" class="side-tooltip">
            <svg-icon slot="tipIcon" :icon-class="`menu-${item.key}`"/>
          </Tooltip>
          <svg-icon :icon-class="`menu-${item.key}`" v-if="!menuCollapse"/>
            {{item.name}}
          </router-link>
        </ul>
      </div>

      <!-- <nuxt-link v-for="item in menuList" :key="item.key"
        :to="item.route" :class="'menu-'+item.key" class="menu-item"
      >{{item.name}}</nuxt-link> -->
    </div>
</template>

<script>
import { mapGetters } from 'vuex'
import Tooltip from '@/components/feedback/Tooltip'
export default {
  name: 'side-bar',
  data () {
    return {
      menuItems: [
        {
          name: '数据统计',
          key: 'statistics'
        },
        {
          name: '话术管理',
          key: 'talk'
        },
        {
          name: '问题库',
          key: 'question'
        },
        {
          name: '任务管理',
          key: 'task'
        }
      ]
    }
  },
  components: {
    Tooltip
  },
  computed: {
    ...mapGetters({
      menuCollapse: 'menuCollapse'
    })
  }
}
</script>

<style scoped lang="scss">
@import "../../assets/css/core";
.sidebar {
  width: $sidebar-width;
  height: 100vh;
  background: $sidebar-menu-bg;
  // overflow: hidden;
  transition: width .25s cubic-bezier(0, 0.99, 0.08, 1.1);
  .menu-list{
    width: $sidebar-width;
  }
  &.collapse{
    font-size: 0;
    width: 52px;
    background: $sidebar-logo-bg;
    .logo{
      text-align: left;
      padding-left: 10px;
    }
    .menu-item{
      li{
        .svg-icon{
          font-size: 14px;
          width: 18px;
          height: 18px;
          vertical-align: middle;
          margin: 0;
        }
        .side-tooltip{
          display: inline-block;
        }
      }
    }
  }
  .logo{
    line-height: 54px;
    // padding-left: 10px;
    text-align: center;
    background-color: $sidebar-logo-bg;
    background-image: url('../../assets/images/logo-bg.png');
    background-size: 40px;
    background-repeat: no-repeat;
    img{
      width: 32px;
      vertical-align: middle;
      margin-right: 8px;
    }
    font-size: 18px;
    color: #fff;
  }
}
.menu-item{
  li{
    height: $sidebar-menu-height;
    line-height: $sidebar-menu-height;
    color: $sidebar-color;
    padding-left: 15px;
    border-left: 3px solid $sidebar-menu-bg;
    border-bottom:1px solid rgba(255, 255, 255, 0.12);
    cursor: pointer;
    .svg-icon{
      width: 16px;
      height: 14px;
      fill: rgba(255, 255, 255, 0.65);
      vertical-align: -2px;
      margin: 0 4px 0 7px;
      }
    &:hover{
      color: #fff;
      transition: .3s ease;
      .svg-icon{
        fill: $theme;
      }
    }
    &.active{
      color: $sidebar-active-color;
      border-left: 3px solid $theme;
      .svg-icon{
        fill: $theme;
      }
    }
  }
}
</style>
