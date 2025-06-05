

// src/services/feedbackService.js
import { apiHelpers, endpoints } from '../config/api';

class FeedbackService {
  // Submit feedback
  async submitFeedback(data) {
    try {
      const response = await apiHelpers.post(endpoints.feedback.submit, data);
      return response;
    } catch (error) {
      throw error;
    }
  }

  // Get feedback history
  async getFeedbackHistory(params = {}) {
    try {
      const response = await apiHelpers.get(endpoints.feedback.history, params);
      return response;
    } catch (error) {
      throw error;
    }
  }

  // Analyze performance
  async analyzePerformance(data) {
    try {
      const response = await apiHelpers.post(endpoints.feedback.analyzePerformance, data);
      return response;
    } catch (error) {
      throw error;
    }
  }

  // Synthesize feedback
  async synthesizeFeedback(data) {
    try {
      const response = await apiHelpers.post(endpoints.feedback.synthesize, data);
      return response;
    } catch (error) {
      throw error;
    }
  }

  // Export feedback to sheets
  async exportToSheets(data) {
    try {
      const response = await apiHelpers.post(endpoints.feedback.exportSheets, data);
      return response;
    } catch (error) {
      throw error;
    }
  }

  // Validate feedback data
  validateFeedbackData(data) {
    const errors = {};

    if (!data.pujaId) {
      errors.pujaId = 'Puja ID is required';
    }

    if (!data.rating || data.rating < 1 || data.rating > 5) {
      errors.rating = 'Rating must be between 1 and 5';
    }

    if (data.ctr && (data.ctr < 0 || data.ctr > 100)) {
      errors.ctr = 'CTR must be between 0 and 100';
    }

    if (data.revenue && data.revenue < 0) {
      errors.revenue = 'Revenue cannot be negative';
    }

    return {
      isValid: Object.keys(errors).length === 0,
      errors
    };
  }

  // Calculate average rating
  calculateAverageRating(feedbacks) {
    if (!feedbacks || feedbacks.length === 0) return 0;
    
    const totalRating = feedbacks.reduce((sum, feedback) => sum + (feedback.rating || 0), 0);
    return (totalRating / feedbacks.length).toFixed(1);
  }

  // Get feedback summary
  getFeedbackSummary(feedbacks) {
    if (!feedbacks || feedbacks.length === 0) {
      return {
        total: 0,
        average: 0,
        distribution: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 }
      };
    }

    const distribution = feedbacks.reduce((acc, feedback) => {
      const rating = feedback.rating || 0;
      acc[rating] = (acc[rating] || 0) + 1;
      return acc;
    }, { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 });

    return {
      total: feedbacks.length,
      average: this.calculateAverageRating(feedbacks),
      distribution
    };
  }
}

export default new FeedbackService();