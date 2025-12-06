// src/utils/http/cancelRequest.ts
import type { InternalAxiosRequestConfig } from 'axios';
import type { CustomRequestConfig } from './types';
import qs from 'qs';

// 存储当前处于 pending 状态的请求
// Key: 请求的唯一标识, Value: AbortController
const pendingMap = new Map<string, AbortController>();

/**
 * @description: 生成唯一的每个请求的标识
 */
export const getPendingUrl = (config: InternalAxiosRequestConfig) => {
  // 比如：GET/api/user?id=1
  return [
    config.method,
    config.url,
    qs.stringify(config.data), 
    qs.stringify(config.params)
  ].join('&');
};

/**
 * @description: 添加请求到 pendingMap
 */
/**
 * @description: 添加请求到 pendingMap
 * @param {CustomRequestConfig} config 
 */
export const addPending = (config: CustomRequestConfig) => {
  const url = getPendingUrl(config);
  
  // 1. 获取请求策略，默认为 'prevent'
  const strategy = config.repeatStrategy ?? 'prevent'; 
  
  // --- 策略判断：如果 Map 中已有相同的请求 Key ---
  if (pendingMap.has(url)) {
    if (strategy === 'prevent') {
      // 策略：防止重复 (适合表单提交)
      // 抛出自定义错误，阻止 Axios 发送，且不会触发 ElMessage 的网络错误
      const error = new Error("请求处理中，请勿短时间内重复请求");
      error.name = 'RequestPrevented'; // 设定特殊的错误名称
      throw error; 

    } else if (strategy === 'cancel') {
      // 策略：取消旧请求 (适合搜索、竞态避免)
      removePending(config); // 取消上一个
    }
  }

  // --- 正常逻辑：创建并添加新的 AbortController ---
  const controller = new AbortController();
  config.signal = controller.signal; // 绑定 signal
  pendingMap.set(url, controller);
};

/**
 * @description: 移除请求
 */
export const removePending = (config: InternalAxiosRequestConfig) => {
  const url = getPendingUrl(config);

  if (pendingMap.has(url)) {
    // 如果存在，说明有重复请求，调用 abort() 取消上一个请求
    const controller = pendingMap.get(url);
    controller && controller.abort();
    // 从 Map 中删除
    pendingMap.delete(url);
  }
};

/**
 * @description: 清空所有 pending (比如路由切换时调用)
 */
export const removeAllPending = () => {
  pendingMap.forEach((controller) => {
    controller && controller.abort();
  });
  pendingMap.clear();
};