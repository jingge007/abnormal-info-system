export default {
  state: {
    isCollapsed: false,
  },
  mutations: {
    isCollapsed(state, data) {
      state.isCollapsed = data;
    }
  }
}