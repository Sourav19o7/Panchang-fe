

// src/utils/validation.js
export const validationRules = {
  required: (value) => {
    if (value === null || value === undefined) return 'This field is required';
    if (typeof value === 'string' && value.trim() === '') return 'This field is required';
    if (Array.isArray(value) && value.length === 0) return 'This field is required';
    return null;
  },

  email: (value) => {
    if (!value) return null;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(value) ? null : 'Please enter a valid email address';
  },

  minLength: (min) => (value) => {
    if (!value) return null;
    return value.length >= min ? null : `Minimum ${min} characters required`;
  },

  maxLength: (max) => (value) => {
    if (!value) return null;
    return value.length <= max ? null : `Maximum ${max} characters allowed`;
  },

  number: (value) => {
    if (!value) return null;
    return !isNaN(value) ? null : 'Please enter a valid number';
  },

  min: (min) => (value) => {
    if (!value) return null;
    return Number(value) >= min ? null : `Value must be at least ${min}`;
  },

  max: (max) => (value) => {
    if (!value) return null;
    return Number(value) <= max ? null : `Value must not exceed ${max}`;
  },

  pattern: (regex, message = 'Invalid format') => (value) => {
    if (!value) return null;
    return regex.test(value) ? null : message;
  }
};

export const validateField = (value, rules) => {
  for (const rule of rules) {
    const error = rule(value);
    if (error) return error;
  }
  return null;
};

export const validateForm = (data, schema) => {
  const errors = {};
  
  for (const [field, rules] of Object.entries(schema)) {
    const error = validateField(data[field], rules);
    if (error) {
      errors[field] = error;
    }
  }
  
  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
};