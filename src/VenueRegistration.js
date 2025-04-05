import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import './VenueRegistration.css';

const VenueRegistration = () => {
  const { venueId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const [formData, setFormData] = useState({
    customerName: '',
    customerEmail: '',
    bookingTime: ''
  });
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [loading, setLoading] = useState(false);
  const [venue, setVenue] = useState(null);

  useEffect(() => {
    const fetchVenueDetails = async () => {
      if (!venueId) {
        setError("Invalid venue selection");
        setTimeout(() => navigate("/venues"), 2000);
        return;
      }

      const token = localStorage.getItem("token");
      if (!token) {
        setError("Please sign in to continue");
        setTimeout(() => navigate("/user-signin"), 2000);
        return;
      }

      try {
        setLoading(true);
        const response = await axios.get(`http://localhost:5000/venues/${venueId}`, {
          headers: { 'Authorization': token }
        });

        if (response.data) {
          setVenue(response.data);
          // Pre-fill form data with user information if available
          const userDataStr = localStorage.getItem("userData");
          if (userDataStr) {
            const userData = JSON.parse(userDataStr);
            setFormData(prev => ({
              ...prev,
              customerName: userData.name || '',
              customerEmail: userData.email || ''
            }));
          }
        }
      } catch (error) {
        console.error("Error fetching venue:", error);
        setError("Failed to load venue details. Please try again.");
        setTimeout(() => navigate("/venues"), 2000);
      } finally {
        setLoading(false);
      }
    };

    fetchVenueDetails();
  }, [venueId, navigate]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    const token = localStorage.getItem("token");
    const userDataStr = localStorage.getItem("userData");
    
    if (!token || !userDataStr) {
      setError("Please sign in to continue");
      setLoading(false);
      setTimeout(() => {
        navigate("/user-signin", { state: { from: location.pathname } });
      }, 2000);
      return;
    }

    try {
      const userData = JSON.parse(userDataStr);
      if (!userData || !userData.id) {
        setError("User information is incomplete. Please sign in again.");
        setLoading(false);
        setTimeout(() => {
          navigate("/user-signin", { state: { from: location.pathname } });
        }, 2000);
        return;
      }

      // Create booking data in the exact format required
      const bookingData = {
        customerName: formData.customerName,
        customerEmail: formData.customerEmail,
        bookingTime: new Date(formData.bookingTime).toISOString()
      };

      // Post to the venue booking endpoint
      const response = await axios.post(
        `http://localhost:5000/bookings/${venueId}/user/${userData.id}`,
        bookingData,
        {
          headers: {
            'Authorization': token,
            'Content-Type': 'application/json'
          }
        }
      );

      if (response.data) {
        setSuccess("Venue registered successfully! Redirecting to payment...");
        setLoading(false);
        
        // Prepare payment data
        const paymentData = {
          bookingId: response.data.id,
          customerName: formData.customerName,
          customerEmail: formData.customerEmail,
          bookingTime: formData.bookingTime,
          totalPrice: venue.pricePerHour,
          venueName: venue.name,
          location: venue.location,
          capacity: venue.capacity,
          amenities: venue.amenities,
          pricePerHour: venue.pricePerHour
        };

        // Navigate to VenuePayment page with booking data
        setTimeout(() => {
          navigate('/venue-payment', { 
            state: { bookingData: paymentData }
          });
        }, 1500);
      }

    } catch (error) {
      console.error("Booking error:", error);
      setError(error.response?.data?.message || "Failed to book venue. Please try again.");
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="venue-registration-container">
      <div className="loading">Loading venue details...</div>
    </div>;
  }

  if (error) {
    return <div className="venue-registration-container">
      <div className="error-message">{error}</div>
    </div>;
  }

  if (!venue) {
    return <div className="venue-registration-container">
      <div className="loading">Loading venue details...</div>
    </div>;
  }

  return (
    <div className="venue-registration-container">
      <h2>Venue Registration - {venue.name}</h2>
      {error && <div className="error-message">{error}</div>}
      {success && <div className="success-notification">{success}</div>}
      
      <div className="venue-details">
        <p><strong>Location:</strong> {venue.location}</p>
        <p><strong>Capacity:</strong> {venue.capacity} people</p>
        <p><strong>Price per Hour:</strong> ${venue.pricePerHour}</p>
      </div>

      <form onSubmit={handleSubmit} className="registration-form">
        <div className="form-group">
          <label htmlFor="customerName">Name:</label>
          <input
            type="text"
            id="customerName"
            name="customerName"
            value={formData.customerName}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="customerEmail">Email:</label>
          <input
            type="email"
            id="customerEmail"
            name="customerEmail"
            value={formData.customerEmail}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="bookingTime">Booking Time:</label>
          <input
            type="datetime-local"
            id="bookingTime"
            name="bookingTime"
            value={formData.bookingTime}
            onChange={handleChange}
            min={new Date().toISOString().slice(0, 16)}
            required
          />
        </div>

        <button type="submit" className="submit-btn" disabled={loading}>
          {loading ? 'Registering...' : 'Register Venue'}
        </button>
      </form>
    </div>
  );
};

export default VenueRegistration; 