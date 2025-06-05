import { apiHelpers, endpoints } from '../config/api';

class AuthService {
  // Login user
  async login(credentials) {
    try {
      const response = await apiHelpers.post(endpoints.auth.login, credentials);
      return response;
    } catch (error) {
      throw error;
    }
  }

  // Register new user
  async register(userData) {
    try {
      const response = await apiHelpers.post(endpoints.auth.register, userData);
      return response;
    } catch (error) {
      throw error;
    }
  }

  // Logout user
  async logout() {
    try {
      const response = await apiHelpers.post(endpoints.auth.logout);
      return response;
    } catch (error) {
      throw error;
    }
  }

  // Get user profile
  async getProfile() {
    try {
      const response = await apiHelpers.get(endpoints.auth.profile);
      return response;
    } catch (error) {
      throw error;
    }
  }

  // Update user profile
  async updateProfile(profileData) {
    try {
      const response = await apiHelpers.put(endpoints.auth.profile, profileData);
      return response;
    } catch (error) {
      throw error;
    }
  }

  // Change password
  async changePassword(passwordData) {
    try {
      const response = await apiHelpers.post(endpoints.auth.changePassword, passwordData);
      return response;
    } catch (error) {
      throw error;
    }
  }

  // Forgot password
  async forgotPassword(email) {
    try {
      const response = await apiHelpers.post(endpoints.auth.forgotPassword, { email });
      return response;
    } catch (error) {
      throw error;
    }
  }

  // Reset password
  async resetPassword(token, newPassword) {
    try {
      const response = await apiHelpers.post(endpoints.auth.resetPassword, {
        token,
        newPassword
      });
      return response;
    } catch (error) {
      throw error;
    }
  }

  // Refresh authentication token
  async refreshToken(refreshToken) {
    try {
      const response = await apiHelpers.post(endpoints.auth.refreshToken, {
        refreshToken
      });
      return response;
    } catch (error) {
      throw error;
    }
  }

  // Validate email format
  validateEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  // Validate password strength
  validatePassword(password) {
    const minLength = 8;
    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasNumbers = /\d/.test(password);
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);

    const errors = [];
    
    if (password.length < minLength) {
      errors.push(`Password must be at least ${minLength} characters long`);
    }
    if (!hasUpperCase) {
      errors.push('Password must contain at least one uppercase letter');
    }
    if (!hasLowerCase) {
      errors.push('Password must contain at least one lowercase letter');
    }
    if (!hasNumbers) {
      errors.push('Password must contain at least one number');
    }
    if (!hasSpecialChar) {
      errors.push('Password must contain at least one special character');
    }

    return {
      isValid: errors.length === 0,
      errors,
      strength: this.calculatePasswordStrength(password)
    };
  }

  // Calculate password strength
  calculatePasswordStrength(password) {
    let strength = 0;
    
    if (password.length >= 8) strength += 1;
    if (password.length >= 12) strength += 1;
    if (/[A-Z]/.test(password)) strength += 1;
    if (/[a-z]/.test(password)) strength += 1;
    if (/[0-9]/.test(password)) strength += 1;
    if (/[^A-Za-z0-9]/.test(password)) strength += 1;

    if (strength <= 2) return 'weak';
    if (strength <= 4) return 'medium';
    return 'strong';
  }

  // Validate registration form
  validateRegistrationForm(formData) {
    const errors = {};

    // Validate email
    if (!formData.email) {
      errors.email = 'Email is required';
    } else if (!this.validateEmail(formData.email)) {
      errors.email = 'Please enter a valid email address';
    }

    // Validate password
    if (!formData.password) {
      errors.password = 'Password is required';
    } else {
      const passwordValidation = this.validatePassword(formData.password);
      if (!passwordValidation.isValid) {
        errors.password = passwordValidation.errors[0];
      }
    }

    // Validate confirm password
    if (!formData.confirmPassword) {
      errors.confirmPassword = 'Please confirm your password';
    } else if (formData.password !== formData.confirmPassword) {
      errors.confirmPassword = 'Passwords do not match';
    }

    // Validate full name
    if (!formData.fullName) {
      errors.fullName = 'Full name is required';
    } else if (formData.fullName.trim().length < 2) {
      errors.fullName = 'Full name must be at least 2 characters long';
    }

    return {
      isValid: Object.keys(errors).length === 0,
      errors
    };
  }

  // Validate login form
  validateLoginForm(formData) {
    const errors = {};

    if (!formData.email) {
      errors.email = 'Email is required';
    } else if (!this.validateEmail(formData.email)) {
      errors.email = 'Please enter a valid email address';
    }

    if (!formData.password) {
      errors.password = 'Password is required';
    }

    return {
      isValid: Object.keys(errors).length === 0,
      errors
    };
  }

  // Validate profile update form
  validateProfileForm(formData) {
    const errors = {};

    if (!formData.fullName) {
      errors.fullName = 'Full name is required';
    } else if (formData.fullName.trim().length < 2) {
      errors.fullName = 'Full name must be at least 2 characters long';
    }

    if (formData.email && !this.validateEmail(formData.email)) {
      errors.email = 'Please enter a valid email address';
    }

    return {
      isValid: Object.keys(errors).length === 0,
      errors
    };
  }

  // Validate change password form
  validateChangePasswordForm(formData) {
    const errors = {};

    if (!formData.currentPassword) {
      errors.currentPassword = 'Current password is required';
    }

    if (!formData.newPassword) {
      errors.newPassword = 'New password is required';
    } else {
      const passwordValidation = this.validatePassword(formData.newPassword);
      if (!passwordValidation.isValid) {
        errors.newPassword = passwordValidation.errors[0];
      }
    }

    if (!formData.confirmNewPassword) {
      errors.confirmNewPassword = 'Please confirm your new password';
    } else if (formData.newPassword !== formData.confirmNewPassword) {
      errors.confirmNewPassword = 'New passwords do not match';
    }

    if (formData.currentPassword === formData.newPassword) {
      errors.newPassword = 'New password must be different from current password';
    }

    return {
      isValid: Object.keys(errors).length === 0,
      errors
    };
  }

  // Get password strength color
  getPasswordStrengthColor(strength) {
    switch (strength) {
      case 'weak':
        return '#ef4444';
      case 'medium':
        return '#f59e0b';
      case 'strong':
        return '#10b981';
      default:
        return '#6b7280';
    }
  }

  // Get password strength percentage
  getPasswordStrengthPercentage(strength) {
    switch (strength) {
      case 'weak':
        return 33;
      case 'medium':
        return 66;
      case 'strong':
        return 100;
      default:
        return 0;
    }
  }
}

export default new AuthService();