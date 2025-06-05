import React, { createContext, useContext, useReducer, useCallback, useEffect, useRef } from 'react';
import { toast } from 'react-toastify';
import { setAuthToken, getAuthToken, apiHelpers, endpoints } from '../config/api';

// Initial state
const initialState = {
  user: null,
  loading: true,
  error: null,
  isAuthenticated: false,
  initialized: false,
};

// Action types
const ActionTypes = {
  SET_LOADING: 'SET_LOADING',
  SET_USER: 'SET_USER',
  SET_ERROR: 'SET_ERROR',
  LOGOUT: 'LOGOUT',
  CLEAR_ERROR: 'CLEAR_ERROR',
  SET_INITIALIZED: 'SET_INITIALIZED',
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
        initialized: true,
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
        initialized: true,
      };

    case ActionTypes.CLEAR_ERROR:
      return {
        ...state,
        error: null,
      };

    case ActionTypes.SET_INITIALIZED:
      return {
        ...state,
        initialized: true,
        loading: false,
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
  const initializeRef = useRef(false);
  const checkingRef = useRef(false);

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

  // Check authentication status - memoized to prevent infinite calls
  const checkAuthStatus = useCallback(async () => {
    // Prevent multiple simultaneous checks
    if (checkingRef.current || state.initialized) {
      return;
    }

    checkingRef.current = true;

    try {
      const token = getAuthToken();
      
      if (!token) {
        dispatch({ type: ActionTypes.SET_INITIALIZED });
        return;
      }

      // For demo purposes, if we have a token, create a mock user
      // In real implementation, verify token with server
      const mockUser = {
        id: 1,
        fullName: 'Demo User',
        email: 'demo@srimandir.com',
        role: 'editor',
        avatarUrl: null
      };

      dispatch({ type: ActionTypes.SET_USER, payload: mockUser });

      // Real implementation would be:
      // const response = await apiHelpers.get(endpoints.auth.profile);
      // if (response.success && response.data) {
      //   dispatch({ type: ActionTypes.SET_USER, payload: response.data });
      // } else {
      //   setAuthToken(null);
      //   dispatch({ type: ActionTypes.SET_INITIALIZED });
      // }
    } catch (error) {
      console.error('Auth check failed:', error);
      setAuthToken(null);
      dispatch({ type: ActionTypes.SET_INITIALIZED });
    } finally {
      checkingRef.current = false;
    }
  }, [state.initialized]);

  // Initialize auth on mount
  useEffect(() => {
    if (!initializeRef.current) {
      initializeRef.current = true;
      checkAuthStatus();
    }
  }, [checkAuthStatus]);

  // Login function
  const login = useCallback(async (credentials) => {
    try {
      setLoading(true);
      clearError();

      // For demo purposes, accept any email/password combination
      const mockUser = {
        id: 1,
        fullName: credentials.email.split('@')[0].replace('.', ' ').replace(/\b\w/g, l => l.toUpperCase()),
        email: credentials.email,
        role: credentials.email.includes('admin') ? 'admin' : 
              credentials.email.includes('editor') ? 'editor' : 'user',
        avatarUrl: null
      };

      const mockToken = 'demo-jwt-token-' + Date.now();
      setAuthToken(mockToken);
      dispatch({ type: ActionTypes.SET_USER, payload: mockUser });
      toast.success('Login successful!');
      
      return { success: true, user: mockUser };

      // Real implementation would be:
      // const response = await apiHelpers.post(endpoints.auth.login, credentials);
      // if (response.success && response.data) {
      //   const { user, token } = response.data;
      //   setAuthToken(token);
      //   dispatch({ type: ActionTypes.SET_USER, payload: user });
      //   toast.success('Login successful!');
      //   return { success: true, user };
      // } else {
      //   throw new Error(response.error || 'Login failed');
      // }
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

      // For demo purposes, create a mock user
      const mockUser = {
        id: Date.now(),
        fullName: userData.fullName,
        email: userData.email,
        role: 'user',
        avatarUrl: null
      };

      const mockToken = 'demo-jwt-token-' + Date.now();
      setAuthToken(mockToken);
      dispatch({ type: ActionTypes.SET_USER, payload: mockUser });
      toast.success('Registration successful!');
      
      return { success: true, user: mockUser };

      // Real implementation would use:
      // const response = await apiHelpers.post(endpoints.auth.register, userData);
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
      // In real implementation, call logout endpoint
      // await apiHelpers.post(endpoints.auth.logout);
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

      // For demo purposes, update the mock user
      const updatedUser = {
        ...state.user,
        ...profileData
      };

      dispatch({ type: ActionTypes.SET_USER, payload: updatedUser });
      toast.success('Profile updated successfully!');
      return { success: true, user: updatedUser };

      // Real implementation would use:
      // const response = await apiHelpers.put(endpoints.auth.profile, profileData);
    } catch (error) {
      const errorMessage = error.message || 'Profile update failed';
      setError(errorMessage);
      toast.error(errorMessage);
      return { success: false, error: errorMessage };
    }
  }, [clearError, state.user]);

  // Change password function
  const changePassword = useCallback(async (passwordData) => {
    try {
      setLoading(true);
      clearError();

      // For demo purposes, just show success
      await new Promise(resolve => setTimeout(resolve, 1000));
      toast.success('Password changed successfully!');
      return { success: true };

      // Real implementation would use:
      // const response = await apiHelpers.post(endpoints.auth.changePassword, passwordData);
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

      // For demo purposes, just show success
      await new Promise(resolve => setTimeout(resolve, 1000));
      toast.success('Password reset email sent!');
      return { success: true };

      // Real implementation would use:
      // const response = await apiHelpers.post(endpoints.auth.forgotPassword, { email });
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

      // For demo purposes, just show success
      await new Promise(resolve => setTimeout(resolve, 1000));
      toast.success('Password reset successful!');
      return { success: true };

      // Real implementation would use:
      // const response = await apiHelpers.post(endpoints.auth.resetPassword, { token, newPassword });
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

      // For demo purposes, just return true
      return true;

      // Real implementation would use:
      // const response = await apiHelpers.post(endpoints.auth.refreshToken, { refreshToken: currentToken });
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
    initialized: state.initialized,

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