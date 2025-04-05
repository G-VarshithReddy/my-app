import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./CustomerVenues.css";

const Venues = () => {
  const [venues, setVenues] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const fetchVenues = useCallback(async () => {
    try {
      const token = localStorage.getItem('token');
      console.log('Token from localStorage:', token);
      
      if (!token) {
        console.log('No token found, redirecting to signin');
        setError('Please sign in to view venues');
        setLoading(false);
        setTimeout(() => {
          navigate('/user-signin');
        }, 2000);
        return;
      }

      const response = await axios.get('http://localhost:5000/venues', {
        headers: { 
          'Authorization': token
        }
      });
      
      if (response.data) {
        console.log('Venues fetched successfully:', response.data);
        // Set all venues as available
        const availableVenues = response.data.map(venue => ({
          ...venue,
          status: 'Available'
        }));
        setVenues(availableVenues);
        setLoading(false);
      }
    } catch (err) {
      console.error('Error fetching venues:', err);
      console.log('Error response:', err.response);
      if (err.response?.status === 401) {
        setError('Session expired. Please sign in again.');
        localStorage.removeItem('token');
        setTimeout(() => {
          navigate('/user-signin');
        }, 2000);
      } else {
        setError('Failed to fetch venues. Please try again later.');
      }
      setLoading(false);
    }
  }, [navigate]);

  useEffect(() => {
    console.log('Component mounted, fetching venues...');
    fetchVenues();
  }, [fetchVenues]);

  const handleRegister = async (venue) => {
    try {
      const token = localStorage.getItem("token");
      const userDataStr = localStorage.getItem("userData");
      
      if (!token || !userDataStr) {
        setError("Please sign in to register for a venue");
        navigate("/user-signin", {
          state: { 
            from: `/venue-registration/${venue._id || venue.id}`,
            venueId: venue._id || venue.id
          }
        });
        return;
      }

      // Navigate to venue registration page
      navigate(`/venue-registration/${venue._id || venue.id}`, {
        state: {
          venue: venue
        }
      });

    } catch (error) {
      console.error('ERROR IN REGISTRATION:', error);
      setError('Failed to process venue registration. Please try again.');
    }
  };

  if (loading) {
    console.log('Rendering loading state');
    return <div className="loading">Loading venues...</div>;
  }
  if (error) {
    console.log('Rendering error state:', error);
    return <div className="error">{error}</div>;
  }

  console.log('Rendering venues list:', venues);
  return (
    <div className="venues-container">
      <h1>Available Venues</h1>
      {error && <div className="error-message">{error}</div>}
      <div className="venues-grid">
        {venues.map((venue) => (
          <div key={venue._id || venue.id} className="venue-card">
            <div className="venue-status">
              <span className="status-available">Available</span>
            </div>
            {venue.imageUrl && (
              <div className="venue-image">
                <img src={venue.imageUrl} alt={venue.name} />
              </div>
            )}
            <div className="venue-details">
              <h2>{venue.name}</h2>
              <p><strong>Location:</strong> {venue.location}</p>
              <p><strong>Capacity:</strong> {venue.capacity} people</p>
              <p><strong>Price per Hour:</strong> ₹{venue.pricePerHour}</p>
              <p><strong>Amenities:</strong> {venue.amenities}</p>
              <button 
                onClick={() => handleRegister(venue)}
                className="register-button"
              >
                Book Now
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Venues; 