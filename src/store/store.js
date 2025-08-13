import Vue from 'vue';
import Vuex from 'vuex';
import index from './index';

Vue.use(Vuex);
export default new Vuex.Store({
  state: {
    ...index.state,
  },
  mutations: {
    ...index.mutations,
  },
  actions: {
    ...index.actions,
  },
  modules: {}
});
