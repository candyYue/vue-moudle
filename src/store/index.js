import 'babel-polyfill'
import Vue from 'vue'
import Vuex from 'vuex'
import User from './modules/User'
import AICall from './modules/AICall'
import Admin from './modules/Admin'
import {
  changeLimit
} from './actions'

Vue.use(Vuex)

export default new Vuex.Store({
  modules: {
    User,
    AICall,
    Admin
  },
  state: {
    cacheMap: {},
    limitMap: {},
    menuCollapse: false,
    tableLoading: false
  },
  getters: {
    limitMap: state => state.limitMap,
    menuCollapse: state => state.menuCollapse,
    tableLoading: state => state.tableLoading
  },
  mutations: {
    changeLimit (state, payload) {
      state.limitMap = Object.assign({}, state.limitMap, {
        [payload.state.key]: payload.state.limit
      })
    },
    toggleMenu (state) {
      state.menuCollapse = !state.menuCollapse
    },
    changeLoading (state, payload) {
      state.tableLoading = payload.state
    }
  },
  actions: {
    changeLimit,
    changeLoading: (context, payload) => {
      context.commit({
        type: 'changeLoading',
        state: payload
      })
    }
  }
})
