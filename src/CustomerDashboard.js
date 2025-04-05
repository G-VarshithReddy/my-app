import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import './CustomerDashboard.css';

const CustomerDashboard = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(true);
  const [showLogoutMessage, setShowLogoutMessage] = useState(false);

  const menuItems = [
    { path: '/customer/profile', icon: 'fa-user', label: 'My Profile' },
    { path: '/my-bookings', icon: 'fa-calendar-check', label: 'My Bookings' },
    { path: '/customer/budget-tracking', icon: 'fa-wallet', label: 'My Budget Tracking' },
    { path: '/venues', icon: 'fa-building', label: 'View Venues' },
    { path: '/events', icon: 'fa-calendar-week', label: 'View Events' },
  ];

  const handleLogout = () => {
    // Clear user session data
    localStorage.removeItem('token');
    localStorage.removeItem('userData');
    setShowLogoutMessage(true);
    setTimeout(() => {
      setShowLogoutMessage(false);
      navigate('/');
    }, 2000);
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <div className="customer-dashboard">
      {showLogoutMessage && (
        <div className="logout-message">
          <i className="fas fa-check-circle"></i>
          Successfully logged out!
        </div>
      )}
      <div className={`dashboard-sidebar ${isMenuOpen ? 'open' : 'closed'}`}>
        <div className="sidebar-header">
          <h2>Customer Dashboard</h2>
          <button className="menu-toggle" onClick={toggleMenu}>
            <i className={`fas ${isMenuOpen ? 'fa-times' : 'fa-bars'}`}></i>
          </button>
        </div>
        <nav className="dashboard-nav">
          {menuItems.map((item) => (
            <div
              key={item.path}
              className={`nav-item ${location.pathname === item.path ? 'active' : ''}`}
              onClick={() => navigate(item.path)}
            >
              <i className={`fas ${item.icon}`}></i>
              <span>{item.label}</span>
            </div>
          ))}
          <div className="nav-item logout-item" onClick={handleLogout}>
            <i className="fas fa-sign-out-alt"></i>
            <span>Logout</span>
          </div>
        </nav>
      </div>
      <div className="dashboard-content">
        <div className="dashboard-header">
          <h1>Welcome to Your Dashboard</h1>
          <p>Manage your events and bookings efficiently</p>
        </div>
        <div className="dashboard-stats">
          <div className="stat-card">
            <i className="fas fa-calendar-alt"></i>
            <div className="stat-info">
              <h3>Upcoming Events</h3>
              <p>3</p>
            </div>
          </div>
          <div className="stat-card">
            <i className="fas fa-history"></i>
            <div className="stat-info">
              <h3>Past Events</h3>
              <p>5</p>
            </div>
          </div>
          <div className="stat-card">
            <i className="fas fa-rupee-sign"></i>
            <div className="stat-info">
              <h3>Total Spent</h3>
              <p>₹75,000</p>
            </div>
          </div>
          <div className="stat-card">
            <i className="fas fa-star"></i>
            <div className="stat-info">
              <h3>User Rating</h3>
              <p>4.5/5</p>
            </div>
          </div>
        </div>
        <div className="recent-activity">
          <h2>Recent Activity</h2>
          <div className="activity-list">
            <div className="activity-item">
              <i className="fas fa-calendar-plus"></i>
              <div className="activity-info">
                <h4>New Booking</h4>
                <p>Wedding Ceremony at Grand Hall</p>
              </div>
            </div>
            <div className="activity-item">
              <i className="fas fa-money-bill-wave"></i>
              <div className="activity-info">
                <h4>Payment Received</h4>
                <p>₹25,000 for Conference Room</p>
              </div>
            </div>
            <div className="activity-item">
              <i className="fas fa-check-circle"></i>
              <div className="activity-info">
                <h4>Event Completed</h4>
                <p>Birthday Party at Party Venue</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CustomerDashboard; 