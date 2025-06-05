

// src/utils/constants.js
export const APP_CONFIG = {
  name: 'Puja Proposition Agent',
  version: '1.0.0',
  apiUrl: process.env.REACT_APP_API_URL || 'http://localhost:5000/api',
  maxFileSize: 10 * 1024 * 1024, // 10MB
  supportedFileTypes: ['application/pdf'],
  pagination: {
    defaultLimit: 20,
    maxLimit: 100
  }
};

export const USER_ROLES = {
  ADMIN: 'admin',
  EDITOR: 'editor',
  USER: 'user'
};

export const PUJA_STATUSES = {
  PENDING_REVIEW: 'pending_review',
  APPROVED: 'approved',
  REJECTED: 'rejected',
  IN_PROGRESS: 'in_progress',
  COMPLETED: 'completed',
  FEEDBACK_RECEIVED: 'feedback_received'
};

export const NOTIFICATION_TYPES = {
  SUCCESS: 'success',
  ERROR: 'error',
  WARNING: 'warning',
  INFO: 'info'
};

export const MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];

export const DEITIES = [
  'Ganesha', 'Shiva', 'Vishnu', 'Durga', 'Lakshmi', 'Saraswati',
  'Krishna', 'Rama', 'Hanuman', 'Kali', 'Parvati', 'Brahma',
  'Surya', 'Chandra', 'Mangal', 'Budh', 'Guru', 'Shukra', 'Shani'
];

export const USE_CASES = [
  'Health & Wellness',
  'Career Growth',
  'Relationship Harmony',
  'Financial Prosperity',
  'Education Success',
  'Spiritual Progress',
  'Protection from Negativity',
  'Mental Peace',
  'Family Happiness',
  'Business Success'
];

export const RATING_LABELS = {
  1: 'Poor',
  2: 'Fair',
  3: 'Good',
  4: 'Very Good',
  5: 'Excellent'
};

export const THEME_OPTIONS = [
  { value: 'light', label: 'Light' },
  { value: 'dark', label: 'Dark' },
  { value: 'auto', label: 'Auto' }
];

export const DATE_FORMATS = {
  SHORT: 'MM/dd/yyyy',
  MEDIUM: 'MMM dd, yyyy',
  LONG: 'MMMM dd, yyyy',
  FULL: 'EEEE, MMMM dd, yyyy'
};

export const API_ENDPOINTS = {
  AUTH: '/auth',
  PUJA: '/puja',
  FEEDBACK: '/feedback',
  ANALYTICS: '/analytics'
};

export const LOCAL_STORAGE_KEYS = {
  AUTH_TOKEN: 'authToken',
  USER_PREFERENCES: 'userPreferences',
  THEME: 'theme',
  SIDEBAR_STATE: 'sidebarState'
};

export const ERROR_MESSAGES = {
  NETWORK_ERROR: 'Network error. Please check your connection.',
  UNAUTHORIZED: 'Your session has expired. Please login again.',
  FORBIDDEN: 'You do not have permission to perform this action.',
  NOT_FOUND: 'The requested resource was not found.',
  SERVER_ERROR: 'Server error. Please try again later.',
  VALIDATION_ERROR: 'Please check your input and try again.'
};

export const SUCCESS_MESSAGES = {
  SAVE_SUCCESS: 'Data saved successfully',
  DELETE_SUCCESS: 'Item deleted successfully',
  UPDATE_SUCCESS: 'Updated successfully',
  UPLOAD_SUCCESS: 'File uploaded successfully',
  EXPORT_SUCCESS: 'Export completed successfully'
};