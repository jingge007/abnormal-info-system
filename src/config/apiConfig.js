// API配置
export const apiConfig = {
  // API基础路径
  baseURL: '/api',
  // 请求超时时间（毫秒）
  timeout: 120000,
  // API端点配置
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