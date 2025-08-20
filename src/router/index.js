import Vue from 'vue';
import Router from 'vue-router';

// 解决重复点击相同路由报错的问题
const originalPush = Router.prototype.push;
Router.prototype.push = function push(location) {
  return originalPush.call(this, location).catch(err => err);
};
Vue.use(Router);

/**
 * 路由参数说明：
 * path        路由访问路径
 * name        路由名称（唯一），用于导航跳转
 * component   路由对应的组件
 * redirect    重定向路径
 * children    子路由（支持多级嵌套）
 *
 * meta        元信息（菜单及页面配置）：
 *  - title        菜单或页面标题（显示在侧边栏和标签页）
 *  - icon         菜单图标（配合 <base-icon> 组件使用）
 *  - singlePage   是否是单页面菜单（true：点击直接进入页面；false：有子菜单）
 *  - icon_size    展开状态下菜单图标大小
 *  - size         折叠状态下菜单图标大小
 *  - hideInMenu   是否在侧边栏隐藏当前路由（true：隐藏，false：显示）
 *  - externalMenu 是否是外部菜单（true：外部菜单，false：内部菜单）
 */
const routes = [
  {
    path: '/',
    redirect: '/generateExceptionReport', // 默认重定向
    component: () => import('@/components/baseMain'),
    children: [
      {
        path: '/generateExceptionReport',
        name: 'generateExceptionReport',
        component: () => import('@/views/generateExceptionReport'),
        meta: {
          title: '生成异常报告',
          icon: 'icon-shengchengbaogao',
          singlePage: true,
          icon_size: '18px',
          size: '18px'
        }
      },
      {
        path: '/packagedService',
        name: 'packagedService',
        component: () => import('@/views/packagedService'),
        meta: {
          title: '打包服务',
          icon: 'icon-ziyuanguanli',
          singlePage: true,
          icon_size: '18px',
          size: '18px'
        }
      },
      {
        path: '/uploadContentMaterials',
        name: 'uploadContentMaterials',
        component: () => import('@/views/uploadContentMaterials'),
        meta: {
          title: '内容资料上传',
          icon: 'icon-cailiaoshenbao',
          singlePage: true,
          icon_size: '18px',
          size: '18px'
        }
      },
      {
        path: '/notepadList',
        name: 'notepadList',
        component: () => import('@/views/notepadList'),
        meta: {
          title: '记事本列表',
          icon: 'icon-jishiben',
          singlePage: true,
          icon_size: '18px',
          size: '18px'
        }
      },
    ]
  },
  {
    path: '/errorReport',
    name: 'errorReport',
    component: () => import('@/views/errorReport')
  },
  {
    path: '/generateExternalExceptionReport',
    name: 'generateExternalExceptionReport',
    component: () => import('@/views/generateExceptionReport'),
    meta: {
      title: '生成外部异常报告',
      icon: 'icon-waibubaogao',
      icon_size: '21px',
      size: '21px',
      singlePage: true,
      externalMenu: true
    }
  },
  {
    path: '/notepadDetails',
    name: 'notepadDetails',
    component: () => import('@/views/notepadDetails'),
    meta: {
      title: '记事本详情',
      singlePage: true,
      hideInMenu: true,
      externalMenu: true
    }
  },
];

export default new Router({
  mode: 'hash',
  routes
});
