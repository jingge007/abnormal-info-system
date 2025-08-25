import Vue from 'vue'
import App from './App.vue'
import viewDesign from 'view-design';
import Vuex from 'vuex';
import leancloud from "@/plugins/leancloud";
import store from "@/store/store";
import moment from 'moment';
import router from "./router"; // 路由
import 'moment/locale/zh-cn';
import '@wangeditor/editor/dist/css/style.css'
import 'windi.css';
import 'view-design/dist/styles/iview.css';
import "@/styles/index.less"
import tools from "@/utils/tools";
import components from '@/utils/components';

// 引入 v-viewer 插件和样式
import Viewer from 'v-viewer'
import 'viewerjs/dist/viewer.css'

moment.locale('zh-cn');
const MomentPlugin = {
  install(Vue) {
    Vue.prototype.$moment = moment;
  },
};

// 配置 v-viewer 插件
Viewer.setDefaults({
  Options: {
    navbar: false, // 是否显示缩略图底部导航栏
    title: false, // 是否显示缩略图标题栏
    zIndex: 9999999,
    toolbar: {
      zoomIn: true,
      zoomOut: true,
      oneToOne: true,
      reset: false, // 隐藏重置按钮
      prev: false, // 隐藏左翻页按钮
      play: false, // 隐藏播放按钮
      next: false, // 隐藏右翻页按钮
      rotateLeft: true,
      rotateRight: true,
      flipHorizontal: true,
      flipVertical: true
    }
  }
});

Vue.prototype.$tools = tools;
Vue.use(components);
Vue.use(MomentPlugin);
Vue.use(leancloud);
Vue.use(Vuex);
Vue.use(Viewer); // 使用 v-viewer 插件

Vue.config.productionTip = false
Vue.use(viewDesign)
new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
