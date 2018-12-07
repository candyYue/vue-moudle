<template>
  <div class="login-container">
    <div class="login-main">
      <div class="login-content">
        <div class="content-left hidden-md-and-down">
          <img src="../assets/images/login-image.png">
        </div>
        <div class="content-right">
          <dl>
            <dt>{{title}}</dt>
            <dd>欢迎登录</dd>
          </dl>
          <div class="login-form">
            <el-form label-width="80px" :model="loginForm" :rules="rules" ref="loginForm">
              <el-form-item prop="username" class="is-border">
                <el-input v-model="loginForm.username" placeholder="请输入用户名" clearable minlength="4" maxlength='24' name="q">
                  <i slot="prefix" class="name-icon"></i>
                </el-input>
              </el-form-item>
              <el-form-item prop="password" class="is-border">
                <el-input type="password" v-model="loginForm.password" @keyup.enter.native="submitForm('loginForm')" placeholder="请输入密码" clearable minlength="8" maxlength='20'>
                  <i slot="prefix" class="pass-icon"></i>
                </el-input>
              </el-form-item>
              <el-button type="primary" @click="submitForm('loginForm')" class="button" round :disabled="disabeld" :class="{'login-loading':loading}" ref="button">
                <Loading v-show="loading"></Loading>
                {{comfirmText}}
              </el-button>
            </el-form>
          </div>
        </div>
      </div>
    </div>
    <Footer/>
  </div>
</template>

<script>
import Footer from '@/components/layout/Footer.vue'
import Loading from '@/components/feedback/Loading.vue'
import { UserType } from '@/utils/config/types'
import { mapActions } from 'vuex'

export default {
  name: 'login-view',
  components: {
    Footer,
    Loading
  },
  data () {
    return {
      title: '运营管理平台',
      comfirmText: '登录',
      loginForm: {
        username: '',
        password: ''
      },
      rules: {
        username: [
          { required: true, message: '请输入用户名', trigger: 'change' }
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'change' }
        ]
      },
      loading: false
    }
  },
  computed: {
    disabeld () {
      return !this.loginForm.username || !this.loginForm.password || this.loading
    }
  },
  methods: {
    ...mapActions({
      login: 'AICall/login',
      adminLogin: 'User/adminLogin'
    }),
    submitForm (formName) {
      this.$refs[formName].validate(async (valid) => {
        if (valid) {
          this.loading = true
          this.comfirmText = '登录中···'
          const admin = this.$route.meta.admin
          const res = admin ? await this.adminLogin(this.loginForm) : await this.login(this.loginForm)
          if (res.status === 0) {
            this.$router.push({ name: UserType[String(res.data.type)].key })
          } else {
            this.loginForm.password = ''
          }
          this.loading = false
          this.comfirmText = '登录'
        }
      })
    }
  },
  mounted () {
    this.title = this.$route.meta.title
  }
}
</script>

<style scoped lang='scss'>
@import '~@/assets/css/core';
@mixin before-icon{
  width: 56px;
  height: 48px;
  display: inline-block;
  background-repeat: no-repeat;
  background-size: 20px;
  background-position:center;
  border-right: 1px solid  #E2E2E4;
}
$login-container-height: 680px;
$footer-height: 40px;
$login-left: 752px;
$login-right: 496px;

.login-container{
  display: flex;
  flex-direction: column;
  height: 100%;
  min-height: $login-container-height + $footer-height + 40px;
  min-width: $login-right;
  overflow: auto;
  .login-main{
    padding: 20px;
    display: flex;
    flex: 1;
    justify-content: center;
    align-items: center;
    .login-content{
      display: flex;
      border-radius: 4px;
      box-shadow: 0 2px 10px 0 rgba(0,0,0,.06);
      overflow: hidden;
      .content-left{
        width: $login-left;
        height: 680px;
      }
      .content-right{
        width: $login-right;
        height: 680px;
        background: #fff;
        border-radius: 4px;
        dl{
          height: 168px;
          background: #FBFCFE;
          display: flex;
          align-items: center;
          border-top-right-radius: 4px;
          dt{
            padding-left: 53px;
            font-size: 32px;
            color: #333333;
          }
          dd{
            margin-left: 12px;
            color: #666666;
            padding-top: 18px;
          }
        }
        .login-form{
          height: 300px;
          margin-top: 105px;
          form{
            width: 390px;
            margin-left: 53px;
            .name-icon{
              @include before-icon;
              background-image: url('../assets/icons/login-name.png');
            }
            .pass-icon{
              @include before-icon;
              background-image: url('../assets/icons/login-pass.png');
            }
          }
          .button{
            width: 390px;
            height: 50px;
            font-size: 20px;
            letter-spacing: 2px;
            border-radius: 56px;
            margin-top: 50px;
          }
        }
      }
    }
  }
  footer{
    height: 40px;
    text-align: center;
    vertical-align: top;
    font-size: 12px;
    color: #999999;
  }
}
@media only screen and (min-width:($--md )){
  .login-container{
    min-width: $login-left + $login-right + 40px;
  }
}
</style>
<style lang="scss">
.login-loading{
  position: relative;
  span{
    margin-left:29px;
    .el-loading-spinner{
      left: 105px;
      width: 22px;
      height: 22px;
      .path{
      stroke: #fff!important;
      stroke-width: 4;
      }
    }
  }
}
.is-border{
  .el-form-item__label,.el-form-item__content{
    line-height:50px;
  }
  .el-form-item__content{
    margin-left:0!important;
  }
  .el-input{
    .el-input__inner{
      height: 50px;
      padding-left:70px!important;
    }
    .el-input__prefix{
      top:1px;
      left:0;
    }
  }
}
</style>
