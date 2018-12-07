import Vue from 'vue'
import Router from 'vue-router'
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'
import {
  UserType
} from '@/utils/config/types'
import {
  messageTip
} from '@/components/feedback/Message'
NProgress.configure({
  showSpinner: false
})
const Admin = r => require.ensure([], () => r(require('./views/index.vue')), 'Admin')
const Login = r => require.ensure([], () => r(require('../Login.vue')), 'Login')
const AdminList = r => require.ensure([], () => r(require('./views/enterprise')), 'AdminList')
const List = r => require.ensure([], () => r(require('./views/enterprise/List')), 'List')
const Setting = r => require.ensure([], () => r(require('./views/enterprise/Setting')), 'Setting')
const {
  enterprise,
  system
} = UserType
Vue.use(Router)
const loginAuth = (next) => {
  const type = localStorage.getItem('type')
  if (type === null) {
    next()
  } else {
    router.push({
      name: UserType[type].key
    })
  }
}
const router = new Router({
  mode: 'history',
  linkActiveClass: 'active',
  base: '/admin',
  routes: [
    {
      path: '/login',
      component: Login,
      name: 'login',
      beforeEnter (to, from, next) {
        loginAuth(next)
      },
      meta: {
        title: UserType[system].title,
        admin: true
      }
    },
    {
      path: '/',
      component: Admin,
      name: 'admin',
      children: [
        {
          path: '/:id',
          component: AdminList,
          name: 'AdminList',
          children: [
            {
              path: 'list',
              component: List,
              name: 'Admin-List'
            },
            {
              path: 'setting',
              component: Setting,
              name: 'Admin-Setting'
            }
          ],
          redirect: {
            name: 'Admin-List'
          }
        }
      ],
      beforeEnter: (to, from, next) => {
        console.log('system')
        const type = localStorage.getItem('type')
        if (type === null) {
          router.push({ name: 'login' })
        } else if (localStorage.getItem('type') === system) {
          next()
        } else {
          messageTip.$warning({
            content: '您无权限访问该页面'
          })
          window.location.href = UserType[enterprise].home
        }
      },
      meta: {
        title: UserType[system].title
      }
    }
  ]
})

router.beforeEach((to, from, next) => {
  NProgress.start()
  // if (to.meta.title) {
  //   document.title = to.meta.title
  // }
  if (to.meta.edit) {
    const opts = { ...from.query
    }
    for (const opt in opts) {
      to.meta[opt] = opts[opt]
    }
  }
  next()
})
router.afterEach(() => {
  NProgress.done()
})

export default router
