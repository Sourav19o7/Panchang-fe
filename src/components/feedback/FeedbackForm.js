// ==================================================
// 10. src/components/feedback/FeedbackForm.js
// ==================================================
import React, { useState, useEffect } from 'react';
import { Star, Send, Search } from 'lucide-react';
import { toast } from 'react-toastify';
import feedbackService from '../../services/feedbackService';
import pujaService from '../../services/pujaService';
import Loading from '../common/Loading';

const FeedbackForm = () => {
  const [pujas, setPujas] = useState([]);
  const [selectedPuja, setSelectedPuja] = useState('');
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    userFeedback: '',
    teamReview: '',
    rating: 5,
    ctr: '',
    revenue: '',
    learnings: '',
    nextActions: ''
  });

  useEffect(() => {
    loadPujas();
  }, []);

  const loadPujas = async () => {
    try {
      setLoading(true);
      const result = await pujaService.getHistoricalPropositions({
        status: 'completed',
        limit: 50
      });
      if (result.success) {
        setPujas(result.data);
      }
    } catch (error) {
      console.error('Failed to load pujas:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleRatingChange = (rating) => {
    setFormData(prev => ({
      ...prev,
      rating
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!selectedPuja) {
      toast.error('Please select a puja');
      return;
    }

    const validation = feedbackService.validateFeedbackData({
      pujaId: selectedPuja,
      ...formData
    });

    if (!validation.isValid) {
      Object.values(validation.errors).forEach(error => toast.error(error));
      return;
    }

    try {
      setSubmitting(true);
      const result = await feedbackService.submitFeedback({
        pujaId: selectedPuja,
        ...formData
      });

      if (result.success) {
        toast.success('Feedback submitted successfully');
        setFormData({
          userFeedback: '',
          teamReview: '',
          rating: 5,
          ctr: '',
          revenue: '',
          learnings: '',
          nextActions: ''
        });
        setSelectedPuja('');
      }
    } catch (error) {
      toast.error('Failed to submit feedback');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return <Loading message="Loading pujas..." />;
  }

  return (
    <div className="feedback-form">
      <div className="page-header">
        <h1 className="page-title">Submit Feedback</h1>
        <p className="page-subtitle">Provide feedback on puja performance</p>
      </div>

      <form onSubmit={handleSubmit} className="form-container">
        <div className="form-section">
          <h3>Select Puja</h3>
          <div className="form-group">
            <label htmlFor="puja-select">Puja Proposition</label>
            <select
              id="puja-select"
              value={selectedPuja}
              onChange={(e) => setSelectedPuja(e.target.value)}
              className="form-select"
              required
            >
              <option value="">Select a puja to review</option>
              {pujas.map((puja) => (
                <option key={puja.id} value={puja.id}>
                  {puja.proposition_data?.pujaName} - {new Date(puja.date).toLocaleDateString()}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="form-section">
          <h3>Performance Rating</h3>
          <div className="rating-section">
            <label>Overall Rating</label>
            <div className="star-rating">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  className={`star ${formData.rating >= star ? 'active' : ''}`}
                  onClick={() => handleRatingChange(star)}
                >
                  <Star size={24} fill={formData.rating >= star ? 'currentColor' : 'none'} />
                </button>
              ))}
            </div>
            <span className="rating-text">{formData.rating}/5 stars</span>
          </div>
        </div>

        <div className="form-section">
          <h3>Performance Metrics</h3>
          <div className="form-grid">
            <div className="form-group">
              <label htmlFor="ctr">Click-Through Rate (%)</label>
              <input
                type="number"
                id="ctr"
                name="ctr"
                value={formData.ctr}
                onChange={handleInputChange}
                className="form-input"
                min="0"
                max="100"
                step="0.1"
                placeholder="e.g., 8.5"
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="revenue">Revenue (₹)</label>
              <input
                type="number"
                id="revenue"
                name="revenue"
                value={formData.revenue}
                onChange={handleInputChange}
                className="form-input"
                min="0"
                step="100"
                placeholder="e.g., 125000"
              />
            </div>
          </div>
        </div>

        <div className="form-section">
          <h3>Feedback Details</h3>
          <div className="form-group">
            <label htmlFor="userFeedback">User Feedback</label>
            <textarea
              id="userFeedback"
              name="userFeedback"
              value={formData.userFeedback}
              onChange={handleInputChange}
              className="form-textarea"
              rows="4"
              placeholder="Share feedback from participants and users..."
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="teamReview">Team Review</label>
            <textarea
              id="teamReview"
              name="teamReview"
              value={formData.teamReview}
              onChange={handleInputChange}
              className="form-textarea"
              rows="4"
              placeholder="Internal team assessment and observations..."
            />
          </div>
        </div>

        <div className="form-section">
          <h3>Insights & Actions</h3>
          <div className="form-group">
            <label htmlFor="learnings">Key Learnings</label>
            <textarea
              id="learnings"
              name="learnings"
              value={formData.learnings}
              onChange={handleInputChange}
              className="form-textarea"
              rows="3"
              placeholder="What did we learn from this puja campaign?"
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="nextActions">Next Actions</label>
            <textarea
              id="nextActions"
              name="nextActions"
              value={formData.nextActions}
              onChange={handleInputChange}
              className="form-textarea"
              rows="3"
              placeholder="Recommended actions for future campaigns..."
            />
          </div>
        </div>

        <div className="form-actions">
          <button
            type="submit"
            disabled={submitting}
            className="btn btn-primary"
          >
            {submitting ? (
              <>
                <div className="btn-spinner"></div>
                Submitting...
              </>
            ) : (
              <>
                <Send size={16} />
                Submit Feedback
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default FeedbackForm;