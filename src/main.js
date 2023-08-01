import Vue from 'vue'
import App from './App.vue'
import viewDesign from 'view-design';
import leancloud from "@/plugins/leancloud";
import moment from 'moment';
import router from "./router"; // 路由
import 'moment/locale/zh-cn';
import 'view-design/dist/styles/iview.css';
import "@/styles/index.less"
import tools from "@/utils/tools";

moment.locale('zh-cn');
const MomentPlugin = {
  install(Vue) {
    Vue.prototype.$moment = moment;
  },
};
Vue.prototype.$tools = tools;
Vue.use(MomentPlugin);
Vue.use(leancloud);

Vue.config.productionTip = false
Vue.use(viewDesign)
new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
