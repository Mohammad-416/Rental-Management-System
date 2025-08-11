import React, { useState, useEffect, useRef } from 'react';
import * as THREE from 'three';
import './AdminPortal.css'; // You'll need to create this CSS file
import axios from 'axios';

const AdminPortal = () => {
  const [formData, setFormData] = useState({
    email: '',
    username: '',
    name: '',
    password: '',
    secretKey: '',
    rememberMe: false
  });
  
  useEffect(() => {
  const cookies = async () => {
    try {
      await axios.get("http://localhost:8000/api/auth/csrf", {
        withCredentials: true, // 🔹 Allow cookies
      });
    } catch (error) {
      console.error("Error fetching CSRF token:", error);
    }
  };

    cookies();
  }, []);


  const [showPassword, setShowPassword] = useState(false);
  const [showSecretKey, setShowSecretKey] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({});
  
  const canvasRef = useRef();
  const sceneRef = useRef();
  const animationRef = useRef();

  // Initialize Three.js scene
  useEffect(() => {
    if (!canvasRef.current) return;

    // Three.js setup
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    
    renderer.setSize(canvasRef.current.offsetWidth, canvasRef.current.offsetHeight);
    renderer.setClearColor(0x000000, 0);
    canvasRef.current.appendChild(renderer.domElement);

    // Add some basic geometry for the 3D background
    const geometry = new THREE.TorusGeometry(1, 0.3, 16, 100);
    const material = new THREE.MeshBasicMaterial({ 
      color: 0x00ff88, 
      wireframe: true,
      transparent: true,
      opacity: 0.3
    });
    const torus = new THREE.Mesh(geometry, material);
    scene.add(torus);

    camera.position.z = 5;
    sceneRef.current = { scene, camera, renderer, torus };

    // Animation loop
    const animate = () => {
      animationRef.current = requestAnimationFrame(animate);
      
      if (sceneRef.current) {
        sceneRef.current.torus.rotation.x += 0.01;
        sceneRef.current.torus.rotation.y += 0.005;
        sceneRef.current.renderer.render(sceneRef.current.scene, sceneRef.current.camera);
      }
    };
    animate();

    // Handle resize
    const handleResize = () => {
      if (sceneRef.current && canvasRef.current) {
        const width = canvasRef.current.offsetWidth;
        const height = canvasRef.current.offsetHeight;
        
        sceneRef.current.camera.aspect = width / height;
        sceneRef.current.camera.updateProjectionMatrix();
        sceneRef.current.renderer.setSize(width, height);
      }
    };

    window.addEventListener('resize', handleResize);

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
      if (sceneRef.current) {
        sceneRef.current.renderer.dispose();
      }
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const togglePassword = () => {
    setShowPassword(!showPassword);
  };

  const toggleSecretKey = () => {
    setShowSecretKey(!showSecretKey);
  };

  function getCookie(name) {
  let cookieValue = null;
  if (document.cookie && document.cookie !== "") {
    const cookies = document.cookie.split(";");
    for (let i = 0; i < cookies.length; i++) {
      const cookie = cookies[i].trim();
      // Does this cookie string begin with the name we want?
      if (cookie.substring(0, name.length + 1) === name + "=") {
        cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
        break;
      }
    }
  }
  return cookieValue;
}

const handleSubmit = async (e) => {
  e.preventDefault();

  const csrfToken = getCookie("csrftoken"); // Make sure the cookie name matches your backend

  const payload = {
    secret: formData.secretKey, // ✅ Take from user input
    username: formData.username,
    email: formData.email,
    name: formData.name,
    password: formData.password,
  };

  try {
    setIsLoading(true);
    const res = await axios.post(
      "http://localhost:8000/api/auth/create-superuser/",
      payload,
      {
        headers: {
          "Content-Type": "application/json",
          "X-CSRFToken": csrfToken,
        },
        withCredentials: true, // ✅ send cookies
      }
    );
    console.log("Superuser created:", res.data);
  } catch (err) {
    console.error("Error creating superuser:", err);
  } finally {
    setIsLoading(false);
  }
};


  const handleBackToUser = () => {
    // Navigate to user login page
    console.log('Navigating to user login...');
  };

  const handleEmergencyAccess = () => {
    console.log('Emergency access requested...');
  };

  const handleContactSupport = () => {
    console.log('Contacting support...');
  };

  return (
    <div className="min-h-screen bg-black text-white overflow-x-hidden">
      {/* Navigation */}
      <nav className="navbar fade-in">
        <div className="nav-container">
          <div className="logo">NEXUS</div>
          <ul className="nav-links">
            <li><div className="admin-badge">🛡️ ADMIN ACCESS</div></li>
            <li><a onClick={handleBackToUser}>User Login</a></li>
            <li><a href="#support">Support</a></li>
            <li><a href="#docs">Documentation</a></li>
          </ul>
        </div>
      </nav>

      {/* Main Admin Login Section */}
      <div className="admin-login-container">
        <div className="admin-login-content fade-in">
          <div className="admin-form-section">
            <h1 className="admin-title">Admin Portal</h1>
            <h2 className="admin-subtitle">Secure Administrator Access</h2>
            <p className="admin-description">
              Access the NEXUS administrative dashboard with enhanced security protocols. 
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
                <div className="status-indicator active" id="status-1"></div>
                <div className="status-indicator" id="status-2"></div>
              </div>

              <form id="adminForm" onSubmit={handleSubmit}>
                {/* Main Login Section */}
                <div id="main-login" className="login-section">
                  {/* Administrator Email Field */}
                  <div className="form-group">
                    <label className="form-label" htmlFor="admin-email">
                      📧 Administrator Email
                    </label>
                    <input
                      type="email"
                      id="admin-email"
                      name="email"
                      className="form-input"
                      placeholder="admin@nexus-pro.com"
                      autoComplete="username"
                      value={formData.email}
                      onChange={handleInputChange}
                      required
                    />
                    {errors.email && (
                      <div className="error-message" style={{ display: 'block' }}>
                        {errors.email}
                      </div>
                    )}
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
                      className="form-input"
                      placeholder="Enter your admin username"
                      autoComplete="username"
                      value={formData.username}
                      onChange={handleInputChange}
                      required
                    />
                    {errors.username && (
                      <div className="error-message" style={{ display: 'block' }}>
                        {errors.username}
                      </div>
                    )}
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
                      className="form-input"
                      placeholder="Enter your full name"
                      autoComplete="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      required
                    />
                    {errors.name && (
                      <div className="error-message" style={{ display: 'block' }}>
                        {errors.name}
                      </div>
                    )}
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
                        className="form-input"
                        placeholder="Enter your master password"
                        autoComplete="current-password"
                        value={formData.password}
                        onChange={handleInputChange}
                        required
                      />
                      <button
                        type="button"
                        className="password-toggle"
                        onClick={togglePassword}
                      >
                        👁️
                      </button>
                    </div>
                    {errors.password && (
                      <div className="error-message" style={{ display: 'block' }}>
                        {errors.password}
                      </div>
                    )}
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
                        className="form-input"
                        placeholder="Enter your secret key"
                        autoComplete="off"
                        value={formData.secretKey}
                        onChange={handleInputChange}
                        required
                      />
                      <button
                        type="button"
                        className="password-toggle"
                        onClick={toggleSecretKey}
                      >
                        👁️
                      </button>
                    </div>
                    {errors.secretKey && (
                      <div className="error-message" style={{ display: 'block' }}>
                        {errors.secretKey}
                      </div>
                    )}
                  </div>

                  {/* Remember Me for Admin */}
                  <div className="checkbox-group">
                    <input
                      type="checkbox"
                      id="admin-remember"
                      name="rememberMe"
                      className="checkbox-input"
                      checked={formData.rememberMe}
                      onChange={handleInputChange}
                    />
                    <label htmlFor="admin-remember" className="checkbox-label">
                      Keep me signed in on this device (Not recommended for shared computers)
                    </label>
                  </div>
                </div>

                {/* Submit Button */}
                <button type="submit" className="btn btn-admin" id="submit-btn" disabled={isLoading}>
                  <span 
                    id="loading-spinner" 
                    className="loading-spinner" 
                    style={{ display: isLoading ? 'inline-block' : 'none' }}
                  ></span>
                  <span id="btn-text">
                    {isLoading ? 'Authenticating...' : '🚀 Access Admin Panel'}
                  </span>
                </button>

                <button 
                  type="button" 
                  className="btn btn-secondary" 
                  id="user-login-btn" 
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

          {/* 3D Animation Canvas */}
          <div className="threejs-canvas">
            <div id="canvas-container" ref={canvasRef}></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminPortal;