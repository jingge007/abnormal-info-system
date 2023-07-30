import Vue from 'vue';
import Router from 'vue-router';

const originalPush = Router.prototype.push;
Router.prototype.push = function push(location) {
  return originalPush.call(this, location).catch(err => err);
};
Vue.use(Router);
const routes = [
  {
    path: '/',
    redirect: '/generateExceptionReport',
    component: () => import('@/components/generateExceptionReport'),
  },
  {
    path: '/generateExceptionReport',
    component: resolve => {
      require(['@/components/generateExceptionReport.vue'], resolve);
    }
  },
  {
    path: '/errorReport',
    component: resolve => {
      require(['@/components/errorReport.vue'], resolve);
    }
  }
];
const router = new Router({
  mode: 'hash',
  routes
});
export default router;
