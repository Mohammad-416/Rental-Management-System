import React, { useState, useEffect } from 'react';
import { 
  FaHome, FaBox, FaCalendarAlt, FaCreditCard, FaBell, 
  FaUser, FaSearch, FaFilter, FaPlus, FaEdit, FaTrash, 
  FaEye, FaDownload, FaChartBar, FaTruck, FaClock,
  FaCheck, FaTimes, FaExclamationTriangle
} from 'react-icons/fa';


const AnalyticsCustomer = ({ isCustomer = true }) => {
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

  // Sample data
  const dashboardStats = [
    { title: 'Active Rentals', value: '12', icon: FaBox, color: '#3b82f6', trend: '+2' },
    { title: 'Total Spent', value: '$2,450', icon: FaCreditCard, color: '#10b981', trend: '+15%' },
    { title: 'Pending Returns', value: '3', icon: FaClock, color: '#f59e0b', trend: '-1' },
    { title: 'Available Credits', value: '$150', icon: FaCheck, color: '#8b5cf6', trend: '+$50' }
  ];

  const recentOrders = [
    { id: 'RNT-001', product: 'Professional DSLR Camera', status: 'active', startDate: '2025-08-10', endDate: '2025-08-12', amount: '$240' },
    { id: 'RNT-002', product: 'Gaming Laptop RTX 4080', status: 'pending_return', startDate: '2025-08-08', endDate: '2025-08-11', amount: '$180' },
    { id: 'RNT-003', product: 'Party Sound System', status: 'returned', startDate: '2025-08-05', endDate: '2025-08-07', amount: '$320' },
    { id: 'RNT-004', product: 'Electric Drill Set', status: 'cancelled', startDate: '2025-08-03', endDate: '2025-08-05', amount: '$80' }
  ];

  const upcomingPickups = [
    { id: 1, product: 'Wedding Decoration Kit', date: '2025-08-15', time: '10:00 AM', location: 'Main Store' },
    { id: 2, product: 'Camping Gear Bundle', date: '2025-08-16', time: '2:00 PM', location: 'North Branch' }
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case 'active': return '#10b981';
      case 'pending_return': return '#f59e0b';
      case 'returned': return '#6b7280';
      case 'cancelled': return '#ef4444';
      default: return '#3b82f6';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'active': return FaCheck;
      case 'pending_return': return FaClock;
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

        /* Upcoming Pickups */
        .pickup-item {
          display: flex;
          align-items: center;
          padding: 1.5rem;
          border-radius: 12px;
          background: rgba(59,130,246,0.02);
          margin-bottom: 1rem;
          transition: all var(--speed) ease;
        }

        .pickup-item:hover {
          background: rgba(59,130,246,0.05);
          transform: translateX(4px);
        }

        .dark .pickup-item {
          background: rgba(76,205,196,0.05);
        }

        .dark .pickup-item:hover {
          background: rgba(76,205,196,0.08);
        }

        .pickup-icon {
          width: 3rem;
          height: 3rem;
          background: linear-gradient(135deg, var(--blue), var(--blue-deep));
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          margin-right: 1rem;
        }

        .dark .pickup-icon {
          background: linear-gradient(135deg, var(--rose), var(--teal));
        }

        .pickup-details h4 {
          font-weight: 600;
          margin-bottom: 0.25rem;
          color: var(--blue-dark);
        }

        .dark .pickup-details h4 {
          color: var(--dark-text);
        }

        .pickup-details p {
          color: var(--white-text-soft);
          font-size: 0.875rem;
        }

        .dark .pickup-details p {
          color: var(--dark-text-soft);
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
            <FaBell className="text-xl cursor-pointer hover:text-blue-500 transition-colors" />
            <div className="user-avatar">
              <FaUser />
            </div>
          </div>
        </div>
      </nav>

      <div className="dashboard-layout">
        {/* Sidebar */}
        <aside className="sidebar">
          <ul className="sidebar-menu">
            <li className="sidebar-item">
              <a 
                href="#overview" 
                className={`sidebar-link ${activeTab === 'overview' ? 'active' : ''}`}
                onClick={() => setActiveTab('overview')}
              >
                <FaHome />
                Overview
              </a>
            </li>
            <li className="sidebar-item">
              <a 
                href="#rentals" 
                className={`sidebar-link ${activeTab === 'rentals' ? 'active' : ''}`}
                onClick={() => setActiveTab('rentals')}
              >
                <FaBox />
                My Rentals
              </a>
            </li>
            <li className="sidebar-item">
              <a 
                href="#bookings" 
                className={`sidebar-link ${activeTab === 'bookings' ? 'active' : ''}`}
                onClick={() => setActiveTab('bookings')}
              >
                <FaCalendarAlt />
                Bookings
              </a>
            </li>
            <li className="sidebar-item">
              <a 
                href="#payments" 
                className={`sidebar-link ${activeTab === 'payments' ? 'active' : ''}`}
                onClick={() => setActiveTab('payments')}
              >
                <FaCreditCard />
                Payments
              </a>
            </li>
            <li className="sidebar-item">
              <a 
                href="#profile" 
                className={`sidebar-link ${activeTab === 'profile' ? 'active' : ''}`}
                onClick={() => setActiveTab('profile')}
              >
                <FaUser />
                Profile
              </a>
            </li>
          </ul>
        </aside>

        {/* Main Content */}
        <main className="main-content">
          {/* Dashboard Header */}
          <div className="dashboard-header fade-in">
            <h1 className="dashboard-title">
              {isCustomer ? 'Customer Dashboard' : 'Business Dashboard'}
            </h1>
            <p className="dashboard-subtitle">
              Welcome back! Here's what's happening with your rentals today.
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

          {/* Content Grid */}
          <div className="content-grid">
            {/* Recent Orders */}
            <div className="dashboard-card slide-in">
              <div className="card-header">
                <h2 className="card-title">Recent Orders</h2>
                <button className="card-action">
                  <FaEye className="mr-1" /> View All
                </button>
              </div>
              <div className="card-content">
                <table className="order-table">
                  <thead>
                    <tr>
                      <th>Order ID</th>
                      <th>Product</th>
                      <th>Status</th>
                      <th>Amount</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {recentOrders.map((order) => {
                      const StatusIcon = getStatusIcon(order.status);
                      return (
                        <tr key={order.id}>
                          <td className="font-medium">{order.id}</td>
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
                          <td className="font-semibold">{order.amount}</td>
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

            {/* Upcoming Pickups */}
            <div className="dashboard-card slide-in" style={{ animationDelay: '0.2s' }}>
              <div className="card-header">
                <h2 className="card-title">Upcoming Pickups</h2>
                <button className="card-action">
                  <FaPlus className="mr-1" /> Add New
                </button>
              </div>
              <div className="card-content">
                {upcomingPickups.map((pickup) => (
                  <div key={pickup.id} className="pickup-item">
                    <div className="pickup-icon">
                      <FaTruck />
                    </div>
                    <div className="pickup-details">
                      <h4>{pickup.product}</h4>
                      <p>{pickup.date} at {pickup.time}</p>
                      <p>{pickup.location}</p>
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

export default AnalyticsCustomer;
