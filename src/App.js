import React, { useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import { useApp } from './context/AppContext';

// Components
import Header from './components/common/Header';
import Sidebar from './components/common/Sidebar';
import Loading from './components/common/Loading';
import ProtectedRoute from './components/auth/ProtectedRoute';

// Pages
import HomePage from './pages/HomePage';
import PujaPage from './pages/PujaPage';
import FeedbackPage from './pages/FeedbackPage';
import AnalyticsPage from './pages/AnalyticsPage';
import SettingsPage from './pages/SettingsPage';

// Auth Components
import Login from './components/auth/Login';
import Register from './components/auth/Register';

function App() {
  const { user, loading: authLoading, checkAuthStatus } = useAuth();
  const { loading: appLoading, sidebarOpen } = useApp();

  useEffect(() => {
    // Check authentication status on app load
    checkAuthStatus();
  }, [checkAuthStatus]);

  // Show loading screen while checking authentication
  if (authLoading || appLoading) {
    return <Loading />;
  }

  // If user is not authenticated, show auth routes
  if (!user) {
    return (
      <div className="auth-container">
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </div>
    );
  }

  // Main app layout for authenticated users
  return (
    <div className="app">
      <Header />
      <div className="app-content">
        <Sidebar />
        <main className={`main-content ${sidebarOpen ? 'sidebar-open' : 'sidebar-closed'}`}>
          <div className="content-wrapper">
            <Routes>
              {/* Dashboard */}
              <Route 
                path="/" 
                element={
                  <ProtectedRoute>
                    <HomePage />
                  </ProtectedRoute>
                } 
              />

              {/* Puja Management */}
              <Route 
                path="/puja/*" 
                element={
                  <ProtectedRoute>
                    <PujaPage />
                  </ProtectedRoute>
                } 
              />

              {/* Feedback Management */}
              <Route 
                path="/feedback/*" 
                element={
                  <ProtectedRoute>
                    <FeedbackPage />
                  </ProtectedRoute>
                } 
              />

              {/* Analytics */}
              <Route 
                path="/analytics/*" 
                element={
                  <ProtectedRoute>
                    <AnalyticsPage />
                  </ProtectedRoute>
                } 
              />

              {/* Settings */}
              <Route 
                path="/settings/*" 
                element={
                  <ProtectedRoute>
                    <SettingsPage />
                  </ProtectedRoute>
                } 
              />

              {/* Fallback */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </div>
        </main>
      </div>
    </div>
  );
}

export default App;