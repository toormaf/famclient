# ApiMaker - Advanced API Management System

A comprehensive API management solution with LRU caching, request tracking, cookie-based preferences, and Supabase integration for your Famroot application.

## Features

### 1. LRU (Least Recently Used) Caching
- Configurable cache pool size
- Automatic cache eviction when pool is full
- Per-request cache TTL (Time To Live)
- Cache hit/miss tracking
- Manual cache control methods

### 2. Cookie Storage
- Secure cookie management for user preferences
- Authentication token storage
- Automatic token injection in requests
- Persistent user preferences across sessions

### 3. API Request Tracking
- All API calls logged to Supabase database
- Response time monitoring
- Error tracking
- Cache performance metrics
- Request/response payload logging

### 4. Axios Integration
- Full Axios feature support
- Request/response interceptors
- Custom headers management
- Timeout configuration
- Error handling

## Installation

The required dependencies are already installed:
```bash
npm install axios
```

## Quick Start

### Basic Usage

```typescript
import { api, authApi, userApi } from '../utils/api';

const loginUser = async (email: string, password: string) => {
  try {
    const response = await authApi.login({ email, password });
    console.log('Login successful:', response.data);

    api.setAuthToken(response.data.token);
  } catch (error) {
    console.error('Login failed:', error);
  }
};
```

### Initialize with Supabase

```typescript
import { createClient } from '@supabase/supabase-js';
import { initializeApi } from '../utils/api';

const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY
);

initializeApi(supabase);
```

## Core Components

### 1. ApiMaker Class

The main API client with all features.

#### Configuration Options

```typescript
interface ApiMakerConfig {
  baseURL?: string;           // Base URL for all requests
  timeout?: number;           // Request timeout in ms (default: 30000)
  cacheSize?: number;         // Max cache entries (default: 100)
  defaultCacheTTL?: number;   // Cache TTL in ms (default: 300000)
  enableTracking?: boolean;   // Enable request logging (default: true)
  enableCookies?: boolean;    // Enable cookie storage (default: true)
  headers?: Record<string, string>; // Default headers
}
```

#### Create Custom Instance

```typescript
import { ApiMaker } from '../utils/ApiMaker';

const customApi = new ApiMaker({
  baseURL: 'https://api.example.com',
  timeout: 15000,
  cacheSize: 50,
  defaultCacheTTL: 10 * 60 * 1000, // 10 minutes
  enableTracking: true,
  enableCookies: true,
});
```

### 2. LRU Cache

Intelligent caching system with automatic eviction.

#### Features
- Fixed size limit with automatic LRU eviction
- Per-entry TTL support
- Cache statistics and monitoring
- Manual cache management

#### Usage

```typescript
import { LRUCache } from '../utils/LRUCache';

const cache = new LRUCache({
  maxSize: 100,
  ttl: 5 * 60 * 1000, // 5 minutes
  onEvict: (key, value) => {
    console.log(`Evicted: ${key}`);
  },
});

cache.set('user_123', { name: 'John' });
const user = cache.get('user_123');

console.log(cache.getStats());
```

### 3. Cookie Manager

Secure cookie management for preferences and authentication.

#### Methods

```typescript
import { CookieManager } from '../utils/CookieManager';

CookieManager.set('theme', 'dark', { expires: 365 });

const theme = CookieManager.get<string>('theme');

CookieManager.setPreference('language', 'en');

const lang = CookieManager.getPreference<string>('language');

CookieManager.remove('theme');

CookieManager.clearPreferences();
```

## API Methods

### HTTP Methods

```typescript
const response = await api.get('/endpoint', config);

const response = await api.post('/endpoint', data, config);

const response = await api.put('/endpoint', data, config);

const response = await api.patch('/endpoint', data, config);

const response = await api.delete('/endpoint', config);
```

### Configuration Options per Request

```typescript
interface ApiConfig {
  cache?: boolean;           // Enable caching (default: true for GET)
  cacheTTL?: number;         // Custom TTL for this request
  trackRequest?: boolean;    // Log this request (default: true)
  skipErrorHandler?: boolean; // Skip error interceptor
  // ... all Axios options
}
```

### Example with Custom Config

```typescript
const response = await api.get('/users', {
  cache: true,
  cacheTTL: 10 * 60 * 1000, // 10 minutes
  trackRequest: true,
  params: { page: 1, limit: 10 },
});
```

## Pre-built API Modules

### Authentication API

```typescript
import { authApi } from '../utils/api';

await authApi.login({ email, password });

await authApi.register(userData);

await authApi.logout();

await authApi.refreshToken();

await authApi.forgotPassword(email);

await authApi.resetPassword(token, newPassword);
```

### User API

```typescript
import { userApi } from '../utils/api';

const profile = await userApi.getProfile();

await userApi.updateProfile({ name: 'John' });

const prefs = await userApi.getPreferences();

await userApi.deleteAccount();
```

### Family API

```typescript
import { familyApi } from '../utils/api';

const tree = await familyApi.getTree();

const members = await familyApi.getMembers();

await familyApi.addMember(memberData);

await familyApi.updateMember(memberId, data);

await familyApi.deleteMember(memberId);

const connections = await familyApi.getConnections();
```

### Chat API

```typescript
import { chatApi } from '../utils/api';

const messages = await chatApi.getMessages(conversationId);

await chatApi.sendMessage(conversationId, message);

const conversations = await chatApi.getConversations();

await chatApi.createConversation(participantIds);
```

### Vault API

```typescript
import { vaultApi } from '../utils/api';

const documents = await vaultApi.getDocuments();

const formData = new FormData();
formData.append('file', file);
await vaultApi.uploadDocument(formData);

await vaultApi.downloadDocument(documentId);

await vaultApi.deleteDocument(documentId);
```

### Maps API

```typescript
import { mapsApi } from '../utils/api';

const locations = await mapsApi.getLocations();

await mapsApi.addLocation(locationData);

await mapsApi.updateLocation(locationId, data);

await mapsApi.deleteLocation(locationId);
```

### Notes API

```typescript
import { notesApi } from '../utils/api';

const notes = await notesApi.getAllNotes();

await notesApi.createNote(noteData);

await notesApi.updateNote(noteId, data);

await notesApi.deleteNote(noteId);
```

## Advanced Features

### Request/Response Interceptors

```typescript
const requestId = api.addRequestInterceptor((config) => {
  config.headers['X-Custom-Header'] = 'value';
  return config;
});

const responseId = api.addResponseInterceptor(
  (response) => {
    console.log('Success:', response);
    return response;
  },
  (error) => {
    console.error('Error:', error);
    return Promise.reject(error);
  }
);

api.removeRequestInterceptor(requestId);
api.removeResponseInterceptor(responseId);
```

### Authentication Token Management

```typescript
api.setAuthToken('your-jwt-token');

api.removeAuthToken();
```

### Cache Management

```typescript
api.clearCache();

const cacheStats = api.getCacheStats();
console.log(cacheStats);
```

### Analytics and Monitoring

```typescript
const stats = api.getStats();
console.log('Total Requests:', stats.totalRequests);
console.log('Cache Hit Rate:', (stats.cacheHits / stats.totalRequests * 100).toFixed(2) + '%');
console.log('Average Response Time:', stats.averageResponseTime + 'ms');
console.log('Success Rate:', stats.successRate.toFixed(2) + '%');

const logs = api.getLogs();
console.log('Recent requests:', logs);

api.clearLogs();
```

### User Preferences

```typescript
api.setPreference('theme', 'dark');

const theme = api.getPreference<string>('theme');

await api.savePreferencesToDatabase();

await api.loadPreferencesFromDatabase();
```

## Database Schema

### api_logs Table

Tracks all API requests:

```typescript
interface ApiLog {
  id: string;
  user_id?: string;
  endpoint: string;
  method: string;
  request_body?: any;
  response_status?: number;
  response_data?: any;
  response_time: number;
  cache_hit: boolean;
  error_message?: string;
  created_at: string;
}
```

### api_preferences Table

Stores user preferences:

```typescript
interface ApiPreference {
  id: string;
  user_id: string;
  preferences: Record<string, any>;
  updated_at: string;
}
```

## Configuration

### Environment Variables

Add to your `.env` file:

```env
VITE_API_BASE_URL=https://api.your-domain.com
VITE_SUPABASE_URL=your-supabase-url
VITE_SUPABASE_ANON_KEY=your-supabase-anon-key
```

### API Endpoints Configuration

Update `src/pages/Urls.tsx` with your endpoints:

```typescript
export const API_ENDPOINTS = {
  BASE_URL: import.meta.env.VITE_API_BASE_URL,
  AUTH: {
    LOGIN: '/auth/login',
    // ... more endpoints
  },
  // ... more categories
};
```

## Best Practices

### 1. Cache Strategy

- Cache GET requests by default
- Set appropriate TTL based on data freshness requirements
- Disable cache for mutations (POST, PUT, DELETE)
- Clear cache after mutations that affect cached data

```typescript
await familyApi.addMember(memberData);
api.clearCache();
```

### 2. Error Handling

```typescript
try {
  const response = await userApi.getProfile();
  console.log(response.data);
} catch (error) {
  if (error.status === 401) {
    console.log('Unauthorized');
  } else if (error.status === 404) {
    console.log('Not found');
  } else {
    console.error('Request failed:', error.message);
  }
}
```

### 3. Loading States

```typescript
const [loading, setLoading] = useState(false);

const fetchData = async () => {
  setLoading(true);
  try {
    const response = await userApi.getProfile();
    // Handle success
  } catch (error) {
    // Handle error
  } finally {
    setLoading(false);
  }
};
```

### 4. Request Tracking

Track only important requests to reduce database load:

```typescript
await api.get('/metrics', {
  trackRequest: false, // Don't log this request
});
```

## Performance Tips

1. **Use appropriate cache sizes**: Larger cache = more memory, better hit rate
2. **Set realistic TTLs**: Balance between freshness and performance
3. **Monitor cache stats**: Use `getCacheStats()` to optimize
4. **Clean up expired entries**: Call `cache.cleanup()` periodically
5. **Disable tracking for high-frequency requests**: Reduce database writes

## Troubleshooting

### Cache Not Working

```typescript
if (!api.getCacheStats().size) {
  console.log('Cache is empty, check configuration');
}
```

### Cookies Not Persisting

```typescript
if (!CookieManager.has('auth_token')) {
  console.log('Cookie not set, check browser settings');
}
```

### Tracking Not Working

```typescript
const logs = api.getLogs();
if (logs.length === 0) {
  console.log('Check if tracking is enabled and Supabase is configured');
}
```

## Examples

See the pre-built API modules in `src/utils/api.ts` for complete implementation examples.

## Support

For issues or questions, refer to the main project documentation or contact the development team.
