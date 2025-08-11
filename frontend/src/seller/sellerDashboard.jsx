import React, { useState, useEffect } from 'react';
import { 
  FaHome, FaBox, FaCalendarAlt, FaCreditCard, FaBell, 
  FaUser, FaSearch, FaFilter, FaPlus, FaEdit, FaTrash, 
  FaEye, FaDownload, FaChartBar, FaTruck, FaClock,
  FaCheck, FaTimes, FaExclamationTriangle, FaStore,
  FaDollarSign, FaUsers, FaStar, FaArrowUp,
} from 'react-icons/fa';
import axios from 'axios';

const AnalyticsDashboard = ({ isSeller = true }) => {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');

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

  // Seller-specific stats
  const dashboardStats = [
    { title: 'Total Earnings', value: '$24,580', icon: FaDollarSign, color: '#10b981', trend: '+18%' },
    { title: 'Active Products', value: '47', icon: FaBox, color: '#3b82f6', trend: '+5' },
    { title: 'Total Orders', value: '238', icon: FaCalendarAlt, color: '#f59e0b', trend: '+12' },
    { title: 'Customer Rating', value: '4.8', icon: FaStar, color: '#8b5cf6', trend: '+0.2' }
  ];

  // Recent orders from customers
  const recentOrders = [
    { 
      id: 'ORD-001', 
      customer: 'John Smith', 
      product: 'Professional DSLR Camera', 
      status: 'active', 
      startDate: '2025-08-10', 
      endDate: '2025-08-12', 
      amount: '$240',
      profit: '$180'
    },
    { 
      id: 'ORD-002', 
      customer: 'Sarah Johnson', 
      product: 'Gaming Laptop RTX 4080', 
      status: 'pending_pickup', 
      startDate: '2025-08-13', 
      endDate: '2025-08-15', 
      amount: '$360',
      profit: '$270'
    },
    { 
      id: 'ORD-003', 
      customer: 'Mike Chen', 
      product: 'Party Sound System', 
      status: 'returned', 
      startDate: '2025-08-05', 
      endDate: '2025-08-07', 
      amount: '$640',
      profit: '$480'
    },
    { 
      id: 'ORD-004', 
      customer: 'Emily Davis', 
      product: 'Wedding Decoration Kit', 
      status: 'cancelled', 
      startDate: '2025-08-08', 
      endDate: '2025-08-10', 
      amount: '$900',
      profit: '$0'
    }
  ];

  // Performance metrics
  const performanceMetrics = [
    { 
      title: 'Revenue This Month', 
      value: '$8,450', 
      change: '+23%', 
      trend: 'up',
      icon: FaDollarSign 
    },
    { 
      title: 'Product Views', 
      value: '1,247', 
      change: '+8%', 
      trend: 'up',
      icon: FaEye 
    },
    { 
      title: 'Conversion Rate', 
      value: '12.4%', 
      change: '+2.1%', 
      trend: 'up',
      icon: FaStar 
    },
    { 
      title: 'Customer Reviews', 
      value: '4.8/5', 
      change: '+0.2', 
      trend: 'up',
      icon: FaStar 
    }
  ];

  // Top performing products
  const topProducts = [
    { id: 1, name: 'Professional DSLR Camera', orders: 23, revenue: '$5,520', rating: 4.9 },
    { id: 2, name: 'Gaming Laptop RTX 4080', orders: 18, revenue: '$6,480', rating: 4.8 },
    { id: 3, name: 'Party Sound System', orders: 15, revenue: '$4,800', rating: 4.7 },
    { id: 4, name: 'Wedding Decoration Kit', orders: 12, revenue: '$10,800', rating: 4.9 }
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case 'active': return '#10b981';
      case 'pending_pickup': return '#f59e0b';
      case 'returned': return '#6b7280';
      case 'cancelled': return '#ef4444';
      default: return '#3b82f6';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'active': return FaCheck;
      case 'pending_pickup': return FaClock;
      case 'returned': return FaBox;
      case 'cancelled': return FaTimes;
      default: return FaBox;
    }
  };

  return (
    <div className={`dashboard-container ${isDarkMode ? 'dark' : ''}`}>
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

        .dashboard-container {
          font-family: 'Inter', ui-sans-serif, system-ui, sans-serif;
          background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%);
          color: var(--white-text);
          min-height: 100vh;
          transition: all var(--speed-long) ease;
        }

        .dashboard-container.dark {
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

        /* Content Grid */
        .content-grid {
          display: grid;
          grid-template-columns: 2fr 1fr;
          gap: 2rem;
          margin-bottom: 2rem;
        }

        /* Performance Grid */
        .performance-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
          gap: 1.5rem;
          margin-bottom: 2rem;
        }

        /* Cards */
        .dashboard-card {
          background: var(--white-card);
          border-radius: 20px;
          border: 1px solid rgba(59,130,246,0.1);
          box-shadow: var(--shadow-light);
          overflow: hidden;
          transition: all var(--speed) ease;
        }

        .dark .dashboard-card {
          background: var(--dark-card);
          border-color: rgba(76,205,196,0.1);
          box-shadow: var(--shadow-dark);
        }

        .card-header {
          padding: 2rem 2rem 1rem;
          border-bottom: 1px solid rgba(59,130,246,0.1);
          display: flex;
          align-items: center;
          justify-content: space-between;
        }

        .dark .card-header {
          border-bottom-color: rgba(76,205,196,0.1);
        }

        .card-title {
          font-size: 1.25rem;
          font-weight: 600;
          color: var(--blue-dark);
        }

        .dark .card-title {
          color: var(--dark-text);
        }

        .card-action {
          padding: 0.5rem 1rem;
          background: rgba(59,130,246,0.1);
          color: var(--blue);
          border: none;
          border-radius: 8px;
          cursor: pointer;
          font-weight: 500;
          transition: all var(--speed) ease;
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }

        .card-action:hover {
          background: var(--blue);
          color: white;
        }

        .dark .card-action {
          background: rgba(76,205,196,0.1);
          color: var(--teal);
        }

        .dark .card-action:hover {
          background: var(--teal);
          color: var(--dark-bg);
        }

        .card-content {
          padding: 2rem;
        }

        /* Order Table */
        .order-table {
          width: 100%;
          border-collapse: separate;
          border-spacing: 0;
        }

        .order-table th,
        .order-table td {
          padding: 1rem;
          text-align: left;
          border-bottom: 1px solid rgba(59,130,246,0.1);
        }

        .dark .order-table th,
        .dark .order-table td {
          border-bottom-color: rgba(76,205,196,0.1);
        }

        .order-table th {
          font-weight: 600;
          color: var(--white-text-soft);
          font-size: 0.875rem;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        .dark .order-table th {
          color: var(--dark-text-soft);
        }

        .order-table tr:hover {
          background: rgba(59,130,246,0.02);
        }

        .dark .order-table tr:hover {
          background: rgba(76,205,196,0.05);
        }

        .status-badge {
          padding: 0.5rem 1rem;
          border-radius: 20px;
          font-size: 0.875rem;
          font-weight: 600;
          color: white;
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
        }

        .order-actions {
          display: flex;
          gap: 0.5rem;
        }

        .action-btn {
          width: 32px;
          height: 32px;
          border: none;
          border-radius: 8px;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all var(--speed) ease;
        }

        .action-btn:hover {
          transform: translateY(-2px);
        }

        /* Performance Metrics */
        .metric-card {
          background: rgba(59,130,246,0.02);
          padding: 1.5rem;
          border-radius: 16px;
          border: 1px solid rgba(59,130,246,0.1);
          transition: all var(--speed) ease;
        }

        .metric-card:hover {
          background: rgba(59,130,246,0.05);
          transform: translateY(-4px);
        }

        .dark .metric-card {
          background: rgba(76,205,196,0.05);
          border-color: rgba(76,205,196,0.1);
        }

        .dark .metric-card:hover {
          background: rgba(76,205,196,0.08);
        }

        .metric-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 1rem;
        }

        .metric-icon {
          width: 2.5rem;
          height: 2.5rem;
          border-radius: 10px;
          background: linear-gradient(135deg, var(--blue), var(--blue-deep));
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
        }

        .dark .metric-icon {
          background: linear-gradient(135deg, var(--rose), var(--teal));
        }

        .metric-change {
          font-size: 0.875rem;
          font-weight: 600;
          color: #10b981;
          display: flex;
          align-items: center;
          gap: 0.25rem;
        }

        .metric-value {
          font-size: 2rem;
          font-weight: 800;
          color: var(--blue-dark);
          margin-bottom: 0.5rem;
        }

        .dark .metric-value {
          color: var(--dark-text);
        }

        .metric-label {
          color: var(--white-text-soft);
          font-weight: 500;
        }

        .dark .metric-label {
          color: var(--dark-text-soft);
        }

        /* Top Products */
        .product-item {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 1.5rem;
          border-radius: 12px;
          background: rgba(59,130,246,0.02);
          margin-bottom: 1rem;
          transition: all var(--speed) ease;
        }

        .product-item:hover {
          background: rgba(59,130,246,0.05);
          transform: translateX(4px);
        }

        .dark .product-item {
          background: rgba(76,205,196,0.05);
        }

        .dark .product-item:hover {
          background: rgba(76,205,196,0.08);
        }

        .product-info h4 {
          font-weight: 600;
          margin-bottom: 0.25rem;
          color: var(--blue-dark);
        }

        .dark .product-info h4 {
          color: var(--dark-text);
        }

        .product-info p {
          color: var(--white-text-soft);
          font-size: 0.875rem;
        }

        .dark .product-info p {
          color: var(--dark-text-soft);
        }

        .product-stats {
          text-align: right;
        }

        .product-revenue {
          font-weight: 700;
          color: var(--blue);
          margin-bottom: 0.25rem;
        }

        .dark .product-revenue {
          color: var(--teal);
        }

        .product-rating {
          display: flex;
          align-items: center;
          gap: 0.25rem;
          color: #fbbf24;
          font-size: 0.875rem;
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

        /* Responsive */
        @media (max-width: 1024px) {
          .sidebar {
            width: 240px;
          }
          
          .main-content {
            margin-left: 240px;
          }
          
          .content-grid {
            grid-template-columns: 1fr;
          }

          .performance-grid {
            grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
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

          .performance-grid {
            grid-template-columns: 1fr;
          }
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
      `}</style>

      {/* Navbar */}
      <nav className="navbar">
        <div className="nav-container">
          <div className="logo">RentalHub</div>
          <div className="nav-user">
            <div className="nav-icon">
              <FaBell />
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
                className={`sidebar-link ${activeTab === 'overview' ? 'active' : ''}`}
                onClick={() => setActiveTab('overview')}
              >
                <FaHome />
                Overview
              </div>
            </li>
            <li className="sidebar-item">
              <div 
                className={`sidebar-link ${activeTab === 'products' ? 'active' : ''}`}
                onClick={() => setActiveTab('products')}
              >
                <FaBox />
                My Products
              </div>
            </li>
            <li className="sidebar-item">
              <div 
                className={`sidebar-link ${activeTab === 'orders' ? 'active' : ''}`}
                onClick={() => setActiveTab('orders')}
              >
                <FaCalendarAlt />
                Orders
              </div>
            </li>
            <li className="sidebar-item">
              <div 
                className={`sidebar-link ${activeTab === 'analytics' ? 'active' : ''}`}
                onClick={() => setActiveTab('analytics')}
              >
                <FaChartBar />
                Analytics
              </div>
            </li>
            <li className="sidebar-item">
              <div 
                className={`sidebar-link ${activeTab === 'earnings' ? 'active' : ''}`}
                onClick={() => setActiveTab('earnings')}
              >
                <FaCreditCard />
                Earnings
              </div>
            </li>
            <li className="sidebar-item">
              <div 
                className={`sidebar-link ${activeTab === 'profile' ? 'active' : ''}`}
                onClick={() => setActiveTab('profile')}
              >
                <FaUser />
                Profile
              </div>
            </li>
          </ul>
        </aside>

        {/* Main Content */}
        <main className="main-content">
          {/* Dashboard Header */}
          <div className="dashboard-header fade-in">
            <h1 className="dashboard-title">Seller Analytics</h1>
            <p className="dashboard-subtitle">
              Track your business performance and grow your rental income.
            </p>
          </div>

          {/* Stats Grid */}
          <div className="stats-grid">
            {dashboardStats.map((stat, index) => (
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

          {/* Performance Metrics */}
          <div className="performance-grid">
            {performanceMetrics.map((metric, index) => (
              <div key={index} className="metric-card fade-in" style={{ animationDelay: `${index * 0.1}s` }}>
                <div className="metric-header">
                  <div className="metric-icon">
                    <metric.icon />
                  </div>
                  <div className="metric-change">
                    <FaArrowUp />
                    {metric.change}
                  </div>
                </div>
                <div className="metric-value">{metric.value}</div>
                <div className="metric-label">{metric.title}</div>
              </div>
            ))}
          </div>

          {/* Content Grid */}
          <div className="content-grid">
            {/* Recent Orders */}
            <div className="dashboard-card slide-in">
              <div className="card-header">
                <h2 className="card-title">Recent Customer Orders</h2>
                <button className="card-action">
                  <FaEye /> 
                  View All
                </button>
              </div>
              <div className="card-content">
                <table className="order-table">
                  <thead>
                    <tr>
                      <th>Order ID</th>
                      <th>Customer</th>
                      <th>Product</th>
                      <th>Status</th>
                      <th>Profit</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {recentOrders.map((order) => {
                      const StatusIcon = getStatusIcon(order.status);
                      return (
                        <tr key={order.id}>
                          <td className="font-medium">{order.id}</td>
                          <td>{order.customer}</td>
                          <td>{order.product}</td>
                          <td>
                            <span 
                              className="status-badge" 
                              style={{ backgroundColor: getStatusColor(order.status) }}
                            >
                              <StatusIcon className="text-xs" />
                              {order.status.replace('_', ' ')}
                            </span>
                          </td>
                          <td className="font-semibold">{order.profit}</td>
                          <td>
                            <div className="order-actions">
                              <button 
                                className="action-btn"
                                style={{ backgroundColor: 'rgba(59,130,246,0.1)', color: 'var(--blue)' }}
                              >
                                <FaEye />
                              </button>
                              <button 
                                className="action-btn"
                                style={{ backgroundColor: 'rgba(16,185,129,0.1)', color: '#10b981' }}
                              >
                                <FaDownload />
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Top Performing Products */}
            <div className="dashboard-card slide-in" style={{ animationDelay: '0.2s' }}>
              <div className="card-header">
                <h2 className="card-title">Top Products</h2>
                <button className="card-action">
                  <FaChartBar />
                  View Report
                </button>
              </div>
              <div className="card-content">
                {topProducts.map((product) => (
                  <div key={product.id} className="product-item">
                    <div className="product-info">
                      <h4>{product.name}</h4>
                      <p>{product.orders} orders this month</p>
                    </div>
                    <div className="product-stats">
                      <div className="product-revenue">{product.revenue}</div>
                      <div className="product-rating">
                        <FaStar />
                        {product.rating}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
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

export default AnalyticsDashboard;
