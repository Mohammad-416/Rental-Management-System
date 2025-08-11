import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import axios from 'axios';
import { Link } from "react-router-dom";
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const canvasRef = useRef(null);
  const navigate = useNavigate();
  const [isLoaded, setIsLoaded] = useState(false);
  const [formData, setFormData] = useState({
    username: '',
    password: '',
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

  useEffect(() => {
    let scene, camera, renderer, cube, particles, animationId;

    const initThreeJS = () => {
      if (!canvasRef.current) return;

      // Scene setup
      scene = new THREE.Scene();
      camera = new THREE.PerspectiveCamera(75, 1, 0.1, 1000);
      renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
      renderer.setSize(400, 400);
      renderer.setClearColor(0xffffff, 0); // Transparent background for white page
      canvasRef.current.appendChild(renderer.domElement);

      // Create main product cube with glow effect
      const geometry = new THREE.BoxGeometry(1.5, 1.5, 1.5);
      const material = new THREE.MeshBasicMaterial({
        color: 0x007bff, // Changed to blue consistent with theme on white bg
        wireframe: true,
        transparent: true,
        opacity: 0.8
      });
      cube = new THREE.Mesh(geometry, material);
      scene.add(cube);

      // Add inner solid cube
      const innerGeometry = new THREE.BoxGeometry(1, 1, 1);
      const innerMaterial = new THREE.MeshBasicMaterial({
        color: 0xff6b6b,
        transparent: true,
        opacity: 0.6
      });
      const innerCube = new THREE.Mesh(innerGeometry, innerMaterial);
      cube.add(innerCube);

      // Create particle system
      const particleGeometry = new THREE.BufferGeometry();
      const particleCount = 80;
      const positions = new Float32Array(particleCount * 3);

      for (let i = 0; i < particleCount * 3; i++) {
        positions[i] = (Math.random() - 0.5) * 8;
      }

      particleGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
      const particleMaterial = new THREE.PointsMaterial({
        color: 0x007bff,
        size: 0.02,
        transparent: true,
        opacity: 0.6
      });

      particles = new THREE.Points(particleGeometry, particleMaterial);
      scene.add(particles);

      camera.position.z = 4;

      const animate = () => {
        animationId = requestAnimationFrame(animate);

        // Rotate the main cube
        if (cube) {
          cube.rotation.x += 0.01;
          cube.rotation.y += 0.01;

          // Pulse effect
          const time = Date.now() * 0.001;
          cube.scale.x = 1 + Math.sin(time) * 0.1;
          cube.scale.y = 1 + Math.sin(time) * 0.1;
          cube.scale.z = 1 + Math.sin(time) * 0.1;
        }

        // Rotate particles
        if (particles) {
          particles.rotation.y += 0.002;
        }

        renderer.render(scene, camera);
      };

      animate();
      setIsLoaded(true);
    };

    initThreeJS();

    // Cleanup
    return () => {
      if (animationId) {
        cancelAnimationFrame(animationId);
      }
      if (renderer) {
        renderer.dispose();
      }
    };
  }, []);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
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

    const csrfToken = getCookie("csrftoken"); // name must match the backend cookie name

    try {
      const response = await axios.post(
        "http://localhost:8000/api/auth/login/",
        {
          username: formData.username,
          password: formData.password
        },
        {
          headers: {
            "Content-Type": "application/json",
            "X-CSRFToken": csrfToken
          },
          withCredentials: true
        }
      );

      console.log("Login successful:", response.data);
      navigate('/home');
    } catch (error) {
      console.error("Login failed:", error.response?.data || error.message);
    }
  };

  // Function for social login redirects
  const handleSocialSignup = (provider) => {
    let url = "";
    switch (provider) {
      case "Facebook":
        url = "http://localhost:8000/accounts/login/facebook/";
        break;
      case "Apple":
        url = "http://localhost:8000/accounts/login/apple/";
        break;
      default:
        url = "/";
    }
    window.location.href = url;
  };

  return (
    <div className="text-dark overflow-x-hidden min-h-screen" style={{ fontFamily: 'Arial, sans-serif', lineHeight: '1.6', backgroundColor: '#ffffff' }}>
      <style dangerouslySetInnerHTML={{__html: `
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }

        /* Navigation */
        .navbar {
          position: fixed;
          top: 0;
          width: 100%;
          z-index: 1000;
          padding: 20px 5%;
          background: rgba(255, 255, 255, 0.9);
          backdrop-filter: blur(10px);
          transition: all 0.3s ease;
        }

        .nav-container {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .logo {
          font-size: 1.8rem;
          font-weight: bold;
          background: linear-gradient(45deg, #007bff, #000000);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        .nav-links {
          display: flex;
          list-style: none;
          gap: 2rem;
        }

        .nav-links a {
          color: #000;
          text-decoration: none;
          transition: color 0.3s ease;
          position: relative;
          cursor: pointer;
        }

        .nav-links a:hover {
          color: #007bff;
        }

        .nav-links a::after {
          content: '';
          position: absolute;
          bottom: -5px;
          left: 0;
          width: 0;
          height: 2px;
          background: linear-gradient(45deg, #007bff, #000000);
          transition: width 0.3s ease;
        }

        .nav-links a:hover::after {
          width: 100%;
        }

        /* Login Container */
        .login-container {
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 100px 5% 50px;
          position: relative;
          background: radial-gradient(ellipse at center, rgba(0, 123, 255, 0.1) 0%, #ffffff 70%);
        }

        .login-content {
          display: flex;
          align-items: center;
          justify-content: space-between;
          max-width: 1200px;
          width: 100%;
          gap: 4rem;
        }

        .login-form-section {
          flex: 1;
          max-width: 500px;
        }

        .login-title {
          font-size: 3rem;
          font-weight: 900;
          margin-bottom: 1rem;
          background: linear-gradient(45deg, #000, #007bff);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          line-height: 1.1;
        }

        .login-subtitle {
          font-size: 1.2rem;
          color: #333;
          margin-bottom: 3rem;
        }

        .login-form {
          background: linear-gradient(145deg, #f9f9f9, #e6e6e6);
          padding: 3rem;
          border-radius: 20px;
          border: 1px solid rgba(0, 123, 255, 0.4);
          position: relative;
          overflow: hidden;
        }

        .login-form::before {
          content: '';
          position: absolute;
          top: -50%;
          left: -50%;
          width: 200%;
          height: 200%;
          background: linear-gradient(45deg, transparent, rgba(0, 123, 255, 0.1), transparent);
          transform: rotate(45deg);
          opacity: 1;
        }

        .form-group {
          margin-bottom: 1.5rem;
          position: relative;
          z-index: 10;
        }

        .form-label {
          display: block;
          margin-bottom: 0.5rem;
          color: #000;
          font-weight: 500;
        }

        .form-input {
          width: 100%;
          padding: 15px 20px;
          background: #fff;
          border: 2px solid rgba(0, 123, 255, 0.4);
          border-radius: 10px;
          color: #000;
          font-size: 1rem;
          transition: all 0.3s ease;
        }

        .form-input:focus {
          outline: none;
          border-color: #007bff;
          box-shadow: 0 0 20px rgba(0, 123, 255, 0.3);
        }

        .form-input::placeholder {
          color: #666;
        }

        .checkbox-group {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          margin-bottom: 2rem;
          position: relative;
          z-index: 10;
        }

        .checkbox-input {
          width: 18px;
          height: 18px;
          cursor: pointer;
          position: relative;
        }

        .checkbox-label {
          color: #444;
          cursor: pointer;
          font-size: 0.9rem;
        }

        .btn {
          padding: 15px 30px;
          border: none;
          border-radius: 50px;
          font-size: 1rem;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s ease;
          text-decoration: none;
          display: inline-block;
          width: 100%;
          text-align: center;
          position: relative;
          z-index: 10;
        }

        .btn-primary {
          background: linear-gradient(45deg, #007bff, #0056b3);
          color: #fff;
          box-shadow: 0 10px 30px rgba(0, 123, 255, 0.4);
          margin-bottom: 1rem;
        }

        .btn-primary:hover {
          transform: translateY(-3px);
          box-shadow: 0 15px 40px rgba(0, 123, 255, 0.6);
        }

        .btn-secondary {
          background: transparent;
          color: #007bff;R
          border: 2px solid #007bff;
        }

        .btn-secondary:hover {
          background: #007bff;
          color: #fff;
          transform: translateY(-3px);
        }

        .form-links {
          display: flex;
          justify-content: space-between;
          margin-top: 1.5rem;
          position: relative;
          z-index: 10;
        }

        .form-link {
          color: #007bff;
          text-decoration: none;
          font-size: 0.9rem;
          transition: color 0.3s ease;
        }

        .form-link:hover {
          color: #0056b3;
        }

        .divider {
          display: flex;
          align-items: center;
          margin: 1.5rem 0;
          position: relative;
          z-index: 10;
        }

        .divider::before,
        .divider::after {
          content: '';
          flex: 1;
          height: 1px;
          background: rgba(0, 123, 255, 0.3);
        }

        .divider-text {
          margin: 0 1rem;
          color: #666;
          font-size: 0.9rem;
        }

        /* 3D Canvas */
        .threejs-canvas {
          flex: 1;
          display: flex;
          justify-content: center;
          align-items: center;
          max-width: 400px;
          animation: float 6s ease-in-out infinite;
        }

        /* Social Login */
        .social-login {
          display: flex;
          gap: 1rem;
          margin-bottom: 1.5rem;
          position: relative;
          z-index: 10;
        }

        .social-btn {
          flex: 1;
          padding: 12px;
          background: #f0f0f0;
          border: 2px solid rgba(0, 123, 255, 0.3);
          border-radius: 10px;
          color: #007bff;
          font-size: 1.2rem;
          cursor: pointer;
          transition: all 0.3s ease;
          display: flex;
          justify-content: center;
          align-items: center;
        }

        .social-btn:hover {
          border-color: #0056b3;
          background: #e6f0ff;
          color: #0056b3;
          transform: translateY(-2px);
        }

        /* Responsive Design */
        @media (max-width: 768px) {
          .login-content {
            flex-direction: column;
            gap: 2rem;
            text-align: center;
          }

          .login-title {
            font-size: 2.5rem;
          }

          .login-form {
            padding: 2rem;
          }

          .nav-links {
            display: none;
          }

          .threejs-canvas {
            order: -1;
            max-width: 300px;
          }
        }

        @media (max-width: 480px) {
          .login-container {
            padding: 80px 3% 30px;
          }

          .login-title {
            font-size: 2rem;
          }

          .login-form {
            padding: 1.5rem;
          }

          .social-login {
            flex-direction: column;
          }

          .form-links {
            flex-direction: column;
            gap: 1rem;
            text-align: center;
          }
        }

        /* Loading Animation */
        .loading-spinner {
          display: inline-block;
          width: 20px;
          height: 20px;
          border: 2px solid #007bff;
          border-radius: 50%;
          border-top-color: transparent;
          animation: spin 1s ease-in-out infinite;
        }

        @keyframes spin {
          to {
            transform: rotate(360deg);
          }
        }

        /* Floating Animation for Canvas */
        @keyframes float {
          0%, 100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-20px);
          }
        }
      `}} />

      {/* Navigation */}
      <nav className="navbar">
        <div className="nav-container">
          <div className="logo">RENTALHUB</div>
          <ul className="nav-links">
            <li><a href="#home">Home</a></li>
            <li><a href="#features">Features</a></li>
            <li><a href="#pricing">Pricing</a></li>
            <li><a href="#contact">Contact</a></li>
          </ul>
        </div>
      </nav>

      {/* Main Login Section */}
      <div className="login-container">
        <div className="login-content">
          <div className="login-form-section">
            <h1 className="login-title">Welcome Back</h1>
            <p className="login-subtitle">
              Sign in to access your Nexus dashboard and continue your journey.
            </p>

            <div className="login-form">
              {/* Social Login */}
              <div className="social-login">
                <button
                  type="button"
                  className="social-btn"
                  title="Continue with Google"
                  onClick={() => window.location.href = 'http://localhost:8000/accounts/login/google-oauth2'}
                >
                  {/* Google SVG */}
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 48 48">
                    <path fill="#4285F4" d="M24 9.5c3.15 0 5.95 1.08 8.18 2.85l6.07-6.07C34.54 2.43 29.64 0 24 0 14.64 0 6.4 5.52 2.54 13.5l7.17 5.57C11.88 13.03 17.52 9.5 24 9.5z" />
                    <path fill="#34A853" d="M46.5 24c0-1.32-.12-2.59-.33-3.82H24v7.64h12.68c-.54 2.9-2.14 5.36-4.54 7.02l7.18 5.57C43.6 35.84 46.5 30.29 46.5 24z" />
                    <path fill="#FBBC05" d="M9.71 28.93c-.44-1.29-.71-2.66-.71-4.08 0-1.42.27-2.79.71-4.08l-7.17-5.57C1.03 18.41 0 21.09 0 24c0 2.91 1.03 5.59 2.54 7.79l7.17-5.57z" />
                    <path fill="#EA4335" d="M24 48c6.48 0 11.88-2.13 15.84-5.79l-7.18-5.57C30.04 38.61 27.15 39.5 24 39.5c-6.48 0-12.12-3.53-14.85-8.57l-7.17 5.57C6.4 42.48 14.64 48 24 48z" />
                  </svg>
                </button>

                <button
                  type="button"
                  className="social-btn"
                  title="Continue with Facebook"
                  onClick={() => handleSocialSignup('Facebook')}
                >
                  {/* Facebook SVG */}
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 48 48">
                    <path fill="#1877F2" d="M48 24C48 10.74 37.26 0 24 0S0 10.74 0 24c0 11.99 8.77 21.91 20.26 23.78v-16.8h-6.1v-6.98h6.1v-5.3c0-6.03 3.58-9.35 9.06-9.35 2.63 0 5.38.47 5.38.47v5.9h-3.03c-2.99 0-3.92 1.86-3.92 3.77v4.51h6.67l-1.07 6.98h-5.6v16.8C39.23 45.91 48 35.99 48 24z" />
                  </svg>
                </button>

                <button
                  type="button"
                  className="social-btn"
                  title="Continue with Apple"
                  onClick={() => handleSocialSignup('Apple')}
                >
                  {/* Apple SVG */}
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 48 48">
                    <path fill="#000" d="M33.65 24.13c-.04-4.17 3.41-6.19 3.56-6.28-1.94-2.85-4.94-3.24-6-3.28-2.55-.26-4.99 1.5-6.29 1.5-1.3 0-3.31-1.46-5.45-1.42-2.8.04-5.4 1.63-6.84 4.15-2.91 5.06-.74 12.57 2.09 16.68 1.39 2 3.05 4.23 5.23 4.15 2.09-.08 2.88-1.34 5.41-1.34 2.53 0 3.23 1.34 5.44 1.29 2.24-.04 3.64-2.03 5-4.05 1.57-2.29 2.21-4.51 2.25-4.62-.05-.02-4.33-1.66-4.4-6.08zM28.2 10.15c1.17-1.43 1.95-3.4 1.73-5.38-1.68.07-3.72 1.12-4.91 2.55-1.08 1.26-2.03 3.27-1.78 5.2 1.88.15 3.8-.96 4.96-2.37z" />
                  </svg>
                </button>
              </div>

              <div className="divider">
                <span className="divider-text">or continue with email</span>
              </div>

              {/* Username Field */}
              <div className="form-group">
                <label className="form-label" htmlFor="username">
                  Username
                </label>
                <input
                  type="text"
                  id="username"
                  name="username"
                  className="form-input"
                  placeholder="Enter your username"
                  value={formData.username}
                  onChange={handleInputChange}
                />
              </div>

              {/* Password Field */}
              <div className="form-group">
                <label className="form-label" htmlFor="password">
                  Password
                </label>
                <input
                  type="password"
                  id="password"
                  name="password"
                  className="form-input"
                  placeholder="Enter your password"
                  value={formData.password}
                  onChange={handleInputChange}
                />
              </div>

              {/* Remember Me Checkbox */}
              <div className="checkbox-group">
                <input
                  type="checkbox"
                  id="rememberMe"
                  name="rememberMe"
                  className="checkbox-input"
                  checked={formData.rememberMe}
                  onChange={handleInputChange}
                />
                <label htmlFor="rememberMe" className="checkbox-label">
                  Remember me for 30 days
                </label>
              </div>

              {/* Submit Button */}
              <div className="btn btn-primary" onClick={handleSubmit}>
                Sign In
              </div>

              <Link to='/signup' className="btn btn-secondary">
                Create Account
              </Link>

              {/* Form Links */}
              <div className="form-links">
                <span className="form-link">
                  Forgot Password?
                </span>
                <span className="form-link">
                  Need Help?
                </span>
              </div>
            </div>
          </div>

          {/* 3D Canvas */}
          <div className="threejs-canvas">
            <div ref={canvasRef} style={{ opacity: isLoaded ? 1 : 0, transition: 'opacity 1s ease' }} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
