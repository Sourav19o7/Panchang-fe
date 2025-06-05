import React, { useState } from 'react';
import { api } from '../services/api';
import toast from 'react-hot-toast';
import { Calendar, MapPin, Star, Sun } from 'lucide-react';

const PanchangGenerator = () => {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    month: new Date().getMonth() + 1,
    year: new Date().getFullYear(),
    location: 'delhi'
  });
  const [panchangData, setPanchangData] = useState(null);

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
      const response = await api.generateMonthlyPanchang(formData);
      
      if (response.data.success) {
        setPanchangData(response.data.data);
        toast.success('Panchang data generated successfully!');
      } else {
        toast.error(response.data.error || 'Failed to generate Panchang data');
      }
    } catch (error) {
      console.error('Error:', error);
      toast.error('Failed to generate Panchang data');
    } finally {
      setLoading(false);
    }
  };

  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const locations = [
    { value: 'delhi', label: 'Delhi' },
    { value: 'mumbai', label: 'Mumbai' },
    { value: 'bangalore', label: 'Bangalore' },
    { value: 'kolkata', label: 'Kolkata' },
    { value: 'chennai', label: 'Chennai' },
    { value: 'hyderabad', label: 'Hyderabad' },
    { value: 'pune', label: 'Pune' },
    { value: 'ahmedabad', label: 'Ahmedabad' }
  ];

  return (
    <div>
      <div className="card">
        <div className="card-header">
          <div className="card-icon">
            <Calendar size={24} />
          </div>
          <div>
            <h2 className="card-title">Monthly Panchang Generator</h2>
            <p className="card-description">
              Generate comprehensive Panchang data including tithi, nakshatra, graha transits for the entire month.
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

            <div className="form-group">
              <label className="form-label">Location</label>
              <select
                name="location"
                value={formData.location}
                onChange={handleChange}
                className="form-input"
                required
              >
                {locations.map((location) => (
                  <option key={location.value} value={location.value}>
                    {location.label}
                  </option>
                ))}
              </select>
            </div>
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
                Generating Panchang Data...
              </>
            ) : (
              <>
                <Star size={18} />
                Generate Monthly Panchang
              </>
            )}
          </button>
        </form>
      </div>

      {/* Results */}
      {panchangData && (
        <div className="results-section">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
            <h3 style={{ color: '#333', fontSize: '1.4rem', fontWeight: '700' }}>
              Panchang Data for {months[formData.month - 1]} {formData.year}
            </h3>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#666' }}>
              <MapPin size={16} />
              <span style={{ textTransform: 'capitalize' }}>{formData.location}</span>
            </div>
          </div>

          {/* Summary */}
          {panchangData.summary && (
            <div className="result-item" style={{ marginBottom: '1.5rem' }}>
              <div className="result-header">
                <h4 className="result-title">
                  <Sun size={18} style={{ display: 'inline', marginRight: '8px' }} />
                  Monthly Summary
                </h4>
              </div>
              <div className="result-content">
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
                  <div style={{ textAlign: 'center', padding: '1rem', background: 'rgba(255, 107, 53, 0.1)', borderRadius: '10px' }}>
                    <div style={{ fontSize: '2rem', fontWeight: '700', color: '#ff6b35' }}>
                      {panchangData.summary.totalDays || panchangData.data?.length || 0}
                    </div>
                    <div style={{ fontSize: '0.9rem', color: '#666' }}>Total Days</div>
                  </div>
                  <div style={{ textAlign: 'center', padding: '1rem', background: 'rgba(102, 126, 234, 0.1)', borderRadius: '10px' }}>
                    <div style={{ fontSize: '2rem', fontWeight: '700', color: '#667eea' }}>
                      {panchangData.summary.festivals?.length || 0}
                    </div>
                    <div style={{ fontSize: '0.9rem', color: '#666' }}>Festivals</div>
                  </div>
                  <div style={{ textAlign: 'center', padding: '1rem', background: 'rgba(118, 75, 162, 0.1)', borderRadius: '10px' }}>
                    <div style={{ fontSize: '2rem', fontWeight: '700', color: '#764ba2' }}>
                      {panchangData.summary.auspiciousDates?.length || 0}
                    </div>
                    <div style={{ fontSize: '0.9rem', color: '#666' }}>Auspicious Days</div>
                  </div>
                </div>
                {panchangData.summary.note && (
                  <p style={{ marginTop: '1rem', fontStyle: 'italic', color: '#666' }}>
                    {panchangData.summary.note}
                  </p>
                )}
              </div>
            </div>
          )}

          {/* Daily Data */}
          <div className="results-grid">
            {panchangData.data && panchangData.data.slice(0, 10).map((day, index) => (
              <div key={index} className="result-item">
                <div className="result-header">
                  <h4 className="result-title">
                    {new Date(day.date).toLocaleDateString('en-IN', { 
                      weekday: 'long', 
                      day: 'numeric',
                      month: 'short'
                    })}
                  </h4>
                </div>
                <div className="result-content">
                  <div style={{ display: 'grid', gap: '0.5rem', fontSize: '0.9rem' }}>
                    <div><strong>Tithi:</strong> {day.tithi || 'N/A'}</div>
                    <div><strong>Nakshatra:</strong> {day.nakshatra || 'N/A'}</div>
                    {day.yog && <div><strong>Yog:</strong> {day.yog}</div>}
                    {day.karan && <div><strong>Karan:</strong> {day.karan}</div>}
                    {day.festivals && day.festivals.length > 0 && (
                      <div>
                        <strong>Festivals:</strong>
                        <div className="taglines">
                          {day.festivals.map((festival, fIndex) => (
                            <span key={fIndex} className="tagline-item">{festival}</span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {panchangData.data && panchangData.data.length > 10 && (
            <div style={{ textAlign: 'center', marginTop: '1rem', color: '#666' }}>
              Showing first 10 days of {panchangData.data.length} total days
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default PanchangGenerator;