import React, { createContext, useContext, useReducer, useCallback } from 'react';
import { toast } from 'react-toastify';
import { setAuthToken, getAuthToken, apiHelpers, endpoints } from '../config/api';

// Initial state
const initialState = {
  user: null,
  loading: true,
  error: null,
  isAuthenticated: false,
};

// Action types
const ActionTypes = {
  SET_LOADING: 'SET_LOADING',
  SET_USER: 'SET_USER',
  SET_ERROR: 'SET_ERROR',
  LOGOUT: 'LOGOUT',
  CLEAR_ERROR: 'CLEAR_ERROR',
};

// Reducer
const authReducer = (state, action) => {
  switch (action.type) {
    case ActionTypes.SET_LOADING:
      return {
        ...state,
        loading: action.payload,
      };

    case ActionTypes.SET_USER:
      return {
        ...state,
        user: action.payload,
        isAuthenticated: !!action.payload,
        loading: false,
        error: null,
      };

    case ActionTypes.SET_ERROR:
      return {
        ...state,
        error: action.payload,
        loading: false,
      };

    case ActionTypes.LOGOUT:
      return {
        ...state,
        user: null,
        isAuthenticated: false,
        loading: false,
        error: null,
      };

    case ActionTypes.CLEAR_ERROR:
      return {
        ...state,
        error: null,
      };

    default:
      return state;
  }
};

// Create context
const AuthContext = createContext();

// Provider component
export const AuthProvider = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);

  // Set loading state
  const setLoading = useCallback((loading) => {
    dispatch({ type: ActionTypes.SET_LOADING, payload: loading });
  }, []);

  // Set error state
  const setError = useCallback((error) => {
    dispatch({ type: ActionTypes.SET_ERROR, payload: error });
  }, []);

  // Clear error state
  const clearError = useCallback(() => {
    dispatch({ type: ActionTypes.CLEAR_ERROR });
  }, []);

  // Check authentication status
  const checkAuthStatus = useCallback(async () => {
    try {
      setLoading(true);
      const token = getAuthToken();
      
      if (!token) {
        setLoading(false);
        return;
      }

      // Verify token with server
      const response = await apiHelpers.get(endpoints.auth.profile);
      
      if (response.success && response.data) {
        dispatch({ type: ActionTypes.SET_USER, payload: response.data });
      } else {
        // Invalid token
        setAuthToken(null);
        setLoading(false);
      }
    } catch (error) {
      console.error('Auth check failed:', error);
      setAuthToken(null);
      setLoading(false);
    }
  }, []);

  // Login function
  const login = useCallback(async (credentials) => {
    try {
      setLoading(true);
      clearError();

      const response = await apiHelpers.post(endpoints.auth.login, credentials);

      if (response.success && response.data) {
        const { user, token } = response.data;
        setAuthToken(token);
        dispatch({ type: ActionTypes.SET_USER, payload: user });
        toast.success('Login successful!');
        return { success: true, user };
      } else {
        throw new Error(response.error || 'Login failed');
      }
    } catch (error) {
      const errorMessage = error.message || 'Login failed';
      setError(errorMessage);
      toast.error(errorMessage);
      return { success: false, error: errorMessage };
    }
  }, [clearError]);

  // Register function
  const register = useCallback(async (userData) => {
    try {
      setLoading(true);
      clearError();

      const response = await apiHelpers.post(endpoints.auth.register, userData);

      if (response.success && response.data) {
        const { user, token } = response.data;
        setAuthToken(token);
        dispatch({ type: ActionTypes.SET_USER, payload: user });
        toast.success('Registration successful!');
        return { success: true, user };
      } else {
        throw new Error(response.error || 'Registration failed');
      }
    } catch (error) {
      const errorMessage = error.message || 'Registration failed';
      setError(errorMessage);
      toast.error(errorMessage);
      return { success: false, error: errorMessage };
    }
  }, [clearError]);

  // Logout function
  const logout = useCallback(async () => {
    try {
      // Call logout endpoint
      await apiHelpers.post(endpoints.auth.logout);
    } catch (error) {
      console.error('Logout API call failed:', error);
    } finally {
      // Clear local auth state regardless of API call result
      setAuthToken(null);
      dispatch({ type: ActionTypes.LOGOUT });
      toast.success('Logged out successfully');
    }
  }, []);

  // Update profile function
  const updateProfile = useCallback(async (profileData) => {
    try {
      setLoading(true);
      clearError();

      const response = await apiHelpers.put(endpoints.auth.profile, profileData);

      if (response.success && response.data) {
        dispatch({ type: ActionTypes.SET_USER, payload: response.data });
        toast.success('Profile updated successfully!');
        return { success: true, user: response.data };
      } else {
        throw new Error(response.error || 'Profile update failed');
      }
    } catch (error) {
      const errorMessage = error.message || 'Profile update failed';
      setError(errorMessage);
      toast.error(errorMessage);
      return { success: false, error: errorMessage };
    }
  }, [clearError]);

  // Change password function
  const changePassword = useCallback(async (passwordData) => {
    try {
      setLoading(true);
      clearError();

      const response = await apiHelpers.post(endpoints.auth.changePassword, passwordData);

      if (response.success) {
        toast.success('Password changed successfully!');
        return { success: true };
      } else {
        throw new Error(response.error || 'Password change failed');
      }
    } catch (error) {
      const errorMessage = error.message || 'Password change failed';
      setError(errorMessage);
      toast.error(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  }, [clearError]);

  // Forgot password function
  const forgotPassword = useCallback(async (email) => {
    try {
      setLoading(true);
      clearError();

      const response = await apiHelpers.post(endpoints.auth.forgotPassword, { email });

      if (response.success) {
        toast.success('Password reset email sent!');
        return { success: true };
      } else {
        throw new Error(response.error || 'Failed to send reset email');
      }
    } catch (error) {
      const errorMessage = error.message || 'Failed to send reset email';
      setError(errorMessage);
      toast.error(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  }, [clearError]);

  // Reset password function
  const resetPassword = useCallback(async (token, newPassword) => {
    try {
      setLoading(true);
      clearError();

      const response = await apiHelpers.post(endpoints.auth.resetPassword, {
        token,
        newPassword
      });

      if (response.success) {
        toast.success('Password reset successful!');
        return { success: true };
      } else {
        throw new Error(response.error || 'Password reset failed');
      }
    } catch (error) {
      const errorMessage = error.message || 'Password reset failed';
      setError(errorMessage);
      toast.error(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  }, [clearError]);

  // Refresh token function
  const refreshToken = useCallback(async () => {
    try {
      const currentToken = getAuthToken();
      if (!currentToken) return false;

      const response = await apiHelpers.post(endpoints.auth.refreshToken, {
        refreshToken: currentToken
      });

      if (response.success && response.data.token) {
        setAuthToken(response.data.token);
        return true;
      } else {
        logout();
        return false;
      }
    } catch (error) {
      console.error('Token refresh failed:', error);
      logout();
      return false;
    }
  }, [logout]);

  // Check if user has specific role
  const hasRole = useCallback((role) => {
    return state.user?.role === role;
  }, [state.user]);

  // Check if user has any of the specified roles
  const hasAnyRole = useCallback((roles) => {
    return roles.includes(state.user?.role);
  }, [state.user]);

  // Context value
  const value = {
    // State
    user: state.user,
    loading: state.loading,
    error: state.error,
    isAuthenticated: state.isAuthenticated,

    // Actions
    login,
    register,
    logout,
    updateProfile,
    changePassword,
    forgotPassword,
    resetPassword,
    checkAuthStatus,
    refreshToken,
    clearError,

    // Utilities
    hasRole,
    hasAnyRole,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook to use auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export default AuthContext;