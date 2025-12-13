import { AxiosRequestConfig, AxiosResponse } from 'axios';

export interface ApiConfig extends AxiosRequestConfig {
  cache?: boolean;
  cacheTTL?: number;
  trackRequest?: boolean;
  skipErrorHandler?: boolean;
}

export interface ApiResponse<T = any> {
  data: T;
  status: number;
  statusText: string;
  headers: any;
  config: ApiConfig;
  fromCache?: boolean;
  responseTime?: number;
}

export interface ApiError {
  message: string;
  status?: number;
  statusText?: string;
  data?: any;
  config?: ApiConfig;
}

export interface ApiLogEntry {
  id?: string;
  user_id?: string;
  endpoint: string;
  method: string;
  request_body?: any;
  response_status?: number;
  response_data?: any;
  response_time: number;
  cache_hit: boolean;
  error_message?: string;
  created_at?: string;
}

export interface ApiStats {
  totalRequests: number;
  cacheHits: number;
  cacheMisses: number;
  averageResponseTime: number;
  errorCount: number;
  successRate: number;
}

export interface CacheEntry<T = any> {
  data: T;
  timestamp: number;
  expiresAt?: number;
}

export type RequestInterceptor = (config: ApiConfig) => ApiConfig | Promise<ApiConfig>;
export type ResponseInterceptor = (response: AxiosResponse) => AxiosResponse | Promise<AxiosResponse>;
export type ErrorInterceptor = (error: any) => any;
