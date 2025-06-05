

// ==================================================
// 4. src/pages/AnalyticsPage.js
// ==================================================
import React, { useState, useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { BarChart3, TrendingUp, Target, Users } from 'lucide-react';
import StatsCard from '../components/dashboard/StatsCard';
import Loading from '../components/common/Loading';

const PerformanceDashboard = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      setData({
        totalRevenue: 2450000,
        avgRating: 4.5,
        totalCampaigns: 156,
        successRate: 92.3
      });
      setLoading(false);
    }, 1000);
  }, []);

  if (loading) return <Loading message="Loading analytics..." />;

  return (
    <div className="analytics-content">
      <div className="page-header">
        <h1>Performance Dashboard</h1>
        <p>Comprehensive analytics and insights</p>
      </div>

      <div className="stats-grid">
        <StatsCard
          title="Total Revenue"
          value={data.totalRevenue}
          icon={BarChart3}
          color="primary"
          format="currency"
        />
        <StatsCard
          title="Average Rating"
          value={data.avgRating}
          icon={TrendingUp}
          color="success"
          format="decimal"
        />
        <StatsCard
          title="Total Campaigns"
          value={data.totalCampaigns}
          icon={Target}
          color="warning"
        />
        <StatsCard
          title="Success Rate"
          value={data.successRate}
          icon={Users}
          color="info"
          format="percentage"
        />
      </div>
    </div>
  );
};

const TrendAnalysis = () => (
  <div className="analytics-content">
    <h1>Trend Analysis</h1>
    <p>Market trends and forecasting</p>
  </div>
);

const Metrics = () => (
  <div className="analytics-content">
    <h1>Success Metrics</h1>
    <p>Key performance indicators</p>
  </div>
);

const AnalyticsPage = () => {
  const { setBreadcrumbs } = useApp();

  React.useEffect(() => {
    setBreadcrumbs([
      { label: 'Dashboard', path: '/' },
      { label: 'Analytics', path: '/analytics' }
    ]);
  }, [setBreadcrumbs]);

  return (
    <div className="page">
      <Routes>
        <Route index element={<PerformanceDashboard />} />
        <Route path="performance" element={<PerformanceDashboard />} />
        <Route path="trends" element={<TrendAnalysis />} />
        <Route path="metrics" element={<Metrics />} />
      </Routes>
    </div>
  );
};

export default AnalyticsPage;
