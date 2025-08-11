import React, { useState, useEffect, useCallback } from 'react';
import { 
  FaHeart, FaTrash, FaSearch, FaPlus, FaMinus,
  FaBox, FaDollarSign, FaShoppingCart, FaUsers, FaHome, FaCog,
  FaBell, FaUser, FaTags, FaCalendarAlt, FaStar,
  FaSpinner, FaExclamationTriangle, FaRedo, FaCreditCard,
  FaMapMarkerAlt, FaClock, FaCheck, FaTimes
} from 'react-icons/fa';
import { Link } from 'react-router-dom';
import axios from 'axios';

const WishlistPage = () => {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [activeTab, setActiveTab] = useState('wishlist');
  const [searchTerm, setSearchTerm] = useState('');
  
  // Wishlist States
  const [wishlistItems, setWishlistItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [initialLoading, setInitialLoading] = useState(true);

  // Payment States
  const [paymentLoading, setPaymentLoading] = useState(false);

  // Stats data
  const [stats, setStats] = useState([
    { title: 'Wishlist Items', value: '0', icon: FaHeart, color: '#ef4444', trend: '0' },
    { title: 'Total Value', value: '$0', icon: FaDollarSign, color: '#10b981', trend: '$0' },
    { title: 'Items to Rent', value: '0', icon: FaShoppingCart, color: '#3b82f6', trend: '0' },
    { title: 'Savings', value: '$0', icon: FaTags, color: '#8b5cf6', trend: '$0' }
  ]);

  useEffect(() => {
    if (isDarkMode) {
      document.body.classList.add('dark');
    } else {
      document.body.classList.remove('dark');
    }
  }, [isDarkMode]);

  // CSRF Token Setup
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

  // Fetch wishlist items from API
  const fetchWishlistItems = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await axios.get('http://localhost:8000/api/wishlist/', {
        withCredentials: true
      });

      const items = response.data.results || response.data || [];
      
      // Transform API data to wishlist format
      const transformedItems = items.map(item => ({
        id: item.id,
        productId: item.product?.id || item.product_id,
        name: item.product?.title || item.name,
        price: parseFloat(item.product?.price_per_day || 0),
        quantity: item.quantity || 1,
        category: item.product?.category || "General",
        description: item.product?.description || "",
        dateAdded: item.created_at || new Date().toISOString()
      }));

      setWishlistItems(transformedItems);
      updateStats(transformedItems);

    } catch (err) {
      console.error('Error fetching wishlist:', err);
      setError('Failed to load wishlist items');
      
      // Fallback sample data
      const sampleItems = [
        { 
          id: 'W001',
          productId: 'P001', 
          name: 'Professional DSLR Camera', 
          price: 240,
          quantity: 1,
          category: 'Electronics',
          description: 'High-quality DSLR camera perfect for photography events.',
          dateAdded: '2025-01-10T10:00:00Z'
        },
        { 
          id: 'W002',
          productId: 'P002', 
          name: 'Gaming Laptop RTX 4080', 
          price: 180,
          quantity: 2,
          category: 'Electronics',
          description: 'High-performance gaming laptop with RTX 4080 graphics.',
          dateAdded: '2025-01-09T14:30:00Z'
        },
        { 
          id: 'W003',
          productId: 'P003', 
          name: 'Party Sound System', 
          price: 320,
          quantity: 1,
          category: 'Audio Equipment',
          description: 'Professional sound system perfect for events and parties.',
          dateAdded: '2025-01-08T09:15:00Z'
        }
      ];
      setWishlistItems(sampleItems);
      updateStats(sampleItems);
      setError(null);
    } finally {
      setLoading(false);
      setInitialLoading(false);
    }
  }, []);

  const updateStats = (items) => {
    const totalItems = items.length;
    const totalValue = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const totalQuantity = items.reduce((sum, item) => sum + item.quantity, 0);
    const savings = totalValue * 0.1; // 10% savings estimate

    setStats([
      { title: 'Wishlist Items', value: totalItems.toString(), icon: FaHeart, color: '#ef4444', trend: totalItems.toString() },
      { title: 'Total Value', value: `$${totalValue.toFixed(2)}`, icon: FaDollarSign, color: '#10b981', trend: `$${totalValue.toFixed(2)}` },
      { title: 'Items to Rent', value: totalQuantity.toString(), icon: FaShoppingCart, color: '#3b82f6', trend: totalQuantity.toString() },
      { title: 'Estimated Savings', value: `$${savings.toFixed(2)}`, icon: FaTags, color: '#8b5cf6', trend: `$${savings.toFixed(2)}` }
    ]);
  };

  // Initial load
  useEffect(() => {
    fetchWishlistItems();
  }, [fetchWishlistItems]);

  // Search filter
  const filteredItems = wishlistItems.filter(item =>
    item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleRetry = () => {
    setError(null);
    setInitialLoading(true);
    fetchWishlistItems();
  };

  const handleRemoveFromWishlist = async (itemId) => {
    try {
      await axios.delete(`http://localhost:8000/api/wishlist/${itemId}/`, {
        withCredentials: true
      });
      
      const updatedItems = wishlistItems.filter(item => item.id !== itemId);
      setWishlistItems(updatedItems);
      updateStats(updatedItems);
    } catch (error) {
      console.error('Error removing from wishlist:', error);
      // For demo, just remove from local state
      const updatedItems = wishlistItems.filter(item => item.id !== itemId);
      setWishlistItems(updatedItems);
      updateStats(updatedItems);
    }
  };

  const handleQuantityChange = async (itemId, newQuantity) => {
    if (newQuantity < 1) return;

    try {
      await axios.patch(`http://localhost:8000/api/wishlist/${itemId}/`, {
        quantity: newQuantity
      }, {
        withCredentials: true
      });

      const updatedItems = wishlistItems.map(item =>
        item.id === itemId ? { ...item, quantity: newQuantity } : item
      );
      setWishlistItems(updatedItems);
      updateStats(updatedItems);
    } catch (error) {
      console.error('Error updating quantity:', error);
      // For demo, just update local state
      const updatedItems = wishlistItems.map(item =>
        item.id === itemId ? { ...item, quantity: newQuantity } : item
      );
      setWishlistItems(updatedItems);
      updateStats(updatedItems);
    }
  };

  const calculateTotalAmount = () => {
    return wishlistItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  };

  const handlePayment = async () => {
    if (wishlistItems.length === 0) {
      alert('Your wishlist is empty');
      return;
    }

    setPaymentLoading(true);
    const amount = calculateTotalAmount();

    try {
      // Create order on backend
      const orderResponse = await axios.post('http://localhost:8000/api/orders/create/', {
        items: wishlistItems.map(item => ({
          product_id: item.productId,
          quantity: item.quantity,
          price: item.price
        })),
        total_amount: amount,
      }, {
        withCredentials: true
      });

      const { order_id, amount: orderAmount } = orderResponse.data;

      // Initialize Razorpay
      const options = {
        key: process.env.REACT_APP_RAZORPAY_KEY_ID || 'rzp_test_your_key_here',
        amount: orderAmount * 100, // Convert to paise
        currency: 'USD',
        name: 'RentalHub',
        description: 'Wishlist Rental Payment',
        order_id: order_id,
        handler: function (response) {
          handlePaymentSuccess(response);
        },
        prefill: {
          name: 'Customer Name',
          email: 'customer@example.com',
          contact: '9999999999'
        },
        theme: {
          color: isDarkMode ? '#4ecdc4' : '#3b82f6'
        },
        modal: {
          ondismiss: function() {
            setPaymentLoading(false);
          }
        }
      };

      const rzp = new window.Razorpay(options);
      rzp.open();

    } catch (error) {
      console.error('Error creating order:', error);
      alert('Failed to process payment. Please try again.');
      setPaymentLoading(false);
    }
  };

  const handlePaymentSuccess = async (response) => {
    try {
      // Verify payment on backend
      await axios.post('http://localhost:8000/api/orders/verify/', {
        razorpay_order_id: response.razorpay_order_id,
        razorpay_payment_id: response.razorpay_payment_id,
        razorpay_signature: response.razorpay_signature,
        items: wishlistItems
      }, {
        withCredentials: true
      });

      alert('Payment successful! Your rentals have been confirmed.');
      
      // Clear wishlist after successful payment
      setWishlistItems([]);
      updateStats([]);
      
    } catch (error) {
      console.error('Error verifying payment:', error);
      alert('Payment verification failed. Please contact support.');
    } finally {
      setPaymentLoading(false);
    }
  };

  return (
    <div className={`wishlist-dashboard ${isDarkMode ? 'dark' : ''}`}>
      <style jsx="true">{`
        /* Landing Page Variables */
        :root {
          --blue: #3b82f6;
          --blue-deep: #1d4ed8;
          --blue-soft: #dbeafe;
          --blue-accent: #2563eb;
          --blue-bright: #60a5fa;
          --blue-light: #93c5fd;
          --teal: #4ecdc4;
          --teal-light: #7dd3db;
          --rose: #ff6b6b;
          --rose-light: #ff9999;
          --dark-bg: #0a0e15;
          --dark-card: #111827;
          --dark-card-light: #1f2937;
          --dark-text: #f8fafc;
          --dark-text-soft: #cbd5e1;
          --white-bg: #ffffff;
          --white-card: #ffffff;
          --white-text: #1e293b;
          --white-text-soft: #64748b;
          --blue-dark: #0f172a;
          --blue-dark-soft: #334155;
          --shadow-dark: 0 25px 50px rgba(0,0,0,0.4);
          --shadow-light: 0 15px 40px rgba(59,130,246,0.15);
          --shadow-blue: 0 15px 45px rgba(59,130,246,0.2);
          --blur-glass: blur(20px);
          --speed: 550ms;
          --speed-long: 850ms;
        }

        * {
          box-sizing: border-box;
          margin: 0;
          padding: 0;
        }

        .wishlist-dashboard {
          font-family: 'Inter', ui-sans-serif, system-ui, sans-serif;
          background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%);
          color: var(--white-text);
          min-height: 100vh;
          transition: all var(--speed-long) ease;
        }

        .wishlist-dashboard.dark {
          background: radial-gradient(ellipse 120% 100% at 50% 0%, #1a202c 0%, var(--dark-bg) 45%, #050810 100%);
          color: var(--dark-text);
        }

        /* Navbar */
        .navbar {
          position: fixed;
          top: 0;
          width: 100%;
          z-index: 50;
          padding: 1rem 5%;
          background: rgba(255,255,255,0.95);
          backdrop-filter: var(--blur-glass);
          border-bottom: 1px solid rgba(59,130,246,0.1);
          box-shadow: var(--shadow-light);
          transition: all var(--speed) ease;
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

        .logo {
          font-size: 1.875rem;
          font-weight: 900;
          background: linear-gradient(135deg, var(--blue), var(--blue-deep), var(--blue-accent));
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          letter-spacing: 1px;
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
          transition: all var(--speed) ease;
          color: var(--white-text-soft);
        }

        .nav-icon:hover {
          background: rgba(59,130,246,0.1);
          color: var(--blue);
        }

        .dark .nav-icon {
          color: var(--dark-text-soft);
        }

        .dark .nav-icon:hover {
          background: rgba(76,205,196,0.1);
          color: var(--teal);
        }

        .user-avatar {
          width: 40px;
          height: 40px;
          border-radius: 50%;
          background: linear-gradient(135deg, var(--blue), var(--blue-deep));
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          font-weight: 600;
          cursor: pointer;
          transition: all var(--speed) ease;
          text-decoration: none;
        }

        .user-avatar:hover {
          transform: scale(1.05);
          box-shadow: 0 8px 25px rgba(59,130,246,0.3);
        }

        .dark .user-avatar {
          background: linear-gradient(135deg, var(--rose), var(--teal));
        }

        /* Dashboard Layout */
        .dashboard-layout {
          display: flex;
          margin-top: 80px;
          min-height: calc(100vh - 80px);
        }

        /* Sidebar */
        .sidebar {
          width: 280px;
          background: var(--white-card);
          border-right: 1px solid rgba(59,130,246,0.1);
          padding: 2rem 0;
          position: fixed;
          height: calc(100vh - 80px);
          overflow-y: auto;
          transition: all var(--speed) ease;
        }

        .dark .sidebar {
          background: var(--dark-card);
          border-right-color: rgba(76,205,196,0.1);
        }

        .sidebar-menu {
          list-style: none;
          padding: 0 1rem;
        }

        .sidebar-item {
          margin-bottom: 0.5rem;
        }

        .sidebar-link {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          padding: 1rem 1.5rem;
          color: var(--white-text-soft);
          text-decoration: none;
          border-radius: 12px;
          transition: all var(--speed) ease;
          font-weight: 500;
          cursor: pointer;
        }

        .sidebar-link:hover {
          background: rgba(59,130,246,0.05);
          color: var(--blue);
          transform: translateX(4px);
        }

        .sidebar-link.active {
          background: linear-gradient(135deg, var(--blue-soft), rgba(59,130,246,0.1));
          color: var(--blue);
          box-shadow: 0 4px 12px rgba(59,130,246,0.15);
        }

        .dark .sidebar-link {
          color: var(--dark-text-soft);
        }

        .dark .sidebar-link:hover {
          background: rgba(76,205,196,0.1);
          color: var(--teal);
        }

        .dark .sidebar-link.active {
          background: linear-gradient(135deg, rgba(76,205,196,0.15), rgba(76,205,196,0.05));
          color: var(--teal);
          box-shadow: 0 4px 12px rgba(76,205,196,0.2);
        }

        /* Main Content */
        .main-content {
          flex: 1;
          margin-left: 280px;
          padding: 2rem;
        }

        /* Dashboard Header */
        .dashboard-header {
          margin-bottom: 2rem;
        }

        .dashboard-title {
          font-size: 2.5rem;
          font-weight: 900;
          margin-bottom: 0.5rem;
          background: linear-gradient(135deg, var(--blue-dark), var(--blue));
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        .dark .dashboard-title {
          background: linear-gradient(135deg, var(--dark-text), var(--teal));
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        .dashboard-subtitle {
          color: var(--white-text-soft);
          font-size: 1.1rem;
        }

        .dark .dashboard-subtitle {
          color: var(--dark-text-soft);
        }

        /* Stats Cards */
        .stats-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
          gap: 1.5rem;
          margin-bottom: 2rem;
        }

        .stat-card {
          background: var(--white-card);
          padding: 2rem;
          border-radius: 20px;
          border: 1px solid rgba(59,130,246,0.1);
          box-shadow: var(--shadow-light);
          transition: all var(--speed) ease;
          position: relative;
          overflow: hidden;
        }

        .stat-card::before {
          content: '';
          position: absolute;
          top: -50%;
          left: -50%;
          width: 200%;
          height: 200%;
          background: linear-gradient(45deg, transparent, rgba(59,130,246,0.03), transparent);
          transform: rotate(45deg);
        }

        .stat-card:hover {
          transform: translateY(-8px);
          box-shadow: 0 20px 40px rgba(59,130,246,0.2);
        }

        .dark .stat-card {
          background: var(--dark-card);
          border-color: rgba(76,205,196,0.1);
          box-shadow: var(--shadow-dark);
        }

        .dark .stat-card::before {
          background: linear-gradient(45deg, transparent, rgba(76,205,196,0.04), transparent);
        }

        .dark .stat-card:hover {
          box-shadow: 0 20px 40px rgba(76,205,196,0.3);
        }

        .stat-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 1rem;
        }

        .stat-icon {
          width: 3rem;
          height: 3rem;
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          font-size: 1.25rem;
        }

        .stat-trend {
          font-size: 0.875rem;
          font-weight: 600;
          padding: 0.25rem 0.75rem;
          border-radius: 20px;
          background: rgba(16,185,129,0.1);
          color: #10b981;
        }

        .stat-value {
          font-size: 2.5rem;
          font-weight: 900;
          color: var(--blue-dark);
          margin-bottom: 0.5rem;
        }

        .dark .stat-value {
          color: var(--dark-text);
        }

        .stat-label {
          color: var(--white-text-soft);
          font-weight: 500;
        }

        .dark .stat-label {
          color: var(--dark-text-soft);
        }

        /* Search Bar */
        .search-bar {
          position: relative;
          margin-bottom: 2rem;
          max-width: 400px;
        }

        .search-input {
          width: 100%;
          padding: 0.75rem 1rem 0.75rem 3rem;
          border: 2px solid rgba(59,130,246,0.1);
          border-radius: 12px;
          background: var(--white-card);
          color: var(--blue-dark);
          outline: none;
          transition: all var(--speed) ease;
        }

        .search-input:focus {
          border-color: var(--blue);
          box-shadow: 0 0 0 3px rgba(59,130,246,0.1);
        }

        .search-icon {
          position: absolute;
          left: 1rem;
          top: 50%;
          transform: translateY(-50%);
          color: var(--white-text-soft);
        }

        .dark .search-input {
          background: var(--dark-card-light);
          border-color: rgba(76,205,196,0.2);
          color: var(--dark-text);
        }

        .dark .search-input:focus {
          border-color: var(--teal);
          box-shadow: 0 0 0 3px rgba(76,205,196,0.1);
        }

        /* Wishlist Items */
        .wishlist-container {
          background: var(--white-card);
          border-radius: 20px;
          border: 1px solid rgba(59,130,246,0.1);
          box-shadow: var(--shadow-light);
          overflow: hidden;
          margin-bottom: 2rem;
        }

        .dark .wishlist-container {
          background: var(--dark-card);
          border-color: rgba(76,205,196,0.1);
          box-shadow: var(--shadow-dark);
        }

        .wishlist-header {
          padding: 1.5rem 2rem;
          border-bottom: 1px solid rgba(59,130,246,0.1);
          background: rgba(59,130,246,0.02);
        }

        .dark .wishlist-header {
          border-bottom-color: rgba(76,205,196,0.1);
          background: rgba(76,205,196,0.05);
        }

        .wishlist-title {
          font-size: 1.5rem;
          font-weight: 600;
          color: var(--blue-dark);
        }

        .dark .wishlist-title {
          color: var(--dark-text);
        }

        .wishlist-items {
          padding: 1rem;
        }

        .wishlist-item {
          display: flex;
          align-items: center;
          padding: 1.5rem;
          border-bottom: 1px solid rgba(59,130,246,0.1);
          transition: all var(--speed) ease;
        }

        .wishlist-item:last-child {
          border-bottom: none;
        }

        .wishlist-item:hover {
          background: rgba(59,130,246,0.02);
        }

        .dark .wishlist-item {
          border-bottom-color: rgba(76,205,196,0.1);
        }

        .dark .wishlist-item:hover {
          background: rgba(76,205,196,0.05);
        }

        .item-details {
          flex: 1;
        }

        .item-name {
          font-size: 1.2rem;
          font-weight: 600;
          color: var(--blue-dark);
          margin-bottom: 0.25rem;
        }

        .dark .item-name {
          color: var(--dark-text);
        }

        .item-category {
          font-size: 0.875rem;
          color: var(--white-text-soft);
          margin-bottom: 0.5rem;
        }

        .dark .item-category {
          color: var(--dark-text-soft);
        }

        .item-description {
          font-size: 0.875rem;
          color: var(--white-text-soft);
          line-height: 1.4;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }

        .dark .item-description {
          color: var(--dark-text-soft);
        }

        .item-price {
          font-size: 1.5rem;
          font-weight: 700;
          color: var(--blue);
          margin: 0 2rem;
        }

        .dark .item-price {
          color: var(--teal);
        }

        .quantity-controls {
          display: flex;
          align-items: center;
          gap: 1rem;
          margin: 0 2rem;
        }

        .quantity-btn {
          width: 36px;
          height: 36px;
          border: 1px solid rgba(59,130,246,0.2);
          border-radius: 8px;
          background: var(--white-bg);
          color: var(--blue);
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all var(--speed) ease;
        }

        .quantity-btn:hover {
          background: var(--blue);
          color: white;
        }

        .dark .quantity-btn {
          background: var(--dark-card-light);
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
          color: var(--blue-dark);
        }

        .dark .quantity-display {
          color: var(--dark-text);
        }

        .remove-btn {
          width: 40px;
          height: 40px;
          border: none;
          border-radius: 50%;
          background: rgba(239,68,68,0.1);
          color: #ef4444;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all var(--speed) ease;
        }

        .remove-btn:hover {
          background: #ef4444;
          color: white;
          transform: scale(1.1);
        }

        /* Payment Section */
        .payment-section {
          position: fixed;
          bottom: 0;
          left: 280px;
          right: 0;
          background: var(--white-card);
          border-top: 1px solid rgba(59,130,246,0.1);
          padding: 1.5rem 2rem;
          box-shadow: 0 -4px 12px rgba(59,130,246,0.1);
          transition: all var(--speed) ease;
        }

        .dark .payment-section {
          background: var(--dark-card);
          border-top-color: rgba(76,205,196,0.1);
          box-shadow: 0 -4px 12px rgba(76,205,196,0.2);
        }

        .payment-content {
          display: flex;
          justify-content: space-between;
          align-items: center;
          max-width: 1120px;
          margin: 0 auto;
        }

        .payment-summary {
          display: flex;
          align-items: center;
          gap: 2rem;
        }

        .total-amount {
          font-size: 1.5rem;
          font-weight: 700;
          color: var(--blue-dark);
        }

        .dark .total-amount {
          color: var(--dark-text);
        }

        .total-items {
          font-size: 1rem;
          color: var(--white-text-soft);
        }

        .dark .total-items {
          color: var(--dark-text-soft);
        }

        .pay-btn {
          padding: 1rem 2rem;
          background: linear-gradient(135deg, var(--blue), var(--blue-deep));
          color: white;
          border: none;
          border-radius: 12px;
          font-weight: 600;
          font-size: 1.1rem;
          cursor: pointer;
          display: flex;
          align-items: center;
          gap: 0.5rem;
          transition: all var(--speed) ease;
          min-width: 150px;
          justify-content: center;
        }

        .pay-btn:hover:not(:disabled) {
          transform: translateY(-2px);
          box-shadow: 0 8px 25px rgba(59,130,246,0.3);
        }

        .pay-btn:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }

        .dark .pay-btn {
          background: linear-gradient(135deg, var(--rose), var(--teal));
        }

        /* Loading States */
        .loading-container {
          display: flex;
          justify-content: center;
          align-items: center;
          padding: 4rem;
        }

        .loading-spinner {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          color: var(--blue);
          font-size: 1.1rem;
        }

        .dark .loading-spinner {
          color: var(--teal);
        }

        .spinner {
          width: 20px;
          height: 20px;
          border: 2px solid transparent;
          border-top: 2px solid currentColor;
          border-radius: 50%;
          animation: spin 1s linear infinite;
        }

        @keyframes spin {
          to {
            transform: rotate(360deg);
          }
        }

        /* Error States */
        .error-container {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 3rem;
          text-align: center;
          background: var(--white-card);
          border-radius: 20px;
          border: 1px solid rgba(239,68,68,0.2);
          margin: 2rem 0;
        }

        .dark .error-container {
          background: var(--dark-card);
        }

        .error-icon {
          font-size: 3rem;
          color: var(--rose);
          margin-bottom: 1rem;
        }

        .error-title {
          font-size: 1.5rem;
          font-weight: 600;
          color: var(--blue-dark);
          margin-bottom: 0.5rem;
        }

        .dark .error-title {
          color: var(--dark-text);
        }

        .error-message {
          color: var(--white-text-soft);
          margin-bottom: 1.5rem;
        }

        .dark .error-message {
          color: var(--dark-text-soft);
        }

        .retry-btn {
          padding: 0.75rem 1.5rem;
          background: linear-gradient(135deg, var(--blue), var(--blue-deep));
          color: white;
          border: none;
          border-radius: 12px;
          font-weight: 600;
          cursor: pointer;
          display: flex;
          align-items: center;
          gap: 0.5rem;
          transition: all var(--speed) ease;
        }

        .retry-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 25px rgba(59,130,246,0.3);
        }

        .dark .retry-btn {
          background: linear-gradient(135deg, var(--rose), var(--teal));
        }

        /* Empty State */
        .empty-state {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 4rem 2rem;
          text-align: center;
          color: var(--white-text-soft);
        }

        .dark .empty-state {
          color: var(--dark-text-soft);
        }

        .empty-icon {
          font-size: 4rem;
          margin-bottom: 1rem;
          opacity: 0.5;
        }

        .empty-title {
          font-size: 1.5rem;
          font-weight: 600;
          margin-bottom: 0.5rem;
          color: var(--blue-dark);
        }

        .dark .empty-title {
          color: var(--dark-text);
        }

        /* Theme Toggle */
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

        .dark .theme-toggle:hover {
          box-shadow: 0 6px 20px rgba(76,205,196,0.3);
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

        /* Animation Classes */
        .fade-in {
          animation: fadeIn 0.6s ease-out forwards;
          opacity: 0;
        }

        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .slide-in {
          animation: slideIn 0.8s ease-out forwards;
          opacity: 0;
          transform: translateX(-30px);
        }

        @keyframes slideIn {
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }

        /* Responsive */
        @media (max-width: 1024px) {
          .sidebar {
            width: 240px;
          }
          
          .main-content {
            margin-left: 240px;
          }
          
          .payment-section {
            left: 240px;
          }
        }

        @media (max-width: 768px) {
          .sidebar {
            transform: translateX(-100%);
          }
          
          .main-content {
            margin-left: 0;
            padding: 1rem;
            padding-bottom: 100px;
          }
          
          .payment-section {
            left: 0;
          }
          
          .stats-grid {
            grid-template-columns: 1fr;
          }

          .wishlist-item {
            flex-direction: column;
            align-items: stretch;
            gap: 1rem;
          }

          .quantity-controls, .item-price {
            margin: 0;
            justify-content: center;
          }

          .payment-content {
            flex-direction: column;
            gap: 1rem;
          }
        }
      `}</style>

      {/* Navbar */}
      <nav className="navbar">
        <div className="nav-container">
          <div className="logo">RentalHub</div>
          <div className="nav-user">
            <div className="nav-icon">
              <FaBell />
            </div>
            <div className="nav-icon">
              <FaCog />
            </div>
            <Link to="/profile" className="user-avatar">
              <FaUser />
            </Link>
          </div>
        </div>
      </nav>

      <div className="dashboard-layout">
        {/* Sidebar */}
        <aside className="sidebar">
          <ul className="sidebar-menu">
            <li className="sidebar-item">
              <Link to="/dashboard" className="sidebar-link">
                <FaBox />
                Products
              </Link>
            </li>
            <li className="sidebar-item">
              <div className="sidebar-link active">
                <FaHeart />
                Wishlist
              </div>
            </li>
            <li className="sidebar-item">
              <Link to="/bookings" className="sidebar-link">
                <FaCalendarAlt />
                My Bookings
              </Link>
            </li>
            <li className="sidebar-item">
              <Link to="/payments" className="sidebar-link">
                <FaCreditCard />
                Payments
              </Link>
            </li>
            <li className="sidebar-item">
              <Link to="/profile" className="sidebar-link">
                <FaUser />
                Profile
              </Link>
            </li>
            <li className="sidebar-item">
              <Link to="/settings" className="sidebar-link">
                <FaCog />
                Settings
              </Link>
            </li>
          </ul>
        </aside>

        {/* Main Content */}
        <main className="main-content">
          {/* Dashboard Header */}
          <div className="dashboard-header fade-in">
            <h1 className="dashboard-title">My Wishlist</h1>
            <p className="dashboard-subtitle">
              Your saved items ready for rental. Manage quantities and proceed to payment.
            </p>
          </div>

          {/* Stats Grid */}
          <div className="stats-grid">
            {stats.map((stat, index) => (
              <div key={index} className="stat-card fade-in" style={{ animationDelay: `${index * 0.1}s` }}>
                <div className="stat-header">
                  <div className="stat-icon" style={{ backgroundColor: stat.color }}>
                    <stat.icon />
                  </div>
                  <div className="stat-trend">{stat.trend}</div>
                </div>
                <div className="stat-value">{stat.value}</div>
                <div className="stat-label">{stat.title}</div>
              </div>
            ))}
          </div>

          {/* Search Bar */}
          <div className="search-bar slide-in">
            <FaSearch className="search-icon" />
            <input 
              type="text"
              className="search-input"
              placeholder="Search wishlist items..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          {/* Wishlist Items */}
          {initialLoading ? (
            <div className="loading-container">
              <div className="loading-spinner">
                <div className="spinner"></div>
                Loading your wishlist...
              </div>
            </div>
          ) : error && wishlistItems.length === 0 ? (
            <div className="error-container">
              <FaExclamationTriangle className="error-icon" />
              <h3 className="error-title">Failed to Load Wishlist</h3>
              <p className="error-message">{error}</p>
              <button className="retry-btn" onClick={handleRetry}>
                <FaRedo />
                Retry
              </button>
            </div>
          ) : filteredItems.length === 0 ? (
            <div className="empty-state">
              <FaHeart className="empty-icon" />
              <h3 className="empty-title">
                {searchTerm ? 'No items found' : 'Your wishlist is empty'}
              </h3>
              <p>
                {searchTerm 
                  ? 'Try searching with different keywords.' 
                  : 'Browse products and add items to your wishlist to see them here.'
                }
              </p>
            </div>
          ) : (
            <div className="wishlist-container slide-in">
              <div className="wishlist-header">
                <h2 className="wishlist-title">
                  Wishlist Items ({filteredItems.length})
                </h2>
              </div>
              <div className="wishlist-items">
                {filteredItems.map((item, index) => (
                  <div key={item.id} className="wishlist-item" style={{ animationDelay: `${index * 0.05}s` }}>
                    <div className="item-details">
                      <h3 className="item-name">{item.name}</h3>
                      <p className="item-category">{item.category}</p>
                      <p className="item-description">{item.description}</p>
                    </div>
                    
                    <div className="item-price">
                      ${item.price}/day
                    </div>
                    
                    <div className="quantity-controls">
                      <button 
                        className="quantity-btn"
                        onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
                      >
                        <FaMinus />
                      </button>
                      <span className="quantity-display">{item.quantity}</span>
                      <button 
                        className="quantity-btn"
                        onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                      >
                        <FaPlus />
                      </button>
                    </div>
                    
                    <button 
                      className="remove-btn"
                      onClick={() => handleRemoveFromWishlist(item.id)}
                      title="Remove from wishlist"
                    >
                      <FaTrash />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </main>
      </div>

      {/* Payment Section */}
      {wishlistItems.length > 0 && (
        <div className="payment-section">
          <div className="payment-content">
            <div className="payment-summary">
              <div className="total-amount">
                Total: ${calculateTotalAmount().toFixed(2)}/day
              </div>
              <div className="total-items">
                {wishlistItems.reduce((sum, item) => sum + item.quantity, 0)} items
              </div>
            </div>
            <button 
              className="pay-btn" 
              onClick={handlePayment}
              disabled={paymentLoading}
            >
              {paymentLoading ? (
                <>
                  <FaSpinner className="spinner" />
                  Processing...
                </>
              ) : (
                <>
                  <FaCreditCard />
                  Pay Now
                </>
              )}
            </button>
          </div>
        </div>
      )}

      {/* Theme Toggle */}
      <button className="theme-toggle" onClick={() => setIsDarkMode(!isDarkMode)}>
        <div className={`toggle-slider ${isDarkMode ? 'toggle-slider-dark' : ''}`}>
          {isDarkMode ? '🌙' : '☀️'}
        </div>
      </button>
    </div>
  );
};

export default WishlistPage;
