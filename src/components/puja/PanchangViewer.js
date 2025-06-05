

// ==================================================
// 8. src/components/puja/PanchangViewer.js
// ==================================================
import React, { useState, useEffect } from 'react';
import { Calendar, Sun, Moon, Star } from 'lucide-react';
import pujaService from '../../services/pujaService';
import Loading from '../common/Loading';

const PanchangViewer = () => {
  const [panchangData, setPanchangData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState(new Date());

  useEffect(() => {
    loadPanchangData();
  }, [selectedDate]);

  const loadPanchangData = async () => {
    try {
      setLoading(true);
      // Simulate API call
      setTimeout(() => {
        setPanchangData({
          date: selectedDate.toISOString().split('T')[0],
          tithi: 'Ekadashi',
          nakshatra: 'Uttara Ashadha',
          yog: 'Shubha',
          karan: 'Bava',
          sunrise: '06:30',
          sunset: '18:15',
          moonrise: '14:22',
          moonset: '02:45',
          auspiciousTimes: [
            { name: 'Brahma Muhurta', time: '04:30 - 05:30' },
            { name: 'Abhijit Muhurta', time: '11:30 - 12:18' }
          ],
          festivals: ['Gita Jayanti'],
          recommendations: [
            'Excellent for spiritual practices',
            'Good for starting new ventures',
            'Avoid travel during Rahu Kaal'
          ]
        });
        setLoading(false);
      }, 1000);
    } catch (error) {
      console.error('Failed to load Panchang data:', error);
      setLoading(false);
    }
  };

  if (loading) {
    return <Loading message="Loading Panchang data..." />;
  }

  return (
    <div className="panchang-viewer">
      <div className="page-header">
        <h1 className="page-title">Panchang Viewer</h1>
        <p className="page-subtitle">Astrological calendar and timing information</p>
      </div>

      <div className="date-selector">
        <input
          type="date"
          value={selectedDate.toISOString().split('T')[0]}
          onChange={(e) => setSelectedDate(new Date(e.target.value))}
          className="form-input"
        />
      </div>

      {panchangData && (
        <div className="panchang-content">
          <div className="panchang-grid">
            <div className="panchang-card">
              <div className="card-header">
                <Calendar className="card-icon" />
                <h3>Basic Information</h3>
              </div>
              <div className="panchang-details">
                <div className="detail-item">
                  <span className="label">Tithi:</span>
                  <span className="value">{panchangData.tithi}</span>
                </div>
                <div className="detail-item">
                  <span className="label">Nakshatra:</span>
                  <span className="value">{panchangData.nakshatra}</span>
                </div>
                <div className="detail-item">
                  <span className="label">Yog:</span>
                  <span className="value">{panchangData.yog}</span>
                </div>
                <div className="detail-item">
                  <span className="label">Karan:</span>
                  <span className="value">{panchangData.karan}</span>
                </div>
              </div>
            </div>

            <div className="panchang-card">
              <div className="card-header">
                <Sun className="card-icon" />
                <h3>Sun & Moon</h3>
              </div>
              <div className="panchang-details">
                <div className="detail-item">
                  <span className="label">Sunrise:</span>
                  <span className="value">{panchangData.sunrise}</span>
                </div>
                <div className="detail-item">
                  <span className="label">Sunset:</span>
                  <span className="value">{panchangData.sunset}</span>
                </div>
                <div className="detail-item">
                  <span className="label">Moonrise:</span>
                  <span className="value">{panchangData.moonrise}</span>
                </div>
                <div className="detail-item">
                  <span className="label">Moonset:</span>
                  <span className="value">{panchangData.moonset}</span>
                </div>
              </div>
            </div>

            <div className="panchang-card">
              <div className="card-header">
                <Star className="card-icon" />
                <h3>Auspicious Times</h3>
              </div>
              <div className="auspicious-times">
                {panchangData.auspiciousTimes.map((time, index) => (
                  <div key={index} className="time-item">
                    <span className="time-name">{time.name}</span>
                    <span className="time-value">{time.time}</span>
                  </div>
                ))}
              </div>
            </div>

            {panchangData.festivals.length > 0 && (
              <div className="panchang-card">
                <div className="card-header">
                  <h3>Festivals</h3>
                </div>
                <div className="festivals-list">
                  {panchangData.festivals.map((festival, index) => (
                    <span key={index} className="festival-tag">
                      {festival}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="recommendations-section">
            <h3>Recommendations</h3>
            <ul className="recommendations-list">
              {panchangData.recommendations.map((rec, index) => (
                <li key={index}>{rec}</li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
};

export default PanchangViewer;
