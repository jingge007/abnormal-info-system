import AV from 'leancloud-storage';

const appId = 'MY5S5LpavKxyigXSGD4gMSTQ-gzGzoHsz';
const appKey = 'xWWkXr5wJ4BL5XeBH9ODKOED';
const serverURL = 'https://my5s5lpa.lc-cn-n1-shared.com';

AV.init({appId, appKey, serverURL});
AV.debug.enable();

export default {
  install: (Vue) => {
    Vue.prototype.$leancloud = AV;
  },
};
