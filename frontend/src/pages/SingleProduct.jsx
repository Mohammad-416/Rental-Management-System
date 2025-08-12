import React, { useState, useEffect } from 'react';
import { 
  FaHeart, FaShare, FaShoppingCart, FaArrowLeft, FaStar,
  FaPhone, FaEnvelope, FaWhatsapp, FaMapMarkerAlt,
  FaCreditCard, FaUndo, FaCheck, FaPlus, FaMinus,
  FaBell, FaCog, FaUser
} from 'react-icons/fa';
import { useParams, useNavigate } from 'react-router-dom';

const SingleProductPage = () => {
  const { productId } = useParams();
  const navigate = useNavigate();
  const [isDarkMode, setIsDarkMode] = useState(false);
  
  // Simple states
  const [isInWishlist, setIsInWishlist] = useState(false);
  const [isConfirmed, setIsConfirmed] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [loading, setLoading] = useState(false);

  // Sample product data - always available
  const product = {
    id: productId || 'P001',
    title: 'Professional DSLR Camera',
    description: 'High-quality DSLR camera perfect for photography events, weddings, and professional shoots. Includes multiple lenses and accessories.',
    category: 'Electronics',
    price_per_day: 240,
    images: [
      'https://images.unsplash.com/photo-1606983340126-99ab4feaa64a?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1502920917128-1aa500764cbd?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1521651201144-634f700b36ef?w=800&h=600&fit=crop'
    ],
    available_quantity: 3,
    total_quantity: 5,
    rating: 4.8,
    rental_count: 127,
    specifications: {
      brand: 'Canon',
      model: 'EOS R5',
      megapixels: '45MP',
      video: '8K',
      weight: '738g'
    }
  };

  const owner = {
    id: 'owner-1',
    full_name: 'John Smith',
    email: 'john.smith@example.com',
    phone: '+1-555-0123',
    address: '123 Main St, New York, NY 10001',
    avatar_url: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
    rating: 4.9,
    verified: true
  };

  const totalPrice = product.price_per_day * quantity;

  // Simple button handlers
  const handleWishlistToggle = () => {
    setLoading(true);
    setTimeout(() => {
      setIsInWishlist(!isInWishlist);
      setLoading(false);
      alert(isInWishlist ? 'Removed from wishlist!' : 'Added to wishlist!');
    }, 500);
  };

  const handleBuyNow = () => {
    if (!startDate || !endDate) {
      alert('Please select start and end dates');
      return;
    }
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      alert('Product purchased successfully!');
      navigate('/orders');
    }, 1000);
  };

  const handleConfirmPayment = () => {
    if (!startDate || !endDate) {
      alert('Please select start and end dates');
      return;
    }
    setLoading(true);
    setTimeout(() => {
      setIsConfirmed(true);
      setLoading(false);
      alert('Payment processed successfully! Order confirmed.');
    }, 1500);
  };

  const handleReturnRequest = () => {
    setLoading(true);
    setTimeout(() => {
      setIsConfirmed(false);
      setLoading(false);
      alert('Return request submitted successfully!');
    }, 1000);
  };

  return (
    <div className={`single-product-page ${isDarkMode ? 'dark' : ''}`}>
      <style jsx>{`
        :root {
          --blue: #3b82f6;
          --blue-deep: #1d4ed8;
          --teal: #4ecdc4;
          --rose: #ff6b6b;
          --green: #10b981;
          --orange: #f59e0b;
          --dark-bg: #0a0e15;
          --dark-card: #111827;
          --dark-text: #f8fafc;
          --white-card: #ffffff;
          --white-text: #1e293b;
          --white-text-soft: #64748b;
          --shadow-light: 0 15px 40px rgba(59,130,246,0.15);
          --shadow-dark: 0 25px 50px rgba(0,0,0,0.4);
        }

        * {
          box-sizing: border-box;
          margin: 0;
          padding: 0;
        }

        .single-product-page {
          font-family: 'Inter', sans-serif;
          background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%);
          color: var(--white-text);
          min-height: 100vh;
        }

        .single-product-page.dark {
          background: radial-gradient(ellipse 120% 100% at 50% 0%, #1a202c 0%, var(--dark-bg) 45%, #050810 100%);
          color: var(--dark-text);
        }

        .navbar {
          position: fixed;
          top: 0;
          width: 100%;
          z-index: 50;
          padding: 1rem 2rem;
          background: rgba(255,255,255,0.95);
          backdrop-filter: blur(20px);
          border-bottom: 1px solid rgba(59,130,246,0.1);
          box-shadow: var(--shadow-light);
        }

        .dark .navbar {
          background: rgba(15,23,42,0.85);
          border-bottom-color: rgba(71,85,105,0.3);
        }

        .nav-container {
          display: flex;
          justify-content: space-between;
          align-items: center;
          max-width: 1400px;
          margin: 0 auto;
        }

        .nav-left {
          display: flex;
          align-items: center;
          gap: 1rem;
        }

        .back-btn {
          width: 40px;
          height: 40px;
          border-radius: 50%;
          background: rgba(59,130,246,0.1);
          border: none;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: all 0.3s ease;
          color: var(--blue);
        }

        .back-btn:hover {
          background: var(--blue);
          color: white;
          transform: scale(1.05);
        }

        .logo {
          font-size: 1.875rem;
          font-weight: 900;
          background: linear-gradient(135deg, var(--blue), var(--blue-deep));
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        .dark .logo {
          background: linear-gradient(135deg, var(--rose), var(--teal));
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        .nav-user {
          display: flex;
          align-items: center;
          gap: 1rem;
        }

        .nav-icon {
          width: 40px;
          height: 40px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: all 0.3s ease;
          color: var(--white-text-soft);
        }

        .nav-icon:hover {
          background: rgba(59,130,246,0.1);
          color: var(--blue);
        }

        .dark .nav-icon {
          color: var(--dark-text);
        }

        .dark .nav-icon:hover {
          background: rgba(76,205,196,0.1);
          color: var(--teal);
        }

        .main-content {
          margin-top: 80px;
          padding: 2rem;
          max-width: 1400px;
          margin-left: auto;
          margin-right: auto;
        }

        .product-container {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 3rem;
          margin-bottom: 3rem;
        }

        .product-images {
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }

        .main-image-container {
          position: relative;
          background: var(--white-card);
          border-radius: 20px;
          overflow: hidden;
          box-shadow: var(--shadow-light);
          aspect-ratio: 1;
        }

        .dark .main-image-container {
          background: var(--dark-card);
          box-shadow: var(--shadow-dark);
        }

        .main-image {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .thumbnail-images {
          display: flex;
          gap: 0.75rem;
          overflow-x: auto;
          padding: 0.5rem 0;
        }

        .thumbnail {
          flex-shrink: 0;
          width: 80px;
          height: 80px;
          border-radius: 12px;
          overflow: hidden;
          cursor: pointer;
          border: 2px solid transparent;
          transition: all 0.3s ease;
        }

        .thumbnail.active {
          border-color: var(--blue);
        }

        .thumbnail img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .product-details {
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
        }

        .product-header {
          border-bottom: 1px solid rgba(59,130,246,0.1);
          padding-bottom: 1.5rem;
        }

        .dark .product-header {
          border-bottom-color: rgba(76,205,196,0.1);
        }

        .product-title {
          font-size: 2.5rem;
          font-weight: 900;
          color: var(--white-text);
          margin-bottom: 0.5rem;
        }

        .dark .product-title {
          color: var(--dark-text);
        }

        .product-meta {
          display: flex;
          align-items: center;
          gap: 1rem;
          margin-bottom: 1rem;
          flex-wrap: wrap;
        }

        .product-category {
          padding: 0.25rem 0.75rem;
          background: rgba(59,130,246,0.1);
          color: var(--blue);
          border-radius: 20px;
          font-size: 0.875rem;
          font-weight: 600;
        }

        .dark .product-category {
          background: rgba(76,205,196,0.1);
          color: var(--teal);
        }

        .product-rating {
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }

        .stars {
          display: flex;
          gap: 0.25rem;
          color: #fbbf24;
        }

        .rating-text {
          color: var(--white-text-soft);
          font-size: 0.875rem;
        }

        .dark .rating-text {
          color: var(--dark-text);
        }

        .product-price {
          font-size: 2rem;
          font-weight: 700;
          color: var(--green);
          margin-bottom: 0.5rem;
        }

        .price-note {
          color: var(--white-text-soft);
          font-size: 0.875rem;
        }

        .dark .price-note {
          color: var(--dark-text);
        }

        .availability-section {
          background: var(--white-card);
          padding: 1.5rem;
          border-radius: 16px;
          border: 1px solid rgba(59,130,246,0.1);
        }

        .dark .availability-section {
          background: var(--dark-card);
          border-color: rgba(76,205,196,0.1);
        }

        .availability-title {
          font-size: 1.2rem;
          font-weight: 600;
          margin-bottom: 1rem;
          color: var(--white-text);
        }

        .dark .availability-title {
          color: var(--dark-text);
        }

        .availability-info {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 1rem;
        }

        .stock-info {
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }

        .stock-indicator {
          width: 12px;
          height: 12px;
          border-radius: 50%;
          background: var(--green);
        }

        .stock-text {
          color: var(--white-text-soft);
          font-size: 0.875rem;
        }

        .dark .stock-text {
          color: var(--dark-text);
        }

        .rental-config {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 1rem;
          margin-bottom: 1rem;
        }

        .config-group {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }

        .config-label {
          font-size: 0.875rem;
          font-weight: 600;
          color: var(--white-text-soft);
        }

        .dark .config-label {
          color: var(--dark-text);
        }

        .config-input {
          padding: 0.75rem;
          border: 2px solid rgba(59,130,246,0.1);
          border-radius: 12px;
          background: var(--white-card);
          color: var(--white-text);
          font-size: 1rem;
        }

        .dark .config-input {
          background: var(--dark-card);
          border-color: rgba(76,205,196,0.2);
          color: var(--dark-text);
        }

        .quantity-control {
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }

        .quantity-btn {
          width: 40px;
          height: 40px;
          border: 2px solid rgba(59,130,246,0.2);
          border-radius: 8px;
          background: var(--white-card);
          color: var(--blue);
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.3s ease;
        }

        .quantity-btn:hover {
          background: var(--blue);
          color: white;
        }

        .dark .quantity-btn {
          background: var(--dark-card);
          border-color: rgba(76,205,196,0.2);
          color: var(--teal);
        }

        .dark .quantity-btn:hover {
          background: var(--teal);
          color: var(--dark-bg);
        }

        .quantity-display {
          font-size: 1.1rem;
          font-weight: 600;
          min-width: 2rem;
          text-align: center;
        }

        .total-price-section {
          background: rgba(59,130,246,0.05);
          padding: 1.5rem;
          border-radius: 16px;
          border: 2px solid rgba(59,130,246,0.1);
        }

        .dark .total-price-section {
          background: rgba(76,205,196,0.05);
          border-color: rgba(76,205,196,0.1);
        }

        .total-label {
          font-size: 1rem;
          color: var(--white-text-soft);
          margin-bottom: 0.5rem;
        }

        .dark .total-label {
          color: var(--dark-text);
        }

        .total-amount {
          font-size: 2rem;
          font-weight: 700;
          color: var(--blue);
        }

        .dark .total-amount {
          color: var(--teal);
        }

        .action-buttons {
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }

        .primary-button {
          width: 100%;
          padding: 1rem 2rem;
          border: none;
          border-radius: 12px;
          font-weight: 600;
          font-size: 1.1rem;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
          transition: all 0.3s ease;
        }

        .primary-button:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 25px rgba(0,0,0,0.15);
        }

        .primary-button:disabled {
          opacity: 0.6;
          cursor: not-allowed;
          transform: none;
        }

        .buy-now-btn {
          background: linear-gradient(135deg, var(--blue), var(--blue-deep));
          color: white;
        }

        .confirm-payment-btn {
          background: linear-gradient(135deg, var(--green), #059669);
          color: white;
        }

        .return-btn {
          background: linear-gradient(135deg, var(--orange), #d97706);
          color: white;
        }

        .secondary-button {
          width: 100%;
          padding: 1rem 2rem;
          border: 2px solid rgba(59,130,246,0.2);
          border-radius: 12px;
          background: transparent;
          color: var(--blue);
          font-weight: 600;
          font-size: 1rem;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
          transition: all 0.3s ease;
        }

        .secondary-button:hover {
          background: rgba(59,130,246,0.1);
          transform: translateY(-2px);
        }

        .dark .secondary-button {
          border-color: rgba(76,205,196,0.2);
          color: var(--teal);
        }

        .dark .secondary-button:hover {
          background: rgba(76,205,196,0.1);
        }

        .secondary-button.active {
          background: var(--rose);
          border-color: var(--rose);
          color: white;
        }

        .description-section {
          background: var(--white-card);
          padding: 2rem;
          border-radius: 20px;
          border: 1px solid rgba(59,130,246,0.1);
          box-shadow: var(--shadow-light);
          margin: 2rem 0;
        }

        .dark .description-section {
          background: var(--dark-card);
          border-color: rgba(76,205,196,0.1);
          box-shadow: var(--shadow-dark);
        }

        .section-title {
          font-size: 1.5rem;
          font-weight: 600;
          margin-bottom: 1rem;
          color: var(--white-text);
        }

        .dark .section-title {
          color: var(--dark-text);
        }

        .description-text {
          line-height: 1.6;
          color: var(--white-text-soft);
        }

        .dark .description-text {
          color: var(--dark-text);
        }

        .specifications-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 1rem;
          margin-top: 1rem;
        }

        .spec-item {
          display: flex;
          justify-content: space-between;
          padding: 0.75rem;
          background: rgba(59,130,246,0.05);
          border-radius: 8px;
        }

        .dark .spec-item {
          background: rgba(76,205,196,0.05);
        }

        .spec-label {
          font-weight: 600;
          color: var(--white-text-soft);
        }

        .dark .spec-label {
          color: var(--dark-text);
        }

        .spec-value {
          color: var(--white-text);
        }

        .dark .spec-value {
          color: var(--dark-text);
        }

        .owner-section {
          background: var(--white-card);
          padding: 2rem;
          border-radius: 20px;
          border: 1px solid rgba(59,130,246,0.1);
          box-shadow: var(--shadow-light);
          margin: 2rem 0;
        }

        .dark .owner-section {
          background: var(--dark-card);
          border-color: rgba(76,205,196,0.1);
          box-shadow: var(--shadow-dark);
        }

        .owner-header {
          display: flex;
          align-items: center;
          gap: 1rem;
          margin-bottom: 1.5rem;
        }

        .owner-avatar {
          width: 60px;
          height: 60px;
          border-radius: 50%;
          object-fit: cover;
          border: 3px solid var(--blue);
        }

        .dark .owner-avatar {
          border-color: var(--teal);
        }

        .owner-info {
          flex: 1;
        }

        .owner-name {
          font-size: 1.25rem;
          font-weight: 600;
          color: var(--white-text);
          margin-bottom: 0.25rem;
        }

        .dark .owner-name {
          color: var(--dark-text);
        }

        .owner-rating {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          color: var(--white-text-soft);
          font-size: 0.875rem;
        }

        .dark .owner-rating {
          color: var(--dark-text);
        }

        .verified-badge {
          display: inline-flex;
          align-items: center;
          gap: 0.25rem;
          padding: 0.25rem 0.5rem;
          background: rgba(16,185,129,0.1);
          color: var(--green);
          border-radius: 12px;
          font-size: 0.75rem;
          font-weight: 600;
        }

        .contact-options {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
          gap: 1rem;
        }

        .contact-btn {
          padding: 0.75rem 1rem;
          border: none;
          border-radius: 12px;
          font-weight: 600;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
          transition: all 0.3s ease;
          text-decoration: none;
        }

        .contact-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(0,0,0,0.1);
        }

        .phone-btn {
          background: linear-gradient(135deg, var(--blue), var(--blue-deep));
          color: white;
        }

        .email-btn {
          background: linear-gradient(135deg, var(--green), #059669);
          color: white;
        }

        .whatsapp-btn {
          background: linear-gradient(135deg, #25d366, #128c7e);
          color: white;
        }

        .theme-toggle {
          position: fixed;
          bottom: 2rem;
          right: 2rem;
          width: 4rem;
          height: 2rem;
          background: rgba(59,130,246,0.15);
          border-radius: 1rem;
          border: 2px solid rgba(59,130,246,0.3);
          cursor: pointer;
          transition: all 0.4s ease;
          box-shadow: 0 4px 12px rgba(59,130,246,0.2);
          z-index: 50;
        }

        .theme-toggle:hover {
          transform: translateY(-2px);
          box-shadow: 0 6px 20px rgba(59,130,246,0.3);
        }

        .dark .theme-toggle {
          background: rgba(76,205,196,0.15);
          border-color: rgba(76,205,196,0.3);
          box-shadow: 0 4px 12px rgba(76,205,196,0.2);
        }

        .toggle-slider {
          width: 1.5rem;
          height: 1.5rem;
          background: linear-gradient(135deg, var(--blue), var(--blue-deep));
          border-radius: 50%;
          position: absolute;
          top: 0.125rem;
          left: 0.125rem;
          transition: all 0.4s ease;
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          font-size: 0.75rem;
          box-shadow: 0 2px 8px rgba(0,0,0,0.2);
        }

        .toggle-slider-dark {
          background: linear-gradient(135deg, var(--teal), var(--rose));
          left: 2rem;
        }

        .loading-text {
          opacity: 0.7;
        }

        @media (max-width: 768px) {
          .main-content {
            padding: 1rem;
          }
          
          .product-container {
            grid-template-columns: 1fr;
            gap: 2rem;
          }
          
          .rental-config {
            grid-template-columns: 1fr;
          }
          
          .contact-options {
            grid-template-columns: 1fr;
          }
          
          .specifications-grid {
            grid-template-columns: 1fr;
          }

          .product-title {
            font-size: 2rem;
          }

          .nav-container {
            padding: 0 1rem;
          }

          .product-meta {
            flex-direction: column;
            align-items: flex-start;
            gap: 0.5rem;
          }
        }
      `}</style>

      {/* Navbar */}
      <nav className="navbar">
        <div className="nav-container">
          <div className="nav-left">
            <button className="back-btn" onClick={() => navigate(-1)}>
              <FaArrowLeft />
            </button>
            <div className="logo">RentalHub</div>
          </div>
          <div className="nav-user">
            <div className="nav-icon">
              <FaBell />
            </div>
            <div className="nav-icon">
              <FaCog />
            </div>
            <div className="nav-icon">
              <FaUser />
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="main-content">
        <div className="product-container">
          {/* Product Images */}
          <div className="product-images">
            <div className="main-image-container">
              <img 
                src={product.images[selectedImage]} 
                alt={product.title}
                className="main-image"
              />
            </div>
            
            <div className="thumbnail-images">
              {product.images.map((image, index) => (
                <div 
                  key={index}
                  className={`thumbnail ${selectedImage === index ? 'active' : ''}`}
                  onClick={() => setSelectedImage(index)}
                >
                  <img src={image} alt={`${product.title} ${index + 1}`} />
                </div>
              ))}
            </div>
          </div>

          {/* Product Details */}
          <div className="product-details">
            <div className="product-header">
              <h1 className="product-title">{product.title}</h1>
              <div className="product-meta">
                <span className="product-category">{product.category}</span>
                <div className="product-rating">
                  <div className="stars">
                    {[...Array(5)].map((_, i) => (
                      <FaStar key={i} style={{ 
                        color: i < Math.floor(product.rating) ? '#fbbf24' : '#e5e7eb' 
                      }} />
                    ))}
                  </div>
                  <span className="rating-text">
                    {product.rating} ({product.rental_count} rentals)
                  </span>
                </div>
              </div>
              <div className="product-price">
                ${product.price_per_day}/day
              </div>
              <p className="price-note">Base rental price per day</p>
            </div>

            {/* Availability */}
            <div className="availability-section">
              <h3 className="availability-title">Availability</h3>
              <div className="availability-info">
                <div className="stock-info">
                  <div className="stock-indicator"></div>
                  <span className="stock-text">
                    {product.available_quantity} of {product.total_quantity} available
                  </span>
                </div>
              </div>

              <div className="rental-config">
                <div className="config-group">
                  <label className="config-label">Quantity</label>
                  <div className="quantity-control">
                    <button 
                      className="quantity-btn"
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    >
                      <FaMinus />
                    </button>
                    <span className="quantity-display">{quantity}</span>
                    <button 
                      className="quantity-btn"
                      onClick={() => setQuantity(Math.min(product.available_quantity, quantity + 1))}
                    >
                      <FaPlus />
                    </button>
                  </div>
                </div>

                <div className="config-group">
                  <label className="config-label">Start Date</label>
                  <input 
                    type="date"
                    className="config-input"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    min={new Date().toISOString().split('T')[0]}
                  />
                </div>

                <div className="config-group">
                  <label className="config-label">End Date</label>
                  <input 
                    type="date"
                    className="config-input"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    min={startDate}
                  />
                </div>
              </div>

              {/* Total Price */}
              <div className="total-price-section">
                <div className="total-label">Total Rental Cost</div>
                <div className="total-amount">${totalPrice.toFixed(2)}</div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="action-buttons">
              {isConfirmed ? (
                <button 
                  className="primary-button return-btn"
                  onClick={handleReturnRequest}
                  disabled={loading}
                >
                  <FaUndo />
                  {loading ? <span className="loading-text">Processing...</span> : 'Request Return'}
                </button>
              ) : isInWishlist ? (
                <button 
                  className="primary-button confirm-payment-btn"
                  onClick={handleConfirmPayment}
                  disabled={loading || !startDate || !endDate}
                >
                  <FaCreditCard />
                  {loading ? <span className="loading-text">Processing...</span> : 'Confirm Payment'}
                </button>
              ) : (
                <button 
                  className="primary-button buy-now-btn"
                  onClick={handleBuyNow}
                  disabled={loading || !startDate || !endDate}
                >
                  <FaShoppingCart />
                  {loading ? <span className="loading-text">Processing...</span> : 'Buy Now'}
                </button>
              )}

              <button 
                className={`secondary-button ${isInWishlist ? 'active' : ''}`}
                onClick={handleWishlistToggle}
                disabled={loading}
              >
                <FaHeart />
                {loading ? 'Updating...' : (isInWishlist ? 'Remove from Wishlist' : 'Add to Wishlist')}
              </button>
            </div>
          </div>
        </div>

        {/* Product Description */}
        <div className="description-section">
          <h2 className="section-title">Product Description</h2>
          <p className="description-text">{product.description}</p>
          
          <h3 className="section-title" style={{ marginTop: '2rem' }}>Specifications</h3>
          <div className="specifications-grid">
            {Object.entries(product.specifications).map(([key, value]) => (
              <div key={key} className="spec-item">
                <span className="spec-label">{key.charAt(0).toUpperCase() + key.slice(1)}</span>
                <span className="spec-value">{value}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Owner Information */}
        <div className="owner-section">
          <h2 className="section-title">Product Owner</h2>
          <div className="owner-header">
            <img 
              src={owner.avatar_url} 
              alt={owner.full_name}
              className="owner-avatar"
            />
            <div className="owner-info">
              <h3 className="owner-name">{owner.full_name}</h3>
              <div className="owner-rating">
                <div className="stars">
                  {[...Array(5)].map((_, i) => (
                    <FaStar key={i} style={{ 
                      color: i < Math.floor(owner.rating) ? '#fbbf24' : '#e5e7eb' 
                    }} />
                  ))}
                </div>
                <span>{owner.rating} rating</span>
                {owner.verified && (
                  <span className="verified-badge">
                    <FaCheck />
                    Verified
                  </span>
                )}
              </div>
              <p style={{ color: 'var(--white-text-soft)', fontSize: '0.875rem', marginTop: '0.5rem' }}>
                <FaMapMarkerAlt style={{ marginRight: '0.5rem' }} />
                {owner.address}
              </p>
            </div>
          </div>

          <div className="contact-options">
            <a href={`tel:${owner.phone}`} className="contact-btn phone-btn">
              <FaPhone />
              Call
            </a>
            <a href={`mailto:${owner.email}`} className="contact-btn email-btn">
              <FaEnvelope />
              Email
            </a>
            <a 
              href={`https://wa.me/${owner.phone.replace(/[^0-9]/g, '')}`} 
              target="_blank" 
              rel="noopener noreferrer"
              className="contact-btn whatsapp-btn"
            >
              <FaWhatsapp />
              WhatsApp
            </a>
          </div>
        </div>
      </div>

      {/* Theme Toggle */}
      <button className="theme-toggle" onClick={() => setIsDarkMode(!isDarkMode)}>
        <div className={`toggle-slider ${isDarkMode ? 'toggle-slider-dark' : ''}`}>
          {isDarkMode ? '🌙' : '☀️'}
        </div>
      </button>
    </div>
  );
};

export default SingleProductPage;
