import React from 'react';
import { Link } from 'react-router-dom';
import './Navbar.css';

const Navbar = () => {
  const handleHomeClick = (e) => {
    e.preventDefault();
    window.location.replace('/');
  };

  return (
    <nav className="navbar">
      <div className="nav-container">
        <div className="nav-left">
          <a href="/" onClick={handleHomeClick} className="nav-link">Home</a>
        </div>
        <div className="nav-right">
          <Link to="/events" className="nav-link">Events</Link>
          <Link to="/about" className="nav-link">About</Link>
          <Link to="/contact" className="nav-link">Contact</Link>
          <Link to="/admin-sign" className="nav-link">Admin</Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar; 