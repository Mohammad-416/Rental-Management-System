import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './AdminPortal.css';
import { useNavigate } from 'react-router-dom';

const AdminPanel = () => {
  const navigate = useNavigate();
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    username: '',
    name: '',
    password: '',
    secretKey: '',
    rememberMe: false
  });
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [showSecretKey, setShowSecretKey] = useState(false);

  // Fetch CSRF token on component mount
  useEffect(() => {
    const fetchCsrfToken = async () => {
      try {
        await axios.get("http://localhost:8000/api/auth/csrf", {
          withCredentials: true, // 🔹 Allow cookies
        });
      } catch (error) {
        console.error("Error fetching CSRF token:", error);
      }
    };

    fetchCsrfToken();
  }, []);

  // Get CSRF token from cookies
  function getCookie(name) {
    let cookieValue = null;
    if (document.cookie && document.cookie !== "") {
      const cookies = document.cookie.split(";");
      for (let cookie of cookies) {
        cookie = cookie.trim();
        if (cookie.startsWith(name + "=")) {
          cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
          break;
        }
      }
    }
    return cookieValue;
  }

  // Theme toggle handler
  const handleThemeToggle = () => {
    setIsDarkMode(prev => !prev);
  };

  // Input change handler
  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  // Form validation
  const validateForm = () => {
    const newErrors = {};
    
    // Email validation
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }
    
    // Username validation
    if (!formData.username.trim()) {
      newErrors.username = 'Username is required';
    } else if (formData.username.length < 3) {
      newErrors.username = 'Username must be at least 3 characters long';
    }
    
    // Name validation
    if (!formData.name.trim()) {
      newErrors.name = 'Full name is required';
    }
    
    // Password validation
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters long';
    }
    
    // Secret key validation
    if (!formData.secretKey) {
      newErrors.secretKey = 'Secret key is required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Password toggle functions
  const togglePassword = () => {
    setShowPassword(prev => !prev);
  };

  const toggleSecretKey = () => {
    setShowSecretKey(prev => !prev);
  };

  // Set loading state
  const setLoadingState = (loading) => {
    setIsLoading(loading);
  };

  // Handle form submission
  const handleSubmit = async (event) => {
    event.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setLoadingState(true);
    
    try {
      const csrfToken = getCookie("csrftoken"); // Get CSRF token from cookies

      const payload = {
        secret: formData.secretKey,
        username: formData.username,
        email: formData.email,
        name: formData.name,
        password: formData.password
      };

      const response = await axios.post(
        'http://localhost:8000/api/auth/create-superuser/',
        payload,
        {
          headers: {
            "Content-Type": "application/json",
            "X-CSRFToken": csrfToken, // Include CSRF token in headers
          },
          withCredentials: true, // Include cookies
        }
      );

      console.log("Admin account created successfully:", response.data);
      alert('✅ Admin account created successfully!\nRedirecting to admin dashboard...');
      
      // Clear form
      setFormData({
        email: '',
        username: '',
        name: '',
        password: '',
        secretKey: '',
        rememberMe: false
      });
      setErrors({});
      
      // Simulate redirect
      setTimeout(() => {
        alert('Redirecting to admin dashboard...');
      }, 1000);
      
    } catch (error) {
      console.error('Admin registration failed:', error);
      
      if (error.response?.data) {
        const errorData = error.response.data;
        
        // Handle field-specific errors
        if (errorData.email) {
          setErrors(prev => ({ ...prev, email: Array.isArray(errorData.email) ? errorData.email[0] : errorData.email }));
        }
        if (errorData.username) {
          setErrors(prev => ({ ...prev, username: Array.isArray(errorData.username) ? errorData.username[0] : errorData.username }));
        }
        if (errorData.password) {
          setErrors(prev => ({ ...prev, password: Array.isArray(errorData.password) ? errorData.password[0] : errorData.password }));
        }
        if (errorData.secret) {
          setErrors(prev => ({ ...prev, secretKey: Array.isArray(errorData.secret) ? errorData.secret[0] : errorData.secret }));
        }
        if (errorData.name) {
          setErrors(prev => ({ ...prev, name: Array.isArray(errorData.name) ? errorData.name[0] : errorData.name }));
        }
        if (errorData.detail) {
          alert('❌ Error: ' + errorData.detail);
        }
        if (errorData.error) {
          alert('❌ Error: ' + errorData.error);
        }
      } else {
        alert('❌ Network error. Please check your connection and try again.');
      }
    } finally {
      setLoadingState(false);
    }
  };

  // Navigation handlers
  const handleBackToUser = () => {
    alert('Redirecting to user login page...');
    navigate('./login');
  };

  const handleEmergencyAccess = () => {
    alert('🆘 Emergency Access Protocol\n\nFor emergency access, please contact:\n\n📧 emergency@rentalhub.com\n📞 +1-800-EMERGENCY\n\nProvide your admin credentials and reason for emergency access.');
  };

  const handleContactSupport = () => {
    alert('📞 IT Support Contact\n\n📧 support@rentalhub.com\n📞 +1-800-SUPPORT\n💬 Live Chat: Available 24/7\n\nFor technical assistance with admin access.');
  };

  // Apply dark mode class to body
  useEffect(() => {
    if (isDarkMode) {
      document.body.classList.add('dark');
    } else {
      document.body.classList.remove('dark');
    }
  }, [isDarkMode]);

  return (
    <div className={`admin-panel-container ${isDarkMode ? 'dark' : ''}`}>
      {/* Navigation */}
      <nav className="navbar">
        <div className="nav-container">
          <div className="logo">RentalHub</div>
          <div className="nav-right">
            <ul className="nav-links">
              <li><div className="admin-badge">🛡️ ADMIN ACCESS</div></li>
              <li><a onClick={handleBackToUser} style={{ cursor: 'pointer' }}>User Login</a></li>
              <li><a href="#support">Support</a></li>
              <li><a href="#docs">Documentation</a></li>
            </ul>
          </div>
        </div>
      </nav>

      {/* Main Admin Login Section */}
      <section className="admin-container">
        <div className="admin-content">
          <h1 className="admin-title">Admin Portal</h1>
          <h2 className="admin-subtitle">Secure Administrator Access</h2>
          <p className="admin-description">
            Access the RentalHub administrative dashboard with enhanced security protocols. 
            Multi-factor authentication and encrypted sessions ensure maximum protection.
          </p>

          <div className="admin-form">
            <div className="security-indicator">
              <div className="security-icon">🔒</div>
              <div>
                <div className="security-text">Secure Connection Established</div>
                <div style={{ color: '#aaa', fontSize: '0.85rem' }}>256-bit SSL Encryption Active</div>
              </div>
            </div>

            <div className="status-indicators">
              <div className={`status-indicator ${!isLoading ? 'active' : ''}`}></div>
              <div className={`status-indicator ${isLoading ? 'active' : ''}`}></div>
            </div>

            <form onSubmit={handleSubmit}>
              {/* Administrator Email Field */}
              <div className="form-group">
                <label className="form-label" htmlFor="admin-email">
                  📧 Administrator Email
                </label>
                <input
                  type="email"
                  id="admin-email"
                  name="email"
                  className={`form-input ${errors.email ? 'error' : ''}`}
                  placeholder="admin@rentalhub.com"
                  autoComplete="username"
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  required
                />
                {errors.email && <div className="error-message">{errors.email}</div>}
              </div>

              {/* Administrator Username Field */}
              <div className="form-group">
                <label className="form-label" htmlFor="admin-username">
                  👤 Administrator Username
                </label>
                <input
                  type="text"
                  id="admin-username"
                  name="username"
                  className={`form-input ${errors.username ? 'error' : ''}`}
                  placeholder="Enter your admin username"
                  autoComplete="username"
                  value={formData.username}
                  onChange={(e) => handleInputChange('username', e.target.value)}
                  required
                />
                {errors.username && <div className="error-message">{errors.username}</div>}
              </div>

              {/* Administrator Full Name Field */}
              <div className="form-group">
                <label className="form-label" htmlFor="admin-name">
                  🏷️ Full Name
                </label>
                <input
                  type="text"
                  id="admin-name"
                  name="name"
                  className={`form-input ${errors.name ? 'error' : ''}`}
                  placeholder="Enter your full name"
                  autoComplete="name"
                  value={formData.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  required
                />
                {errors.name && <div className="error-message">{errors.name}</div>}
              </div>

              {/* Admin Password Field */}
              <div className="form-group">
                <label className="form-label" htmlFor="admin-password">
                  🔐 Master Password
                </label>
                <div className="input-wrapper">
                  <input
                    type={showPassword ? "text" : "password"}
                    id="admin-password"
                    name="password"
                    className={`form-input ${errors.password ? 'error' : ''}`}
                    placeholder="Enter your master password"
                    autoComplete="current-password"
                    value={formData.password}
                    onChange={(e) => handleInputChange('password', e.target.value)}
                    required
                  />
                  <button
                    type="button"
                    className="password-toggle"
                    onClick={togglePassword}
                  >
                    {showPassword ? '🙈' : '👁️'}
                  </button>
                </div>
                {errors.password && <div className="error-message">{errors.password}</div>}
              </div>

              {/* Secret Key Field */}
              <div className="form-group">
                <label className="form-label" htmlFor="admin-secret">
                  🔑 Secret Key
                </label>
                <div className="input-wrapper">
                  <input
                    type={showSecretKey ? "text" : "password"}
                    id="admin-secret"
                    name="secretKey"
                    className={`form-input ${errors.secretKey ? 'error' : ''}`}
                    placeholder="Enter your secret key"
                    autoComplete="off"
                    value={formData.secretKey}
                    onChange={(e) => handleInputChange('secretKey', e.target.value)}
                    required
                  />
                  <button
                    type="button"
                    className="password-toggle"
                    onClick={toggleSecretKey}
                  >
                    {showSecretKey ? '🙈' : '👁️'}
                  </button>
                </div>
                {errors.secretKey && <div className="error-message">{errors.secretKey}</div>}
              </div>

              {/* Remember Me for Admin */}
              <div className="checkbox-group">
                <input
                  type="checkbox"
                  id="admin-remember"
                  name="rememberMe"
                  className="checkbox-input"
                  checked={formData.rememberMe}
                  onChange={(e) => handleInputChange('rememberMe', e.target.checked)}
                />
                <label htmlFor="admin-remember" className="checkbox-label">
                  Keep me signed in on this device (Not recommended for shared computers)
                </label>
              </div>

              {/* Submit Button */}
              <button 
                type="submit" 
                className={`btn btn-admin ${isLoading ? 'loading' : ''}`}
                disabled={isLoading}
              >
                {isLoading && <span className="loading-spinner"></span>}
                <span>{isLoading ? 'Creating Account...' : '🚀 Access Admin Panel'}</span>
              </button>

              <button 
                type="button" 
                className="btn btn-secondary" 
                onClick={handleBackToUser}
              >
                👤 Switch to User Login
              </button>
            </form>

            {/* Form Links */}
            <div className="form-links">
              <span className="form-link" onClick={handleEmergencyAccess}>
                🆘 Emergency Access
              </span>
              <span className="form-link" onClick={handleContactSupport}>
                📞 Contact IT Support
              </span>
              <a href="#audit-logs" className="back-to-user">
                📊 View Audit Logs
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Theme Toggle Button */}
      <div className="theme-toggle-container">
        <div className="swipe-toggle" onClick={handleThemeToggle} title="Toggle Theme">
          <div className="toggle-slider">
            <span className="toggle-icon">{isDarkMode ? '🌙' : '☀️'}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminPanel;
