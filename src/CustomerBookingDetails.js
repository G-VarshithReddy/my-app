import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './CustomerBookingDetails.css';

const CustomerBookingDetails = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const fetchUserBookings = useCallback(async () => {
    try {
      const userToken = localStorage.getItem('token');
      console.log("Token found:", !!userToken); // Debug log
      
      if (!userToken) {
        console.log("No token found, redirecting to signin"); // Debug log
        setError('Please sign in to view your bookings');
        setTimeout(() => {
          navigate('/user-signin', { state: { from: '/customer/booking-details' } });
        }, 2000);
        return;
      }

      // Make the API call to get all bookings
      const response = await axios.get('http://localhost:5000/bookings', {
        headers: {
          Authorization: userToken
        }
      });

      if (response.data) {
        setBookings(response.data);
      } else {
        setBookings([]);
      }
      setLoading(false);
    } catch (err) {
      console.error('Error fetching bookings:', err);
      if (err.response?.status === 401) {
        setError('Session expired. Please sign in again.');
        setTimeout(() => {
          navigate('/user-signin', { state: { from: '/customer/booking-details' } });
        }, 2000);
      } else {
        setError('Failed to fetch your bookings. Please try again later.');
      }
      setLoading(false);
    }
  }, [navigate]);

  useEffect(() => {
    fetchUserBookings();
  }, [fetchUserBookings]);

  const getStatusColor = (status) => {
    switch (status?.toUpperCase()) {
      case 'APPROVED':
        return 'status-approved';
      case 'REJECTED':
        return 'status-rejected';
      default:
        return 'status-pending';
    }
  };

  if (loading) return <div className="loading">Loading your bookings...</div>;
  if (error) return <div className="error-message">{error}</div>;
  if (bookings.length === 0) return <div className="no-bookings">You haven't made any bookings yet.</div>;

  return (
    <div className="customer-bookings-container">
      <h2>My Bookings</h2>
      <div className="bookings-list">
        {bookings.map((booking) => (
          <div key={booking.id} className="booking-card">
            <div className="booking-header">
              <h3>{booking.venueName}</h3>
              <span className={`booking-status ${getStatusColor(booking.status)}`}>
                {booking.status}
              </span>
            </div>

            <div className="booking-details">
              <div className="detail-group">
                <label>Booking ID:</label>
                <span>#{booking.id}</span>
              </div>

              <div className="detail-group">
                <label>Booking Date:</label>
                <span>{new Date(booking.bookingTime).toLocaleDateString()}</span>
              </div>

              <div className="detail-group">
                <label>Booking Time:</label>
                <span>{new Date(booking.bookingTime).toLocaleTimeString()}</span>
              </div>

              <div className="detail-group">
                <label>Venue Capacity:</label>
                <span>{booking.venue?.capacity || booking.capacity || 0} people</span>
              </div>

              <div className="detail-group">
                <label>Total Price:</label>
                <span>${booking.totalPrice}</span>
              </div>

              {booking.amenities && (
                <div className="detail-group">
                  <label>Amenities:</label>
                  <span>{booking.amenities}</span>
                </div>
              )}
            </div>

            {booking.status === 'REJECTED' && (
              <div className="booking-message rejected">
                Your booking was rejected. Please try booking another venue or time slot.
              </div>
            )}

            {booking.status === 'PENDING' && (
              <div className="booking-message pending">
                Your booking is pending approval. We'll notify you once it's reviewed.
              </div>
            )}

            {booking.status === 'APPROVED' && (
              <div className="booking-message approved">
                Your booking has been approved! We look forward to hosting your event.
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default CustomerBookingDetails; 