import { ApiMaker } from './ApiMaker';
import { API_ENDPOINTS } from '../pages/Urls';

export const api = new ApiMaker({
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

export const authApi = {
  login: (credentials: { email: string; password: string }) =>
    api.post(API_ENDPOINTS.AUTH.LOGIN, credentials, { cache: false }),

  register: (userData: any) =>
    api.post(API_ENDPOINTS.AUTH.REGISTER, userData, { cache: false }),

  logout: () =>
    api.post(API_ENDPOINTS.AUTH.LOGOUT, {}, { cache: false }),

  refreshToken: () =>
    api.post(API_ENDPOINTS.AUTH.REFRESH_TOKEN, {}, { cache: false }),

  forgotPassword: (email: string) =>
    api.post(API_ENDPOINTS.AUTH.FORGOT_PASSWORD, { email }, { cache: false }),

  resetPassword: (token: string, newPassword: string) =>
    api.post(API_ENDPOINTS.AUTH.RESET_PASSWORD, { token, newPassword }, { cache: false }),
};

export const userApi = {
  getProfile: () =>
    api.get(API_ENDPOINTS.USER.PROFILE, { cache: true, cacheTTL: 10 * 60 * 1000 }),

  updateProfile: (data: any) =>
    api.put(API_ENDPOINTS.USER.UPDATE_PROFILE, data, { cache: false }),

  getPreferences: () =>
    api.get(API_ENDPOINTS.USER.PREFERENCES, { cache: true }),

  deleteAccount: () =>
    api.delete(API_ENDPOINTS.USER.DELETE_ACCOUNT, { cache: false }),
};

export const familyApi = {
  getTree: () =>
    api.get(API_ENDPOINTS.FAMILY.TREE, { cache: true, cacheTTL: 15 * 60 * 1000 }),

  getMembers: () =>
    api.get(API_ENDPOINTS.FAMILY.MEMBERS, { cache: true }),

  addMember: (memberData: any) =>
    api.post(API_ENDPOINTS.FAMILY.ADD_MEMBER, memberData, { cache: false }),

  updateMember: (memberId: string, data: any) =>
    api.put(`${API_ENDPOINTS.FAMILY.UPDATE_MEMBER}/${memberId}`, data, { cache: false }),

  deleteMember: (memberId: string) =>
    api.delete(`${API_ENDPOINTS.FAMILY.DELETE_MEMBER}/${memberId}`, { cache: false }),

  getConnections: () =>
    api.get(API_ENDPOINTS.FAMILY.CONNECTIONS, { cache: true }),
};

export const chatApi = {
  getMessages: (conversationId: string) =>
    api.get(`${API_ENDPOINTS.CHAT.MESSAGES}/${conversationId}`, { cache: false }),

  sendMessage: (conversationId: string, message: string) =>
    api.post(API_ENDPOINTS.CHAT.SEND_MESSAGE, { conversationId, message }, { cache: false }),

  getConversations: () =>
    api.get(API_ENDPOINTS.CHAT.CONVERSATIONS, { cache: true, cacheTTL: 2 * 60 * 1000 }),

  createConversation: (participantIds: string[]) =>
    api.post(API_ENDPOINTS.CHAT.CREATE_CONVERSATION, { participantIds }, { cache: false }),
};

export const vaultApi = {
  getDocuments: () =>
    api.get(API_ENDPOINTS.VAULT.DOCUMENTS, { cache: true }),

  uploadDocument: (formData: FormData) =>
    api.post(API_ENDPOINTS.VAULT.UPLOAD, formData, {
      cache: false,
      headers: { 'Content-Type': 'multipart/form-data' },
    }),

  downloadDocument: (documentId: string) =>
    api.get(`${API_ENDPOINTS.VAULT.DOWNLOAD}/${documentId}`, { cache: false }),

  deleteDocument: (documentId: string) =>
    api.delete(`${API_ENDPOINTS.VAULT.DELETE}/${documentId}`, { cache: false }),
};

export const mapsApi = {
  getLocations: () =>
    api.get(API_ENDPOINTS.MAPS.LOCATIONS, { cache: true, cacheTTL: 5 * 60 * 1000 }),

  addLocation: (locationData: any) =>
    api.post(API_ENDPOINTS.MAPS.ADD_LOCATION, locationData, { cache: false }),

  updateLocation: (locationId: string, data: any) =>
    api.put(`${API_ENDPOINTS.MAPS.UPDATE_LOCATION}/${locationId}`, data, { cache: false }),

  deleteLocation: (locationId: string) =>
    api.delete(`${API_ENDPOINTS.MAPS.DELETE_LOCATION}/${locationId}`, { cache: false }),
};

export const notesApi = {
  getAllNotes: () =>
    api.get(API_ENDPOINTS.NOTES.ALL, { cache: true }),

  createNote: (noteData: any) =>
    api.post(API_ENDPOINTS.NOTES.CREATE, noteData, { cache: false }),

  updateNote: (noteId: string, data: any) =>
    api.put(`${API_ENDPOINTS.NOTES.UPDATE}/${noteId}`, data, { cache: false }),

  deleteNote: (noteId: string) =>
    api.delete(`${API_ENDPOINTS.NOTES.DELETE}/${noteId}`, { cache: false }),
};

export { ApiMaker } from './ApiMaker';
export { LRUCache } from './LRUCache';
export { CookieManager } from './CookieManager';
export * from '../types/api';
