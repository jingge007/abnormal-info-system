import Vue from 'vue';
import Router from 'vue-router';
import config from '@/config';
import {getToken} from '@/utils/cookie';
import {
  getAccessToken,
  refreshToken,
  getErpconfig,
  nonexistent,
  getQueryMenu,
  getSinglePageRoleCommon,
  openClothingCategories, webDataCollectionFn, getConfigureLanguage
} from '@/utils/user';
import {
  deleteTicket
} from '@/utils/index';

const originalPush = Router.prototype.push;
Router.prototype.push = function push(location) {
  return originalPush.call(this, location).catch(err => err);
};
Vue.use(Router);
let countTime = config.curTime;
const routes = [
  {
    path: '/',
    redirect: '/statistics',
    component: () => import('@/components/layout/main'), // 引入主文件
    children: [
      {
        path: '/noPersermission',
        component: () => import('@/components/common/noPersermission')
      },
      {
        path: '/statistics', // 即时经营数据
        component: () => import('@/views/yms/components/statistics/statistics')
      },
      {
        path: '/supplierList', // 供应商管理---供应商列表
        component: () => import('@/views/yms/components/supplierManagement/supplierList')
      },
      {
        path: '/supplierLevel', // 供应商管理---供应商等级管理
        component: () => import('@/views/yms/components/supplierManagement/supplierLevel')
      },
      {
        path: '/customerList', // 客户管理---客户列表
        component: () => import('@/views/yms/components/customerManage/customerList')
      },
      {
        path: '/customerLabel', // 客户管理---客户标签
        component: () => import('@/views/yms/components/customerManage/customerLabel')
      },
      {
        path: '/customerGroups', // 客户管理---客户分组
        component: () => import('@/views/yms/components/customerManage/customerGroups')
      },
      {
        path: '/customerGrade', // 客户管理---客户等级
        component: () => import('@/views/yms/components/customerManage/customerGrade')
      },
      {
        path: '/tuokeLink', // 客户管理---拓客链接
        component: () => import('@/views/yms/components/customerManage/tuokeLink')
      },
      {
        path: '/productList', // 商品管理---商品列表
        component: () => import('@/views/yms/components/commodityManage/productList')
      },
      {
        path: '/viewSku', // 商品管理---商品列表---查看SKU
        component: () => import('@/components/common/viewSku'),
        meta: {
          parentPath: '/productList'
        }
      },
      {
        path: '/productDetails', // 商品管理--商品列表---编辑商品
        component: () => import('@/components/common/productDetails'),
        meta: {
          parentPath: '/productList'
        }
      },
      {
        path: '/category', // 商品管理---商品分类
        component: () => import('@/views/yms/components/commodityManage/category'),
      },
      {
        path: '/sizeTemplateManage', // 尺码管理
        component: () => import('@/views/yms/components/commodityManage/sizeTemplateManage'),
      },
      {
        path: '/updateSizeTemplate', // 新增/编辑尺码模板
        component: () => import('@/views/yms/components/commodityManage/updateSizeTemplate'),
        meta: {
          parentPath: '/sizeTemplateManage'
        }
      },
      {
        path: '/approvalList', // 商品管理--待审核列表
        component: () => import('@/views/yms/components/commodityManage/approvalList'),
      },
      {
        path: '/approvalDetails', // 商品管理--待审核列表---审核/编辑商品
        component: () => import('@/components/common/productDetails'),
        meta: {
          parentPath: '/approvalList'
        }
      },
      {
        path: '/itemAttributes', // 商品管理--物品属性池
        component: () => import('@/views/yms/components/commodityManage/itemAttributes'),
      },
      {
        path: '/orderList', // 云卖订单
        component: () => import('@/views/yms/components/orderList/orderList')
      },
      {
        path: '/orderListDetails', // 云卖订单详情
        component: () => import('@/views/yms/components/orderList/orderListDetails'),
        meta: {
          parentPath: '/orderList'
        }
      },
      {
        path: '/supplierOrderDetails', // 供应商订单详情
        component: () => import('@/views/yms/components/orderList/supplierOrderDetails')
      },
      {
        path: '/supplierStockList', // 供应商备货单
        component: () => import('@/views/yms/components/orderList/supplierStockList')
      },
      {
        path: '/supplierStockOrderDetails', // 供应商备货单详情
        component: () => import('@/views/yms/components/orderList/supplierStockOrderDetails'),
        meta: {
          parentPath: '/supplierStockList'
        }
      },
      {
        path: '/supplierBillManage', // 财务管理---供应商账单管理
        component: () => import('@/views/yms/components/financialManage/supplierBill')
      },
      {
        path: '/supplierBillDetails', // 财务管理---供应商账单管理详情
        component: () => import('@/views/yms/components/financialManage/supplierBillDetails')
      },
      {
        path: '/financialJournal', // 财务管理---费用明细
        component: () => import('@/views/yms/components/financialManage/financialJournal')
      },
      {
        path: '/rechargeRecord', // 财务管理---充值记录
        component: () => import('@/views/yms/components/financialManage/rechargeRecord')
      },
      {
        path: '/passwordManage', // 财务管理---密码管理
        component: () => import('@/views/yms/components/financialManage/passwordManage')
      },
      {
        path: '/subsidyReview', // 财务管理---补贴审核
        component: () => import('@/views/yms/components/financialManage/subsidyReview')
      },
      {
        path: '/billLadingManage', // 入库管理---提单管理
        component: () => import('@/views/yms/components/collectionManage/billLadingManage')
      },
      {
        path: '/billLadingManageDetails', // 入库管理---提单管理详情
        component: () => import('@/views/yms/components/collectionManage/billLadingManageDetails'),
        meta: {
          parentPath: '/billLadingManage'
        }
      },
      {
        path: '/billWarehousing', // 入库管理---提单入库
        component: () => import('@/views/yms/components/collectionManage/billWarehousing')
      },
      {
        path: '/commoditySorting', // 入库管理---入库分拣
        component: () => import('@/views/yms/components/collectionManage/commoditySorting')
      },
      {
        path: '/commoditySticker', // 入库管理---商品贴单
        component: () => import('@/views/yms/components/collectionManage/commoditySticker')
      },
      {
        path: '/commodityShelves', // 入库管理---商品上架
        component: () => import('@/views/yms/components/collectionManage/commodityShelves')
      },
      {
        path: '/handoverSheetManage', // 入库管理---物流商交接单管理
        component: () => import('@/views/yms/components/collectionManage/handoverSheetManage')
      },
      {
        path: '/handoverSheetManageDetails', // 入库管理---物流商交接单管理详情
        component: () => import('@/views/yms/components/collectionManage/handoverSheetManageDetails'),
        meta: {
          parentPath: '/handoverSheetManage'
        }
      },
      {
        path: '/sortingOut', // 入库管理---物流分拣
        component: () => import('@/views/yms/components/collectionManage/sortingOut')
      },
      {
        path: '/wms/inventoryLevels', // 仓储管理--库存余量
        component: () => import('@/views/yms/components/wms/wms-inStock/inventoryLevels')
      },
      {
        path: '/wms/generateOrderList', // 仓储管理--拣货--生成拣货单
        component: () => import('@/views/yms/components/wms/exWarehouse/generateOrderList')
      },
      {
        path: '/generateOrderDetails', // 仓储管理--拣货--生成拣货单详情
        component: () => import('@/views/yms/components/orderList/orderListDetails'),
        meta: {
          parentPath: '/wms/generateOrderList'
        }
      },
      {
        path: '/wms/pickList', // 仓储管理--拣货--拣货单列表
        component: () => import('@/views/yms/components/wms/exWarehouse/pickList')
      },
      {
        path: '/wms/pickListDetails', // 仓储管理--拣货--拣货单详情
        component: () => import('@/views/yms/components/wms/exWarehouse/pickListDetails'),
        meta: {
          parentPath: '/wms/pickList'
        }
      },
      {
        path: '/wms/sortOrderSetting', // 仓储管理--见货出单---见货出单设置
        component: () => import('@/views/yms/components/wms/exWarehouse/sortOrderSetting')
      },
      {
        path: '/wms/sorting', // 仓储管理--见货出单---多品分拣
        component: () => import('@/views/yms/components/wms/exWarehouse/sorting')
      },
      {
        path: '/wms/packWorking', // 仓储管理--见货出单---包装作业
        component: () => import('@/views/yms/components/wms/exWarehouse/pickingReview')
      },
      {
        path: '/warehouseManage', // 基础设置---仓库管理
        component: () => import('@/views/yms/components/basicSettings/warehouseManage')
      },
      {
        path: '/reservoirManage', // 基础设置---库区管理
        component: () => import('@/views/yms/components/basicSettings/reservoirManage')
      },
      {
        path: '/locationManage', // 基础设置---库位管理
        component: () => import('@/views/yms/components/basicSettings/locationManage')
      },
      {
        path: '/exchangeRateConfig', // 基础设置---汇率配置
        component: () => import('@/views/yms/components/basicSettings/exchangeRateConfig')
      },
      {
        path: '/ymsLogistics', // 物流管理--YMS物流
        component: () => import('@/views/yms/components/logisticsManage/ymsLogistics')
      },
      {
        path: '/basicLogistics', // 物流管理--基础物流
        component: () => import('@/views/yms/components/logisticsManage/basicLogistics')
      },
      {
        path: '/smartLogisticsRule', // 物流管理--智能物流规则
        component: () => import('@/views/yms/components/logisticsManage/smartLogisticsRule')
      },
      {
        path: '/messageNotification', // 基础设置--消息通知
        component: () => import('@/views/yms/components/basicSettings/messageNotification')
      },
      {
        path: '/activityManage', // 营销管理--活动管理
        component: () => import('@/views/yms/components/marketingManage/activityManage')
      },
      {
        path: '/editActivity', // 营销管理--活动管理--新增、编辑活动
        component: () => import('@/views/yms/components/marketingManage/editActivity'),
        meta: {
          parentPath: '/activityManage'
        }
      },
      {
        path: '/advertisingManage', // 营销管理--广告管理
        component: () => import('@/views/yms/components/marketingManage/advertisingManage')
      },
      {
        path: '/rotationChart', // 营销管理--广告管理--首页轮播图
        component: () => import('@/views/yms/components/marketingManage/rotationChart'),
        meta: {
          parentPath: '/advertisingManage'
        }
      },
      {
        path: '/vajraDistrict', // 营销管理--广告管理--金刚区
        component: () => import('@/views/yms/components/marketingManage/vajraDistrict'),
        meta: {
          parentPath: '/advertisingManage'
        }
      },
      {
        path: '/topAdvertisingSpace', // 营销管理--广告管理--顶部广告位
        component: () => import('@/views/yms/components/marketingManage/topAdvertisingSpace'),
        meta: {
          parentPath: '/advertisingManage'
        }
      },
      {
        path: '/sideAdvertisingSpace', // 营销管理--广告管理--侧边广告位
        component: () => import('@/views/yms/components/marketingManage/sideAdvertisingSpace'),
        meta: {
          parentPath: '/advertisingManage'
        }
      },
      {
        path: '/infoAdvertisingSpace', // 营销管理--广告管理--首页-个人信息下方广告位
        component: () => import('@/views/yms/components/marketingManage/infoAdvertisingSpace'),
        meta: {
          parentPath: '/advertisingManage'
        }
      },
      {
        path: '/subsidyRules', // 营销管理--补贴规则
        component: () => import('@/views/yms/components/marketingManage/subsidyRules')
      },
      {
        path: '/helpCenter', // 内容管理--帮助中心
        component: () => import('@/views/yms/components/contentManage/helpCenter')
      },
      {
        path: '/questionnaireInvestigation', // 内容管理--问卷调查
        component: () => import('@/views/yms/components/contentManage/questionnaireInvestigation')
      },
      {
        path: '/addQuestionnaire', // 内容管理--问卷调查--新建问卷
        component: () => import('@/views/yms/components/contentManage/questionnaire'),
        meta: {
          parentPath: '/questionnaireInvestigation'
        }
      },
      {
        path: '/editQuestionnaire', // 内容管理--问卷调查--编辑问卷
        component: () => import('@/views/yms/components/contentManage/questionnaire'),
        meta: {
          parentPath: '/questionnaireInvestigation'
        }
      },
      {
        path: '/questionnaireStatistics', // 内容管理--问卷调查--统计
        component: () => import('@/views/yms/components/contentManage/questionnaireStatistics'),
        meta: {
          parentPath: '/questionnaireInvestigation'
        }
      },
      {
        path: '/operatingInstructions', // 内容管理--操作指引
        component: () => import('@/views/yms/components/contentManage/operatingInstructions')
      },
      {
        path: '/systemAnnouncement', // 内容管理--系统公告
        component: () => import('@/views/yms/components/contentManage/systemAnnouncement')
      },
      {
        path: '/deliveryDetails', // 数据中心--出库明细
        component: () => import('@/views/yms/components/dataCenter/deliveryDetails')
      },
      {
        path: '/messageCenter', // 基础设置--消息中心
        component: () => import('@/views/yms/components/basicSettings/messageCenter')
      },
      {
        path: '/messageMailboxes', // 基础设置--消息中心--消息、邮箱查看
        component: () => import('@/views/yms/components/basicSettings/messageMailboxes')
      },
      {
        path: '/containerManage', // 基础设置--容器管理
        component: () => import('@/views/yms/components/basicSettings/containerManage')
      },
      {
        path: '/containerSettings', // 基础设置--容器类型设置
        component: () => import('@/views/yms/components/basicSettings/containerSettings')
      },
      {
        path: '/processConfiguration', // 基础设置--出入库流程配置
        component: () => import('@/views/yms/components/basicSettings/processConfiguration')
      },
      {
        path: '/declarationRules', // 基础设置--申报规则
        component: () => import('@/views/yms/components/basicSettings/declarationRules')
      },
      {
        path: '/automaticDistributionRules', // 基础设置--自动分仓规则
        component: () => import('@/views/yms/components/basicSettings/automaticDistributionRules')
      },
      {
        path: '/employeeList', // 员工管理---员工列表
        component: () => import('@/views/yms/components/employeeManage/employeeList')
      },
      {
        path: '/importTask', // 导入/导出任务--导入查看
        component: () => import('@/views/yms/components/importExportTask/importTask')
      },
      {
        path: '/exportTask', // 导入/导出任务---导出查看
        component: () => import('@/views/yms/components/importExportTask/exportTask')
      },
    ]
  },
  {
    path: '/sortingInfo', // 扫描多品常规分拣
    component: resolve => {
      require(['@/views/yms/components/wms/exWarehouse/sortingInfo.vue'], resolve);
    },
    meta: {
      parentPath: '/wms/sorting'
    }
  },
  {
    path: '/choiceSortingInfo', // 扫描多品备货分拣
    component: resolve => {
      require(['@/views/yms/components/wms/exWarehouse/choiceSortingInfo.vue'], resolve);
    },
    meta: {
      parentPath: '/wms/sorting'
    }
  },
  {
    path: '/printPickListBatch',
    component: resolve => {
      require(['@/views/yms/components/wms/exWarehouse/printPickListBatch.vue'], resolve);
    },
    meta: {
      parentPath: '/wms/pickList'
    }
  },
  {
    path: '/printPickList', // 打印拣货单
    component: resolve => {
      require(['@/views/yms/components/wms/exWarehouse/printPickList.vue'], resolve);
    }
  },
  {
    path: '/packingWork', // 常规包装
    component: resolve => {
      require(['@/views/yms/components/wms/exWarehouse/packingWork.vue'], resolve);
    },
    meta: {
      parentPath: '/wms/packWorking'
    }
  },
  {
    path: '/choicePackingWork', // 备货包装
    component: resolve => {
      require(['@/views/yms/components/wms/exWarehouse/choicePackingWork.vue'], resolve);
    },
    meta: {
      parentPath: '/wms/packWorking'
    }
  },
  {
    path: '/commoditySortingOperation', // 入库管理---入库分拣作业
    component: resolve => {
      require(['@/views/yms/components/collectionManage/commoditySortingOperation.vue'], resolve);
    },
    meta: {
      parentPath: '/commoditySorting'
    }
  },
  {
    path: '/commodityStickerOperation', // 入库管理---商品贴单作业
    component: resolve => {
      require(['@/views/yms/components/collectionManage/commodityStickerOperation.vue'], resolve);
    },
    meta: {
      parentPath: '/commoditySticker'
    }
  },
  {
    path: '/merchantSettlement', // 商户入驻
    component: () => import('@/views/yms/components/merchantSettlement/merchantSettlement.vue')
  },
  {
    path: '/previewHelpCenter', // 帮助中心--预览内容
    component: () => import('@/views/yms/components/contentManage/previewHelpCenter')
  },
];
const router = new Router({
  mode: 'hash',
  routes
});
router.beforeEach((to, from, next) => {
  localStorage.setItem('system', 'yms');
  // 判断当前的token是否已经过期
  const token = getToken();
  let pathName = '';
  let pathIndex = '';
  if (Object.keys(to.meta).length > 0 && to.meta.parentPath) {
    pathIndex = to.meta.parentPath.split('/');
  } else {
    pathIndex = to.path.split('/');
  }

  if (pathIndex[2]) {
    pathName = pathIndex[1] + '_' + pathIndex[2];
  } else {
    pathName = pathIndex[1];
  }
  let menuKey = 'yms_' + pathName;
  getConfigureLanguage();
  if (token) {
    refreshToken(countTime);
    if (to.path === '/merchantSettlement') {
      // 入驻界面
      if (window.location.href.includes('ticket=')) {
        window.location.href = deleteTicket(window.location.href);
        window.location.reload();
      } else {
        next();
      }
      return;
    }
    openClothingCategories();
    getQueryMenu().then(() => {
      Promise.all([getErpconfig(''), getSinglePageRoleCommon(menuKey)]).then(result => {
        if (result[0] && result[1]) {
          nonexistent(to, next);
        }
      });
    });
  } else {
    webDataCollectionFn();
    if (to.path === '/merchantSettlement') {
      // 入驻界面
      getAccessToken(to.fullPath).then(result => {
        if (window.location.href.includes('ticket=')) {
          window.location.href = deleteTicket(window.location.href);
          window.location.reload();
        } else {
          next();
        }
      });
      return;
    }
    getAccessToken(to.fullPath).then(result => {
      if (result) {
        setTimeout(function () {
          refreshToken(countTime);
        }, countTime);
        getQueryMenu().then(() => {
          Promise.all([getErpconfig(''), getSinglePageRoleCommon(menuKey)]).then(result => {
            if (result[0] && result[1]) {
              nonexistent(to, next);
            }
          });
        });
      }
    });
  }
});
export default router;
