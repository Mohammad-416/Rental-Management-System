import React, { useState, useEffect, useCallback, useRef } from 'react';
import { 
  FaPlus, FaEdit, FaTrash, FaEye, FaSearch, FaFilter, FaDownload,
  FaBox, FaDollarSign, FaChartLine, FaUsers, FaHome, FaCog,
  FaBell, FaUser, FaSignOutAlt, FaUpload, FaImage, FaStar,
  FaHeart, FaShare, FaCopy, FaBarcode, FaTags, FaCalendarAlt,
  FaSpinner, FaExclamationTriangle, FaRedo, FaStore
} from 'react-icons/fa';
import { Link } from 'react-router-dom';
import axios from 'axios';

const SellerDashboard = ({ onCreateProduct }) => {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [activeTab, setActiveTab] = useState('products');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');
  
  // Infinite Scrolling States
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [page, setPage] = useState(1);
  const [error, setError] = useState(null);
  const [initialLoading, setInitialLoading] = useState(true);
  const observerRef = useRef();

  // Stats data
  const [stats, setStats] = useState([
    { title: 'My Products', value: '0', icon: FaBox, color: '#3b82f6', trend: '+0' },
    { title: 'Total Earnings', value: '$0', icon: FaDollarSign, color: '#10b981', trend: '+0%' },
    { title: 'Active Rentals', value: '0', icon: FaChartLine, color: '#f59e0b', trend: '+0' },
    { title: 'Total Views', value: '0', icon: FaEye, color: '#8b5cf6', trend: '+0' }
  ]);

  // Apply dark mode to body
  useEffect(() => {
    if (isDarkMode) {
      document.body.classList.add('dark');
    } else {
      document.body.classList.remove('dark');
    }
  }, [isDarkMode]);

  // Configure axios for CSRF
  useEffect(() => {
    const setupCSRF = async () => {
      try {
        await axios.get('http://localhost:8000/api/auth/csrf/', {
          withCredentials: true
        });
      } catch (error) {
        console.error('CSRF setup failed:', error);
      }
    };
    setupCSRF();
  }, []);

  // Fetch products from API
  const fetchProducts = useCallback(async (pageNum = 1, reset = false) => {
    if (loading && !reset) return;
    
    setLoading(true);
    setError(null);

    try {
      const params = new URLSearchParams({
        page: pageNum.toString(),
        limit: '12',
        ...(searchTerm && { search: searchTerm }),
        ...(filterCategory !== 'all' && { category: filterCategory })
      });

      const response = await axios.get(`http://localhost:8000/api/rentals/products/?${params}`, {
        withCredentials: true,
        headers: {
          'Content-Type': 'application/json',
        }
      });

      let newProducts = [];
      let totalCount = 0;

      if (response.data.results) {
        newProducts = response.data.results;
        totalCount = response.data.count || 1000;
      } else if (Array.isArray(response.data)) {
        newProducts = response.data;
        totalCount = response.data.length;
      } else if (response.data.data) {
        newProducts = response.data.data;
        totalCount = response.data.total || response.data.count || 1000;
      }

      if (reset || pageNum === 1) {
        setProducts(newProducts);
      } else {
        setProducts(prev => [...prev, ...newProducts]);
      }

      setHasMore(newProducts.length > 0 && newProducts.length === 12);
      setPage(pageNum + 1);

      // Update stats if we have data
      if (newProducts.length > 0 && pageNum === 1) {
        setStats([
          { title: 'My Products', value: totalCount.toString(), icon: FaBox, color: '#3b82f6', trend: '+5' },
          { title: 'Total Earnings', value: '$12,450', icon: FaDollarSign, color: '#10b981', trend: '+23%' },
          { title: 'Active Rentals', value: '34', icon: FaChartLine, color: '#f59e0b', trend: '+12' },
          { title: 'Total Views', value: '2,847', icon: FaEye, color: '#8b5cf6', trend: '+18%' }
        ]);
      }

    } catch (err) {
      console.error('Error fetching products:', err);
      const errorMessage = err.response?.data?.message || err.message || 'Failed to load products';
      setError(errorMessage);
      
      // Fallback to sample data
      if (pageNum === 1) {
        const sampleProducts = [
          { 
            id: 'S001', 
            title: 'Professional DSLR Camera', 
            category: 'Electronics', 
            price: 2400, 
            status: 'active',
            views: 156,
            rentals: 23,
            earnings: '$1,840',
            images: ['https://images.unsplash.com/photo-1606983340126-99ab4feaa64a?w=300&h=200&fit=crop'],
            expiration_date: '2025-12-31',
            pickup_date: '2025-08-15'
          },
          { 
            id: 'S002', 
            title: 'Gaming Setup Complete', 
            category: 'Electronics', 
            price: 1800, 
            status: 'active',
            views: 203,
            rentals: 31,
            earnings: '$2,580',
            images: ['https://images.unsplash.com/photo-1593642702749-b7d2a804fbcf?w=300&h=200&fit=crop'],
            expiration_date: '2025-11-30',
            pickup_date: '2025-08-16'
          },
          { 
            id: 'S003', 
            title: 'Party Sound System', 
            category: 'Audio Equipment', 
            price: 3200, 
            status: 'rented',
            views: 89,
            rentals: 18,
            earnings: '$3,200',
            images: ['https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=300&h=200&fit=crop'],
            expiration_date: '2025-10-15',
            pickup_date: '2025-08-20'
          }
        ];
        setProducts(sampleProducts);
        setHasMore(false);
        setError(null);
      }
    } finally {
      setLoading(false);
      setInitialLoading(false);
    }
  }, [searchTerm, filterCategory, loading]);

  // Initial load
  useEffect(() => {
    fetchProducts(1, true);
  }, []);

  // Search and filter debounce
  useEffect(() => {
    const debounceTimer = setTimeout(() => {
      setPage(1);
      setProducts([]);
      fetchProducts(1, true);
    }, 500);

    return () => clearTimeout(debounceTimer);
  }, [searchTerm, filterCategory]);

  // Infinite scroll observer
  const lastProductRef = useCallback(node => {
    if (loading) return;
    if (observerRef.current) observerRef.current.disconnect();
    
    observerRef.current = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting && hasMore) {
        fetchProducts(page);
      }
    });
    
    if (node) observerRef.current.observe(node);
  }, [loading, hasMore, page, fetchProducts]);

  const getStatusColor = (status) => {
    switch (status) {
      case 'active': return '#10b981';
      case 'rented': return '#f59e0b';
      case 'inactive': return '#6b7280';
      case 'expired': return '#ef4444';
      default: return '#3b82f6';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'active': return 'Available';
      case 'rented': return 'Rented Out';
      case 'inactive': return 'Inactive';
      case 'expired': return 'Expired';
      default: return 'Available';
    }
  };

  const handleRetry = () => {
    setError(null);
    setPage(1);
    setProducts([]);
    setInitialLoading(true);
    fetchProducts(1, true);
  };

  const handleSidebarClick = (tab) => {
    setActiveTab(tab);
    console.log('Navigated to:', tab);
  };

  const handleDeleteProduct = (productId) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      setProducts(prev => prev.filter(p => p.id !== productId));
      // Here you would also call the delete API
      console.log('Deleting product:', productId);
    }
  };

  return (
    <div className={`seller-dashboard ${isDarkMode ? 'dark' : ''}`}>
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

        .seller-dashboard {
          font-family: 'Inter', ui-sans-serif, system-ui, sans-serif;
          background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%);
          color: var(--white-text);
          min-height: 100vh;
          transition: all var(--speed-long) ease;
          scroll-behavior: smooth;
        }

        .seller-dashboard.dark {
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
          transform: scale(1.05);
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
          overflow-y: auto;
          scroll-behavior: smooth;
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

        /* Search and Filter Bar */
        .search-filter-bar {
          display: flex;
          gap: 1rem;
          margin-bottom: 2rem;
          align-items: center;
          flex-wrap: wrap;
        }

        .search-wrapper {
          position: relative;
          flex: 1;
          min-width: 300px;
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

        .filter-select {
          padding: 0.75rem 1rem;
          border: 2px solid rgba(59,130,246,0.1);
          border-radius: 12px;
          background: var(--white-card);
          color: var(--blue-dark);
          outline: none;
          cursor: pointer;
          transition: all var(--speed) ease;
        }

        .dark .filter-select {
          background: var(--dark-card-light);
          border-color: rgba(76,205,196,0.2);
          color: var(--dark-text);
        }

        .add-product-btn {
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

        .add-product-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 25px rgba(59,130,246,0.3);
        }

        .dark .add-product-btn {
          background: linear-gradient(135deg, var(--rose), var(--teal));
        }

        /* Products Grid */
        .products-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
          gap: 1.5rem;
          margin-bottom: 2rem;
        }

        .product-card {
          background: var(--white-card);
          border-radius: 20px;
          border: 1px solid rgba(59,130,246,0.1);
          box-shadow: var(--shadow-light);
          overflow: hidden;
          transition: all var(--speed) ease;
          position: relative;
        }

        .product-card:hover {
          transform: translateY(-8px) scale(1.02);
          box-shadow: 0 20px 40px rgba(59,130,246,0.2);
        }

        .dark .product-card {
          background: var(--dark-card);
          border-color: rgba(76,205,196,0.1);
          box-shadow: var(--shadow-dark);
        }

        .dark .product-card:hover {
          box-shadow: 0 20px 40px rgba(76,205,196,0.3);
        }

        .product-image {
          width: 100%;
          height: 200px;
          background-size: cover;
          background-position: center;
          position: relative;
          background-color: #f3f4f6;
        }

        .product-status {
          position: absolute;
          top: 0.75rem;
          right: 0.75rem;
          padding: 0.25rem 0.75rem;
          border-radius: 20px;
          font-size: 0.75rem;
          font-weight: 600;
          color: white;
          text-transform: uppercase;
        }

        .product-content {
          padding: 1.5rem;
        }

        .product-name {
          font-size: 1.2rem;
          font-weight: 600;
          color: var(--blue-dark);
          margin-bottom: 0.25rem;
        }

        .dark .product-name {
          color: var(--dark-text);
        }

        .product-category {
          font-size: 0.875rem;
          color: var(--white-text-soft);
          margin-bottom: 1rem;
        }

        .dark .product-category {
          color: var(--dark-text-soft);
        }

        .product-stats {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 1rem;
          margin: 1rem 0;
          padding: 1rem;
          background: rgba(59,130,246,0.02);
          border-radius: 12px;
        }

        .dark .product-stats {
          background: rgba(76,205,196,0.05);
        }

        .stat-item {
          text-align: center;
        }

        .stat-value-small {
          font-size: 1.25rem;
          font-weight: 700;
          color: var(--blue);
        }

        .dark .stat-value-small {
          color: var(--teal);
        }

        .stat-label-small {
          font-size: 0.75rem;
          color: var(--white-text-soft);
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        .dark .stat-label-small {
          color: var(--dark-text-soft);
        }

        .product-footer {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .product-price {
          font-size: 1.25rem;
          font-weight: 700;
          color: var(--blue);
        }

        .dark .product-price {
          color: var(--teal);
        }

        .product-actions {
          display: flex;
          gap: 0.5rem;
        }

        .action-btn {
          width: 36px;
          height: 36px;
          border: none;
          border-radius: 8px;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all var(--speed) ease;
          color: white;
        }

        .action-btn:hover {
          transform: translateY(-2px) scale(1.1);
        }

        .action-btn.view { background: rgba(59,130,246,0.8); }
        .action-btn.edit { background: rgba(16,185,129,0.8); }
        .action-btn.delete { background: rgba(239,68,68,0.8); }

        /* Loading States */
        .loading-container {
          display: flex;
          justify-content: center;
          align-items: center;
          padding: 2rem;
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
          
          .products-grid {
            grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
          }
        }

        @media (max-width: 768px) {
          .sidebar {
            transform: translateX(-100%);
          }
          
          .main-content {
            margin-left: 0;
            padding: 1rem;
          }
          
          .stats-grid {
            grid-template-columns: 1fr;
          }

          .products-grid {
            grid-template-columns: 1fr;
          }

          .search-filter-bar {
            flex-direction: column;
            align-items: stretch;
          }

          .search-wrapper {
            min-width: auto;
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
            <div className="user-avatar">
              <FaStore />
            </div>
          </div>
        </div>
      </nav>

      <div className="dashboard-layout">
        {/* Sidebar */}
        <aside className="sidebar">
          <ul className="sidebar-menu">
            <li className="sidebar-item">
              <div 
                className={`sidebar-link ${activeTab === 'products' ? 'active' : ''}`}
                onClick={() => handleSidebarClick('products')}
              >
                <FaBox />
                My Products
              </div>
            </li>
            <li className="sidebar-item">
              <div 
                className={`sidebar-link ${activeTab === 'analytics' ? 'active' : ''}`}
                onClick={() => handleSidebarClick('analytics')}
              >
                <FaChartLine />
                Analytics
              </div>
            </li>
            <li className="sidebar-item">
              <div 
                className={`sidebar-link ${activeTab === 'orders' ? 'active' : ''}`}
                onClick={() => handleSidebarClick('orders')}
              >
                <FaCalendarAlt />
                Orders
              </div>
            </li>
            <li className="sidebar-item">
              <div 
                className={`sidebar-link ${activeTab === 'earnings' ? 'active' : ''}`}
                onClick={() => handleSidebarClick('earnings')}
              >
                <FaDollarSign />
                Earnings
              </div>
            </li>
            <li className="sidebar-item">
              <div 
                className={`sidebar-link ${activeTab === 'profile' ? 'active' : ''}`}
                onClick={() => handleSidebarClick('profile')}
              >
                <FaUser />
                Profile
              </div>
            </li>
            <li className="sidebar-item">
              <div 
                className={`sidebar-link ${activeTab === 'settings' ? 'active' : ''}`}
                onClick={() => handleSidebarClick('settings')}
              >
                <FaCog />
                Settings
              </div>
            </li>
          </ul>
        </aside>

        {/* Main Content */}
        <main className="main-content">
          {/* Dashboard Header */}
          <div className="dashboard-header fade-in">
            <h1 className="dashboard-title">Seller Dashboard</h1>
            <p className="dashboard-subtitle">
              Manage your rental products, track earnings, and grow your business.
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

          {/* Search and Filter Bar */}
          <div className="search-filter-bar slide-in">
            <div className="search-wrapper">
              <FaSearch className="search-icon" />
              <input 
                type="text"
                className="search-input"
                placeholder="Search your products..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <select 
              className="filter-select"
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
            >
              <option value="all">All Categories</option>
              <option value="electronics">Electronics</option>
              <option value="tools">Tools</option>
              <option value="audio">Audio Equipment</option>
              <option value="furniture">Furniture</option>
              <option value="events">Events</option>
            </select>
            <button className="add-product-btn" onClick={onCreateProduct}>
              <FaPlus />
              Add Product
            </button>
          </div>

          {/* Products Grid */}
          {initialLoading ? (
            <div className="loading-container">
              <div className="loading-spinner">
                <div className="spinner"></div>
                Loading products...
              </div>
            </div>
          ) : error && products.length === 0 ? (
            <div className="error-container">
              <FaExclamationTriangle className="error-icon" />
              <h3 className="error-title">Failed to Load Products</h3>
              <p className="error-message">{error}</p>
              <button className="retry-btn" onClick={handleRetry}>
                <FaRedo />
                Retry
              </button>
            </div>
          ) : products.length === 0 ? (
            <div className="empty-state">
              <FaBox className="empty-icon" />
              <h3 className="empty-title">No Products Yet</h3>
              <p>Start by adding your first rental product to begin earning.</p>
            </div>
          ) : (
            <>
              <div className="products-grid">
                {products.map((product, index) => (
                  <div 
                    key={product.id || index} 
                    className="product-card slide-in" 
                    style={{ animationDelay: `${(index % 12) * 0.05}s` }}
                    ref={index === products.length - 1 ? lastProductRef : null}
                  >
                    <div 
                      className="product-image"
                      style={{ 
                        backgroundImage: `url(${product.images?.[0] || 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=300&h=200&fit=crop'})` 
                      }}
                    >
                      <div 
                        className="product-status" 
                        style={{ backgroundColor: getStatusColor(product.status || 'active') }}
                      >
                        {getStatusText(product.status || 'active')}
                      </div>
                    </div>
                    <div className="product-content">
                      <div className="product-header">
                        <div>
                          <h3 className="product-name">{product.title || product.name || 'Product Name'}</h3>
                          <p className="product-category">{product.category || 'General'}</p>
                        </div>
                      </div>
                      
                      <div className="product-stats">
                        <div className="stat-item">
                          <div className="stat-value-small">{product.views || '0'}</div>
                          <div className="stat-label-small">Views</div>
                        </div>
                        <div className="stat-item">
                          <div className="stat-value-small">{product.rentals || '0'}</div>
                          <div className="stat-label-small">Rentals</div>
                        </div>
                        <div className="stat-item">
                          <div className="stat-value-small">{product.earnings || '$0'}</div>
                          <div className="stat-label-small">Earned</div>
                        </div>
                        <div className="stat-item">
                          <div className="stat-value-small">
                            {product.expiration_date ? new Date(product.expiration_date).toLocaleDateString() : 'N/A'}
                          </div>
                          <div className="stat-label-small">Expires</div>
                        </div>
                      </div>

                      <div className="product-footer">
                        <div className="product-price">
                          ${product.price || '0'}/day
                        </div>
                        <div className="product-actions">
                          <button className="action-btn view" title="View Details">
                            <FaEye />
                          </button>
                          <button className="action-btn edit" title="Edit Product">
                            <FaEdit />
                          </button>
                          <button 
                            className="action-btn delete" 
                            title="Delete Product"
                            onClick={() => handleDeleteProduct(product.id)}
                          >
                            <FaTrash />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Loading more indicator */}
              {loading && !initialLoading && (
                <div className="loading-container">
                  <div className="loading-spinner">
                    <div className="spinner"></div>
                    Loading more products...
                  </div>
                </div>
              )}

              {/* End of results indicator */}
              {!hasMore && products.length > 0 && (
                <div style={{ textAlign: 'center', padding: '2rem', color: 'var(--white-text-soft)' }}>
                  <p>You've reached the end of your product list</p>
                </div>
              )}
            </>
          )}
        </main>
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

export default SellerDashboard;
