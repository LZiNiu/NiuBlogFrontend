// src/utils/http/index.ts
import axios, { 
  type AxiosInstance, 
  type AxiosResponse, 
  AxiosError,
  type InternalAxiosRequestConfig 
} from 'axios';
import { ElMessage } from 'element-plus';
import { checkStatus } from './checkStatus';
import { addPending, removePending } from './cancelRequest';
import type { ApiResponse, CustomRequestConfig } from './types';

// 1. 创建 Axios 实例
const service: AxiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  timeout: Number(import.meta.env.VITE_API_TIMEOUT) || 10000,
  headers: { 'Content-Type': 'application/json;charset=utf-8' },
});

// 2. 请求拦截器
service.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    try {
        // 自动添加防重复处理，可能会抛出 RequestPrevented 错误
        addPending(config);
    } catch (error) {
        // 捕获 RequestPrevented 错误
        if (error instanceof Error && error.name === 'RequestPrevented') {
            // 弹出友好的提示
            ElMessage.warning(error.message);
            // 必须返回一个被拒绝的 Promise 来阻止请求继续发送
            return Promise.reject(error);
        }
        // 否则，抛出其他未知错误
        return Promise.reject(error);
    }

    // *本项目无 Token 逻辑，此处省略 Authorization 设置*
    
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// 3. 响应拦截器
service.interceptors.response.use(
  (response: AxiosResponse) => {
    // 请求完成，从 pendingMap 中移除
    removePending(response.config);

    const res = response.data as ApiResponse;
    const config = response.config as CustomRequestConfig;

    // --- 业务成功 ---
    // 假设后端 200 为成功
    if (res.code === 200) {
      return res.data; 
    }

    // --- 业务失败 ---
    // 只需要这一行调用即可，不用写复杂的 ElMessage
    if (config.showError !== false) {
      ElMessage.error(res.msg || '服务器开小差了');
    }
    
    // 抛出错误，业务侧 catch 可捕获
    return Promise.reject(new Error(res.msg));
  },
  (error: AxiosError) => {
    // 请求失败也需要移除 pending
    if (error.config) {
        removePending(error.config);
    }
    
    // 检查是否是我们阻止的请求 (它不是一个标准的 Axios CanceledError)
    if (error.name === 'RequestPrevented') {
        // 静默处理，不弹窗，不进入后续错误逻辑
        return Promise.reject(error);
    }
    
    // 检查是否是 Axios 取消的请求 (用户快速点击导致的旧请求取消)
    if (axios.isCancel(error)) {
        console.log('Previous request canceled by newer request.'); 
        return Promise.reject(error); 
    }

    // 处理 HTTP 网络错误
    // 提取状态码，调用独立的 checkStatus 函数
    const status = error.response?.status;
    if (status) {
      checkStatus(status);
    } else {
      // 处理断网或超时
      if (error.message.includes('timeout')) ElMessage.error('请求超时！请检查网络');
      else ElMessage.error('网络连接异常');
    }

    return Promise.reject(error);
  }
);

// 4. 导出 (与之前保持一致)
const http = {
  get<T = any>(url: string, params?: any, config?: CustomRequestConfig): Promise<T> {
    return service.get(url, { params, ...config });
  },

  post<T = any>(url: string, data?: any, config?: CustomRequestConfig): Promise<T> {
    return service.post(url, data, config);
  },
  
  put<T = any>(url: string, data?: any, config?: CustomRequestConfig): Promise<T> {
    return service.put(url, data, config);
  },

  delete<T = any>(url: string, params?: any, config?: CustomRequestConfig): Promise<T> {
    return service.delete(url, { params, ...config });
  }
};

export default http;