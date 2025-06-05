import React, { useState } from 'react';
import { api } from '../services/api';
import toast from 'react-hot-toast';
import { Brain, Calendar, Sparkles, TrendingUp, Target, Users } from 'lucide-react';

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

  const renderSuggestionContent = () => {
    if (!suggestions?.suggestions) return null;

    const data = suggestions.suggestions;

    // Check if we have an error
    if (data.error) {
      return (
        <div className="result-item" style={{ borderLeft: '4px solid #dc3545' }}>
          <div className="result-header">
            <h4 className="result-title">⚠️ Generation Error</h4>
          </div>
          <div className="result-content">
            <p style={{ color: '#dc3545' }}>{data.error}</p>
            {data.errorDetails && (
              <p style={{ fontSize: '0.9rem', color: '#666', marginTop: '0.5rem' }}>
                Details: {data.errorDetails}
              </p>
            )}
          </div>
        </div>
      );
    }

    return (
      <div className="results-grid">
        {/* Focus Themes */}
        {data.focusThemes && data.focusThemes.length > 0 && (
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
              <div className="taglines">
                {data.focusThemes.map((theme, index) => (
                  <span key={index} className="tagline-item">{theme}</span>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Top Puja Categories */}
        {data.topCategories && data.topCategories.length > 0 && (
          <div className="result-item">
            <div className="result-header">
              <div>
                <h4 className="result-title">
                  <Target size={18} style={{ display: 'inline', marginRight: '8px' }} />
                  Top Puja Categories
                </h4>
              </div>
            </div>
            <div className="result-content">
              {data.topCategories.map((category, index) => (
                <div key={index} style={{ marginBottom: '1rem', padding: '1rem', background: 'rgba(255, 107, 53, 0.05)', borderRadius: '8px' }}>
                  <div style={{ fontWeight: '600', color: '#ff6b35', marginBottom: '0.5rem' }}>
                    {category.category}
                  </div>
                  <div style={{ fontSize: '0.9rem', lineHeight: '1.5' }}>
                    {category.rationale}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Recommended Deities */}
        {data.recommendedDeities && data.recommendedDeities.length > 0 && (
          <div className="result-item">
            <div className="result-header">
              <div>
                <h4 className="result-title">
                  <Sparkles size={18} style={{ display: 'inline', marginRight: '8px' }} />
                  High-Performing Deities
                </h4>
              </div>
            </div>
            <div className="result-content">
              <div className="taglines">
                {data.recommendedDeities.map((deity, index) => (
                  <span key={index} className="tagline-item">{deity}</span>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Deity Combinations */}
        {data.deityCominations && data.deityCominations.length > 0 && (
          <div className="result-item">
            <div className="result-header">
              <div>
                <h4 className="result-title">
                  <Users size={18} style={{ display: 'inline', marginRight: '8px' }} />
                  Recommended Deity Combinations
                </h4>
              </div>
            </div>
            <div className="result-content">
              {data.deityCominations.map((combo, index) => (
                <div key={index} style={{ marginBottom: '1rem', padding: '1rem', background: 'rgba(102, 126, 234, 0.05)', borderRadius: '8px' }}>
                  <div style={{ fontWeight: '600', color: '#667eea', marginBottom: '0.5rem' }}>
                    {combo.deity_combination}
                  </div>
                  <div style={{ fontSize: '0.9rem', lineHeight: '1.5' }}>
                    {combo.rationale}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Timing Strategies */}
        {data.timingStrategies && data.timingStrategies.length > 0 && (
          <div className="result-item">
            <div className="result-header">
              <div>
                <h4 className="result-title">
                  <TrendingUp size={18} style={{ display: 'inline', marginRight: '8px' }} />
                  Optimal Timing Strategies
                </h4>
              </div>
            </div>
            <div className="result-content">
              {data.timingStrategies.map((timing, index) => (
                <div key={index} style={{ marginBottom: '1rem', padding: '1rem', background: 'rgba(118, 75, 162, 0.05)', borderRadius: '8px' }}>
                  <div style={{ fontWeight: '600', color: '#764ba2', marginBottom: '0.5rem' }}>
                    {timing.timing}
                  </div>
                  <div style={{ fontSize: '0.9rem', lineHeight: '1.5' }}>
                    {timing.rationale}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Optimal Timing */}
        {data.optimalTiming && (
          <div className="result-item">
            <div className="result-header">
              <div>
                <h4 className="result-title">
                  <TrendingUp size={18} style={{ display: 'inline', marginRight: '8px' }} />
                  General Timing Guidance
                </h4>
              </div>
            </div>
            <div className="result-content">
              <p>{data.optimalTiming}</p>
            </div>
          </div>
        )}

        {/* Cultural Significance */}
        {data.culturalSignificance && (
          <div className="result-item">
            <div className="result-header">
              <div>
                <h4 className="result-title">Cultural Significance</h4>
              </div>
            </div>
            <div className="result-content">
              <p>{data.culturalSignificance}</p>
              {data.dataNote && (
                <p style={{ fontStyle: 'italic', color: '#666', marginTop: '0.5rem', fontSize: '0.9rem' }}>
                  {data.dataNote}
                </p>
              )}
            </div>
          </div>
        )}
      </div>
    );
  };

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
            📿 Monthly Focus Suggestions for {months[formData.month - 1]} {formData.year}
          </h3>

          {renderSuggestionContent()}

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