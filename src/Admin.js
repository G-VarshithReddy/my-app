import React from "react";
import { useNavigate } from "react-router-dom";
import "./Admin.css";

const Admin = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    navigate('/');
  };

  return (
    <div className="admin-container">
      <h1>Admin Dashboard</h1>
      
      <div className="admin-options">
        <div className="admin-card" onClick={() => navigate('/register-admin')}>
          <h2>Admin Registration</h2>
          <p>Register new admin users</p>
        </div>

        <div className="admin-card" onClick={() => navigate('/event-management')}>
          <h2>Event Management</h2>
          <p>View, update, and delete events</p>
        </div>

        <div className="admin-card" onClick={() => navigate('/add-category')}>
          <h2>Add Category</h2>
          <p>Add new event categories</p>
        </div>

        <div className="admin-card" onClick={() => navigate('/view-categories')}>
          <h2>View Categories</h2>
          <p>View and manage existing categories</p>
        </div>
        
        <div className="admin-card" onClick={() => navigate('/add-event')}>
          <h2>Add Event</h2>
          <p>Create new events</p>
        </div>
        
        <div className="admin-card" onClick={() => navigate('/event-bookings')}>
          <h2>Event Bookings</h2>
          <p>View and manage event bookings</p>
        </div>
        
        <div className="admin-card" onClick={() => navigate('/view-customers')}>
          <h2>View Customers</h2>
          <p>Manage customer information</p>
        </div>
        
        <div className="admin-card" onClick={() => navigate('/messages')}>
          <h2>Messages</h2>
          <p>View customer messages</p>
        </div>

        <div className="admin-card" onClick={() => navigate('/manage-venues')}>
          <h2>Manage Venues</h2>
          <p>Add and manage venue listings</p>
        </div>

        <div className="admin-card" onClick={() => navigate('/manage-venue-bookings')}>
          <h2>Venue Bookings</h2>
          <p>Manage venue bookings</p>
        </div>

        <div className="admin-card" onClick={() => navigate('/budget-tracking')}>
          <h2>Budget Tracking</h2>
          <p>Track and manage event budgets</p>
        </div>

        <div className="admin-card logout" onClick={handleLogout}>
          <h2>Logout</h2>
          <p>Sign out from admin panel</p>
        </div>
      </div>
    </div>
  );
};

export default Admin;
