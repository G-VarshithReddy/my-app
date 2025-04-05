import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import './UserSignup.css';

const UserSignup = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: ''
  });
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      console.log('Sending registration request with:', formData);
      const response = await axios.post('http://localhost:5000/user', formData);
      console.log('Registration response:', response.data);
      
      // Check if we have a jwtToken in the response
      if (response.data && response.data.jwtToken) {
        // Store the token with Bearer prefix
        localStorage.setItem('token', `Bearer ${response.data.jwtToken}`);
        
        // Store user data
        const userData = {
          name: formData.name,
          email: formData.email,
          userId: response.data.id || response.data.userId
        };
        console.log('Storing user data:', userData);
        localStorage.setItem('userData', JSON.stringify(userData));
        
        setMessage('Registration successful! Redirecting to dashboard...');
        setError('');
        
        // Clear form
        setFormData({
          name: '',
          email: '',
          password: ''
        });

        // Redirect to customer dashboard after 2 seconds
        setTimeout(() => {
          navigate('/customer-dashboard');
        }, 2000);
      } else {
        console.error('Invalid response structure:', response.data);
        setError('Registration successful but login failed. Please login manually.');
        setTimeout(() => {
          navigate('/user-signin');
        }, 2000);
      }
    } catch (error) {
      console.error('Signup error:', error);
      console.error('Error response:', error.response?.data);
      setError(error.response?.data?.message || 'Failed to signup. Please try again.');
      setMessage('');
    }
  };

  return (
    <div className="signup-container">
      <div className="signup-form-container">
        <h2>Create Account</h2>
        {message && <div className="success-message">{message}</div>}
        {error && <div className="error-message">{error}</div>}
        
        <form onSubmit={handleSubmit} className="signup-form">
          <div className="form-group">
            <label htmlFor="name">Name</label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              placeholder="Enter your name"
            />
          </div>

          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              placeholder="Enter your email"
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              placeholder="Enter your password"
            />
          </div>

          <button type="submit" className="signup-btn">
            Sign Up
          </button>
        </form>

        <div className="login-link">
          Already have an account? <Link to="/user-signin">Login here</Link>
        </div>
      </div>
    </div>
  );
};

export default UserSignup; 