import React, { createContext, useContext, useReducer, useCallback } from 'react';

// Initial state
const initialState = {
  loading: false,
  sidebarOpen: true,
  theme: 'light',
  notifications: [],
  breadcrumbs: [],
  selectedMonth: new Date().getMonth() + 1,
  selectedYear: new Date().getFullYear(),
};

// Action types
const ActionTypes = {
  SET_LOADING: 'SET_LOADING',
  TOGGLE_SIDEBAR: 'TOGGLE_SIDEBAR',
  SET_SIDEBAR: 'SET_SIDEBAR',
  SET_THEME: 'SET_THEME',
  ADD_NOTIFICATION: 'ADD_NOTIFICATION',
  REMOVE_NOTIFICATION: 'REMOVE_NOTIFICATION',
  CLEAR_NOTIFICATIONS: 'CLEAR_NOTIFICATIONS',
  SET_BREADCRUMBS: 'SET_BREADCRUMBS',
  SET_SELECTED_MONTH: 'SET_SELECTED_MONTH',
  SET_SELECTED_YEAR: 'SET_SELECTED_YEAR',
};

// Reducer
const appReducer = (state, action) => {
  switch (action.type) {
    case ActionTypes.SET_LOADING:
      return {
        ...state,
        loading: action.payload,
      };

    case ActionTypes.TOGGLE_SIDEBAR:
      return {
        ...state,
        sidebarOpen: !state.sidebarOpen,
      };

    case ActionTypes.SET_SIDEBAR:
      return {
        ...state,
        sidebarOpen: action.payload,
      };

    case ActionTypes.SET_THEME:
      return {
        ...state,
        theme: action.payload,
      };

    case ActionTypes.ADD_NOTIFICATION:
      return {
        ...state,
        notifications: [...state.notifications, action.payload],
      };

    case ActionTypes.REMOVE_NOTIFICATION:
      return {
        ...state,
        notifications: state.notifications.filter(n => n.id !== action.payload),
      };

    case ActionTypes.CLEAR_NOTIFICATIONS:
      return {
        ...state,
        notifications: [],
      };

    case ActionTypes.SET_BREADCRUMBS:
      return {
        ...state,
        breadcrumbs: action.payload,
      };

    case ActionTypes.SET_SELECTED_MONTH:
      return {
        ...state,
        selectedMonth: action.payload,
      };

    case ActionTypes.SET_SELECTED_YEAR:
      return {
        ...state,
        selectedYear: action.payload,
      };

    default:
      return state;
  }
};

// Create context
const AppContext = createContext();

// Provider component
export const AppProvider = ({ children }) => {
  const [state, dispatch] = useReducer(appReducer, initialState);

  // Set loading state
  const setLoading = useCallback((loading) => {
    dispatch({ type: ActionTypes.SET_LOADING, payload: loading });
  }, []);

  // Toggle sidebar
  const toggleSidebar = useCallback(() => {
    dispatch({ type: ActionTypes.TOGGLE_SIDEBAR });
  }, []);

  // Set sidebar state
  const setSidebar = useCallback((open) => {
    dispatch({ type: ActionTypes.SET_SIDEBAR, payload: open });
  }, []);

  // Set theme
  const setTheme = useCallback((theme) => {
    dispatch({ type: ActionTypes.SET_THEME, payload: theme });
    localStorage.setItem('theme', theme);
  }, []);

  // Add notification
  const addNotification = useCallback((notification) => {
    const id = Date.now().toString();
    dispatch({
      type: ActionTypes.ADD_NOTIFICATION,
      payload: {
        id,
        ...notification,
        timestamp: new Date().toISOString(),
      },
    });

    // Auto remove after duration (default 5 seconds)
    const duration = notification.duration || 5000;
    if (duration > 0) {
      setTimeout(() => {
        dispatch({ type: ActionTypes.REMOVE_NOTIFICATION, payload: id });
      }, duration);
    }

    return id;
  }, []);

  // Remove notification
  const removeNotification = useCallback((id) => {
    dispatch({ type: ActionTypes.REMOVE_NOTIFICATION, payload: id });
  }, []);

  // Clear all notifications
  const clearNotifications = useCallback(() => {
    dispatch({ type: ActionTypes.CLEAR_NOTIFICATIONS });
  }, []);

  // Set breadcrumbs
  const setBreadcrumbs = useCallback((breadcrumbs) => {
    dispatch({ type: ActionTypes.SET_BREADCRUMBS, payload: breadcrumbs });
  }, []);

  // Set selected month
  const setSelectedMonth = useCallback((month) => {
    dispatch({ type: ActionTypes.SET_SELECTED_MONTH, payload: month });
  }, []);

  // Set selected year
  const setSelectedYear = useCallback((year) => {
    dispatch({ type: ActionTypes.SET_SELECTED_YEAR, payload: year });
  }, []);

  // Initialize theme from localStorage
  React.useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme && savedTheme !== state.theme) {
      setTheme(savedTheme);
    }
  }, [setTheme, state.theme]);

  // Apply theme to document
  React.useEffect(() => {
    document.documentElement.setAttribute('data-theme', state.theme);
  }, [state.theme]);

  // Context value
  const value = {
    // State
    loading: state.loading,
    sidebarOpen: state.sidebarOpen,
    theme: state.theme,
    notifications: state.notifications,
    breadcrumbs: state.breadcrumbs,
    selectedMonth: state.selectedMonth,
    selectedYear: state.selectedYear,

    // Actions
    setLoading,
    toggleSidebar,
    setSidebar,
    setTheme,
    addNotification,
    removeNotification,
    clearNotifications,
    setBreadcrumbs,
    setSelectedMonth,
    setSelectedYear,
  };

  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  );
};

// Custom hook to use app context
export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};

export default AppContext;