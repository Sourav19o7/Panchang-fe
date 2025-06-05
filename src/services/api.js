import axios from 'axios';
import toast from 'react-hot-toast';

const BASE_URL = process.env.REACT_APP_API_URL;

class ApiService {
  constructor() {
    this.client = axios.create({
      baseURL: BASE_URL,
      timeout: 30000,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // Request interceptor
    this.client.interceptors.request.use(
      (config) => {
        return config;
      },
      (error) => {
        return Promise.reject(error);
      }
    );

    // Response interceptor
    this.client.interceptors.response.use(
      (response) => {
        return response;
      },
      (error) => {
        if (error.response?.status === 401) {
          // Token expired or invalid
          localStorage.removeItem('token');
          this.setAuthToken(null);
          window.location.href = '/login';
        } else if (error.response?.status === 403) {
          toast.error('Access denied');
        } else if (error.response?.status >= 500) {
          toast.error('Server error. Please try again.');
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
    return this.client.get(url, config);
  }

  async post(url, data = {}, config = {}) {
    return this.client.post(url, data, config);
  }

  async put(url, data = {}, config = {}) {
    return this.client.put(url, data, config);
  }

  async delete(url, config = {}) {
    return this.client.delete(url, config);
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

export const api = new ApiService();