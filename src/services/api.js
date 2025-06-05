// src/services/api.js - Updated version with all new methods
import axios from 'axios';
import toast from 'react-hot-toast';

// Use environment variable or default to localhost for development
const BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

class ApiService {
  constructor() {
    this.client = axios.create({
      baseURL: BASE_URL,
      timeout: 60000,
      headers: {
        'Content-Type': 'application/json',
      },
      withCredentials: false,
      crossdomain: true,
    });

    // Request interceptor
    this.client.interceptors.request.use(
      (config) => {
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
        if (error.message && error.message.includes('CORS')) {
          console.error('CORS Error:', error);
          toast.error('Network connection error. Please check your internet connection.');
          return Promise.reject(error);
        }

        if (error.code === 'NETWORK_ERROR' || error.message === 'Network Error') {
          console.error('Network Error:', error);
          toast.error('Unable to connect to server. Please check your connection.');
          return Promise.reject(error);
        }

        if (error.code === 'ECONNABORTED') {
          console.error('Timeout Error:', error);
          toast.error('Request timeout. Please try again.');
          return Promise.reject(error);
        }

        if (error.response?.status === 401) {
          localStorage.removeItem('token');
          this.setAuthToken(null);
          window.location.href = '/login';
        } else if (error.response?.status === 403) {
          toast.error('Access denied');
        } else if (error.response?.status >= 500) {
          toast.error('Server error. Please try again.');
        } else if (error.response?.status === 0) {
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

  // Generic HTTP methods
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

  // =====================================
  // EXISTING PUJA API METHODS
  // =====================================
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

  async uploadPDFs(formData) {
    return this.post('/puja/pdfs/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      timeout: 120000,
    });
  }

  async listPDFs() {
    return this.get('/puja/pdfs/list');
  }

  async getPujaStatistics(params = {}) {
    return this.get('/puja/statistics', { params });
  }

  async getPanchangForDate(date, location = 'delhi') {
    return this.get('/puja/panchang/date', { 
      params: { date, location } 
    });
  }

  async saveFocusSuggestion(data) {
    return this.post('/puja/focus-suggestion/save', data);
  }

  async getFocusSuggestionHistory(params = {}) {
    return this.get('/puja/focus-suggestion/history', { params });
  }

  async getSeasonalEvents(month) {
    return this.get('/puja/seasonal-events', { 
      params: { month } 
    });
  }

  // =====================================
  // NEW PROPOSITION MANAGEMENT METHODS
  // =====================================

  // Search propositions with advanced filters
  async searchPropositions(params = {}) {
    return this.get('/puja/propositions/search', { params });
  }

  // Get propositions by category
  async getPropositionsByCategory(category, params = {}) {
    return this.get(`/puja/propositions/category/${category}`, { params });
  }

  // Update proposition status
  async updatePropositionStatus(propositionId, data) {
    return this.put(`/puja/propositions/${propositionId}/status`, data);
  }

  // Delete proposition
  async deleteProposition(propositionId) {
    return this.delete(`/puja/propositions/${propositionId}`);
  }

  // Clone proposition
  async cloneProposition(propositionId, data) {
    return this.post(`/puja/propositions/${propositionId}/clone`, data);
  }

  // Generate proposition variations
  async generatePropositionVariations(propositionId, data) {
    return this.post(`/puja/propositions/${propositionId}/variations`, data);
  }

  // Bulk update propositions
  async bulkUpdatePropositions(data) {
    return this.post('/puja/propositions/bulk-update', data);
  }

  // =====================================
  // ADVANCED ANALYSIS METHODS
  // =====================================

  // Generate Why-Why Analysis
  async generateWhyWhyAnalysis(data) {
    return this.post('/puja/analysis/why-why', data);
  }

  // Analyze Performance
  async analyzePerformance(data) {
    return this.post('/puja/analysis/performance', data);
  }

  // Competitive Analysis
  async performCompetitiveAnalysis(data) {
    return this.post('/puja/analysis/competitive', data);
  }

  // Seasonal Strategy Optimization
  async optimizeSeasonalStrategy(data) {
    return this.post('/puja/analysis/seasonal', data);
  }

  // =====================================
  // INNOVATION & EXPERIMENTATION METHODS
  // =====================================

  // Innovation Workshop
  async conductInnovationWorkshop(data) {
    return this.post('/puja/experiments/innovation-workshop', data);
  }

  // A/B Test Design
  async designABTest(data) {
    return this.post('/puja/experiments/ab-test-design', data);
  }

  // Breakthrough Ideas
  async generateBreakthroughIdeas(data) {
    return this.post('/puja/experiments/breakthrough-ideas', data);
  }

  // Rapid Prototype Design
  async designRapidPrototype(data) {
    return this.post('/puja/experiments/rapid-prototype', data);
  }

  // =====================================
  // TEAM REVIEW METHODS
  // =====================================

  // Sync feedback from Google Sheets
  async syncSheetFeedback(data) {
    return this.post('/team-review/sync-sheet-feedback', data);
  }

  // Get review status
  async getReviewStatus(params = {}) {
    return this.get('/team-review/status', { params });
  }

  // Submit review
  async submitReview(propositionId, data) {
    return this.post(`/team-review/submit/${propositionId}`, data);
  }

  // Get pending reviews
  async getPendingReviews(params = {}) {
    return this.get('/team-review/pending', { params });
  }

  // Bulk review
  async bulkReview(data) {
    return this.post('/team-review/bulk-review', data);
  }

  // =====================================
  // PERFORMANCE TRACKING METHODS
  // =====================================

  // Track performance metrics
  async trackPerformance(data) {
    return this.post('/performance/track', data);
  }

  // Get performance analytics
  async getPerformanceAnalytics(params = {}) {
    return this.get('/performance/analytics', { params });
  }

  // Get ROI analysis
  async getROIAnalysis(params = {}) {
    return this.get('/performance/roi-analysis', { params });
  }

  // Get top performers
  async getTopPerformers(params = {}) {
    return this.get('/performance/top-performers', { params });
  }

  // Track conversion funnel
  async trackConversionFunnel(data) {
    return this.post('/performance/track-conversion', data);
  }

  // =====================================
  // LEARNING SYSTEM METHODS
  // =====================================

  // Analyze patterns
  async analyzePatterns(params = {}) {
    return this.get('/learning/analyze-patterns', { params });
  }

  // Get success factors
  async getSuccessFactors(params = {}) {
    return this.get('/learning/success-factors', { params });
  }

  // Generate recommendations
  async generateRecommendations(data) {
    return this.post('/learning/generate-recommendations', data);
  }

  // Track learning outcome
  async trackLearningOutcome(data) {
    return this.post('/learning/track-outcome', data);
  }

  // =====================================
  // FEEDBACK METHODS
  // =====================================

  // Submit feedback
  async submitFeedback(data) {
    return this.post('/feedback/submit', data);
  }

  // Get feedback history
  async getFeedbackHistory(params = {}) {
    return this.get('/feedback/history', { params });
  }

  // Synthesize feedback
  async synthesizeFeedback(data) {
    return this.post('/feedback/synthesize', data);
  }

  // Export feedback to sheets
  async exportFeedbackToSheets(data) {
    return this.post('/feedback/export/sheets', data);
  }

  // =====================================
  // ANALYTICS & DASHBOARD METHODS
  // =====================================

  // Get dashboard data
  async getDashboardData(params = {}) {
    return this.get('/dashboard/data', { params });
  }

  // Get weekly overview
  async getWeeklyOverview(params = {}) {
    return this.get('/dashboard/weekly', { params });
  }

  // Get user activity
  async getUserActivity(params = {}) {
    return this.get('/dashboard/activity', { params });
  }

  // Get analytics dashboard
  async getAnalyticsDashboard(params = {}) {
    return this.get('/analytics/dashboard', { params });
  }

  // Get performance analytics
  async getAnalyticsPerformance(params = {}) {
    return this.get('/analytics/performance', { params });
  }

  // Get trends
  async getAnalyticsTrends(params = {}) {
    return this.get('/analytics/trends', { params });
  }

  // Get insights
  async getAnalyticsInsights(params = {}) {
    return this.get('/analytics/insights', { params });
  }

  // =====================================
  // UTILITY METHODS
  // =====================================

  // Test connection
  async testConnection() {
    try {
      const response = await this.get('/test');
      console.log('Connection test successful:', response.data);
      return true;
    } catch (error) {
      console.error('Connection test failed:', error);
      return false;
    }
  }

  // Generic search method for any endpoint
  async search(endpoint, params = {}) {
    return this.get(`${endpoint}/search`, { params });
  }

  // Generic list method for any endpoint
  async list(endpoint, params = {}) {
    return this.get(endpoint, { params });
  }

  // Generic create method
  async create(endpoint, data) {
    return this.post(endpoint, data);
  }

  // Generic update method
  async update(endpoint, id, data) {
    return this.put(`${endpoint}/${id}`, data);
  }

  // Generic delete method
  async remove(endpoint, id) {
    return this.delete(`${endpoint}/${id}`);
  }

  // Batch operations
  async batchOperation(endpoint, operation, data) {
    return this.post(`${endpoint}/${operation}`, data);
  }

  // File upload helper
  async uploadFile(endpoint, file, additionalData = {}) {
    const formData = new FormData();
    formData.append('file', file);
    
    Object.keys(additionalData).forEach(key => {
      formData.append(key, additionalData[key]);
    });

    return this.post(endpoint, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      timeout: 120000,
    });
  }

  // Export helper
  async exportData(endpoint, format = 'json', params = {}) {
    return this.get(`${endpoint}/export`, {
      params: { ...params, format },
      responseType: format === 'csv' ? 'blob' : 'json'
    });
  }

  // Pagination helper
  async getPaginated(endpoint, page = 1, limit = 20, params = {}) {
    const offset = (page - 1) * limit;
    return this.get(endpoint, {
      params: {
        ...params,
        limit,
        offset
      }
    });
  }

  // Error handling helper
  handleApiError(error, customMessage = null) {
    const message = customMessage || 
                   error.response?.data?.error || 
                   error.message || 
                   'An unexpected error occurred';
    
    toast.error(message);
    console.error('API Error:', error);
    
    return {
      success: false,
      error: message,
      status: error.response?.status,
      data: null
    };
  }

  // Success response helper
  handleApiSuccess(response, customMessage = null) {
    if (customMessage) {
      toast.success(customMessage);
    }
    
    return {
      success: true,
      data: response.data,
      status: response.status,
      error: null
    };
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