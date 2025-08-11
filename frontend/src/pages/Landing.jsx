import { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import {Link} from 'react-router-dom';
import axios from 'axios';

const Landing = () => {
  const canvasRef = useRef(null);
  const sceneRef = useRef(null);
  const [isLoaded, setIsLoaded] = useState(false);

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
      renderer.setSize(500, 500);
      renderer.setClearColor(0x000000, 0);
      canvasRef.current.appendChild(renderer.domElement);

      // Create main product cube with glow effect
      const geometry = new THREE.BoxGeometry(2, 2, 2);
      const material = new THREE.MeshBasicMaterial({
        color: 0x4ecdc4,
        wireframe: true,
        transparent: true,
        opacity: 0.8
      });
      cube = new THREE.Mesh(geometry, material);
      scene.add(cube);

      // Add inner solid cube
      const innerGeometry = new THREE.BoxGeometry(1.5, 1.5, 1.5);
      const innerMaterial = new THREE.MeshBasicMaterial({
        color: 0xff6b6b,
        transparent: true,
        opacity: 0.6
      });
      const innerCube = new THREE.Mesh(innerGeometry, innerMaterial);
      cube.add(innerCube);

      // Create particle system
      const particleGeometry = new THREE.BufferGeometry();
      const particleCount = 100;
      const positions = new Float32Array(particleCount * 3);

      for (let i = 0; i < particleCount * 3; i++) {
        positions[i] = (Math.random() - 0.5) * 10;
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

      camera.position.z = 5;

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

  // Scroll animations effect
  useEffect(() => {
    const handleScroll = () => {
      const elements = document.querySelectorAll('.fade-in');
      
      elements.forEach(el => {
        const elementTop = el.getBoundingClientRect().top;
        const elementVisible = 150;
        
        if (elementTop < window.innerHeight - elementVisible) {
          el.classList.add('visible');
        }
      });

      // Navbar scroll effect
      const navbar = document.querySelector('.navbar');
      if (navbar) {
        if (window.scrollY > 50) {
          navbar.style.background = 'rgba(0, 0, 0, 0.95)';
        } else {
          navbar.style.background = 'rgba(0, 0, 0, 0.9)';
        }
      }
    };

    handleScroll();
    window.addEventListener('scroll', handleScroll);
    
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const smoothScroll = (targetId) => {
    const targetSection = document.querySelector(targetId);
    if (targetSection) {
      targetSection.scrollIntoView({
        behavior: 'smooth'
      });
    }
  };

  const features = [
    {
      icon: '⚡',
      title: 'Lightning Fast',
      description: 'Experience unprecedented speed with our advanced processing technology. 10x faster than conventional alternatives.'
    },
    {
      icon: '🛡',
      title: 'Military Grade',
      description: 'Built to withstand extreme conditions with military-grade materials and rigorous testing standards.'
    },
    {
      icon: '🎯',
      title: 'Precision Engineered',
      description: 'Every component crafted with microscopic precision for optimal performance and longevity.'
    },
    {
      icon: '🔋',
      title: 'Extended Battery',
      description: 'Up to 72 hours of continuous operation with our revolutionary power management system.'
    },
    {
      icon: '📡',
      title: 'Smart Connectivity',
      description: 'Seamlessly connect to all your devices with advanced wireless technology and instant sync.'
    },
    {
      icon: '🎨',
      title: 'Premium Design',
      description: 'Sleek, modern aesthetics combined with ergonomic design for the ultimate user experience.'
    }
  ];

  const stats = [
    { number: '50K+', label: 'Happy Customers' },
    { number: '99.9%', label: 'Reliability Rate' },
    { number: '24/7', label: 'Support Available' },
    { number: '5★', label: 'Average Rating' }
  ];

  return (
    <div className="bg-black text-white overflow-x-hidden" style={{ fontFamily: 'Arial, sans-serif', lineHeight: '1.6' }}>
      <style jsx="true">{`
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

        /* Hero Section */
        .hero {
          height: 100vh;
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 0 5%;
          position: relative;
          background: radial-gradient(ellipse at center, rgba(76, 205, 196, 0.1) 0%, rgba(0, 0, 0, 1) 70%);
        }

        .hero-content {
          flex: 1;
          max-width: 600px;
          z-index: 10;
        }

        .hero-title {
          font-size: 4rem;
          font-weight: 900;
          margin-bottom: 1rem;
          background: linear-gradient(45deg, #fff, #4ecdc4);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          line-height: 1.1;
        }

        .hero-subtitle {
          font-size: 1.3rem;
          color: #ccc;
          margin-bottom: 2rem;
          opacity: 0;
          animation: fadeInUp 1s ease 0.5s forwards;
        }

        .hero-description {
          font-size: 1.1rem;
          color: #aaa;
          margin-bottom: 3rem;
          opacity: 0;
          animation: fadeInUp 1s ease 0.7s forwards;
        }

        .cta-buttons {
          display: flex;
          gap: 1rem;
          flex-wrap: wrap;
          opacity: 0;
          animation: fadeInUp 1s ease 0.9s forwards;
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
        }

        .btn-primary {
          background: linear-gradient(45deg, #ff6b6b, #4ecdc4);
          color: #fff;
          box-shadow: 0 10px 30px rgba(76, 205, 196, 0.3);
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

        /* 3D Canvas */
        .threejs-canvas {
          position: absolute;
          right: 5%;
          top: 50%;
          transform: translateY(-50%);
          width: 500px;
          height: 500px;
          z-index: 5;
        }

        /* Features Section */
        .features {
          padding: 100px 5%;
          background: linear-gradient(180deg, #000 0%, #0a0a0a 100%);
        }

        .section-title {
          text-align: center;
          font-size: 3rem;
          margin-bottom: 3rem;
          background: linear-gradient(45deg, #fff, #4ecdc4);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        .features-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
          gap: 2rem;
          margin-top: 4rem;
        }

        .feature-card {
          background: linear-gradient(145deg, #1a1a1a, #0d0d0d);
          padding: 2rem;
          border-radius: 20px;
          border: 1px solid rgba(76, 205, 196, 0.2);
          transition: all 0.3s ease;
          position: relative;
          overflow: hidden;
        }

        .feature-card::before {
          content: '';
          position: absolute;
          top: -50%;
          left: -50%;
          width: 200%;
          height: 200%;
          background: linear-gradient(45deg, transparent, rgba(76, 205, 196, 0.1), transparent);
          transform: rotate(45deg);
          transition: all 0.3s ease;
          opacity: 0;
        }

        .feature-card:hover::before {
          opacity: 1;
          animation: shimmer 2s linear infinite;
        }

        .feature-card:hover {
          transform: translateY(-10px);
          box-shadow: 0 20px 40px rgba(76, 205, 196, 0.2);
          border-color: #4ecdc4;
        }

        .feature-icon {
          width: 60px;
          height: 60px;
          background: linear-gradient(45deg, #ff6b6b, #4ecdc4);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          margin-bottom: 1rem;
          font-size: 1.5rem;
        }

        .feature-title {
          font-size: 1.3rem;
          margin-bottom: 1rem;
          color: #fff;
        }

        .feature-description {
          color: #aaa;
          line-height: 1.6;
        }

        /* Stats Section */
        .stats {
          padding: 80px 5%;
          background: #000;
          text-align: center;
        }

        .stats-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 2rem;
          margin-top: 3rem;
        }

        .stat-item {
          padding: 2rem;
        }

        .stat-number {
          font-size: 3rem;
          font-weight: bold;
          background: linear-gradient(45deg, #ff6b6b, #4ecdc4);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          margin-bottom: 0.5rem;
        }

        .stat-label {
          color: #aaa;
          font-size: 1.1rem;
        }

        /* CTA Section */
        .cta-section {
          padding: 100px 5%;
          background: linear-gradient(45deg, #1a1a1a, #0a0a0a);
          text-align: center;
        }

        .cta-title {
          font-size: 2.5rem;
          margin-bottom: 1rem;
          color: #fff;
        }

        .cta-description {
          font-size: 1.2rem;
          color: #aaa;
          margin-bottom: 2rem;
          max-width: 600px;
          margin-left: auto;
          margin-right: auto;
        }

        /* Footer */
        .footer {
          padding: 40px 5%;
          background: #000;
          border-top: 1px solid #333;
          text-align: center;
        }

        .footer-content {
          display: flex;
          justify-content: space-between;
          align-items: center;
          flex-wrap: wrap;
          gap: 1rem;
        }

        .social-links {
          display: flex;
          gap: 1rem;
        }

        .social-links a {
          color: #aaa;
          font-size: 1.2rem;
          transition: color 0.3s ease;
          cursor: pointer;
        }

        .social-links a:hover {
          color: #4ecdc4;
        }

        /* Animations */
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

        @keyframes shimmer {
          0% { transform: translateX(-100%) translateY(-100%) rotate(45deg); }
          100% { transform: translateX(100%) translateY(100%) rotate(45deg); }
        }

        @keyframes float {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-10px); }
        }

        /* Scroll animations */
        .fade-in {
          opacity: 0;
          transform: translateY(30px);
          transition: all 0.8s ease;
        }

        .fade-in.visible {
          opacity: 1;
          transform: translateY(0);
        }

        /* Responsive Design */
        @media (max-width: 768px) {
          .hero {
            flex-direction: column;
            text-align: center;
            padding: 100px 5% 50px;
          }

          .hero-title {
            font-size: 2.5rem;
          }

          .threejs-canvas {
            position: relative;
            right: auto;
            top: auto;
            transform: none;
            width: 300px;
            height: 300px;
            margin-top: 2rem;
          }

          .nav-links {
            display: none;
          }

          .section-title {
            font-size: 2rem;
          }

          .features-grid {
            grid-template-columns: 1fr;
          }

          .stats-grid {
            grid-template-columns: repeat(2, 1fr);
          }
        }
      `}</style>

      {/* Navigation */}
      <nav className="navbar">
        <div className="nav-container">
          <div className="logo">NEXUS</div>
          <ul className="nav-links">
            <li><a onClick={() => smoothScroll('#home')}>Home</a></li>
            <li><a onClick={() => smoothScroll('#features')}>Features</a></li>
            <li><a onClick={() => smoothScroll('#specs')}>Specs</a></li>
            <li><a onClick={() => smoothScroll('#contact')}>Contact</a></li>
          </ul>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="hero" id="home">
        <div className="hero-content">
          <h1 className="hero-title">NEXUS Pro</h1>
          <h2 className="hero-subtitle">Revolutionary Performance Technology</h2>
          <p className="hero-description">
            Experience the future of innovation with our cutting-edge product. Designed for professionals who demand excellence and reliability in every detail.
          </p>
          <div className="cta-buttons">
            <a href="#" className="btn btn-primary">Order Now - $299</a>
            <Link to="signup" className="btn btn-secondary">Get Started</Link>
          </div>
        </div>
        <div className="threejs-canvas" ref={canvasRef}></div>
      </section>

      {/* Features Section */}
      <section className="features fade-in" id="features">
        <h2 className="section-title">Exceptional Features</h2>
        <div className="features-grid">
          {features.map((feature, index) => (
            <div key={index} className="feature-card">
              <div className="feature-icon">{feature.icon}</div>
              <h3 className="feature-title">{feature.title}</h3>
              <p className="feature-description">{feature.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Stats Section */}
      <section className="stats fade-in" id="specs">
        <h2 className="section-title">Proven Excellence</h2>
        <div className="stats-grid">
          {stats.map((stat, index) => (
            <div key={index} className="stat-item">
              <div className="stat-number">{stat.number}</div>
              <div className="stat-label">{stat.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta-section fade-in" id="contact">
        <h2 className="cta-title">Ready to Experience the Future?</h2>
        <p className="cta-description">
          Join thousands of professionals who have already transformed their workflow with NEXUS Pro. 
          Order now and get free shipping plus a 30-day money-back guarantee.
        </p>
        <div className="cta-buttons">
          <a href="#" className="btn btn-primary">Order Now - $299</a>
          <a href="#" className="btn btn-secondary">Request Demo</a>
        </div>
      </section>

      {/* Footer */}
      <footer className="footer">
        <div className="footer-content">
          <div className="logo">NEXUS</div>
          <div>© 2025 NEXUS Technologies. All rights reserved.</div>
          <div className="social-links">
            <a href="#">📘</a>
            <a href="#">🐦</a>
            <a href="#">📷</a>
            <a href="#">💼</a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Landing;