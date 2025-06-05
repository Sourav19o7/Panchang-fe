
// ==================================================
// 3. src/pages/FeedbackPage.js
// ==================================================
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import FeedbackForm from '../components/feedback/FeedbackForm';
import FeedbackList from '../components/feedback/FeedbackList';
import AnalyticsDashboard from '../components/feedback/AnalyticsDashboard';

const FeedbackPage = () => {
  const { setBreadcrumbs } = useApp();

  React.useEffect(() => {
    setBreadcrumbs([
      { label: 'Dashboard', path: '/' },
      { label: 'Feedback', path: '/feedback' }
    ]);
  }, [setBreadcrumbs]);

  return (
    <div className="page">
      <Routes>
        <Route index element={<FeedbackList />} />
        <Route path="submit" element={<FeedbackForm />} />
        <Route path="history" element={<FeedbackList />} />
        <Route path="analysis" element={<AnalyticsDashboard />} />
      </Routes>
    </div>
  );
};

export default FeedbackPage;