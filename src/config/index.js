/**
 * 项目统一配置文件
 * 集中管理所有配置项，方便维护和修改
 */

// API 配置
export const apiConfig = {
  // API 基础路径
  baseURL: '/api',
  // 请求超时时间（毫秒）- 2 分钟
  timeout: 120000,
  // API 端点配置
  endpoints: {
    // 异常报告相关
    abnormalReport: {
      add: '/workAbnormalReport/addAbnormalReport',
      detail: '/workAbnormalReport/abnormalReportDetails',
      list: '/workAbnormalReport/abnormalReportList',
      delete: '/workAbnormalReport/deleteAbnormalReport'
    },
    // 内容资料相关
    contentManage: {
      add: '/workContentManage/addNotepad',
      list: '/workContentManage/addNotepadList',
      detail: '/workContentManage/addNotepadDetails',
      update: '/workContentManage/updateNotepad',
      delete: '/workContentManage/deleteNotepad'
    },
    // 文件上传相关
    upload: '/uploadFileData'
  }
};

// 上传配置
export const uploadConfig = {
  // 上传路径配置
  paths: {
    // 异常报告上传路径
    abnormalReport: 'abnormalReportUpload',
    // 内容资料上传路径
    contentMaterials: 'materials',
    // 其他业务上传路径
    default: 'upload'
  }
};

// 请求配置
export const requestConfig = {
  // 默认请求头
  headers: {
    'Content-Type': 'application/json'
  },
  // 默认 loading 配置
  loading: {
    // 是否默认开启 loading
    enabled: true,
    // 查询请求默认文案
    queryText: '加载中...',
    // 变更请求默认文案
    mutateText: '处理中...'
  }
};

// 环境配置
export const envConfig = {
  // 当前环境
  env: process.env.NODE_ENV,
  // 是否为开发环境
  isDev: process.env.NODE_ENV === 'development',
  // 是否为生产环境
  isProd: process.env.NODE_ENV === 'production',
  // 线上域名
  prodDomain: 'https://abnormal-info-system.taicisou.cn',
  // 本地开发域名
  devDomain: 'http://localhost:8080'
};

// 导出所有配置
export default {
  apiConfig,
  uploadConfig,
  requestConfig,
  envConfig
};
