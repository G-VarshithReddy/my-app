import React from "react";
import { Link } from "react-router-dom";
import "./Navbar.css";

const Navbar = () => {
  return (
    <nav className="navbar">
      <div className="navbar-brand">
        <Link to="/">Event Management</Link>
      </div>
      <div className="navbar-links">
        <a href="/">Home</a> {/* This will trigger a reload */}
        <Link to="/events">Events</Link>
        <Link to="/categories">Categories</Link>
        <Link to="/user-signin">Customer</Link>
        <Link to="/user-signup">Sign Up</Link>
        <Link to="/admin-signin">Admin</Link>
      </div>
    </nav>
  );
};

export default Navbar;
