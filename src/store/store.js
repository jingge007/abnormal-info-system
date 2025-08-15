// store/index.js
import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    // 全局菜单折叠状态
    isCollapsed: false
  },
  mutations: {
    // 切换折叠状态
    toggleCollapsed(state) {
      state.isCollapsed = !state.isCollapsed
    },
    // 设置折叠状态
    setCollapsed(state, val) {
      state.isCollapsed = val
    }
  }
})
