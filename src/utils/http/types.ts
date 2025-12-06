// src/utils/http/types.ts (或 CustomRequestConfig)

import type { InternalAxiosRequestConfig } from 'axios';

export interface CustomRequestConfig extends InternalAxiosRequestConfig {
  showError?: boolean;
  
  // 用于控制重复请求的策略
  // 'prevent' (默认): 如果有相同请求在进行中，则阻止本次请求发送，并提示用户
  // 'cancel'      : 如果有相同请求在进行中，则取消旧请求，发送新请求
  repeatStrategy?: 'prevent' | 'cancel';

  loading?: boolean;   // 是否显示全局 loading，默认 false
}

// 定义后端返回的标准数据格式
// T 默认为 any，代表 data 字段的具体类型
export interface ApiResponse<T = any> {
  code: number; // 业务状态码
  msg: string;  // 业务提示信息
  data: T;      // 业务数据载体
}