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
  const { user, loading: authLoading, isAuthenticated, initialized } = useAuth();
  const { loading: appLoading, sidebarOpen } = useApp();

  // Show loading screen while checking authentication
  if (!initialized || authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Loading message="Initializing application..." />
      </div>
    );
  }

  // If user is not authenticated, show auth routes
  if (!isAuthenticated || !user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-600 to-blue-800">
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
    <div className="app min-h-screen bg-gray-50">
      <Header />
      <div className="app-content flex">
        <Sidebar />
        <main className={`main-content flex-1 transition-all duration-200 ${
          sidebarOpen ? 'ml-64' : 'ml-16'
        } pt-16`}>
          <div className="content-wrapper p-6 max-w-7xl mx-auto">
            {appLoading ? (
              <Loading message="Loading..." />
            ) : (
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
                    <ProtectedRoute requiredRoles={['admin', 'editor']}>
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

                {/* Activity Page (placeholder) */}
                <Route 
                  path="/activity" 
                  element={
                    <ProtectedRoute>
                      <div className="page">
                        <div className="page-header">
                          <h1 className="page-title">Activity Log</h1>
                          <p className="page-subtitle">View all system activity and user actions</p>
                        </div>
                        <div className="card">
                          <div className="card-body">
                            <p>Activity log functionality coming soon...</p>
                          </div>
                        </div>
                      </div>
                    </ProtectedRoute>
                  } 
                />

                {/* Fallback */}
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}

export default App;