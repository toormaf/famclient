import axios, { AxiosInstance, AxiosError } from 'axios';
import { LRUCache } from './LRUCache';
import { CookieManager } from './CookieManager';
import {
  ApiConfig,
  ApiResponse,
  ApiError,
  ApiLogEntry,
  ApiStats,
} from '../types/api';

export interface ApiMakerConfig {
  baseURL?: string;
  timeout?: number;
  cacheSize?: number;
  defaultCacheTTL?: number;
  enableTracking?: boolean;
  enableCookies?: boolean;
  headers?: Record<string, string>;
}

export class ApiMaker {
  private axiosInstance: AxiosInstance;
  private cache: LRUCache<string, any>;
  private requestLogs: ApiLogEntry[] = [];
  private stats: ApiStats = {
    totalRequests: 0,
    cacheHits: 0,
    cacheMisses: 0,
    averageResponseTime: 0,
    errorCount: 0,
    successRate: 0,
  };
  private enableTracking: boolean;
  private enableCookies: boolean;
  private defaultCacheTTL: number;
  private supabaseClient: any = null;

  constructor(config: ApiMakerConfig = {}) {
    this.enableTracking = config.enableTracking ?? true;
    this.enableCookies = config.enableCookies ?? true;
    this.defaultCacheTTL = config.defaultCacheTTL || 5 * 60 * 1000;

    this.cache = new LRUCache({
      maxSize: config.cacheSize || 100,
      ttl: this.defaultCacheTTL,
      onEvict: (key) => {
        console.log(`[ApiMaker] Evicted from cache: ${key}`);
      },
    });

    this.axiosInstance = axios.create({
      baseURL: config.baseURL || '',
      timeout: config.timeout || 30000,
      headers: {
        'Content-Type': 'application/json',
        ...config.headers,
      },
    });

    this.setupInterceptors();
    this.loadPreferences();
  }

  setSupabaseClient(client: any): void {
    this.supabaseClient = client;
  }

  private setupInterceptors(): void {
    this.axiosInstance.interceptors.request.use(
      (config: any) => {
        if (!config.metadata) {
          config.metadata = {};
        }
        config.metadata.startTime = Date.now();

        if (this.enableCookies) {
          const authToken = CookieManager.get<string>('auth_token');
          if (authToken && config.headers && !config.headers['Authorization']) {
            config.headers['Authorization'] = `Bearer ${authToken}`;
          }
        }

        return config;
      },
      (error) => {
        return Promise.reject(error);
      }
    );

    this.axiosInstance.interceptors.response.use(
      (response) => {
        const config = response.config as any;
        const responseTime = Date.now() - (config.metadata?.startTime || 0);
        if (!config.metadata) {
          config.metadata = {};
        }
        config.metadata.responseTime = responseTime;
        return response;
      },
      (error) => {
        if (error.config) {
          if (!error.config.metadata) {
            error.config.metadata = {};
          }
          const responseTime = Date.now() - (error.config.metadata.startTime || Date.now());
          error.config.metadata.responseTime = responseTime;
        }
        return Promise.reject(error);
      }
    );
  }

  addRequestInterceptor(interceptor: (config: any) => any): number {
    return this.axiosInstance.interceptors.request.use(interceptor);
  }

  addResponseInterceptor(
    onSuccess: (response: any) => any,
    onError?: (error: any) => any
  ): number {
    return this.axiosInstance.interceptors.response.use(onSuccess, onError);
  }

  removeRequestInterceptor(id: number): void {
    this.axiosInstance.interceptors.request.eject(id);
  }

  removeResponseInterceptor(id: number): void {
    this.axiosInstance.interceptors.response.eject(id);
  }

  private generateCacheKey(url: string, config: ApiConfig = {}): string {
    const method = config.method?.toUpperCase() || 'GET';
    const params = JSON.stringify(config.params || {});
    const data = JSON.stringify(config.data || {});
    return `${method}:${url}:${params}:${data}`;
  }

  private async logRequest(logEntry: ApiLogEntry): Promise<void> {
    this.requestLogs.push(logEntry);

    this.stats.totalRequests++;
    if (logEntry.cache_hit) {
      this.stats.cacheHits++;
    } else {
      this.stats.cacheMisses++;
    }

    if (logEntry.error_message) {
      this.stats.errorCount++;
    }

    const totalTime = this.requestLogs.reduce(
      (sum, log) => sum + log.response_time,
      0
    );
    this.stats.averageResponseTime = totalTime / this.requestLogs.length;
    this.stats.successRate =
      ((this.stats.totalRequests - this.stats.errorCount) /
        this.stats.totalRequests) *
      100;

    if (this.supabaseClient && this.enableTracking) {
      try {
        await this.supabaseClient.from('api_logs').insert({
          endpoint: logEntry.endpoint,
          method: logEntry.method,
          request_body: logEntry.request_body,
          response_status: logEntry.response_status,
          response_data: logEntry.response_data,
          response_time: logEntry.response_time,
          cache_hit: logEntry.cache_hit,
          error_message: logEntry.error_message,
        });
      } catch (error) {
        console.error('[ApiMaker] Failed to log request to database:', error);
      }
    }
  }

  private loadPreferences(): void {
    if (this.enableCookies) {
      const savedCacheSize = CookieManager.getPreference<number>('api_cache_size');
      if (savedCacheSize) {
        console.log(`[ApiMaker] Loaded cache size preference: ${savedCacheSize}`);
      }
    }
  }

  async request<T = any>(
    url: string,
    config: ApiConfig = {}
  ): Promise<ApiResponse<T>> {
    const method = config.method?.toUpperCase() || 'GET';
    const enableCache = config.cache ?? (method === 'GET');
    const cacheTTL = config.cacheTTL || this.defaultCacheTTL;
    const cacheKey = this.generateCacheKey(url, config);

    if (enableCache && this.cache.has(cacheKey)) {
      const cachedData = this.cache.get(cacheKey);

      if (this.enableTracking && config.trackRequest !== false) {
        await this.logRequest({
          endpoint: url,
          method,
          request_body: config.data,
          response_status: 200,
          response_data: cachedData,
          response_time: 0,
          cache_hit: true,
        });
      }

      return {
        data: cachedData,
        status: 200,
        statusText: 'OK',
        headers: {},
        config,
        fromCache: true,
        responseTime: 0,
      };
    }

    const startTime = Date.now();

    try {
      const response = await this.axiosInstance.request<T>({
        url,
        ...config,
      });

      const responseTime = Date.now() - startTime;

      if (enableCache) {
        this.cache.set(cacheKey, response.data, cacheTTL);
      }

      if (this.enableTracking && config.trackRequest !== false) {
        await this.logRequest({
          endpoint: url,
          method,
          request_body: config.data,
          response_status: response.status,
          response_data: response.data,
          response_time: responseTime,
          cache_hit: false,
        });
      }

      return {
        data: response.data,
        status: response.status,
        statusText: response.statusText,
        headers: response.headers,
        config,
        fromCache: false,
        responseTime,
      };
    } catch (error) {
      const responseTime = Date.now() - startTime;
      const axiosError = error as AxiosError;

      const apiError: ApiError = {
        message: axiosError.message,
        status: axiosError.response?.status,
        statusText: axiosError.response?.statusText,
        data: axiosError.response?.data,
        config,
      };

      if (this.enableTracking && config.trackRequest !== false) {
        await this.logRequest({
          endpoint: url,
          method,
          request_body: config.data,
          response_status: axiosError.response?.status,
          response_time: responseTime,
          cache_hit: false,
          error_message: apiError.message,
        });
      }

      throw apiError;
    }
  }

  async get<T = any>(url: string, config?: ApiConfig): Promise<ApiResponse<T>> {
    return this.request<T>(url, { ...config, method: 'GET' });
  }

  async post<T = any>(
    url: string,
    data?: any,
    config?: ApiConfig
  ): Promise<ApiResponse<T>> {
    return this.request<T>(url, { ...config, method: 'POST', data });
  }

  async put<T = any>(
    url: string,
    data?: any,
    config?: ApiConfig
  ): Promise<ApiResponse<T>> {
    return this.request<T>(url, { ...config, method: 'PUT', data });
  }

  async patch<T = any>(
    url: string,
    data?: any,
    config?: ApiConfig
  ): Promise<ApiResponse<T>> {
    return this.request<T>(url, { ...config, method: 'PATCH', data });
  }

  async delete<T = any>(
    url: string,
    config?: ApiConfig
  ): Promise<ApiResponse<T>> {
    return this.request<T>(url, { ...config, method: 'DELETE' });
  }

  clearCache(): void {
    this.cache.clear();
    console.log('[ApiMaker] Cache cleared');
  }

  getCacheStats() {
    return this.cache.getStats();
  }

  getStats(): ApiStats {
    return { ...this.stats };
  }

  getLogs(): ApiLogEntry[] {
    return [...this.requestLogs];
  }

  clearLogs(): void {
    this.requestLogs = [];
  }

  setAuthToken(token: string): void {
    if (this.enableCookies) {
      CookieManager.set('auth_token', token, {
        expires: 7,
        secure: true,
        sameSite: 'Strict',
      });
    }
    this.axiosInstance.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  }

  removeAuthToken(): void {
    if (this.enableCookies) {
      CookieManager.remove('auth_token');
    }
    delete this.axiosInstance.defaults.headers.common['Authorization'];
  }

  setPreference(key: string, value: any): void {
    if (this.enableCookies) {
      CookieManager.setPreference(key, value);
    }
  }

  getPreference<T = any>(key: string): T | null {
    if (this.enableCookies) {
      return CookieManager.getPreference<T>(key);
    }
    return null;
  }

  async savePreferencesToDatabase(): Promise<void> {
    if (this.supabaseClient && this.enableCookies) {
      const preferences = CookieManager.getAllPreferences();
      try {
        const { data: existingPrefs } = await this.supabaseClient
          .from('api_preferences')
          .select('id')
          .maybeSingle();

        if (existingPrefs) {
          await this.supabaseClient
            .from('api_preferences')
            .update({ preferences })
            .eq('id', existingPrefs.id);
        } else {
          await this.supabaseClient.from('api_preferences').insert({ preferences });
        }
      } catch (error) {
        console.error('[ApiMaker] Failed to save preferences to database:', error);
      }
    }
  }

  async loadPreferencesFromDatabase(): Promise<void> {
    if (this.supabaseClient && this.enableCookies) {
      try {
        const { data } = await this.supabaseClient
          .from('api_preferences')
          .select('preferences')
          .maybeSingle();

        if (data?.preferences) {
          Object.entries(data.preferences).forEach(([key, value]) => {
            CookieManager.setPreference(key, value);
          });
        }
      } catch (error) {
        console.error(
          '[ApiMaker] Failed to load preferences from database:',
          error
        );
      }
    }
  }
}

export default ApiMaker;
