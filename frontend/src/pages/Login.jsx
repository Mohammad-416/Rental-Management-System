import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import axios from 'axios';

const Login = () => {
  const canvasRef = useRef(null);
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
      renderer.setClearColor(0x000000, 0);
      canvasRef.current.appendChild(renderer.domElement);

      // Create main product cube with glow effect
      const geometry = new THREE.BoxGeometry(1.5, 1.5, 1.5);
      const material = new THREE.MeshBasicMaterial({
        color: 0x4ecdc4,
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
        color: 0x4ecdc4,
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
    } catch (error) {
      console.error("Login failed:", error.response?.data || error.message);
    }
  };


  return (
    <div className="bg-black text-white overflow-x-hidden min-h-screen" style={{ fontFamily: 'Arial, sans-serif', lineHeight: '1.6' }}>
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
          background: rgba(0, 0, 0, 0.9);
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
          background: linear-gradient(45deg, #ff6b6b, #4ecdc4);
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
          color: #fff;
          text-decoration: none;
          transition: color 0.3s ease;
          position: relative;
          cursor: pointer;
        }

        .nav-links a:hover {
          color: #4ecdc4;
        }

        .nav-links a::after {
          content: '';
          position: absolute;
          bottom: -5px;
          left: 0;
          width: 0;
          height: 2px;
          background: linear-gradient(45deg, #ff6b6b, #4ecdc4);
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
          background: radial-gradient(ellipse at center, rgba(76, 205, 196, 0.1) 0%, rgba(0, 0, 0, 1) 70%);
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
          background: linear-gradient(45deg, #fff, #4ecdc4);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          line-height: 1.1;
        }

        .login-subtitle {
          font-size: 1.2rem;
          color: #ccc;
          margin-bottom: 3rem;
        }

        .login-form {
          background: linear-gradient(145deg, #1a1a1a, #0d0d0d);
          padding: 3rem;
          border-radius: 20px;
          border: 1px solid rgba(76, 205, 196, 0.2);
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
          background: linear-gradient(45deg, transparent, rgba(76, 205, 196, 0.05), transparent);
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
          color: #fff;
          font-weight: 500;
        }

        .form-input {
          width: 100%;
          padding: 15px 20px;
          background: rgba(0, 0, 0, 0.5);
          border: 2px solid rgba(76, 205, 196, 0.3);
          border-radius: 10px;
          color: #fff;
          font-size: 1rem;
          transition: all 0.3s ease;
        }

        .form-input:focus {
          outline: none;
          border-color: #4ecdc4;
          box-shadow: 0 0 20px rgba(76, 205, 196, 0.2);
        }

        .form-input::placeholder {
          color: #aaa;
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
          color: #ccc;
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
          background: linear-gradient(45deg, #ff6b6b, #4ecdc4);
          color: #fff;
          box-shadow: 0 10px 30px rgba(76, 205, 196, 0.3);
          margin-bottom: 1rem;
        }

        .btn-primary:hover {
          transform: translateY(-3px);
          box-shadow: 0 15px 40px rgba(76, 205, 196, 0.5);
        }

        .btn-secondary {
          background: transparent;
          color: #fff;
          border: 2px solid #4ecdc4;
        }

        .btn-secondary:hover {
          background: #4ecdc4;
          color: #000;
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
          color: #4ecdc4;
          text-decoration: none;
          font-size: 0.9rem;
          transition: color 0.3s ease;
        }

        .form-link:hover {
          color: #ff6b6b;
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
          background: rgba(76, 205, 196, 0.3);
        }

        .divider-text {
          margin: 0 1rem;
          color: #aaa;
          font-size: 0.9rem;
        }

        /* 3D Canvas */
        .threejs-canvas {
          flex: 1;
          display: flex;
          justify-content: center;
          align-items: center;
          max-width: 400px;
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
          background: rgba(0, 0, 0, 0.5);
          border: 2px solid rgba(76, 205, 196, 0.3);
          border-radius: 10px;
          color: #fff;
          font-size: 1.2rem;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .social-btn:hover {
          border-color: #4ecdc4;
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
          border: 2px solid #4ecdc4;
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
        .threejs-canvas {
          animation: float 6s ease-in-out infinite;
        }

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
          <div className="logo">NEXUS</div>
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
                <div className="social-btn" title="Login with Google">
                  G
                </div>
                <div className="social-btn" title="Login with Facebook">
                  F
                </div>
                <div className="social-btn" title="Login with Twitter">
                  T
                </div>
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

              <div className="btn btn-secondary">
                Create Account
              </div>

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