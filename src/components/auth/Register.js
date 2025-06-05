import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff, Mail, Lock, User, UserPlus } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import authService from '../../services/authService';
import Loading from '../common/Loading';

const Register = () => {
  const navigate = useNavigate();
  const { register, loading } = useAuth();

  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    // Clear specific error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }

    // Real-time password validation
    if (name === 'password') {
      const validation = authService.validatePassword(value);
      if (!validation.isValid && value.length > 0) {
        setErrors(prev => ({
          ...prev,
          password: validation.errors[0]
        }));
      }
    }

    // Real-time confirm password validation
    if (name === 'confirmPassword' && formData.password) {
      if (value !== formData.password) {
        setErrors(prev => ({
          ...prev,
          confirmPassword: 'Passwords do not match'
        }));
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate form
    const validation = authService.validateRegistrationForm(formData);
    if (!validation.isValid) {
      setErrors(validation.errors);
      return;
    }

    // Clear errors
    setErrors({});

    // Attempt registration
    const result = await register({
      fullName: formData.fullName,
      email: formData.email,
      password: formData.password
    });

    if (result.success) {
      // Redirect to dashboard
      navigate('/', { replace: true });
    }
  };

  // Get password strength info
  const passwordStrength = formData.password ? 
    authService.validatePassword(formData.password) : null;

  if (loading) {
    return <Loading message="Creating your account..." />;
  }

  return (
    <div className="auth-page">
      <div className="auth-container">
        <div className="auth-card">
          {/* Header */}
          <div className="auth-header">
            <div className="auth-logo">
              <UserPlus size={32} className="auth-logo-icon" />
              <h1>Puja Proposition Agent</h1>
            </div>
            <h2>Create Account</h2>
            <p>Join us to start creating amazing puja propositions</p>
          </div>

          {/* Registration Form */}
          <form onSubmit={handleSubmit} className="auth-form">
            {/* Full Name Field */}
            <div className="form-group">
              <label htmlFor="fullName" className="form-label">
                <User size={16} />
                Full Name
              </label>
              <input
                type="text"
                id="fullName"
                name="fullName"
                value={formData.fullName}
                onChange={handleChange}
                className={`form-input ${errors.fullName ? 'error' : ''}`}
                placeholder="Enter your full name"
                autoComplete="name"
                autoFocus
              />
              {errors.fullName && (
                <span className="form-error">{errors.fullName}</span>
              )}
            </div>

            {/* Email Field */}
            <div className="form-group">
              <label htmlFor="email" className="form-label">
                <Mail size={16} />
                Email Address
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className={`form-input ${errors.email ? 'error' : ''}`}
                placeholder="Enter your email"
                autoComplete="email"
              />
              {errors.email && (
                <span className="form-error">{errors.email}</span>
              )}
            </div>

            {/* Password Field */}
            <div className="form-group">
              <label htmlFor="password" className="form-label">
                <Lock size={16} />
                Password
              </label>
              <div className="password-input">
                <input
                  type={showPassword ? 'text' : 'password'}
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  className={`form-input ${errors.password ? 'error' : ''}`}
                  placeholder="Create a strong password"
                  autoComplete="new-password"
                />
                <button
                  type="button"
                  className="password-toggle"
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
              
              {/* Password strength indicator */}
              {formData.password && passwordStrength && (
                <div className="password-strength">
                  <div className="strength-bar">
                    <div 
                      className={`strength-fill strength-${passwordStrength.strength}`}
                      style={{ 
                        width: `${authService.getPasswordStrengthPercentage(passwordStrength.strength)}%` 
                      }}
                    ></div>
                  </div>
                  <span className={`strength-text strength-${passwordStrength.strength}`}>
                    {passwordStrength.strength} password
                  </span>
                </div>
              )}
              
              {errors.password && (
                <span className="form-error">{errors.password}</span>
              )}
            </div>

            {/* Confirm Password Field */}
            <div className="form-group">
              <label htmlFor="confirmPassword" className="form-label">
                <Lock size={16} />
                Confirm Password
              </label>
              <div className="password-input">
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  id="confirmPassword"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className={`form-input ${errors.confirmPassword ? 'error' : ''}`}
                  placeholder="Confirm your password"
                  autoComplete="new-password"
                />
                <button
                  type="button"
                  className="password-toggle"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  aria-label={showConfirmPassword ? 'Hide password' : 'Show password'}
                >
                  {showConfirmPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
              {errors.confirmPassword && (
                <span className="form-error">{errors.confirmPassword}</span>
              )}
            </div>

            {/* Terms and Conditions */}
            <div className="form-group">
              <label className="checkbox-label">
                <input
                  type="checkbox"
                  required
                  className="checkbox-input"
                />
                <span className="checkbox-custom"></span>
                I agree to the{' '}
                <Link to="/terms" className="auth-link">Terms of Service</Link>
                {' '}and{' '}
                <Link to="/privacy" className="auth-link">Privacy Policy</Link>
              </label>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="auth-submit-btn"
            >
              {loading ? (
                <>
                  <div className="btn-spinner"></div>
                  Creating account...
                </>
              ) : (
                <>
                  <UserPlus size={16} />
                  Create Account
                </>
              )}
            </button>
          </form>

          {/* Footer */}
          <div className="auth-footer">
            <p>
              Already have an account?{' '}
              <Link to="/login" className="auth-link">
                Sign in here
              </Link>
            </p>
          </div>
        </div>

        {/* Password Requirements */}
        <div className="password-requirements">
          <h4>Password Requirements</h4>
          <ul>
            <li className={formData.password?.length >= 8 ? 'valid' : ''}>
              At least 8 characters long
            </li>
            <li className={/[A-Z]/.test(formData.password) ? 'valid' : ''}>
              One uppercase letter
            </li>
            <li className={/[a-z]/.test(formData.password) ? 'valid' : ''}>
              One lowercase letter
            </li>
            <li className={/\d/.test(formData.password) ? 'valid' : ''}>
              One number
            </li>
            <li className={/[!@#$%^&*(),.?":{}|<>]/.test(formData.password) ? 'valid' : ''}>
              One special character
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Register;