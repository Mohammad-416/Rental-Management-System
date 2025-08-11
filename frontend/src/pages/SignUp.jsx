import { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import {useNavigate} from 'react-router-dom';
import axios from 'axios';

const SignUp = () => {
  const navigate = useNavigate();
  const canvasRef = useRef(null);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    acceptTerms: false
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState({});

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
    let scene, camera, renderer, particles, animationId;

    const initThreeJS = () => {
      if (!canvasRef.current) return;

      // Scene setup
      scene = new THREE.Scene();
      camera = new THREE.PerspectiveCamera(75, 1, 0.1, 1000);
      renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
      renderer.setSize(400, 400);
      renderer.setClearColor(0x000000, 0);
      canvasRef.current.appendChild(renderer.domElement);

      // Create floating geometric shapes
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

      // Create particle field
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

        // Animate shapes
        shapes.forEach((shape, index) => {
          shape.rotation.x += 0.005 + index * 0.001;
          shape.rotation.y += 0.008 + index * 0.001;
          
          // Floating motion
          const time = Date.now() * 0.001;
          shape.position.y += Math.sin(time + index) * 0.002;
        });

        // Rotate particles
        if (particles) {
          particles.rotation.y += 0.001;
          particles.rotation.x += 0.0005;
        }

        renderer.render(scene, camera);
      };

      animate();
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
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.firstName.trim()) newErrors.firstName = 'First name is required';
    if (!formData.lastName.trim()) newErrors.lastName = 'Last name is required';
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email';
    }
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters';
    }
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }
    if (!formData.acceptTerms) {
      newErrors.acceptTerms = 'You must accept the terms and conditions';
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

  try {
    const csrfToken = getCookie("csrftoken"); // name should match your backend cookie key

    const payload = {
      username: "Mohammad",
      email: "admin@gmail.com",
      name: "Mohammad",
      password: "admin@123",
    };

    const res = await axios.post(
      "http://localhost:8000/api/auth/register/",
      payload,
      {
        headers: {
          "Content-Type": "application/json",
          "X-CSRFToken": csrfToken,
        },
        withCredentials: true, // send cookies
      }
    );

    console.log("Registration successful:", res.data);
    navigate('/home')
  } catch (error) {
    console.error(
      "Registration failed:",
      error.response?.data || error.message
    );
  }
};
  const navigateToLogin = () => {
    // Navigate to login page
    navigate('/login')
    console.log('Navigate to login');
  };

  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center p-4" style={{ fontFamily: 'Arial, sans-serif' }}>
      <style jsx="true">{`
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }

        .signup-container {
          display: flex;
          max-width: 1200px;
          width: 100%;
          min-height: 600px;
          background: linear-gradient(145deg, #1a1a1a, #0d0d0d);
          border-radius: 30px;
          border: 1px solid rgba(76, 205, 196, 0.2);
          box-shadow: 0 30px 60px rgba(0, 0, 0, 0.5);
          overflow: hidden;
          position: relative;
        }

        .signup-container::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          height: 2px;
          background: linear-gradient(90deg, #ff6b6b, #4ecdc4, #ff6b6b);
          animation: shimmer 3s linear infinite;
        }

        .visual-section {
          flex: 1;
          background: radial-gradient(ellipse at center, rgba(76, 205, 196, 0.15) 0%, rgba(0, 0, 0, 0.8) 70%);
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 3rem;
          position: relative;
        }

        .form-section {
          flex: 1;
          padding: 3rem;
          display: flex;
          flex-direction: column;
          justify-content: center;
        }

        .logo {
          font-size: 3rem;
          font-weight: bold;
          background: linear-gradient(45deg, #ff6b6b, #4ecdc4);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          margin-bottom: 1rem;
          text-align: center;
        }

        .visual-title {
          font-size: 2.5rem;
          font-weight: 900;
          background: linear-gradient(45deg, #fff, #4ecdc4);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          margin-bottom: 1rem;
          text-align: center;
          line-height: 1.1;
        }

        .visual-subtitle {
          color: #aaa;
          text-align: center;
          font-size: 1.1rem;
          margin-bottom: 2rem;
          line-height: 1.6;
        }

        .canvas-container {
          width: 400px;
          height: 400px;
          position: relative;
        }

        .form-title {
          font-size: 2rem;
          font-weight: bold;
          color: #fff;
          margin-bottom: 0.5rem;
        }

        .form-subtitle {
          color: #aaa;
          margin-bottom: 2rem;
          font-size: 1rem;
        }

        .form-group {
          margin-bottom: 1.5rem;
        }

        .form-row {
          display: flex;
          gap: 1rem;
        }

        .form-group label {
          display: block;
          margin-bottom: 0.5rem;
          color: #ccc;
          font-weight: 500;
        }

        .input-wrapper {
          position: relative;
        }

        .form-group input {
          width: 100%;
          padding: 12px 16px;
          background: rgba(255, 255, 255, 0.05);
          border: 2px solid rgba(76, 205, 196, 0.2);
          border-radius: 12px;
          color: #fff;
          font-size: 1rem;
          transition: all 0.3s ease;
          backdrop-filter: blur(10px);
        }

        .form-group input:focus {
          outline: none;
          border-color: #4ecdc4;
          background: rgba(76, 205, 196, 0.1);
          box-shadow: 0 0 20px rgba(76, 205, 196, 0.3);
        }

        .form-group input::placeholder {
          color: #666;
        }

        .password-toggle {
          position: absolute;
          right: 12px;
          top: 50%;
          transform: translateY(-50%);
          background: none;
          border: none;
          color: #4ecdc4;
          cursor: pointer;
          font-size: 1.1rem;
          padding: 4px;
        }

        .error-message {
          color: #ff6b6b;
          font-size: 0.875rem;
          margin-top: 0.5rem;
        }

        .checkbox-group {
          display: flex;
          align-items: flex-start;
          gap: 0.75rem;
          margin-bottom: 2rem;
        }

        .checkbox-group input[type="checkbox"] {
          width: auto;
          margin: 0;
          accent-color: #4ecdc4;
        }

        .checkbox-group label {
          margin: 0;
          color: #ccc;
          font-size: 0.9rem;
          line-height: 1.4;
        }

        .checkbox-group a {
          color: #4ecdc4;
          text-decoration: none;
        }

        .checkbox-group a:hover {
          text-decoration: underline;
        }

        .submit-btn {
          width: 100%;
          padding: 16px;
          background: linear-gradient(45deg, #ff6b6b, #4ecdc4);
          border: none;
          border-radius: 12px;
          color: #fff;
          font-size: 1.1rem;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s ease;
          box-shadow: 0 10px 30px rgba(76, 205, 196, 0.3);
          margin-bottom: 1.5rem;
        }

        .submit-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 15px 40px rgba(76, 205, 196, 0.5);
        }

        .submit-btn:disabled {
          opacity: 0.6;
          cursor: not-allowed;
          transform: none;
        }

        .login-link {
          text-align: center;
          color: #aaa;
        }

        .login-link button {
          background: none;
          border: none;
          color: #4ecdc4;
          text-decoration: underline;
          cursor: pointer;
          font-size: inherit;
        }

        .login-link button:hover {
          color: #fff;
        }

        .social-signup {
          margin-bottom: 2rem;
        }

        .social-btn {
          width: 100%;
          padding: 12px;
          border: 2px solid rgba(76, 205, 196, 0.2);
          border-radius: 12px;
          background: transparent;
          color: #fff;
          margin-bottom: 1rem;
          cursor: pointer;
          transition: all 0.3s ease;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
        }

        .social-btn:hover {
          border-color: #4ecdc4;
          background: rgba(76, 205, 196, 0.1);
        }

        .divider {
          display: flex;
          align-items: center;
          margin: 2rem 0;
          color: #666;
        }

        .divider::before,
        .divider::after {
          content: '';
          flex: 1;
          height: 1px;
          background: rgba(76, 205, 196, 0.2);
        }

        .divider span {
          padding: 0 1rem;
          font-size: 0.9rem;
        }

        @keyframes shimmer {
          0% { background-position: -200% center; }
          100% { background-position: 200% center; }
        }

        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .fade-in {
          animation: fadeInUp 0.8s ease forwards;
        }

        @media (max-width: 768px) {
          .signup-container {
            flex-direction: column;
            margin: 1rem;
          }

          .visual-section {
            padding: 2rem;
          }

          .form-section {
            padding: 2rem;
          }

          .canvas-container {
            width: 250px;
            height: 250px;
          }

          .visual-title {
            font-size: 2rem;
          }

          .form-row {
            flex-direction: column;
            gap: 0;
          }

          .form-row .form-group {
            margin-bottom: 1.5rem;
          }
        }
      `}</style>

      <div className="signup-container fade-in">
        {/* Visual Section */}
        <div className="visual-section">
          <div className="logo">NEXUS</div>
          <h2 className="visual-title">Join the Future</h2>
          <p className="visual-subtitle">
            Experience revolutionary performance technology and connect with thousands of professionals worldwide.
          </p>
          <div className="canvas-container" ref={canvasRef}></div>
        </div>

        {/* Form Section */}
        <div className="form-section">
          <h1 className="form-title">Create Account</h1>
          <p className="form-subtitle">Start your journey with NEXUS Pro today</p>

          {/* Social Signup */}
          <div className="social-signup">
            <a href='http://localhost:8000/accounts/login/google-oauth2' className="social-btn border-none">
              <span>🔵</span>
              Continue with Google
            </a>
            <button className="social-btn">
              <span>📘</span>
              Continue with Facebook
            </button>
          </div>

          <div className="divider">
            <span>or sign up with email</span>
          </div>

          {/* Signup Form */}
          <form onSubmit={handleSubmit}>
            <div className="form-row">
              <div className="form-group" style={{flex: 1}}>
                <label htmlFor="firstName">First Name</label>
                <input
                  type="text"
                  id="firstName"
                  name="firstName"
                  placeholder="John"
                  value={formData.firstName}
                  onChange={handleInputChange}
                />
                {errors.firstName && <div className="error-message">{errors.firstName}</div>}
              </div>
              <div className="form-group" style={{flex: 1}}>
                <label htmlFor="lastName">Last Name</label>
                <input
                  type="text"
                  id="lastName"
                  name="lastName"
                  placeholder="Doe"
                  value={formData.lastName}
                  onChange={handleInputChange}
                />
                {errors.lastName && <div className="error-message">{errors.lastName}</div>}
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="email">Email Address</label>
              <input
                type="email"
                id="email"
                name="email"
                placeholder="john@example.com"
                value={formData.email}
                onChange={handleInputChange}
              />
              {errors.email && <div className="error-message">{errors.email}</div>}
            </div>

            <div className="form-group">
              <label htmlFor="password">Password</label>
              <div className="input-wrapper">
                <input
                  type={showPassword ? "text" : "password"}
                  id="password"
                  name="password"
                  placeholder="Enter your password"
                  value={formData.password}
                  onChange={handleInputChange}
                />
                <button
                  type="button"
                  className="password-toggle"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? '🙈' : '👁'}
                </button>
              </div>
              {errors.password && <div className="error-message">{errors.password}</div>}
            </div>

            <div className="form-group">
              <label htmlFor="confirmPassword">Confirm Password</label>
              <div className="input-wrapper">
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  id="confirmPassword"
                  name="confirmPassword"
                  placeholder="Confirm your password"
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                />
                <button
                  type="button"
                  className="password-toggle"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  {showConfirmPassword ? '🙈' : '👁'}
                </button>
              </div>
              {errors.confirmPassword && <div className="error-message">{errors.confirmPassword}</div>}
            </div>

            <div className="checkbox-group">
              <input
                type="checkbox"
                id="acceptTerms"
                name="acceptTerms"
                checked={formData.acceptTerms}
                onChange={handleInputChange}
              />
              <label htmlFor="acceptTerms">
                I agree to the <a href="#">Terms of Service</a> and <a href="#">Privacy Policy</a>
              </label>
            </div>
            {errors.acceptTerms && <div className="error-message">{errors.acceptTerms}</div>}

            <button type="submit" className="submit-btn">
              Create Account
            </button>

            <div className="login-link">
              Already have an account? <button type="button" onClick={navigateToLogin}>Sign in here</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default SignUp;