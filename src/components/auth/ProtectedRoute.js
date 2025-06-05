import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import Loading from '../common/Loading';

const ProtectedRoute = ({ 
  children, 
  requiredRole = null,
  requiredRoles = [],
  fallbackPath = '/login'
}) => {
  const { user, loading, isAuthenticated } = useAuth();
  const location = useLocation();

  // Show loading while checking authentication
  if (loading) {
    return <Loading fullScreen message="Checking authentication..." />;
  }

  // Redirect to login if not authenticated
  if (!isAuthenticated || !user) {
    // return (
    //   <Navigate 
    //     to={fallbackPath} 
    //     state={{ from: location }} 
    //     replace 
    //   />
    // );
  }

  // Check role-based access
  if (requiredRole || requiredRoles.length > 0) {
    const userRole = user.role;
    
    // Check single required role
    if (requiredRole && userRole !== requiredRole) {
      return (
        <div className="access-denied">
          <div className="access-denied-content">
            <h1>Access Denied</h1>
            <p>You don't have permission to access this page.</p>
            <p>Required role: <strong>{requiredRole}</strong></p>
            <p>Your role: <strong>{userRole}</strong></p>
            <button 
              onClick={() => window.history.back()}
              className="btn btn-primary"
            >
              Go Back
            </button>
          </div>
        </div>
      );
    }

    // Check multiple required roles
    if (requiredRoles.length > 0 && !requiredRoles.includes(userRole)) {
      return (
        <div className="access-denied">
          <div className="access-denied-content">
            <h1>Access Denied</h1>
            <p>You don't have permission to access this page.</p>
            <p>Required roles: <strong>{requiredRoles.join(', ')}</strong></p>
            <p>Your role: <strong>{userRole}</strong></p>
            <button 
              onClick={() => window.history.back()}
              className="btn btn-primary"
            >
              Go Back
            </button>
          </div>
        </div>
      );
    }
  }

  // Render children if all checks pass
  return children;
};

// Higher-order component for role-based protection
export const withRoleProtection = (Component, requiredRoles) => {
  return function ProtectedComponent(props) {
    return (
      <ProtectedRoute requiredRoles={requiredRoles}>
        <Component {...props} />
      </ProtectedRoute>
    );
  };
};

// Specific role-based route components
export const AdminRoute = ({ children }) => (
  <ProtectedRoute requiredRole="admin">
    {children}
  </ProtectedRoute>
);

export const EditorRoute = ({ children }) => (
  <ProtectedRoute requiredRoles={['admin', 'editor']}>
    {children}
  </ProtectedRoute>
);

export const UserRoute = ({ children }) => (
  <ProtectedRoute requiredRoles={['admin', 'editor', 'user']}>
    {children}
  </ProtectedRoute>
);

export default ProtectedRoute;