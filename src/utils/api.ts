import { ApiMaker } from './ApiMaker';
import { API_ENDPOINTS } from '../pages/Urls';

const api = new ApiMaker({
  baseURL: API_ENDPOINTS.BASE_URL,
  timeout: 30000,
  cacheSize: 100,
  defaultCacheTTL: 5 * 60 * 1000,
  enableTracking: true,
  enableCookies: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const initializeApi = (supabaseClient: any) => {
  api.setSupabaseClient(supabaseClient);
  api.loadPreferencesFromDatabase();
};

export { api, API_ENDPOINTS };
export { ApiMaker } from './ApiMaker';
export { LRUCache } from './LRUCache';
export { CookieManager } from './CookieManager';
export * from '../types/api';
