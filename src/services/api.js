import axios from 'axios';
import toast from 'react-hot-toast';

const BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

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

  // Feedback API methods
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