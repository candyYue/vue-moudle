import Vue from 'vue'
import Router from 'vue-router'
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'

import {
  types as TYPES,
  AICallRouter as routerConfig
} from '@/utils/config'
import {
  messageTip
} from '@/components/feedback/Message'
const UserType = TYPES.UserType
const {
  system,
  enterprise
} = UserType

const Login = r => require.ensure([], () => r(require('../Login.vue')), 'Login')
const AICall = r => require.ensure([], () => r(require('./views')), 'AICall')

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

const getComponentByName = (name) => {
  let path = name.split('-').slice(1).join('/')
  return r => require.ensure([], () => r(require(`./views/${path}`)))
}
const getRouter = (config) => Object.keys(config).map((key) => {
  const {
    path, name, title, newTitle = '', children, meta
  } = config[key]
  const curRoute = {
    path,
    component: getComponentByName(name),
    name,
    meta: {
      ...meta,
      edit: name.includes('id'),
      title,
      newTitle
    }
  }
  if (children) {
    curRoute.children = getRouter(children)
    curRoute.redirect = { name: curRoute.children[0].name }
  }
  return curRoute
})

const router = new Router({
  mode: 'history',
  linkActiveClass: 'active',
  routes: [
    {
      path: '/',
      redirect: '/enterprise'
    },
    {
      path: '/login',
      component: Login,
      name: 'login',
      beforeEnter (to, from, next) {
        loginAuth(next)
      },
      meta: {
        title: UserType[enterprise].title
      }
    },
    {
      path: '/enterprise',
      component: AICall,
      name: 'AICall',
      children: getRouter(routerConfig),
      redirect: '/enterprise/statistics',
      beforeEnter: (to, from, next) => {
        const type = localStorage.getItem('type')
        if (type === null) {
          router.push({ name: 'login' })
        } else if (localStorage.getItem('type') === enterprise) {
          next()
        } else {
          messageTip.$warning({
            content: '您无权限访问该页面'
          })
          window.location.href = UserType[system].home
        }
      }
    }
  ]
})

router.beforeEach((to, from, next) => {
  NProgress.start()
  if (to.meta.edit) {
    const opts = { ...from.query }
    to.meta.query = opts
  }
  next()
})
router.afterEach(() => {
  NProgress.done()
})

export default router
