import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './MyBookings.css';

const MyBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [userEmail, setUserEmail] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const [filter, setFilter] = useState('all');

  // Fetch user email from localStorage or context
  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem('userData'));
    if (userData && userData.email) {
      setUserEmail(userData.email);
    }
  }, []);

  const fetchBookings = useCallback(async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        navigate('/user-signin');
        return;
      }

      const response = await axios.get('http://localhost:5000/bookings', {
        headers: {
          Authorization: token
        }
      });

      if (Array.isArray(response.data)) {
        // Filter bookings based on customerEmail
        const userBookings = response.data.filter(
          booking => booking.customerEmail === userEmail
        );
        setBookings(userBookings);
      } else {
        setBookings([]);
      }
      setError(null);
    } catch (err) {
      console.error('Error fetching bookings:', err);
      if (err.response?.status === 401) {
        localStorage.removeItem('token');
        navigate('/user-signin');
      } else {
        setError('Failed to fetch bookings. Please try again later.');
      }
    } finally {
      setLoading(false);
    }
  }, [navigate, userEmail]);

  useEffect(() => {
    if (userEmail) {
      fetchBookings();
    }
  }, [fetchBookings, userEmail]);

  const handleCancelBooking = async (bookingId) => {
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`http://localhost:5000/bookings/${bookingId}`, {
        headers: {
          'Authorization': token
        }
      });

      // Remove the cancelled booking from the state
      setBookings(bookings.filter(booking => booking.id !== bookingId));
      
    } catch (error) {
      console.error('Error cancelling booking:', error);
      setError('Failed to cancel booking. Please try again later.');
    }
  };

  const getFilteredBookings = () => {
    if (filter === 'all') return bookings;
    return bookings.filter(booking => booking.status?.toLowerCase() === filter.toLowerCase());
  };

  if (loading) {
    return (
      <div className="bookings-container">
        <div className="loading">Loading your bookings...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bookings-container">
        <div className="error-message">{error}</div>
      </div>
    );
  }

  const filteredBookings = getFilteredBookings();

  return (
    <div className="bookings-container">
      <h2>My Bookings</h2>
      <div className="user-info-section">
        <h3>Customer Information</h3>
        <div className="user-details">
          <p><strong>Email:</strong> {userEmail}</p>
        </div>
      </div>
      
      <div className="filter-section">
        <select 
          value={filter} 
          onChange={(e) => setFilter(e.target.value)}
          className="filter-dropdown"
        >
          <option value="all">All Bookings</option>
          <option value="pending">Pending</option>
          <option value="confirmed">Confirmed</option>
          <option value="cancelled">Cancelled</option>
        </select>
      </div>

      {filteredBookings.length === 0 ? (
        <div className="no-bookings">
          <p>No bookings found for the selected filter.</p>
          <button 
            className="view-events-button"
            onClick={() => navigate('/venues')}
          >
            View Venues
          </button>
        </div>
      ) : (
        <div className="bookings-grid">
          {filteredBookings.map((booking) => (
            <div key={booking.id} className="booking-card">
              <h3>Booking Details</h3>
              <div className="booking-details">
                <p>
                  <strong>Booking ID:</strong>{' '}
                  {booking.id}
                </p>
                <p>
                  <strong>Customer Name:</strong>{' '}
                  {booking.customerName}
                </p>
                <p>
                  <strong>Customer Email:</strong>{' '}
                  {booking.customerEmail}
                </p>
                <p>
                  <strong>Booking Time:</strong>{' '}
                  {new Date(booking.bookingTime).toLocaleString()}
                </p>
                <p>
                  <strong>Total Price:</strong>{' '}
                  ₹{booking.totalPrice}
                </p>

                <div className="venue-details">
                  <h4>Venue Information</h4>
                  <p>
                    <strong>Venue Name:</strong>{' '}
                    {booking.venue.name}
                  </p>
                  <p>
                    <strong>Location:</strong>{' '}
                    {booking.venue.location}
                  </p>
                  <p>
                    <strong>Capacity:</strong>{' '}
                    {booking.venue.capacity} people
                  </p>
                  <p>
                    <strong>Amenities:</strong>{' '}
                    {booking.venue.amenities}
                  </p>
                  <p>
                    <strong>Price Per Hour:</strong>{' '}
                    ₹{booking.venue.pricePerHour}
                  </p>
                </div>

                {booking.status !== 'cancelled' && (
                  <button
                    className="cancel-button"
                    onClick={() => handleCancelBooking(booking.id)}
                  >
                    Cancel Booking
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyBookings; 