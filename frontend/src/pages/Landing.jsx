import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './Landing.css';
import hammerImg from '../assets/hammer.png';
import helmetImg from '../assets/helmet.png';
import furnitureImg from '../assets/sofa.png';
import partyImg from '../assets/party.png';
import phoneImg from '../assets/phone.png';
import appliancesImg from '../assets/appliances.png';

const Landing = () => {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleThemeToggle = () => {
    setIsDarkMode(prev => !prev);
  };

  const handleMobileMenuToggle = () => {
    setIsMobileMenuOpen(prev => !prev);
  };

  const handleNavigation = (sectionId) => {
    const target = document.querySelector(sectionId);
    if (target) {
      target.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      });
      if (isMobileMenuOpen) {
        setIsMobileMenuOpen(false);
      }
    }
  };

  useEffect(() => {
    if (isDarkMode) {
      document.body.classList.add('dark');
    } else {
      document.body.classList.remove('dark');
    }
  }, [isDarkMode]);

  useEffect(() => {
    const handleScroll = () => {
      const navbar = document.querySelector('.navbar');
      if (navbar) {
        if (window.scrollY > 50) {
          navbar.style.background = isDarkMode
            ? 'rgba(15,23,42,0.95)'
            : 'rgba(255,255,255,0.98)';
        } else {
          navbar.style.background = isDarkMode
            ? 'rgba(15,23,42,0.85)'
            : 'rgba(255,255,255,0.95)';
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [isDarkMode]);

  useEffect(() => {
    const observerOptions = {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.style.opacity = '1';
          entry.target.style.transform = 'translateY(0)';
        }
      });
    }, observerOptions);

    const animateElements = document.querySelectorAll('.category-card, .feature-card, .step, .stat-item');

    animateElements.forEach(el => {
      el.style.opacity = '0';
      el.style.transform = 'translateY(30px)';
      el.style.transition = 'all 0.6s ease';
      observer.observe(el);
    });

    return () => {
      animateElements.forEach(el => observer.unobserve(el));
    };
  }, []);

  const categories = [
    { name: "Tools & Eqippet", count: "120 Items", image: hammerImg },
    { name: "Furniture", count: "200 Items", image: furnitureImg },
    { name: "Electronics", count: "200 Items", image: phoneImg },
    { name: "sports & Outdoor", count: "200 Items", image: helmetImg },
    { name: "Appliances", count: "200 Items", image: appliancesImg },
    { name: "Party & Events", count: "200 Items", image: partyImg }
  ];

  const features = [
    {
      icon: '📦',
      title: 'Vast Inventory',
      description: 'Access thousands of rental items from electronics to furniture, tools, and equipment for any occasion.'
    },
    {
      icon: '⚡',
      title: 'Instant Booking',
      description: 'Book items instantly with real-time availability. Reserve what you need in just a few clicks.'
    },
    {
      icon: '🚛',
      title: 'Free Delivery',
      description: 'Enjoy free pickup and delivery service for orders above $50. We bring rentals right to your door.'
    },
    {
      icon: '💰',
      title: 'Flexible Pricing',
      description: 'Hourly, daily, weekly, or monthly rates. Choose the rental period that fits your needs and budget.'
    },
    {
      icon: '🛡️',
      title: 'Damage Protection',
      description: 'Complete insurance coverage included. Rent with confidence knowing you\'re fully protected.'
    },
    {
      icon: '📱',
      title: 'Smart Management',
      description: 'Track rentals, manage bookings, and get notifications through our intuitive mobile app.'
    }
  ];

  const steps = [
    {
      number: '1',
      title: 'Browse & Select',
      description: 'Explore our vast catalog and find exactly what you need for your project or event.'
    },
    {
      number: '2',
      title: 'Book & Pay',
      description: 'Choose your rental period and complete secure payment. Get instant confirmation.'
    },
    {
      number: '3',
      title: 'Pickup/Delivery',
      description: 'Choose convenient pickup or free delivery. Items are clean, tested, and ready to use.'
    },
    {
      number: '4',
      title: 'Enjoy & Return',
      description: 'Use your rental items worry-free with damage protection. Return or extend easily.'
    }
  ];

  const stats = [
    { number: '10K+', label: 'Rental Items' },
    { number: '98%', label: 'Customer Satisfaction' },
    { number: '24/7', label: 'Customer Support' },
    { number: '500+', label: 'Cities Covered' }
  ];

  return (
    <div className={isDarkMode ? 'dark' : ''}>
      <div className="landing-container">

        {/* Navigation */}
        <nav className="navbar">
          <div className="nav-container">
            <div className="logo">RentalHub</div>

            {/* Desktop Navigation */}
            <div className="nav-right">
              <button onClick={() => handleNavigation('#hero')} className="nav-link">
                Home
              </button>
              <button onClick={() => handleNavigation('#about')} className="nav-link">
                About
              </button>
              <button onClick={() => handleNavigation('#contact')} className="nav-link">
                Contact
              </button>
            </div>

            {/* Mobile Hamburger Menu */}
            <button className="mobile-menu-btn" onClick={handleMobileMenuToggle}>
              <span className={`hamburger-line ${isMobileMenuOpen ? 'rotate-45 translate-y-1.5' : ''}`}></span>
              <span className={`hamburger-line ${isMobileMenuOpen ? 'opacity-0' : ''}`}></span>
              <span className={`hamburger-line ${isMobileMenuOpen ? '-rotate-45 -translate-y-1.5' : ''}`}></span>
            </button>
          </div>

          {/* Mobile Menu Dropdown */}
          <div className={`mobile-menu ${isMobileMenuOpen ? 'mobile-menu-open' : ''}`}>
            <div className="mobile-menu-content">
              <button onClick={() => handleNavigation('#hero')} className="mobile-nav-link">
                Home
              </button>
              <button onClick={() => handleNavigation('#about')} className="mobile-nav-link">
                About
              </button>
              <button onClick={() => handleNavigation('#contact')} className="mobile-nav-link">
                Contact
              </button>
            </div>
          </div>
        </nav>

        {/* Hero Section */}
        <section className="hero" id="hero">
          <div className="hero-content">
            <h1 className="hero-title">Rent Anything, Anytime</h1>
            <p className="hero-subtitle">
              Your Ultimate Rental Marketplace - From electronics to furniture, tools to party equipment.
              Rent what you need, when you need it.
            </p>
            <div className="hero-buttons">
              <Link to="/signup" className="btn-primary">
                Get Started Free
              </Link>
              <button className="btn-primary" onClick={() => alert('Redirecting to products...')}>
                Browse Rentals
              </button>
            </div>
          </div>
        </section>

        {/* Categories Section */}
        <section className="categories" id="about">
          <div className="section-container">
            <h2 className="section-title">Rental Categories</h2>
            <p className="section-subtitle">
              Discover thousands of rental items across multiple categories
            </p>

            <div className="categories-grid">
              {categories.map((category, index) => (
                <div
                  key={index}
                  className="category-card"
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: '180px', // increased from ~150px
                    height: '180px', // increased height
                    padding: '1rem',
                    borderRadius: '12px',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                    backgroundColor: '#fff',
                  }}
                >
                  <img
                    src={category.image}
                    alt={category.name}
                    style={{
                      width: '80px',  // slightly larger
                      height: '80px', // slightly larger
                      objectFit: 'contain',
                    }}
                  />
                  <p style={{ marginTop: '0.75rem', textAlign: 'center' }}>{category.name}</p>
                </div>

              ))}
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="features">
          <div className="section-container">
            <h2 className="section-title">Why Choose RentalHub?</h2>
            <p className="section-subtitle">
              Everything you need for seamless rental experience
            </p>

            <div className="features-grid">
              {features.map((feature, index) => (
                <div key={index} className="feature-card">
                  <div className="feature-icon">{feature.icon}</div>
                  <h3 className="feature-title">{feature.title}</h3>
                  <p className="feature-description">{feature.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* How it Works */}
        <section className="how-it-works">
          <div className="section-container">
            <h2 className="section-title">How It Works</h2>
            <p className="section-subtitle">
              Get what you need in just a few simple steps
            </p>

            <div className="steps-grid">
              {steps.map((step, index) => (
                <div key={index} className="step">
                  <div className="step-number">{step.number}</div>
                  <h3 className="step-title">{step.title}</h3>
                  <p className="step-description">{step.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Stats Section */}
        <section className="stats">
          <div className="section-container">
            <h2 className="section-title">Trusted by Thousands</h2>
            <div className="stats-grid">
              {stats.map((stat, index) => (
                <div key={index} className="stat-item">
                  <div className="stat-number">{stat.number}</div>
                  <div className="stat-label">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="cta" id="contact">
          <div className="section-container">
            <h2 className="cta-title">Ready to Start Renting?</h2>
            <p className="cta-subtitle">
              Join thousands of smart consumers who save money by renting instead of buying.
            </p>
            <div className="cta-buttons">
              <Link to="/signup" className="btn-primary">
                Create Account
              </Link>
              <Link to="/signin" className="btn-secondary">
                Sign In
              </Link>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="footer">
          <div className="footer-container">
            <div className="footer-content">
              <div className="logo">RentalHub</div>
              <p>© 2025 RentalHub. Built with ❤️ by <a href="https://github.com/mohammad-416" target="_blank" rel="noopener noreferrer" className="footer-link">Bit Lords</a></p>
              <div className="social-links">
                <a
                  href="https://github.com/mohammad-416"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="social-link github-link"
                  title="Visit GitHub Profile"
                >
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z" />
                  </svg>
                </a>
                <a
                  href="https://github.com/mohammad-416?tab=repositories"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="social-link github-repos"
                  title="View Repositories"
                >
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M3 3C1.89 3 1 3.89 1 5V19C1 20.11 1.89 21 3 21H21C22.11 21 23 20.11 23 19V5C23 3.89 22.11 3 21 3H3M3 5H21V19H3V5M5 7V9H19V7H5M5 11V13H19V11H5M5 15V17H19V15H5Z" />
                  </svg>
                </a>
                <a
                  href="https://github.com/mohammad-416/mohammad-416"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="social-link github-profile"
                  title="About Me"
                >
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12,4A4,4 0 0,1 16,8A4,4 0 0,1 12,12A4,4 0 0,1 8,8A4,4 0 0,1 12,4M12,14C16.42,14 20,15.79 20,18V20H4V18C4,15.79 7.58,14 12,14Z" />
                  </svg>
                </a>
                <a
                  href="https://github.com/mohammad-416?tab=stars"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="social-link github-stars"
                  title="Starred Repositories"
                >
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12,17.27L18.18,21L16.54,13.97L22,9.24L14.81,8.62L12,2L9.19,8.62L2,9.24L7.45,13.97L5.82,21L12,17.27Z" />
                  </svg>
                </a>
              </div>
            </div>
          </div>
        </footer>

        {/* Theme Toggle Button */}
        <button className="theme-toggle" onClick={handleThemeToggle}>
          <div className={`toggle-slider ${isDarkMode ? 'toggle-slider-dark' : ''}`}>
            {isDarkMode ? '🌙' : '☀️'}
          </div>
        </button>
      </div>
    </div>
  );
};

export default Landing;
