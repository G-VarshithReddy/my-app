import React, { useState } from "react";
import { useNavigate, Link, useLocation } from "react-router-dom";
import "./UserSignIn.css";
import axios from "axios";
import { setToken } from './utils/auth';

const UserSignIn = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      console.log("Sending sign-in request with:", {
        email: formData.email,
        password: formData.password
      });

      const response = await axios.post(
        "http://localhost:5000/login",
        {
          email: formData.email,
          password: formData.password
        },
        {
          headers: {
            'Content-Type': 'application/json'
          }
        }
      );
      
      console.log("Sign-in response:", response.data);

      if (response.data && response.data.jwtToken) {
        // Store the token with Bearer prefix using the setToken function
        const tokenWithBearer = `Bearer ${response.data.jwtToken}`;
        setToken(tokenWithBearer);

        // Fetch all users to find the matching email and get correct ID
        const usersResponse = await axios.get('http://localhost:5000/user', {
          headers: { 'Authorization': tokenWithBearer }
        });

        // Find user with matching email
        const matchingUser = usersResponse.data.find(user => user.email === formData.email);
        
        if (!matchingUser) {
          setError("Failed to fetch user details. Please try again.");
          setLoading(false);
          return;
        }
        
        // Store user data with correct ID from database
        const userData = {
          email: formData.email,
          name: matchingUser.name,
          id: matchingUser.id,
          roles: matchingUser.roles
        };
        console.log("Storing user data:", userData);
        localStorage.setItem("userData", JSON.stringify(userData));

        setSuccess("Sign in successful! Redirecting...");
        
        // Check if this is an event registration redirect
        const isEventRegistration = location.state?.isEventRegistration;
        const eventId = location.state?.eventId;
        const returnUrl = location.state?.returnUrl;

        setTimeout(() => {
          if (isEventRegistration && eventId) {
            // If there's a return URL, use it, otherwise construct the registration URL
            navigate(returnUrl || `/register-event/${eventId}`);
          } else {
            // Default navigation to dashboard
            navigate('/customer-dashboard');
          }
        }, 1500);
      } else {
        console.error("Invalid response structure:", response.data);
        setError("Invalid response from server");
      }
    } catch (error) {
      console.error("Sign-in error:", error);
      console.error("Error response:", error.response?.data);
      
      if (error.response?.status === 401) {
        setError("Invalid email or password");
      } else {
        setError(error.response?.data?.message || "Sign-in failed. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="signin-container">
      <div className="signin-form-container">
        <h2>Sign In</h2>
        {error && <div className="error-message">{error}</div>}
        {success && <div className="success-message">{success}</div>}
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
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
            />
          </div>
          <button type="submit" className="signin-button" disabled={loading}>
            Sign In
          </button>
        </form>
        <div className="signup-link">
          Don't have an account? <Link to="/signup">Sign up here</Link>
        </div>
      </div>
    </div>
  );
};

export default UserSignIn; 