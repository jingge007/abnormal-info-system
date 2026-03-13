// API 服务封装

import { apiConfig } from '@/config/apiConfig';

// 通用请求方法
async function request(url, options = {}) {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), apiConfig.timeout);
    
    const response = await fetch(`${apiConfig.baseURL}${url}`, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...options.headers
      },
      signal: controller.signal
    });
    
    clearTimeout(timeoutId);
    
    const data = await response.json();
    
    if (data.code !== 200) {
      throw new Error(data.message || '请求失败');
    }
    
    return data;
  } catch (error) {
    if (error.name === 'AbortError') {
      throw new Error('请求超时');
    }
    console.error('API 请求错误:', error);
    throw error;
  }
}

// 异常报告模块
export const abnormalReportAPI = {
  // 生成异常报告
  generateReport: async (data) => {
    return request(apiConfig.endpoints.abnormalReport.add, {
      method: 'POST',
      body: JSON.stringify(data)
    });
  },
  // 获取异常报告详情
  getReportDetail: async (exceptionReportId) => {
    return request(`${apiConfig.endpoints.abnormalReport.detail}?exceptionReportId=${exceptionReportId}`, {
      method: 'GET'
    });
  },
  // 获取异常报告列表
  getReportList: async (params = { page: 1, pageSize: 10 }) => {
    return request(apiConfig.endpoints.abnormalReport.list, {
      method: 'POST',
      body: JSON.stringify(params)
    });
  },
  // 删除异常报告（单个）
  deleteReport: async (exceptionReportId) => {
    return request(`${apiConfig.endpoints.abnormalReport.delete}?exceptionReportId=${exceptionReportId}`, {
      method: 'DELETE'
    });
  },
  // 删除异常报告（批量）
  batchDeleteReport: async (exceptionReportIds) => {
    return request(apiConfig.endpoints.abnormalReport.delete, {
      method: 'DELETE',
      body: JSON.stringify({ exceptionReportId: exceptionReportIds })
    });
  }
};

// 内容资料模块
export const contentManageAPI = {
  // 生成内容资料
  addNotepad: async (data) => {
    return request(apiConfig.endpoints.contentManage.add, {
      method: 'POST',
      body: JSON.stringify(data)
    });
  },
  
  // 查询内容资料列表
  getList: async (params = { page: 1, pageSize: 10 }) => {
    return request(apiConfig.endpoints.contentManage.list, {
      method: 'POST',
      body: JSON.stringify(params)
    });
  },
  
  // 查询内容资料详情
  getDetail: async (fileContentId) => {
    return request(`${apiConfig.endpoints.contentManage.detail}?fileContentId=${fileContentId}`, {
      method: 'GET'
    });
  },
  
  // 编辑内容资料
  updateNotepad: async (data) => {
    return request(apiConfig.endpoints.contentManage.update, {
      method: 'PUT',
      body: JSON.stringify(data)
    });
  },
  
  // 删除内容资料（单个）
  deleteNotepad: async (fileContentId) => {
    return request(`${apiConfig.endpoints.contentManage.delete}?fileContentId=${fileContentId}`, {
      method: 'DELETE'
    });
  },
  
  // 删除内容资料（批量）
  batchDeleteNotepad: async (fileContentIds) => {
    return request(apiConfig.endpoints.contentManage.delete, {
      method: 'DELETE',
      body: JSON.stringify({ fileContentId: fileContentIds })
    });
  }
};

// 文件上传模块
export const uploadAPI = {
  // 上传文件
  uploadFile: async (file, uploadPath = 'upload') => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('uploadPath', uploadPath);
    
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), apiConfig.timeout);
      
      const response = await fetch(`${apiConfig.baseURL}${apiConfig.endpoints.upload}`, {
        method: 'POST',
        body: formData,
        signal: controller.signal
      });
      
      clearTimeout(timeoutId);
      
      const data = await response.json();
      
      if (data.code !== 200) {
        throw new Error(data.message || '上传失败');
      }
      
      return data;
    } catch (error) {
      if (error.name === 'AbortError') {
        throw new Error('上传超时');
      }
      console.error('文件上传错误:', error);
      throw error;
    }
  }
};
