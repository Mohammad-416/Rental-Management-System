import { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './SignUp.css';
import { FaUserSecret } from "react-icons/fa6";
import { FaUserTie } from "react-icons/fa";

const SignUp = () => {
  const navigate = useNavigate();
  const canvasRef = useRef(null);
  const [currentRole, setCurrentRole] = useState('customer'); // Default to customer
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    fullName: '',
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    agreeTerms: false
  });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    const cookies = async () => {
      try {
        await axios.get("http://localhost:8000/api/auth/csrf", {
          withCredentials: true,
        });
      } catch (error) {
        console.error("Error fetching CSRF token:", error);
      }
    };
    cookies();
  }, []);

  // Keep your existing Three.js animation code
  useEffect(() => {
    let scene, camera, renderer, particles, animationId;

    const initThreeJS = () => {
      if (!canvasRef.current) return;

      scene = new THREE.Scene();
      camera = new THREE.PerspectiveCamera(75, 1, 0.1, 1000);
      renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
      renderer.setSize(400, 400);
      renderer.setClearColor(0x000000, 0);
      canvasRef.current.appendChild(renderer.domElement);

      const shapes = [];
      const geometries = [
        new THREE.TetrahedronGeometry(0.5),
        new THREE.OctahedronGeometry(0.4),
        new THREE.IcosahedronGeometry(0.3)
      ];

      for (let i = 0; i < 8; i++) {
        const geometry = geometries[Math.floor(Math.random() * geometries.length)];
        const material = new THREE.MeshBasicMaterial({
          color: i % 2 === 0 ? 0x4ecdc4 : 0xff6b6b,
          wireframe: true,
          transparent: true,
          opacity: 0.6
        });
        const shape = new THREE.Mesh(geometry, material);

        shape.position.x = (Math.random() - 0.5) * 8;
        shape.position.y = (Math.random() - 0.5) * 8;
        shape.position.z = (Math.random() - 0.5) * 8;

        shape.rotation.x = Math.random() * Math.PI;
        shape.rotation.y = Math.random() * Math.PI;

        shapes.push(shape);
        scene.add(shape);
      }

      const particleGeometry = new THREE.BufferGeometry();
      const particleCount = 150;
      const positions = new Float32Array(particleCount * 3);

      for (let i = 0; i < particleCount * 3; i++) {
        positions[i] = (Math.random() - 0.5) * 12;
      }

      particleGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
      const particleMaterial = new THREE.PointsMaterial({
        color: 0x4ecdc4,
        size: 0.03,
        transparent: true,
        opacity: 0.4
      });

      particles = new THREE.Points(particleGeometry, particleMaterial);
      scene.add(particles);

      camera.position.z = 6;

      const animate = () => {
        animationId = requestAnimationFrame(animate);

        shapes.forEach((shape, index) => {
          shape.rotation.x += 0.005 + index * 0.001;
          shape.rotation.y += 0.008 + index * 0.001;

          const time = Date.now() * 0.001;
          shape.position.y += Math.sin(time + index) * 0.002;
        });

        if (particles) {
          particles.rotation.y += 0.001;
          particles.rotation.x += 0.0005;
        }

        renderer.render(scene, camera);
      };

      animate();
    };

    initThreeJS();

    return () => {
      if (animationId) {
        cancelAnimationFrame(animationId);
      }
      if (renderer) {
        renderer.dispose();
      }
    };
  }, []);

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));

    if (errors[field]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  const handleRoleChange = (role) => {
    setCurrentRole(role);
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.fullName.trim()) {
      newErrors.fullName = 'Full name is required';
    } else if (formData.fullName.trim().length < 2) {
      newErrors.fullName = 'Please enter your full name';
    }

    if (!formData.username.trim()) {
      newErrors.username = 'Username is required';
    } else if (formData.username.length < 3) {
      newErrors.username = 'Username must be at least 3 characters long';
    } else if (!/^[a-zA-Z0-9_]+$/.test(formData.username)) {
      newErrors.username = 'Username can only contain letters, numbers, and underscores';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters long';
    } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(formData.password)) {
      newErrors.password = 'Password must contain uppercase, lowercase, and number';
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password';
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    if (!formData.agreeTerms) {
      newErrors.agreeTerms = 'You must agree to the terms and conditions';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

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

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsLoading(true);

    try {
      const csrfToken = getCookie("csrftoken");

      const payload = {
        username: formData.username,
        email: formData.email,
        name: formData.fullName,
        password: formData.password,
        role: currentRole
      };

      const res = await axios.post(
        "http://localhost:8000/api/auth/register/",
        payload,
        {
          headers: {
            "Content-Type": "application/json",
            "X-CSRFToken": csrfToken,
          },
          withCredentials: true,
        }
      );

      console.log("Registration successful:", res.data);
      alert(`Demo: ${currentRole.charAt(0).toUpperCase() + currentRole.slice(1)} account created successfully!\nPlease check your email for verification.`);
      navigate('/home');
    } catch (error) {
      console.error("Registration failed:", error.response?.data || error.message);
      alert('Registration failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const navigateToLogin = () => {
    navigate('/login');
  };

  const handleNavigation = (page) => {
    if (page === 'home') {
      alert('Redirecting to Home page...');
    } else if (page === 'about') {
      alert('About Us - Learn more about RentalHub and our mission to revolutionize the rental marketplace!');
    } else if (page === 'contact') {
      alert('Contact Us - Get in touch with our team:\n\nEmail: support@rentalhub.com\nPhone: +1 (555) 123-4567\n\nWe\'d love to hear from you!');
    }
  };

  const handleThemeToggle = () => {
    setIsDarkMode(prev => !prev);
  };

  const handleSocialSignup = (provider) => {
    alert(`${provider} signup for ${currentRole} - Feature coming soon!`);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSubmit(e);
    }
  };

  useEffect(() => {
    if (isDarkMode) {
      document.body.classList.add('dark');
    } else {
      document.body.classList.remove('dark');
    }
  }, [isDarkMode]);

  return (
    <div>
      <nav className="navbar">
        <div className="nav-container">
          <div className="logo">RentalHub</div>
          <div className="nav-right">
            <ul className="nav-links">
              <li>
                <a
                  href="#home"
                  onClick={(e) => {
                    e.preventDefault();
                    handleNavigation("home");
                  }}
                >
                  Home
                </a>
              </li>
              <li>
                <a
                  href="#about"
                  onClick={(e) => {
                    e.preventDefault();
                    handleNavigation("about");
                  }}
                >
                  About
                </a>
              </li>
              <li>
                <a
                  href="#contact"
                  onClick={(e) => {
                    e.preventDefault();
                    handleNavigation("contact");
                  }}
                >
                  Contact
                </a>
              </li>
            </ul>
          </div>
        </div>
      </nav>

      <section className="signup-container">
        <div className="signup-content">
          <h1 className="signup-title">
            {currentRole === "customer" ? "Join as Customer" : "Join as User"}
          </h1>
          <p className="signup-subtitle">
            {currentRole === "customer"
              ? "Create your business account to start listing and renting your products."
              : "Create your account to start renting products from our marketplace."}
          </p>

          <div className="role-tabs">
            <button
              className={`role-tab ${currentRole === "user" ? "active" : ""}`}
              onClick={() => handleRoleChange("user")}
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                padding: "10px 16px",
                gap: "4px",
                cursor: "pointer",
              }}
            >
              <FaUserSecret style={{ fontSize: "22px" }} />
              <span style={{ fontWeight: "500" }}>Occupant</span>
              <span style={{ fontSize: "14px", color: "#666" }}>Signup</span>
            </button>

            <button
              className={`role-tab ${
                currentRole === "customer" ? "active" : ""
              }`}
              onClick={() => handleRoleChange("customer")}
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                padding: "10px 16px",
                gap: "4px",
                cursor: "pointer",
              }}
            >
              <FaUserTie style={{ fontSize: "22px" }} />
              <span style={{ fontWeight: "500" }}>Client</span>
              <span style={{ fontSize: "14px", color: "#666" }}>Signup</span>
            </button>
          </div>

          <div className="signup-form">
            <div className="social-signup">
              <button
                type="button"
                className="social-btn"
                title="Continue with Google"
                onClick={() =>
                  (window.location.href =
                    "http://localhost:8000/accounts/login/google-oauth2")
                }
              >
                {/* Google SVG */}
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  viewBox="0 0 48 48"
                >
                  <path
                    fill="#4285F4"
                    d="M24 9.5c3.15 0 5.95 1.08 8.18 2.85l6.07-6.07C34.54 2.43 29.64 0 24 0 14.64 0 6.4 5.52 2.54 13.5l7.17 5.57C11.88 13.03 17.52 9.5 24 9.5z"
                  />
                  <path
                    fill="#34A853"
                    d="M46.5 24c0-1.32-.12-2.59-.33-3.82H24v7.64h12.68c-.54 2.9-2.14 5.36-4.54 7.02l7.18 5.57C43.6 35.84 46.5 30.29 46.5 24z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M9.71 28.93c-.44-1.29-.71-2.66-.71-4.08 0-1.42.27-2.79.71-4.08l-7.17-5.57C1.03 18.41 0 21.09 0 24c0 2.91 1.03 5.59 2.54 7.79l7.17-5.57z"
                  />
                  <path
                    fill="#EA4335"
                    d="M24 48c6.48 0 11.88-2.13 15.84-5.79l-7.18-5.57C30.04 38.61 27.15 39.5 24 39.5c-6.48 0-12.12-3.53-14.85-8.57l-7.17 5.57C6.4 42.48 14.64 48 24 48z"
                  />
                </svg>
              </button>

              <button
                type="button"
                className="social-btn"
                title="Continue with Facebook"
                onClick={() => handleSocialSignup("Facebook")}
              >
                {/* Facebook SVG */}
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  viewBox="0 0 48 48"
                >
                  <path
                    fill="#1877F2"
                    d="M48 24C48 10.74 37.26 0 24 0S0 10.74 0 24c0 11.99 8.77 21.91 20.26 23.78v-16.8h-6.1v-6.98h6.1v-5.3c0-6.03 3.58-9.35 9.06-9.35 2.63 0 5.38.47 5.38.47v5.9h-3.03c-2.99 0-3.92 1.86-3.92 3.77v4.51h6.67l-1.07 6.98h-5.6v16.8C39.23 45.91 48 35.99 48 24z"
                  />
                </svg>
              </button>

              <button
                type="button"
                className="social-btn"
                title="Continue with Apple"
                onClick={() => handleSocialSignup("Apple")}
              >
                {/* Apple SVG */}
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  viewBox="0 0 48 48"
                >
                  <path
                    fill="#000"
                    d="M33.65 24.13c-.04-4.17 3.41-6.19 3.56-6.28-1.94-2.85-4.94-3.24-6-3.28-2.55-.26-4.99 1.5-6.29 1.5-1.3 0-3.31-1.46-5.45-1.42-2.8.04-5.4 1.63-6.84 4.15-2.91 5.06-.74 12.57 2.09 16.68 1.39 2 3.05 4.23 5.23 4.15 2.09-.08 2.88-1.34 5.41-1.34 2.53 0 3.23 1.34 5.44 1.29 2.24-.04 3.64-2.03 5-4.05 1.57-2.29 2.21-4.51 2.25-4.62-.05-.02-4.33-1.66-4.4-6.08zM28.2 10.15c1.17-1.43 1.95-3.4 1.73-5.38-1.68.07-3.72 1.12-4.91 2.55-1.08 1.26-2.03 3.27-1.78 5.2 1.88.15 3.8-.96 4.96-2.37z"
                  />
                </svg>
              </button>
            </div>

            <div className="divider">
              <span className="divider-text">or create account with email</span>
            </div>

            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label className="form-label" htmlFor="fullName">
                  Full Name
                </label>
                <input
                  className={`form-input ${errors.fullName ? "error" : ""}`}
                  id="fullName"
                  type="text"
                  placeholder="Enter your full name"
                  autoComplete="name"
                  value={formData.fullName}
                  onChange={(e) =>
                    handleInputChange("fullName", e.target.value)
                  }
                  onKeyPress={handleKeyPress}
                />
                {errors.fullName && (
                  <span className="error-message">{errors.fullName}</span>
                )}
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="username">
                  Username
                </label>
                <input
                  className={`form-input ${errors.username ? "error" : ""}`}
                  id="username"
                  type="text"
                  placeholder="Choose a unique username"
                  autoComplete="username"
                  value={formData.username}
                  onChange={(e) =>
                    handleInputChange("username", e.target.value)
                  }
                  onKeyPress={handleKeyPress}
                />
                {errors.username && (
                  <span className="error-message">{errors.username}</span>
                )}
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="email">
                  Email Address
                </label>
                <input
                  className={`form-input ${errors.email ? "error" : ""}`}
                  id="email"
                  type="email"
                  placeholder="Enter your email address"
                  autoComplete="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange("email", e.target.value)}
                  onKeyPress={handleKeyPress}
                />
                {errors.email && (
                  <span className="error-message">{errors.email}</span>
                )}
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="password">
                  Password
                </label>
                <input
                  className={`form-input ${errors.password ? "error" : ""}`}
                  id="password"
                  type="password"
                  placeholder="Create a secure password"
                  autoComplete="new-password"
                  value={formData.password}
                  onChange={(e) =>
                    handleInputChange("password", e.target.value)
                  }
                  onKeyPress={handleKeyPress}
                />
                {errors.password && (
                  <span className="error-message">{errors.password}</span>
                )}
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="confirmPassword">
                  Confirm Password
                </label>
                <input
                  className={`form-input ${
                    errors.confirmPassword ? "error" : ""
                  }`}
                  id="confirmPassword"
                  type="password"
                  placeholder="Confirm your password"
                  autoComplete="new-password"
                  value={formData.confirmPassword}
                  onChange={(e) =>
                    handleInputChange("confirmPassword", e.target.value)
                  }
                  onKeyPress={handleKeyPress}
                />
                {errors.confirmPassword && (
                  <span className="error-message">
                    {errors.confirmPassword}
                  </span>
                )}
              </div>

              <div className="checkbox-group">
                <input
                  className="checkbox-input"
                  id="agreeTerms"
                  type="checkbox"
                  checked={formData.agreeTerms}
                  onChange={(e) =>
                    handleInputChange("agreeTerms", e.target.checked)
                  }
                />
                <label className="checkbox-label" htmlFor="agreeTerms">
                  I agree to the{" "}
                  <span className="form-link">Terms of Service</span> and{" "}
                  <span className="form-link">Privacy Policy</span>
                </label>
              </div>
              {errors.agreeTerms && (
                <span className="error-message">{errors.agreeTerms}</span>
              )}

              <button
                type="submit"
                className={`btn btn-primary ${isLoading ? "loading" : ""}`}
                disabled={isLoading}
              >
                {isLoading
                  ? "Creating Account..."
                  : `Create ${
                      currentRole === "customer" ? "Customer" : "User"
                    } Account`}
              </button>

              <button
                type="button"
                className="btn btn-secondary"
                onClick={navigateToLogin}
              >
                Already have an account? Sign In
              </button>
            </form>
          </div>
        </div>

        {/* 3D Animation Canvas - Hidden but still running */}
        <div style={{ position: "absolute", left: "-9999px", top: "-9999px" }}>
          <div ref={canvasRef}></div>
        </div>
      </section>

      {/* Theme Toggle - Bottom Right Corner */}
      <div className="theme-toggle-container">
        <div
          className="swipe-toggle"
          onClick={handleThemeToggle}
          title="Toggle Theme"
        >
          <div className="toggle-slider">
            <span className="toggle-icon">{isDarkMode ? "🌙" : "☀️"}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignUp;