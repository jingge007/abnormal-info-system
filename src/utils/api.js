// API 服务封装

import { request, default as service } from '@/utils/request';
import { apiConfig } from '@/config/apiConfig';

// 异常报告模块
export const abnormalReportAPI = {
  // 生成异常报告
  generateReport: async (data, options = {}) => {
    const { loading = true, loadingText } = options;
    return request(apiConfig.endpoints.abnormalReport.add, {
      method: 'POST',
      data: JSON.stringify(data),
      loading,
      loadingText
    });
  },
  // 获取异常报告详情
  getReportDetail: async (exceptionReportId, options = {}) => {
    const { loading = true, loadingText } = options;
    return request(`${apiConfig.endpoints.abnormalReport.detail}?exceptionReportId=${exceptionReportId}`, {
      method: 'GET',
      loading,
      loadingText
    });
  },
  // 获取异常报告列表
  getReportList: async (params = { page: 1, pageSize: 10 }, options = {}) => {
    const { loading = true, loadingText } = options;
    return request(apiConfig.endpoints.abnormalReport.list, {
      method: 'POST',
      data: JSON.stringify(params),
      loading,
      loadingText
    });
  },
  // 删除异常报告（单个）
  deleteReport: async (exceptionReportId, options = {}) => {
    const { loading = true, loadingText } = options;
    return request(`${apiConfig.endpoints.abnormalReport.delete}?exceptionReportId=${exceptionReportId}`, {
      method: 'DELETE',
      loading,
      loadingText
    });
  },
  // 删除异常报告（批量）
  batchDeleteReport: async (exceptionReportIds, options = {}) => {
    const { loading = true, loadingText } = options;
    return request(apiConfig.endpoints.abnormalReport.delete, {
      method: 'DELETE',
      data: JSON.stringify({ exceptionReportId: exceptionReportIds }),
      loading,
      loadingText
    });
  }
};

// 内容资料模块
export const contentManageAPI = {
  // 生成内容资料
  addNotepad: async (data, options = {}) => {
    const { loading = true, loadingText } = options;
    return request(apiConfig.endpoints.contentManage.add, {
      method: 'POST',
      data: JSON.stringify(data),
      loading,
      loadingText
    });
  },
  
  // 查询内容资料列表
  getList: async (params = { page: 1, pageSize: 10 }, options = {}) => {
    const { loading = true, loadingText } = options;
    return request(apiConfig.endpoints.contentManage.list, {
      method: 'POST',
      data: JSON.stringify(params),
      loading,
      loadingText
    });
  },
  
  // 查询内容资料详情
  getDetail: async (fileContentId, options = {}) => {
    const { loading = true, loadingText } = options;
    return request(`${apiConfig.endpoints.contentManage.detail}?fileContentId=${fileContentId}`, {
      method: 'GET',
      loading,
      loadingText
    });
  },
  
  // 编辑内容资料
  updateNotepad: async (data, options = {}) => {
    const { loading = true, loadingText } = options;
    return request(apiConfig.endpoints.contentManage.update, {
      method: 'PUT',
      data: JSON.stringify(data),
      loading,
      loadingText
    });
  },
  
  // 删除内容资料（单个）
  deleteNotepad: async (fileContentId, options = {}) => {
    const { loading = true, loadingText } = options;
    return request(`${apiConfig.endpoints.contentManage.delete}?fileContentId=${fileContentId}`, {
      method: 'DELETE',
      loading,
      loadingText
    });
  },
  
  // 删除内容资料（批量）
  batchDeleteNotepad: async (fileContentIds, options = {}) => {
    const { loading = true, loadingText } = options;
    return request(apiConfig.endpoints.contentManage.delete, {
      method: 'DELETE',
      data: JSON.stringify({ fileContentId: fileContentIds }),
      loading,
      loadingText
    });
  }
};

// 文件上传模块
export const uploadAPI = {
  // 上传文件
  uploadFile: async (file, uploadPath = 'upload', options = {}) => {
    const { loading = true, loadingText = '上传中...' } = options;
    const formData = new FormData();
    formData.append('file', file);
    formData.append('uploadPath', uploadPath);
    
    return request(apiConfig.endpoints.upload, {
      method: 'POST',
      data: formData,
      headers: {
        'Content-Type': 'multipart/form-data'
      },
      loading,
      loadingText
    });
  }
};
