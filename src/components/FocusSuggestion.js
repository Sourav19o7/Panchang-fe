import React, { useState } from 'react';
import { api } from '../services/api';
import toast from 'react-hot-toast';
import { Brain, Calendar, Sparkles, TrendingUp } from 'lucide-react';

const FocusSuggestion = () => {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    month: new Date().getMonth() + 1,
    year: new Date().getFullYear(),
    theme: ''
  });
  const [suggestions, setSuggestions] = useState(null);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await api.generateFocusSuggestion(formData);
      
      if (response.data.success) {
        setSuggestions(response.data.data);
        toast.success('Focus suggestions generated successfully!');
      } else {
        toast.error(response.data.error || 'Failed to generate suggestions');
      }
    } catch (error) {
      console.error('Error:', error);
      toast.error('Failed to generate focus suggestions');
    } finally {
      setLoading(false);
    }
  };

  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  return (
    <div>
      <div className="card">
        <div className="card-header">
          <div className="card-icon">
            <Brain size={24} />
          </div>
          <div>
            <h2 className="card-title">Monthly Focus Suggestion</h2>
            <p className="card-description">
              Get AI-powered recommendations for your monthly puja focus based on historical data and seasonal events.
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Month</label>
              <select
                name="month"
                value={formData.month}
                onChange={handleChange}
                className="form-input"
                required
              >
                {months.map((month, index) => (
                  <option key={index} value={index + 1}>
                    {month}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Year</label>
              <input
                type="number"
                name="year"
                value={formData.year}
                onChange={handleChange}
                className="form-input"
                min="2020"
                max="2030"
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Optional Theme (leave blank for AI suggestion)</label>
            <input
              type="text"
              name="theme"
              value={formData.theme}
              onChange={handleChange}
              className="form-input"
              placeholder="e.g., Festival season, New beginnings, etc."
            />
          </div>

          <button 
            type="submit" 
            className="btn btn-primary"
            disabled={loading}
            style={{ width: '100%' }}
          >
            {loading ? (
              <>
                <div className="spinner" style={{ width: '18px', height: '18px', marginRight: '8px' }}></div>
                Generating Suggestions...
              </>
            ) : (
              <>
                <Sparkles size={18} />
                Generate Focus Suggestions
              </>
            )}
          </button>
        </form>
      </div>

      {/* Results */}
      {suggestions && (
        <div className="results-section">
          <h3 style={{ marginBottom: '1.5rem', color: '#333', fontSize: '1.4rem', fontWeight: '700' }}>
            Monthly Focus Suggestions for {months[formData.month - 1]} {formData.year}
          </h3>

          <div className="results-grid">
            {/* Focus Themes */}
            <div className="result-item">
              <div className="result-header">
                <div>
                  <h4 className="result-title">
                    <Calendar size={18} style={{ display: 'inline', marginRight: '8px' }} />
                    Recommended Focus Themes
                  </h4>
                </div>
              </div>
              <div className="result-content">
                {suggestions.suggestions?.focusThemes ? (
                  <div className="taglines">
                    {suggestions.suggestions.focusThemes.map((theme, index) => (
                      <span key={index} className="tagline-item">{theme}</span>
                    ))}
                  </div>
                ) : (
                  <p>Spiritual Growth, Divine Blessings, Inner Peace</p>
                )}
              </div>
            </div>

            {/* Recommended Deities */}
            <div className="result-item">
              <div className="result-header">
                <div>
                  <h4 className="result-title">
                    <Sparkles size={18} style={{ display: 'inline', marginRight: '8px' }} />
                    Top Performing Deities
                  </h4>
                </div>
              </div>
              <div className="result-content">
                {suggestions.suggestions?.recommendedDeities || suggestions.suggestions?.topDeities ? (
                  <div className="taglines">
                    {(suggestions.suggestions.recommendedDeities || suggestions.suggestions.topDeities).map((deity, index) => (
                      <span key={index} className="tagline-item">{deity}</span>
                    ))}
                  </div>
                ) : (
                  <div className="taglines">
                    <span className="tagline-item">Ganesha</span>
                    <span className="tagline-item">Lakshmi</span>
                    <span className="tagline-item">Saraswati</span>
                  </div>
                )}
              </div>
            </div>

            {/* Optimal Timing */}
            <div className="result-item">
              <div className="result-header">
                <div>
                  <h4 className="result-title">
                    <TrendingUp size={18} style={{ display: 'inline', marginRight: '8px' }} />
                    Optimal Timing
                  </h4>
                </div>
              </div>
              <div className="result-content">
                <p>{suggestions.suggestions?.optimalTiming || suggestions.suggestions?.recommendedTiming || 'Morning hours between 6 AM to 10 AM are most auspicious'}</p>
              </div>
            </div>

            {/* Cultural Significance */}
            <div className="result-item">
              <div className="result-header">
                <div>
                  <h4 className="result-title">Cultural Significance</h4>
                </div>
              </div>
              <div className="result-content">
                <p>{suggestions.suggestions?.culturalSignificance || 'Based on traditional Vedic principles and seasonal alignment'}</p>
                {suggestions.suggestions?.note && (
                  <p style={{ fontStyle: 'italic', color: '#666', marginTop: '0.5rem' }}>
                    {suggestions.suggestions.note}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Historical Context */}
          {suggestions.historicalContext && suggestions.historicalContext.length > 0 && (
            <div style={{ marginTop: '2rem' }}>
              <h4 style={{ marginBottom: '1rem', color: '#333' }}>Historical Performance Data</h4>
              <div style={{ 
                background: 'rgba(255, 255, 255, 0.8)', 
                padding: '1rem', 
                borderRadius: '10px',
                fontSize: '0.9rem',
                color: '#666'
              }}>
                Found {suggestions.historicalContext.length} historical data points for analysis
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default FocusSuggestion;