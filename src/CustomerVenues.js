import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./CustomerVenues.css";

const CustomerVenues = () => {
  const [venues, setVenues] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [message, setMessage] = useState(null);
  const navigate = useNavigate();

  const fetchVenues = useCallback(async () => {
    try {
      const userToken = localStorage.getItem('userToken');
      if (!userToken) {
        setError('Please sign in to view venues');
        setLoading(false);
        setTimeout(() => {
          navigate('/signin');
        }, 2000);
        return;
      }

      const response = await axios.get('http://localhost:5000/venues', {
        headers: { 
          'Authorization': userToken
        }
      });
      
      if (response.data) {
        setVenues(response.data);
        setLoading(false);
      }
    } catch (err) {
      console.error('Error fetching venues:', err);
      if (err.response?.status === 401) {
        setError('Session expired. Please sign in again.');
        localStorage.removeItem('userToken');
        setTimeout(() => {
          navigate('/signin');
        }, 2000);
      } else {
        setError('Failed to fetch venues. Please try again later.');
      }
      setLoading(false);
    }
  }, [navigate]);

  useEffect(() => {
    fetchVenues();
  }, [fetchVenues]);

  const handleRegister = useCallback((venueId) => {
    const userToken = localStorage.getItem('userToken');
    if (!userToken) {
      setError('Please sign in to register for a venue');
      setTimeout(() => {
        navigate('/signin');
      }, 2000);
      return;
    }
    navigate(`/venue-registration/${venueId}`);
  }, [navigate]);

  const handleUpdate = useCallback(async (venueId) => {
    try {
      const userToken = localStorage.getItem('userToken');
      if (!userToken) {
        setError('Please sign in to update venue information');
        setTimeout(() => {
          navigate('/signin');
        }, 2000);
        return;
      }

      // You can implement the actual update logic here
      setMessage('Update request submitted successfully!');
      setTimeout(() => {
        setMessage(null);
      }, 3000);
    } catch (err) {
      setError('Failed to update venue. Please try again.');
      setTimeout(() => {
        setError(null);
      }, 3000);
    }
  }, [navigate]);

  if (loading) return <div className="loading">Loading venues...</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <div className="customer-venues-container">
      <h1 className="customer-venues-title">Available Venues</h1>
      {message && (
        <div className={`status-message ${message.includes('Registration') ? 'success' : 'info'}`}>
          {message}
        </div>
      )}
      <div className="venues-grid">
        {venues.map((venue) => (
          <div key={venue.id} className="venue-card">
            {venue.imageUrl && (
              <div className="venue-image">
                <img src={venue.imageUrl} alt={venue.name} />
              </div>
            )}
            <div className="venue-header">
              <span className="venue-id">Venue #{venue.id}</span>
              <span className="venue-status available">Available</span>
            </div>
            
            <div className="venue-content">
              <div className="venue-info">
                <h3 className="venue-name">{venue.name}</h3>
                <p><strong>Location:</strong> {venue.location}</p>
                <p><strong>Capacity:</strong> {venue.capacity} people</p>
                <p><strong>Price per Hour:</strong> ${venue.pricePerHour}</p>
                {venue.amenities && (
                  <p><strong>Amenities:</strong> {venue.amenities}</p>
                )}
                {venue.description && (
                  <p><strong>Description:</strong> {venue.description}</p>
                )}
              </div>
            </div>

            <div className="venue-actions">
              <button 
                className="register-btn"
                onClick={() => handleRegister(venue.id)}
              >
                Register
              </button>
              <button 
                className="update-btn"
                onClick={() => handleUpdate(venue.id)}
              >
                Update
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CustomerVenues; 