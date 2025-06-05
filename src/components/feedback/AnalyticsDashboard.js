// ==================================================
// 12. src/components/feedback/AnalyticsDashboard.js
// ==================================================
import React, { useState, useEffect } from 'react';
import { BarChart3, TrendingUp, Target, Users, Star } from 'lucide-react';
import feedbackService from '../../services/feedbackService';
import StatsCard from '../dashboard/StatsCard';
import Loading from '../common/Loading';

const AnalyticsDashboard = () => {
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [timeframe, setTimeframe] = useState('3_months');

  useEffect(() => {
    loadAnalytics();
  }, [timeframe]);

  const loadAnalytics = async () => {
    try {
      setLoading(true);
      
      // Simulate API calls
      setTimeout(() => {
        setAnalytics({
          overview: {
            totalFeedbacks: 156,
            averageRating: 4.3,
            totalRevenue: 2450000,
            avgCTR: 7.8
          },
          trends: {
            ratingTrend: '+0.3',
            revenueTrend: '+12%',
            ctrTrend: '+5%',
            feedbackTrend: '+18'
          },
          topPerformers: [
            { name: 'Diwali Lakshmi Puja', rating: 4.8, revenue: 125000 },
            { name: 'Ganesh Chaturthi Special', rating: 4.7, revenue: 98000 },
            { name: 'Navratri Durga Puja', rating: 4.6, revenue: 87000 }
          ],
          categories: {
            'Financial Prosperity': { count: 45, avgRating: 4.5 },
            'Health & Wellness': { count: 38, avgRating: 4.2 },
            'Spiritual Progress': { count: 32, avgRating: 4.4 },
            'Career Growth': { count: 28, avgRating: 4.1 },
            'Family Happiness': { count: 13, avgRating: 4.3 }
          }
        });
        setLoading(false);
      }, 1000);
    } catch (error) {
      console.error('Failed to load analytics:', error);
      setLoading(false);
    }
  };

  if (loading) {
    return <Loading message="Loading analytics..." />;
  }

  return (
    <div className="analytics-dashboard">
      <div className="page-header">
        <div>
          <h1 className="page-title">Feedback Analytics</h1>
          <p className="page-subtitle">Performance insights and trends</p>
        </div>
        
        <select
          value={timeframe}
          onChange={(e) => setTimeframe(e.target.value)}
          className="form-select"
        >
          <option value="1_month">Last Month</option>
          <option value="3_months">Last 3 Months</option>
          <option value="6_months">Last 6 Months</option>
          <option value="1_year">Last Year</option>
        </select>
      </div>

      {analytics && (
        <>
          <div className="stats-grid">
            <StatsCard
              title="Total Feedback"
              value={analytics.overview.totalFeedbacks}
              icon={BarChart3}
              color="primary"
              trend={analytics.trends.feedbackTrend}
              trendDirection="up"
            />
            
            <StatsCard
              title="Average Rating"
              value={analytics.overview.averageRating}
              icon={Star}
              color="success"
              format="decimal"
              trend={analytics.trends.ratingTrend}
              trendDirection="up"
            />
            
            <StatsCard
              title="Total Revenue"
              value={analytics.overview.totalRevenue}
              icon={TrendingUp}
              color="warning"
              format="currency"
              trend={analytics.trends.revenueTrend}
              trendDirection="up"
            />
            
            <StatsCard
              title="Average CTR"
              value={analytics.overview.avgCTR}
              icon={Target}
              color="info"
              format="percentage"
              trend={analytics.trends.ctrTrend}
              trendDirection="up"
            />
          </div>

          <div className="analytics-grid">
            <div className="analytics-card">
              <div className="card-header">
                <h3>Top Performers</h3>
              </div>
              <div className="top-performers">
                {analytics.topPerformers.map((performer, index) => (
                  <div key={index} className="performer-item">
                    <div className="performer-info">
                      <h4>{performer.name}</h4>
                      <div className="performer-metrics">
                        <span className="rating">⭐ {performer.rating}</span>
                        <span className="revenue">₹{performer.revenue.toLocaleString()}</span>
                      </div>
                    </div>
                    <div className="performer-rank">#{index + 1}</div>
                  </div>
                ))}
              </div>
            </div>

            <div className="analytics-card">
              <div className="card-header">
                <h3>Category Performance</h3>
              </div>
              <div className="category-performance">
                {Object.entries(analytics.categories).map(([category, data]) => (
                  <div key={category} className="category-item">
                    <div className="category-info">
                      <span className="category-name">{category}</span>
                      <span className="category-count">{data.count} pujas</span>
                    </div>
                    <div className="category-rating">
                      <div className="rating-bar">
                        <div 
                          className="rating-fill"
                          style={{ width: `${(data.avgRating / 5) * 100}%` }}
                        ></div>
                      </div>
                      <span className="rating-value">{data.avgRating}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="insights-section">
            <h3>Key Insights</h3>
            <div className="insights-grid">
              <div className="insight-card">
                <h4>🎯 Performance Trends</h4>
                <p>Average rating has improved by 0.3 points over the last 3 months, indicating enhanced user satisfaction.</p>
              </div>
              
              <div className="insight-card">
                <h4>💰 Revenue Growth</h4>
                <p>12% revenue increase driven primarily by high-performing Lakshmi and Ganesha pujas during festival seasons.</p>
              </div>
              
              <div className="insight-card">
                <h4>📈 Engagement Metrics</h4>
                <p>Click-through rates have improved by 5%, suggesting better alignment between content and user expectations.</p>
              </div>
              
              <div className="insight-card">
                <h4>🎨 Content Strategy</h4>
                <p>Financial prosperity and health wellness categories show highest engagement and satisfaction scores.</p>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default AnalyticsDashboard;
