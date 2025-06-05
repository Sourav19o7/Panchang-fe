// src/services/pujaService.js
import { apiHelpers, endpoints } from '../config/api';

class PujaService {
  // Generate focus suggestions
  async generateFocusSuggestion(data) {
    try {
      const response = await apiHelpers.post(endpoints.puja.focusSuggestion, data);
      return response;
    } catch (error) {
      throw error;
    }
  }

  // Generate monthly Panchang data
  async generateMonthlyPanchang(data) {
    try {
      const response = await apiHelpers.post(endpoints.puja.monthlyPanchang, data);
      return response;
    } catch (error) {
      throw error;
    }
  }

  // Generate puja propositions
  async generatePropositions(data) {
    try {
      const response = await apiHelpers.post(endpoints.puja.generatePropositions, data);
      return response;
    } catch (error) {
      throw error;
    }
  }

  // Generate experimental pujas
  async generateExperimentalPujas(data) {
    try {
      const response = await apiHelpers.post(endpoints.puja.experimentalPujas, data);
      return response;
    } catch (error) {
      throw error;
    }
  }

  // Get historical propositions
  async getHistoricalPropositions(params = {}) {
    try {
      const response = await apiHelpers.get(endpoints.puja.history, params);
      return response;
    } catch (error) {
      throw error;
    }
  }

  // Export to Google Sheets
  async exportToSheets(data) {
    try {
      const response = await apiHelpers.post(endpoints.puja.exportSheets, data);
      return response;
    } catch (error) {
      throw error;
    }
  }

  // Get team feedback from sheets
  async getTeamFeedback(spreadsheetId) {
    try {
      const response = await apiHelpers.get(endpoints.puja.teamFeedback(spreadsheetId));
      return response;
    } catch (error) {
      throw error;
    }
  }

  // Upload PDF files
  async uploadPDFs(files, onProgress = null) {
    try {
      const formData = new FormData();
      files.forEach(file => {
        formData.append('pdfs', file);
      });

      const response = await apiHelpers.upload(
        endpoints.puja.uploadPDFs, 
        formData, 
        onProgress
      );
      return response;
    } catch (error) {
      throw error;
    }
  }

  // List available PDFs
  async listPDFs() {
    try {
      const response = await apiHelpers.get(endpoints.puja.listPDFs);
      return response;
    } catch (error) {
      throw error;
    }
  }

  // Validate proposition data
  validatePropositionData(data) {
    const errors = {};

    if (!data.month || data.month < 1 || data.month > 12) {
      errors.month = 'Valid month is required';
    }

    if (!data.year || data.year < 2020 || data.year > 2030) {
      errors.year = 'Valid year is required';
    }

    if (!data.dates || data.dates.length === 0) {
      errors.dates = 'At least one date is required';
    }

    return {
      isValid: Object.keys(errors).length === 0,
      errors
    };
  }

  // Format proposition data for display
  formatPropositionData(proposition) {
    return {
      ...proposition,
      formattedDate: new Date(proposition.date).toLocaleDateString('en-IN'),
      shortRationale: proposition.rationale ? 
        proposition.rationale.substring(0, 150) + '...' : '',
      taglinesText: proposition.taglines ? 
        proposition.taglines.join(', ') : ''
    };
  }
}

export default new PujaService();