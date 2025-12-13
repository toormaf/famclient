# ApiMaker Usage Examples

This document shows how to use the common API utility across all modules in your Famroot application.

## Overview

The `api` instance is a **singleton** shared across all modules, providing:
- **Request Deduplication**: Multiple simultaneous GET requests to the same URL will be merged into a single HTTP request
- **LRU Caching**: Automatic caching of GET requests with configurable TTL
- **Cookie Management**: Automatic auth token injection and preference storage
- **Request Tracking**: All API calls logged to Supabase for monitoring

## Setup

### Initialize API with Supabase

```typescript
import { createClient } from '@supabase/supabase-js';
import { initializeApi } from './utils/api';

const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY
);

initializeApi(supabase);
```

## Basic Usage

### Importing the API

```typescript
import { api, API_ENDPOINTS } from '../utils/api';
```

### Authentication Module

```typescript
import { api, API_ENDPOINTS } from '../utils/api';

export const login = async (email: string, password: string) => {
  try {
    const response = await api.post(API_ENDPOINTS.AUTH.LOGIN, {
      email,
      password,
    }, { cache: false });

    api.setAuthToken(response.data.token);

    return response.data;
  } catch (error) {
    console.error('Login failed:', error);
    throw error;
  }
};

export const logout = async () => {
  try {
    await api.post(API_ENDPOINTS.AUTH.LOGOUT, {}, { cache: false });
    api.removeAuthToken();
    api.clearCache();
  } catch (error) {
    console.error('Logout failed:', error);
    throw error;
  }
};

export const register = async (userData: any) => {
  const response = await api.post(API_ENDPOINTS.AUTH.REGISTER, userData, {
    cache: false,
  });
  return response.data;
};
```

### User Profile Module

```typescript
import { api, API_ENDPOINTS } from '../utils/api';

export const getUserProfile = async () => {
  const response = await api.get(API_ENDPOINTS.USER.PROFILE, {
    cache: true,
    cacheTTL: 10 * 60 * 1000,
  });
  return response.data;
};

export const updateUserProfile = async (profileData: any) => {
  const response = await api.put(API_ENDPOINTS.USER.UPDATE_PROFILE, profileData, {
    cache: false,
  });

  api.clearCache();

  return response.data;
};
```

### Family Tree Module

```typescript
import { api, API_ENDPOINTS } from '../utils/api';

export const getFamilyTree = async () => {
  const response = await api.get(API_ENDPOINTS.FAMILY.TREE, {
    cache: true,
    cacheTTL: 15 * 60 * 1000,
  });
  return response.data;
};

export const getFamilyMembers = async () => {
  const response = await api.get(API_ENDPOINTS.FAMILY.MEMBERS, {
    cache: true,
  });
  return response.data;
};

export const addFamilyMember = async (memberData: any) => {
  const response = await api.post(API_ENDPOINTS.FAMILY.ADD_MEMBER, memberData, {
    cache: false,
  });

  api.clearCache();

  return response.data;
};

export const updateFamilyMember = async (memberId: string, data: any) => {
  const response = await api.put(
    `${API_ENDPOINTS.FAMILY.UPDATE_MEMBER}/${memberId}`,
    data,
    { cache: false }
  );

  api.clearCache();

  return response.data;
};
```

### Chat Module

```typescript
import { api, API_ENDPOINTS } from '../utils/api';

export const getConversations = async () => {
  const response = await api.get(API_ENDPOINTS.CHAT.CONVERSATIONS, {
    cache: true,
    cacheTTL: 2 * 60 * 1000,
  });
  return response.data;
};

export const getMessages = async (conversationId: string) => {
  const response = await api.get(
    `${API_ENDPOINTS.CHAT.MESSAGES}/${conversationId}`,
    { cache: false }
  );
  return response.data;
};

export const sendMessage = async (conversationId: string, message: string) => {
  const response = await api.post(API_ENDPOINTS.CHAT.SEND_MESSAGE, {
    conversationId,
    message,
  }, { cache: false });
  return response.data;
};
```

### Vault Module

```typescript
import { api, API_ENDPOINTS } from '../utils/api';

export const getDocuments = async () => {
  const response = await api.get(API_ENDPOINTS.VAULT.DOCUMENTS, {
    cache: true,
  });
  return response.data;
};

export const uploadDocument = async (file: File) => {
  const formData = new FormData();
  formData.append('file', file);

  const response = await api.post(API_ENDPOINTS.VAULT.UPLOAD, formData, {
    cache: false,
    headers: { 'Content-Type': 'multipart/form-data' },
  });

  api.clearCache();

  return response.data;
};

export const downloadDocument = async (documentId: string) => {
  const response = await api.get(
    `${API_ENDPOINTS.VAULT.DOWNLOAD}/${documentId}`,
    { cache: false }
  );
  return response.data;
};
```

### Maps Module

```typescript
import { api, API_ENDPOINTS } from '../utils/api';

export const getLocations = async () => {
  const response = await api.get(API_ENDPOINTS.MAPS.LOCATIONS, {
    cache: true,
    cacheTTL: 5 * 60 * 1000,
  });
  return response.data;
};

export const addLocation = async (locationData: any) => {
  const response = await api.post(API_ENDPOINTS.MAPS.ADD_LOCATION, locationData, {
    cache: false,
  });

  api.clearCache();

  return response.data;
};
```

### Notes Module

```typescript
import { api, API_ENDPOINTS } from '../utils/api';

export const getAllNotes = async () => {
  const response = await api.get(API_ENDPOINTS.NOTES.ALL, {
    cache: true,
  });
  return response.data;
};

export const createNote = async (noteData: any) => {
  const response = await api.post(API_ENDPOINTS.NOTES.CREATE, noteData, {
    cache: false,
  });

  api.clearCache();

  return response.data;
};

export const updateNote = async (noteId: string, data: any) => {
  const response = await api.put(
    `${API_ENDPOINTS.NOTES.UPDATE}/${noteId}`,
    data,
    { cache: false }
  );

  api.clearCache();

  return response.data;
};
```

## Request Deduplication Example

When multiple components make the same GET request simultaneously, only one HTTP request is made:

```typescript
import { api, API_ENDPOINTS } from '../utils/api';

const Component1 = () => {
  useEffect(() => {
    api.get(API_ENDPOINTS.USER.PROFILE);
  }, []);
};

const Component2 = () => {
  useEffect(() => {
    api.get(API_ENDPOINTS.USER.PROFILE);
  }, []);
};

const Component3 = () => {
  useEffect(() => {
    api.get(API_ENDPOINTS.USER.PROFILE);
  }, []);
};
```

**Result**: All three components will receive the same response, but only **1 HTTP request** is made to the server.

Console output:
```
[ApiMaker] Request deduplication: waiting for in-flight request to /user/profile
[ApiMaker] Request deduplication: waiting for in-flight request to /user/profile
```

## React Hook Example

Create a custom hook for API calls:

```typescript
import { useState, useEffect } from 'react';
import { api, API_ENDPOINTS } from '../utils/api';

export const useUserProfile = () => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await api.get(API_ENDPOINTS.USER.PROFILE, {
          cache: true,
          cacheTTL: 10 * 60 * 1000,
        });
        setProfile(response.data);
      } catch (err) {
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  return { profile, loading, error };
};

const ProfileComponent = () => {
  const { profile, loading, error } = useUserProfile();

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return <div>Welcome, {profile.name}!</div>;
};
```

## Monitoring and Analytics

### View Request Statistics

```typescript
import { api } from '../utils/api';

const stats = api.getStats();
console.log('Total Requests:', stats.totalRequests);
console.log('Cache Hits:', stats.cacheHits);
console.log('Cache Misses:', stats.cacheMisses);
console.log('Cache Hit Rate:', (stats.cacheHits / stats.totalRequests * 100).toFixed(2) + '%');
console.log('Average Response Time:', stats.averageResponseTime + 'ms');
console.log('Success Rate:', stats.successRate.toFixed(2) + '%');
console.log('Error Count:', stats.errorCount);
```

### View Cache Statistics

```typescript
import { api } from '../utils/api';

const cacheStats = api.getCacheStats();
console.log('Cache Size:', cacheStats.size);
console.log('Max Size:', cacheStats.maxSize);
console.log('Oldest Key:', cacheStats.oldestKey);
console.log('Newest Key:', cacheStats.newestKey);
```

### View Pending Requests

```typescript
import { api } from '../utils/api';

console.log('Pending Requests:', api.getPendingRequestsCount());
console.log('Request Keys:', api.getPendingRequests());
```

### View Request Logs

```typescript
import { api } from '../utils/api';

const logs = api.getLogs();
console.log('Recent requests:', logs);

logs.forEach(log => {
  console.log(`${log.method} ${log.endpoint} - ${log.response_time}ms - Cache Hit: ${log.cache_hit}`);
});
```

## Best Practices

### 1. Cache Strategy

```typescript
api.get(endpoint, { cache: true, cacheTTL: 5 * 60 * 1000 });

api.post(endpoint, data, { cache: false });
```

### 2. Clear Cache After Mutations

```typescript
await api.post(API_ENDPOINTS.FAMILY.ADD_MEMBER, memberData);
api.clearCache();
```

### 3. Error Handling

```typescript
try {
  const response = await api.get(API_ENDPOINTS.USER.PROFILE);
  return response.data;
} catch (error) {
  if (error.status === 401) {
    api.removeAuthToken();
    window.location.href = '/login';
  } else if (error.status === 404) {
    console.log('Resource not found');
  } else {
    console.error('Request failed:', error.message);
  }
  throw error;
}
```

### 4. Loading States

```typescript
const [loading, setLoading] = useState(false);

const fetchData = async () => {
  setLoading(true);
  try {
    const response = await api.get(API_ENDPOINTS.FAMILY.MEMBERS);
    setData(response.data);
  } catch (error) {
    setError(error);
  } finally {
    setLoading(false);
  }
};
```

### 5. User Preferences

```typescript
api.setPreference('theme', 'dark');
api.setPreference('language', 'en');

await api.savePreferencesToDatabase();

const theme = api.getPreference('theme');
const language = api.getPreference('language');
```

## Advanced Usage

### Custom Interceptors

```typescript
import { api } from '../utils/api';

const requestId = api.addRequestInterceptor((config) => {
  config.headers['X-Request-ID'] = generateRequestId();
  return config;
});

const responseId = api.addResponseInterceptor(
  (response) => {
    console.log('Request succeeded:', response);
    return response;
  },
  (error) => {
    if (error.status === 401) {
      api.removeAuthToken();
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

api.removeRequestInterceptor(requestId);
api.removeResponseInterceptor(responseId);
```

### Dynamic Endpoints

```typescript
import { api } from '../utils/api';

const getResourceById = async (resourceType: string, id: string) => {
  const endpoint = `/${resourceType}/${id}`;
  const response = await api.get(endpoint);
  return response.data;
};

const member = await getResourceById('family/members', '123');
const document = await getResourceById('vault/documents', '456');
```

## Debugging

Enable verbose logging:

```typescript
import { api } from '../utils/api';

const originalRequest = api.request.bind(api);
api.request = async function(...args) {
  console.log('[API] Request:', args);
  const response = await originalRequest(...args);
  console.log('[API] Response:', response);
  return response;
};
```

## Summary

- **Use the same `api` instance** across all modules
- **GET requests are automatically deduplicated** when called simultaneously
- **Cache is shared** across all modules
- **Auth tokens are automatically injected** from cookies
- **All requests are tracked** in Supabase for monitoring
- **Clear cache after mutations** that affect cached data

This centralized approach ensures consistency, prevents duplicate requests, and makes debugging easier.
