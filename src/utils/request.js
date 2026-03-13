// axios 请求配置

import axios from 'axios';
import { apiConfig, requestConfig } from '@/config';
import { showLoading, hideLoading } from '@/utils/loading';

// 创建 axios 实例
const service = axios.create({
  baseURL: apiConfig.baseURL,
  timeout: apiConfig.timeout,
  headers: requestConfig.headers
});

// 请求拦截器
service.interceptors.request.use(
  (config) => {
    // 处理 loading
    if (config.loading !== false) {
      // 如果没有传入 loadingText，根据请求方法设置默认值
      const method = config.method || 'GET';
      const defaultLoadingText = ['GET'].includes(method.toUpperCase()) 
        ? requestConfig.loading.queryText
        : requestConfig.loading.mutateText;
      showLoading(config.loadingText || defaultLoadingText);
    }
    return config;
  },
  (error) => {
    // 隐藏 loading
    if (error.config && error.config.loading !== false) {
      hideLoading();
    }
    console.error('请求错误:', error);
    return Promise.reject(error);
  }
);

// 响应拦截器
service.interceptors.response.use(
  (response) => {
    // 隐藏 loading
    if (response.config.loading !== false) {
      hideLoading();
    }
    
    const data = response.data;
    if (data.code !== 200) {
      throw new Error(data.message || '请求失败');
    }
    return data;
  },
  (error) => {
    // 隐藏 loading
    if (error.config && error.config.loading !== false) {
      hideLoading();
    }
    
    if (error.code === 'ECONNABORTED') {
      throw new Error('请求超时');
    }
    console.error('API 请求错误:', error);
    throw error;
  }
);

// 通用请求方法
export async function request(url, options = {}) {
  const { loading = true, loadingText, method = 'GET', ...axiosOptions } = options;
  
  // 根据请求方法设置默认的 loadingText
  const defaultLoadingText = ['GET'].includes(method.toUpperCase()) 
    ? requestConfig.loading.queryText
    : requestConfig.loading.mutateText;
  
  return service({
    url,
    method,
    ...axiosOptions,
    loading,
    loadingText: loadingText || defaultLoadingText
  });
}

export default service;
