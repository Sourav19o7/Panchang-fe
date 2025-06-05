import axios from 'axios';
import toast from 'react-hot-toast';

// Use environment variable or default to localhost for development
const BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

class ApiService {
  constructor() {
    this.client = axios.create({
      baseURL: BASE_URL,
      timeout: 60000, // Increased timeout for deployment
      headers: {
        'Content-Type': 'application/json',
      },
      // Add explicit CORS and credential settings
      withCredentials: false, // Set to false to avoid preflight issues
      crossdomain: true,
    });

    // Request interceptor
    this.client.interceptors.request.use(
      (config) => {
        // Add any additional headers needed for CORS
        config.headers['Access-Control-Allow-Origin'] = '*';
        config.headers['Access-Control-Allow-Headers'] = '*';
        config.headers['Access-Control-Allow-Methods'] = '*';
        
        return config;
      },
      (error) => {
        return Promise.reject(error);
      }
    );

    // Response interceptor with better error handling
    this.client.interceptors.response.use(
      (response) => {
        return response;
      },
      (error) => {
        // Handle CORS errors specifically
        if (error.message && error.message.includes('CORS')) {
          console.error('CORS Error:', error);
          toast.error('Network connection error. Please check your internet connection.');
          return Promise.reject(error);
        }

        // Handle network errors
        if (error.code === 'NETWORK_ERROR' || error.message === 'Network Error') {
          console.error('Network Error:', error);
          toast.error('Unable to connect to server. Please check your connection.');
          return Promise.reject(error);
        }

        // Handle timeout errors
        if (error.code === 'ECONNABORTED') {
          console.error('Timeout Error:', error);
          toast.error('Request timeout. Please try again.');
          return Promise.reject(error);
        }

        if (error.response?.status === 401) {
          // Token expired or invalid
          localStorage.removeItem('token');
          this.setAuthToken(null);
          window.location.href = '/login';
        } else if (error.response?.status === 403) {
          toast.error('Access denied');
        } else if (error.response?.status >= 500) {
          toast.error('Server error. Please try again.');
        } else if (error.response?.status === 0) {
          // This often indicates CORS issues
          console.error('Possible CORS issue - Status 0:', error);
          toast.error('Connection blocked. Please check CORS settings.');
        }
        
        return Promise.reject(error);
      }
    );
  }

  setAuthToken(token) {
    if (token) {
      this.client.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    } else {
      delete this.client.defaults.headers.common['Authorization'];
    }
  }

  // Generic HTTP methods with better error handling
  async get(url, config = {}) {
    try {
      return await this.client.get(url, config);
    } catch (error) {
      console.error(`GET ${url} failed:`, error);
      throw error;
    }
  }

  async post(url, data = {}, config = {}) {
    try {
      return await this.client.post(url, data, config);
    } catch (error) {
      console.error(`POST ${url} failed:`, error);
      throw error;
    }
  }

  async put(url, data = {}, config = {}) {
    try {
      return await this.client.put(url, data, config);
    } catch (error) {
      console.error(`PUT ${url} failed:`, error);
      throw error;
    }
  }

  async delete(url, config = {}) {
    try {
      return await this.client.delete(url, config);
    } catch (error) {
      console.error(`DELETE ${url} failed:`, error);
      throw error;
    }
  }

  // Test connection method
  async testConnection() {
    try {
      const response = await this.get('/cors-test');
      console.log('Connection test successful:', response.data);
      return true;
    } catch (error) {
      console.error('Connection test failed:', error);
      return false;
    }
  }

  // Health check method
  async healthCheck() {
    try {
      const response = await this.client.get('/health');
      console.log('Health check successful:', response.data);
      return response.data;
    } catch (error) {
      console.error('Health check failed:', error);
      throw error;
    }
  }

  // Puja-specific API methods
  async generateFocusSuggestion(data) {
    return this.post('/puja/focus-suggestion', data);
  }

  async generateMonthlyPanchang(data) {
    return this.post('/puja/panchang/monthly', data);
  }

  async generatePropositions(data) {
    return this.post('/puja/propositions/generate', data);
  }

  async generateExperimentalPujas(data) {
    return this.post('/puja/propositions/experimental', data);
  }

  async getHistoricalPropositions(params = {}) {
    return this.get('/puja/propositions/history', { params });
  }

  async exportToSheets(data) {
    return this.post('/puja/export/sheets', data);
  }

  async getTeamFeedback(spreadsheetId) {
    return this.get(`/puja/feedback/sheets/${spreadsheetId}`);
  }

  async uploadPDFs(formData) {
    return this.post('/puja/pdfs/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      timeout: 120000, // 2 minutes for file uploads
    });
  }

  async listPDFs() {
    return this.get('/puja/pdfs/list');
  }

  async getPujaStatistics(params = {}) {
    return this.get('/puja/statistics', { params });
  }

  async searchPropositions(params = {}) {
    return this.get('/puja/propositions/search', { params });
  }

  async updatePropositionStatus(propositionId, data) {
    return this.put(`/puja/propositions/${propositionId}/status`, data);
  }

  async deleteProposition(propositionId) {
    return this.delete(`/puja/propositions/${propositionId}`);
  }

  async cloneProposition(propositionId, data) {
    return this.post(`/puja/propositions/${propositionId}/clone`, data);
  }

  async generateWhyWhyAnalysis(data) {
    return this.post('/puja/analysis/why-why', data);
  }

  async getPanchangForDate(date, location = 'delhi') {
    return this.get('/puja/panchang/date', { 
      params: { date, location } 
    });
  }

  async getSeasonalEvents(month) {
    return this.get('/puja/seasonal-events', { 
      params: { month } 
    });
  }

  async saveFocusSuggestion(data) {
    return this.post('/puja/focus-suggestion/save', data);
  }

  async getFocusSuggestionHistory(params = {}) {
    return this.get('/puja/focus-suggestion/history', { params });
  }

  async exportPanchangData(data) {
    return this.post('/puja/panchang/export', data);
  }

  async bulkUpdatePropositions(data) {
    return this.post('/puja/propositions/bulk-update', data);
  }

  async getPropositionsByCategory(category, params = {}) {
    return this.get(`/puja/propositions/category/${category}`, { params });
  }

  async generatePropositionVariations(propositionId, data) {
    return this.post(`/puja/propositions/${propositionId}/variations`, data);
  }

  // Advanced analysis methods using professional prompts
  async performCompetitiveAnalysis(data) {
    return this.post('/puja/analysis/competitive', data);
  }

  async optimizeSeasonalStrategy(data) {
    return this.post('/puja/analysis/seasonal', data);
  }

  // Advanced experimental methods
  async conductInnovationWorkshop(data) {
    return this.post('/puja/experiments/innovation-workshop', data);
  }

  async designABTest(data) {
    return this.post('/puja/experiments/ab-test-design', data);
  }

  async generateBreakthroughIdeas(data) {
    return this.post('/puja/experiments/breakthrough-ideas', data);
  }

  async designRapidPrototype(data) {
    return this.post('/puja/experiments/rapid-prototype', data);
  }

  // Enhanced feedback methods
  async submitFeedback(data) {
    return this.post('/feedback/submit', data);
  }

  async getFeedbackHistory(params = {}) {
    return this.get('/feedback/history', { params });
  }

  async analyzePerformance(data) {
    return this.post('/feedback/analyze/performance', data);
  }

  async synthesizeFeedback(data) {
    return this.post('/feedback/synthesize', data);
  }

  async exportFeedbackToSheets(data) {
    return this.post('/feedback/export/sheets', data);
  }
}

// Create and export the API instance
export const api = new ApiService();

// Test connection on startup in development
if (process.env.NODE_ENV === 'development') {
  api.testConnection().then(success => {
    console.log('API Connection Test:', success ? 'SUCCESS' : 'FAILED');
  });
}