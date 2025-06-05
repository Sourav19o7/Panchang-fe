// Enhanced API Configuration with Better Error Handling and Retry Logic
import axios from 'axios';
import { toast } from 'react-toastify';

// API Configuration
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';
const REQUEST_TIMEOUT = 30000; // 30 seconds
const MAX_RETRIES = 3;
const RETRY_DELAY = 1000; // 1 second

// Create axios instance with enhanced configuration
const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: REQUEST_TIMEOUT,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Token management
let authToken = null;
let tokenRefreshPromise = null;

export const setAuthToken = (token) => {
  authToken = token;
  if (token) {
    api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    localStorage.setItem('authToken', token);
  } else {
    delete api.defaults.headers.common['Authorization'];
    localStorage.removeItem('authToken');
  }
};

export const getAuthToken = () => {
  if (!authToken) {
    authToken = localStorage.getItem('authToken');
    if (authToken) {
      api.defaults.headers.common['Authorization'] = `Bearer ${authToken}`;
    }
  }
  return authToken;
};

// Initialize token from localStorage
getAuthToken();

// Network status tracking
let isOnline = navigator.onLine;
const networkStatusListeners = new Set();

window.addEventListener('online', () => {
  isOnline = true;
  networkStatusListeners.forEach(listener => listener(true));
});

window.addEventListener('offline', () => {
  isOnline = false;
  networkStatusListeners.forEach(listener => listener(false));
});

export const addNetworkStatusListener = (listener) => {
  networkStatusListeners.add(listener);
  return () => networkStatusListeners.delete(listener);
};

// Request queue for offline handling
const requestQueue = [];

const processRequestQueue = async () => {
  while (requestQueue.length > 0 && isOnline) {
    const { resolve, reject, config } = requestQueue.shift();
    try {
      const response = await api(config);
      resolve(response);
    } catch (error) {
      reject(error);
    }
  }
};

// Enhanced request interceptor
api.interceptors.request.use(
  (config) => {
    // Add timestamp to prevent caching
    config.params = {
      ...config.params,
      _t: Date.now(),
    };

    // Add request ID for tracking
    config.requestId = `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

    // Check network status
    if (!isOnline && config.method !== 'get') {
      // Queue non-GET requests when offline
      return new Promise((resolve, reject) => {
        requestQueue.push({ resolve, reject, config });
        toast.warning('You are offline. Request will be processed when connection is restored.');
      });
    }

    // Log request in development
    if (process.env.NODE_ENV === 'development') {
      console.log(`🚀 API Request [${config.requestId}]: ${config.method?.toUpperCase()} ${config.url}`, {
        params: config.params,
        data: config.data,
      });
    }

    return config;
  },
  (error) => {
    console.error('Request interceptor error:', error);
    return Promise.reject(error);
  }
);

// Enhanced response interceptor with retry logic
api.interceptors.response.use(
  (response) => {
    // Log response in development
    if (process.env.NODE_ENV === 'development') {
      console.log(`✅ API Response [${response.config.requestId}]: ${response.config.method?.toUpperCase()} ${response.config.url}`, {
        status: response.status,
        data: response.data,
      });
    }

    return response;
  },
  async (error) => {
    const { response, request, config, message } = error;

    // Log error in development
    if (process.env.NODE_ENV === 'development') {
      console.error(`❌ API Error [${config?.requestId}]:`, {
        url: config?.url,
        method: config?.method,
        status: response?.status,
        message: response?.data?.error || message,
      });
    }

    // Handle different types of errors
    if (response) {
      const { status, data } = response;
      const errorMessage = data?.error || data?.message || 'An error occurred';

      switch (status) {
        case 400:
          if (data?.details) {
            // Validation errors with details
            const validationMessages = Object.values(data.details).join(', ');
            toast.error(`Validation Error: ${validationMessages}`);
          } else {
            toast.error(`Bad Request: ${errorMessage}`);
          }
          break;

        case 401:
          // Handle token expiration
          if (!config._retry && authToken) {
            config._retry = true;
            try {
              await refreshAuthToken();
              return api(config);
            } catch (refreshError) {
              handleAuthError();
              return Promise.reject(refreshError);
            }
          } else {
            handleAuthError();
          }
          break;

        case 403:
          toast.error('Access denied. You do not have permission to perform this action.');
          break;

        case 404:
          toast.error('Resource not found.');
          break;

        case 409:
          toast.error(`Conflict: ${errorMessage}`);
          break;

        case 422:
          toast.error(`Validation Error: ${errorMessage}`);
          break;

        case 429:
          // Rate limiting - implement exponential backoff
          const retryAfter = response.headers['retry-after'] || 60;
          toast.warning(`Too many requests. Please wait ${retryAfter} seconds and try again.`);
          
          if (!config._retryCount) config._retryCount = 0;
          if (config._retryCount < MAX_RETRIES) {
            config._retryCount++;
            const delay = Math.pow(2, config._retryCount) * 1000; // Exponential backoff
            await new Promise(resolve => setTimeout(resolve, delay));
            return api(config);
          }
          break;

        case 500:
          toast.error('Server error. Please try again later.');
          break;

        case 502:
        case 503:
        case 504:
          // Server errors - implement retry logic
          if (!config._retryCount) config._retryCount = 0;
          if (config._retryCount < MAX_RETRIES) {
            config._retryCount++;
            const delay = RETRY_DELAY * Math.pow(2, config._retryCount);
            toast.warning(`Server temporarily unavailable. Retrying in ${delay/1000} seconds...`);
            await new Promise(resolve => setTimeout(resolve, delay));
            return api(config);
          } else {
            toast.error('Service temporarily unavailable. Please try again later.');
          }
          break;

        default:
          toast.error(`Error: ${errorMessage}`);
      }

      return Promise.reject({
        status,
        message: errorMessage,
        data: data,
        details: data?.details
      });
    } else if (request) {
      // Network error
      if (!isOnline) {
        toast.error('You are offline. Please check your internet connection.');
        return Promise.reject({
          status: 0,
          message: 'Network offline',
          data: null,
        });
      } else {
        // Network timeout or connection error
        if (!config._retryCount) config._retryCount = 0;
        if (config._retryCount < MAX_RETRIES) {
          config._retryCount++;
          const delay = RETRY_DELAY * config._retryCount;
          toast.warning(`Connection failed. Retrying in ${delay/1000} seconds...`);
          await new Promise(resolve => setTimeout(resolve, delay));
          return api(config);
        } else {
          toast.error('Network error. Please check your internet connection.');
          return Promise.reject({
            status: 0,
            message: 'Network error',
            data: null,
          });
        }
      }
    } else {
      // Something else happened
      toast.error(`Error: ${message}`);
      return Promise.reject({
        status: 0,
        message: message,
        data: null,
      });
    }
  }
);

// Token refresh function
const refreshAuthToken = async () => {
  if (tokenRefreshPromise) {
    return tokenRefreshPromise;
  }

  tokenRefreshPromise = (async () => {
    try {
      const refreshToken = localStorage.getItem('refreshToken');
      if (!refreshToken) {
        throw new Error('No refresh token available');
      }

      const response = await axios.post(`${API_BASE_URL}/auth/refresh-token`, {
        refreshToken
      });

      if (response.data.success && response.data.data.token) {
        setAuthToken(response.data.data.token);
        if (response.data.data.sessionInfo?.refreshToken) {
          localStorage.setItem('refreshToken', response.data.data.sessionInfo.refreshToken);
        }
        return response.data.data.token;
      } else {
        throw new Error('Invalid refresh response');
      }
    } catch (error) {
      console.error('Token refresh failed:', error);
      throw error;
    } finally {
      tokenRefreshPromise = null;
    }
  })();

  return tokenRefreshPromise;
};

// Handle authentication errors
const handleAuthError = () => {
  setAuthToken(null);
  localStorage.removeItem('refreshToken');
  toast.error('Session expired. Please login again.');
  
  // Redirect to login page
  setTimeout(() => {
    window.location.href = '/login';
  }, 1000);
};

// Process queued requests when coming back online
window.addEventListener('online', processRequestQueue);

// Enhanced API helper functions
export const apiHelpers = {
  // GET request with caching support
  get: async (url, params = {}, options = {}) => {
    try {
      const config = {
        params,
        ...options
      };

      // Check cache if enabled
      if (options.cache && options.cacheKey) {
        const cachedData = getCachedData(options.cacheKey);
        if (cachedData) {
          return cachedData;
        }
      }

      const response = await api.get(url, config);
      const result = response.data;

      // Cache the result if caching is enabled
      if (options.cache && options.cacheKey && result.success) {
        setCachedData(options.cacheKey, result, options.cacheTTL || 300000); // 5 minutes default
      }

      return result;
    } catch (error) {
      throw error;
    }
  },

  // POST request
  post: async (url, data = {}, options = {}) => {
    try {
      const response = await api.post(url, data, options);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // PUT request
  put: async (url, data = {}, options = {}) => {
    try {
      const response = await api.put(url, data, options);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // PATCH request
  patch: async (url, data = {}, options = {}) => {
    try {
      const response = await api.patch(url, data, options);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // DELETE request
  delete: async (url, options = {}) => {
    try {
      const response = await api.delete(url, options);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Upload file with progress tracking
  upload: async (url, formData, onUploadProgress = null, options = {}) => {
    try {
      const config = {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        timeout: 120000, // 2 minutes for uploads
        ...options
      };

      if (onUploadProgress) {
        config.onUploadProgress = (progressEvent) => {
          const percentCompleted = Math.round(
            (progressEvent.loaded * 100) / progressEvent.total
          );
          onUploadProgress(percentCompleted);
        };
      }

      const response = await api.post(url, formData, config);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Download file with progress tracking
  download: async (url, filename, onDownloadProgress = null) => {
    try {
      const config = {
        responseType: 'blob',
        timeout: 120000 // 2 minutes for downloads
      };

      if (onDownloadProgress) {
        config.onDownloadProgress = (progressEvent) => {
          const percentCompleted = Math.round(
            (progressEvent.loaded * 100) / progressEvent.total
          );
          onDownloadProgress(percentCompleted);
        };
      }

      const response = await api.get(url, config);
      
      // Create blob link to download
      const blob = new Blob([response.data]);
      const link = document.createElement('a');
      link.href = window.URL.createObjectURL(blob);
      link.download = filename;
      link.click();
      
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Batch requests
  batch: async (requests) => {
    try {
      const promises = requests.map(({ method, url, data, params }) => {
        switch (method.toLowerCase()) {
          case 'get':
            return apiHelpers.get(url, params);
          case 'post':
            return apiHelpers.post(url, data);
          case 'put':
            return apiHelpers.put(url, data);
          case 'delete':
            return apiHelpers.delete(url);
          default:
            throw new Error(`Unsupported method: ${method}`);
        }
      });

      const results = await Promise.allSettled(promises);
      return results.map((result, index) => ({
        success: result.status === 'fulfilled',
        data: result.status === 'fulfilled' ? result.value : null,
        error: result.status === 'rejected' ? result.reason : null,
        request: requests[index]
      }));
    } catch (error) {
      throw error;
    }
  }
};

// Simple caching mechanism
const cache = new Map();

const getCachedData = (key) => {
  const cached = cache.get(key);
  if (cached && Date.now() < cached.expiry) {
    return cached.data;
  }
  cache.delete(key);
  return null;
};

const setCachedData = (key, data, ttl) => {
  cache.set(key, {
    data,
    expiry: Date.now() + ttl
  });
};

export const clearCache = (key) => {
  if (key) {
    cache.delete(key);
  } else {
    cache.clear();
  }
};

// Specific API endpoints with enhanced functionality
export const endpoints = {
  // Auth endpoints
  auth: {
    login: '/auth/login',
    register: '/auth/register',
    logout: '/auth/logout',
    profile: '/auth/profile',
    refreshToken: '/auth/refresh-token',
    forgotPassword: '/auth/forgot-password',
    resetPassword: '/auth/reset-password',
    changePassword: '/auth/change-password',
  },

  // Puja endpoints
  puja: {
    focusSuggestion: '/puja/focus-suggestion',
    monthlyPanchang: '/puja/panchang/monthly',
    generatePropositions: '/puja/propositions/generate',
    experimentalPujas: '/puja/propositions/experimental',
    history: '/puja/propositions/history',
    exportSheets: '/puja/export/sheets',
    teamFeedback: (spreadsheetId) => `/puja/feedback/sheets/${spreadsheetId}`,
    uploadPDFs: '/puja/pdfs/upload',
    listPDFs: '/puja/pdfs/list',
  },

  // Feedback endpoints
  feedback: {
    submit: '/feedback/submit',
    history: '/feedback/history',
    analyzePerformance: '/feedback/analyze/performance',
    synthesize: '/feedback/synthesize',
    exportSheets: '/feedback/export/sheets',
  },

  // Analytics endpoints
  analytics: {
    dashboard: '/analytics/dashboard',
    performance: '/analytics/performance',
    trends: '/analytics/trends',
    insights: '/analytics/insights'
  }
};

// Request timeout handler
export const withTimeout = (promise, timeoutMs = REQUEST_TIMEOUT) => {
  const timeout = new Promise((_, reject) =>
    setTimeout(() => reject(new Error('Request timeout')), timeoutMs)
  );
  
  return Promise.race([promise, timeout]);
};

// Retry mechanism for specific operations
export const withRetry = async (fn, retries = MAX_RETRIES, delay = RETRY_DELAY) => {
  try {
    return await fn();
  } catch (error) {
    if (retries > 0 && shouldRetry(error)) {
      console.log(`Retrying operation... ${retries} attempts left`);
      await new Promise(resolve => setTimeout(resolve, delay));
      return withRetry(fn, retries - 1, delay * 2);
    }
    throw error;
  }
};

// Determine if an error should trigger a retry
const shouldRetry = (error) => {
  // Retry on network errors or 5xx server errors
  return !error.status || error.status >= 500;
};

// Health check with fallback
export const healthCheck = async () => {
  try {
    const response = await withTimeout(api.get('/health'), 5000);
    return {
      status: 'healthy',
      data: response.data,
      timestamp: new Date().toISOString()
    };
  } catch (error) {
    console.error('Health check failed:', error);
    return {
      status: 'unhealthy',
      error: error.message,
      timestamp: new Date().toISOString()
    };
  }
};

// Connection quality assessment
export const assessConnectionQuality = async () => {
  const start = performance.now();
  try {
    await healthCheck();
    const latency = performance.now() - start;
    
    if (latency < 100) return 'excellent';
    if (latency < 300) return 'good';
    if (latency < 1000) return 'fair';
    return 'poor';
  } catch (error) {
    return 'offline';
  }
};

// Export the configured axios instance
export default api;