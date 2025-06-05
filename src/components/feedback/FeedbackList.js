

// ==================================================
// 11. src/components/feedback/FeedbackList.js
// ==================================================
import React, { useState, useEffect } from 'react';
import { Star, Filter, Download, Eye } from 'lucide-react';
import feedbackService from '../../services/feedbackService';
import Loading from '../common/Loading';
import { formatDate, formatCurrency } from '../../utils/helpers';

const FeedbackList = () => {
  const [feedbacks, setFeedbacks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    month: '',
    year: '',
    rating: '',
    sortBy: 'created_at',
    sortOrder: 'desc'
  });

  useEffect(() => {
    loadFeedbacks();
  }, [filters]);

  const loadFeedbacks = async () => {
    try {
      setLoading(true);
      const result = await feedbackService.getFeedbackHistory(filters);
      if (result.success) {
        setFeedbacks(result.data);
      }
    } catch (error) {
      console.error('Failed to load feedbacks:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const renderStars = (rating) => {
    return (
      <div className="star-display">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            size={16}
            fill={rating >= star ? '#fbbf24' : 'none'}
            className={rating >= star ? 'text-yellow-400' : 'text-gray-300'}
          />
        ))}
      </div>
    );
  };

  if (loading) {
    return <Loading message="Loading feedback..." />;
  }

  return (
    <div className="feedback-list">
      <div className="page-header">
        <h1 className="page-title">Feedback History</h1>
        <p className="page-subtitle">Review all puja feedback and performance data</p>
      </div>

      <div className="filters-section">
        <div className="filters-grid">
          <select
            name="month"
            value={filters.month}
            onChange={handleFilterChange}
            className="form-select"
          >
            <option value="">All Months</option>
            {Array.from({ length: 12 }, (_, i) => (
              <option key={i + 1} value={i + 1}>
                {new Date(2023, i).toLocaleString('default', { month: 'long' })}
              </option>
            ))}
          </select>
          
          <select
            name="year"
            value={filters.year}
            onChange={handleFilterChange}
            className="form-select"
          >
            <option value="">All Years</option>
            {Array.from({ length: 5 }, (_, i) => (
              <option key={2022 + i} value={2022 + i}>
                {2022 + i}
              </option>
            ))}
          </select>
          
          <select
            name="rating"
            value={filters.rating}
            onChange={handleFilterChange}
            className="form-select"
          >
            <option value="">All Ratings</option>
            <option value="5">5 Stars</option>
            <option value="4">4+ Stars</option>
            <option value="3">3+ Stars</option>
            <option value="2">2+ Stars</option>
            <option value="1">1+ Stars</option>
          </select>
          
          <button className="btn btn-outline">
            <Download size={16} />
            Export
          </button>
        </div>
      </div>

      <div className="feedback-cards">
        {feedbacks.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">📝</div>
            <h3>No feedback found</h3>
            <p>Submit your first feedback to see it here</p>
          </div>
        ) : (
          feedbacks.map((feedback) => (
            <div key={feedback.id} className="feedback-card">
              <div className="feedback-header">
                <div>
                  <h3>{feedback.puja_propositions?.proposition_data?.pujaName || 'Unnamed Puja'}</h3>
                  <p className="feedback-date">{formatDate(feedback.created_at)}</p>
                </div>
                <div className="feedback-rating">
                  {renderStars(feedback.rating)}
                  <span className="rating-value">{feedback.rating}/5</span>
                </div>
              </div>

              <div className="feedback-metrics">
                {feedback.ctr && (
                  <div className="metric">
                    <span className="metric-label">CTR:</span>
                    <span className="metric-value">{feedback.ctr}%</span>
                  </div>
                )}
                {feedback.revenue && (
                  <div className="metric">
                    <span className="metric-label">Revenue:</span>
                    <span className="metric-value">{formatCurrency(feedback.revenue)}</span>
                  </div>
                )}
              </div>

              <div className="feedback-content">
                {feedback.user_feedback && (
                  <div className="feedback-section">
                    <h4>User Feedback:</h4>
                    <p>{feedback.user_feedback}</p>
                  </div>
                )}
                
                {feedback.team_review && (
                  <div className="feedback-section">
                    <h4>Team Review:</h4>
                    <p>{feedback.team_review}</p>
                  </div>
                )}
              </div>

              <div className="feedback-actions">
                <button className="btn btn-sm btn-outline">
                  <Eye size={14} />
                  View Details
                </button>
                <button className="btn btn-sm btn-outline">Edit</button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default FeedbackList;