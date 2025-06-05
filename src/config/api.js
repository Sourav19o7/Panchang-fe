import axios from 'axios';
import { toast } from 'react-toastify';

// API Configuration
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000, // 30 seconds
  headers: {
    'Content-Type': 'application/json',
  },
});

// Token management
let authToken = null;

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

// Request interceptor
api.interceptors.request.use(
  (config) => {
    // Add timestamp to prevent caching
    config.params = {
      ...config.params,
      _t: Date.now(),
    };

    // Log request in development
    if (process.env.NODE_ENV === 'development') {
      console.log(`🚀 API Request: ${config.method?.toUpperCase()} ${config.url}`, {
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

// Response interceptor
api.interceptors.response.use(
  (response) => {
    // Log response in development
    if (process.env.NODE_ENV === 'development') {
      console.log(`✅ API Response: ${response.config.method?.toUpperCase()} ${response.config.url}`, {
        status: response.status,
        data: response.data,
      });
    }

    return response;
  },
  (error) => {
    const { response, request, message } = error;

    // Log error in development
    if (process.env.NODE_ENV === 'development') {
      console.error('❌ API Error:', {
        url: error.config?.url,
        method: error.config?.method,
        status: response?.status,
        message: response?.data?.error || message,
      });
    }

    // Handle different types of errors
    if (response) {
      // Server responded with error status
      const { status, data } = response;
      const errorMessage = data?.error || data?.message || 'An error occurred';

      switch (status) {
        case 400:
          toast.error(`Bad Request: ${errorMessage}`);
          break;
        case 401:
          toast.error('Session expired. Please login again.');
          setAuthToken(null);
          window.location.href = '/login';
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
          toast.error('Too many requests. Please try again later.');
          break;
        case 500:
          toast.error('Server error. Please try again later.');
          break;
        case 503:
          toast.error('Service temporarily unavailable. Please try again later.');
          break;
        default:
          toast.error(`Error: ${errorMessage}`);
      }

      return Promise.reject({
        status,
        message: errorMessage,
        data: data,
      });
    } else if (request) {
      // Network error
      toast.error('Network error. Please check your internet connection.');
      return Promise.reject({
        status: 0,
        message: 'Network error',
        data: null,
      });
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

// API helper functions
export const apiHelpers = {
  // GET request
  get: async (url, params = {}) => {
    try {
      const response = await api.get(url, { params });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // POST request
  post: async (url, data = {}) => {
    try {
      const response = await api.post(url, data);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // PUT request
  put: async (url, data = {}) => {
    try {
      const response = await api.put(url, data);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // PATCH request
  patch: async (url, data = {}) => {
    try {
      const response = await api.patch(url, data);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // DELETE request
  delete: async (url) => {
    try {
      const response = await api.delete(url);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Upload file
  upload: async (url, formData, onUploadProgress = null) => {
    try {
      const response = await api.post(url, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        onUploadProgress: onUploadProgress ? (progressEvent) => {
          const percentCompleted = Math.round(
            (progressEvent.loaded * 100) / progressEvent.total
          );
          onUploadProgress(percentCompleted);
        } : undefined,
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Download file
  download: async (url, filename) => {
    try {
      const response = await api.get(url, {
        responseType: 'blob',
      });
      
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
  }
};

// Specific API endpoints
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
};

// Request timeout handler
export const withTimeout = (promise, timeoutMs = 30000) => {
  const timeout = new Promise((_, reject) =>
    setTimeout(() => reject(new Error('Request timeout')), timeoutMs)
  );
  
  return Promise.race([promise, timeout]);
};

// Retry mechanism
export const withRetry = async (fn, retries = 3, delay = 1000) => {
  try {
    return await fn();
  } catch (error) {
    if (retries > 0 && error.status >= 500) {
      console.log(`Retrying request... ${retries} attempts left`);
      await new Promise(resolve => setTimeout(resolve, delay));
      return withRetry(fn, retries - 1, delay * 2);
    }
    throw error;
  }
};

// Health check
export const healthCheck = async () => {
  try {
    const response = await api.get('/health');
    return response.data;
  } catch (error) {
    console.error('Health check failed:', error);
    return null;
  }
};

export default api;