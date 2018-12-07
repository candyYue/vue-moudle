<template>
    <header :class="[ theme === 'dark' ? 'toggle-theme' :'']">
        <!-- <div v-if="!toggle" :class="[menuCollapse ? 'unfold' : 'fold', 'toggle-menu']"  @click="toggleMenu"></div> -->
        <div v-if="!toggle" class="toggle-menu">
          <span @click="toggleMenu">
            <svg-icon v-if="!menuCollapse" icon-class="fold" class-name="fold"/>
            <svg-icon v-else icon-class="unfold" class-name="unfold"/>
          </span>
          <h1 :class="[menuCollapse ? 'fold-name' : '','company-name']">{{EpInfo.name}}</h1>
        </div>
        <div v-else>
          <slot name="logo">
            <img src="../../assets/images/admin-logo.png" class="admin-logo">
          </slot>
        </div>
        <ul class="nav-menu">
          <li class="expire" v-if="isExpire">
            <el-button type="danger" size="medium" plain>已到期</el-button>
          </li>
          <li :class="['center',dropshow ? 'active' : '']" @click.stop="toggleDrop">
            <!-- {{EpInfo.enterprise_type === '1'?'呼叫中心':'云总机'}} -->
            <span :title="nickname ? nickname : EpInfo.name" class="nickname">{{nickname ? nickname : EpInfo.name}}</span>
            <transition name="fade">
                <div class="dropdown" v-show="dropshow">
                  <!-- <a href="javascript:;">修改密码</a> -->
                  <a @click="quit">退出系统</a>
                </div>
            </transition>
          </li>
        </ul>
    </header>
</template>

<script>
import { mapGetters, mapMutations, mapActions } from 'vuex'
import { UserType } from '../../utils/config/types'

export default {
  name: 'header-bar',
  props: {
    toggle: {
      type: Boolean,
      default: false
    },
    theme: {
      type: String,
      default: 'light'
    }
  },
  data () {
    return {
      dropshow: false,
      isExpire: false,
      nickname: '',
      UserType: ''
    }
  },
  computed: {
    ...mapGetters({
      menuCollapse: 'menuCollapse',
      EpInfo: 'AICall/EpInfo'
    })
  },
  methods: {
    ...mapActions({
      logout: 'User/logout'
    }),
    ...mapMutations({
      toggleMenu: 'toggleMenu'
    }),
    async quit () {
      const res = await this.logout()
      if (res.status === 0) {
        this.$router.push({ name: 'login' })
      }
    },
    toggleDrop () {
      this.dropshow = !this.dropshow
    },
    compareDate () {
      var expireDate = this.EpInfo.expire_date
      var nowDate = new Date()
      var nowDateStr = Math.ceil(nowDate.getTime() / 1000)
      console.log('过期时间戳:' + expireDate)
      console.log('当前时间戳:' + nowDateStr)
      // console.log(expireDate)
      // console.log(nowDateStr)
      if (expireDate < nowDateStr) {
        this.isExpire = true
        this.$messageBox.$warning({
          title: '到期提醒',
          content: '您的账号已到期，系统已停止服务，现仅支持查看数据，如需继续服务请联系客户经理进行续费。超过3个月不续费，则智能语音机器人功能关闭。',
          comfirmText: '好的',
          showCancel: false,
          maskClosable: false,
          extraClass: 'nomask'
        })
      } else if ((expireDate - nowDateStr) <= 30 * 24 * 60 * 60) {
        this.isExpire = false
        this.$messageTip.$warning({
          content: '您的账号即将到期，请尽快联系客户经理进行续费，以免影响您的使用。'
        })
      }
    }
  },
  async mounted () {
    document.body.addEventListener('click', v => {
      this.dropshow = false
    })
    this.UserType = localStorage.getItem('type')
    this.nickname = localStorage.getItem('nickname')
    if (UserType.enterprise === this.UserType) {
      this.compareDate()
    }
  }
}
</script>
<style lang="scss">
.nomask{
  .modal-mask {
    visibility: hidden;
  }
  .modal-content{
    box-shadow:  0 0 4px rgba(161,161,161,.35);
  }
}
</style>
<style lang="scss" scoped>
.message-box-warning .modal-mask {
    visibility: hidden;
}
</style>
<style scoped lang="scss">
@import "../../assets/css/core";
@mixin icon-bg($size) {
  background: {
    size: $size;
    position: center;
    repeat: no-repeat;
  }
}
header {
  position: relative;
  z-index: 1;
  @include text-vertical-center($header-height);
  background: #fff;
  color: #90939A;
  box-shadow: 0 2px 4px 0 rgba(0,0,0,0.03);

  display: flex;
  justify-content: space-between;
  &.toggle-theme{
    color:#fff;
    background:#343F4B;
    ul li.center{
      &::before{
          background-image: url(../../assets/icons/admin-avatar.png)
        }
      &:after{
          background-image: url(../../assets/icons/admin-header-arrow.png);
        }
      &.active,&:hover{
        color:#fff;
        background-color: #2A3541;
        &::before{
          background-image: url(../../assets/icons/admin-avatar.png)
        }
        &::after{
          background-image: url(../../assets/icons/admin-header-arrow.png);
        }
      }
    }
  }
  .toggle-menu{
    width: 50px;
    height: 54px;
    position: relative;
    cursor: pointer;
    .fold{
      width: 26px;
      height: 36px;
      fill:$theme;
      // vertical-align: middle;
      position: absolute;
      top: 8px;
      left: -14px;
      &:hover{
        fill:#47AFF3;
        transition:.3s ease;
      }
    }
    .unfold{
      width:25px;
      height:18px;
      position: absolute;
      left: 20px;
      top: 18px;
      &:hover{
        fill:$theme;
        transition:.3s ease;
      }
    }
    .company-name{
      font-size: 14px;
      width: 500px;
      height: 54px;
      line-height: 54px;
      color:#000000;
      opacity: 0.45;
      position: absolute;
      left:20px;
      cursor: auto;
      &.fold-name{
        left:65px;
      }
    }
  }

  .admin-logo{
    display: inline-block;
    width: 200px;
    padding: 14px 17px;
    background: #2A3541;
  }

  .nav-menu{
    margin-right: 22px;
    li{
      // width: 90px;
      float: left;
      // font-size: 16px;
      text-align: center;
      &.download,&.about,&.center{
        &::before{
          display: inline-block;
          content: '';
          margin-right: 5px;
        }
      }
      &.download,&.about{
        margin-left: 36px;
        &::before{
          @include size(20px);
          @include icon-bg(20px);
          vertical-align: -4px;
        }
      }
      &.center{
        width: 150px;
        height: 54px;
        margin-left: 3px;
        padding:0 6px;
        .nickname{
          display:inline-block;
          max-width:88px;
          margin:0 6px 0 5px;
          @include ellipsis();
        }
        &::before{
          @include size(24px);
          @include icon-bg(24px);
          vertical-align: 15px;
        }
      }
      &.download{
        &::before{
          background-image: url(../../assets/icons/navbar-download.png)
        }
      }
      &.about{
        &::before{
          background-image: url(../../assets/icons/navbar-about.png)
        }
      }
      &.center{
        position: relative;
        cursor: pointer;
        &.active::after{
          transform: rotate(180deg);
        }
        &.active,&:hover{
          background-color: #F8F9FD;
          color: $theme-color;
          &::before{
            background-image: url(../../assets/icons/avatar-active.png)
          }
          &::after{
            background-image: url(../../assets/icons/navbar-arrow-active.png)
          }
        }
        &::before{
          background-image: url(../../assets/icons/avatar.png)
        }
        &:after{
          display: inline-block;
          content: '';
          @include size(10px,6px);
          @include icon-bg(contain);
          background-image: url(../../assets/icons/navbar-arrow.png);
          vertical-align: 24px;
          transition: all linear .35s;
        }
      }
    }
    .dropdown{
      position: absolute;
      left: 0;
      top: $header-height + 2px;
      width: 150px;
      padding: 4px 0;
      background: #FFFFFF;
      box-shadow: 0 2px 4px 0 #A4AAB3;
      border-radius: 4px;
        a{
          display: block;
          @include text-vertical-center(36px);
          color: $subsidiary-text-color;
          text-align: center;
          &:hover{
            background: #EDF8FF;
            color: $theme-color;
          }
        }
    }
  }
}
.el-button--danger.is-plain{
  cursor: auto;
  vertical-align: baseline;
  width:86px;
  height: 34px;
  background: #FEF0F0;
  &:hover,&:focus{
    color: $text-error;
    background: #FEF0F0;
    border-color: #ffb9b8;
  }
}
</style>
