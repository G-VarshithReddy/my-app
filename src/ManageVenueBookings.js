import React, { useState, useEffect } from "react";
import axios from "axios";
import "./ManageVenueBookings.css";

const ManageVenueBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [message, setMessage] = useState(null);

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      const adminToken = localStorage.getItem('adminToken');
      if (!adminToken) {
        setError('Admin authentication required');
        setLoading(false);
        return;
      }

      const response = await axios.get('http://localhost:5000/bookings', {
        headers: { Authorization: `Bearer ${adminToken}` }
      });
      
      // Set bookings with default PENDING status if not set
      const bookingsWithStatus = response.data.map(booking => ({
        ...booking,
        status: booking.status || 'PENDING'
      }));
      
      setBookings(bookingsWithStatus);
      setLoading(false);
    } catch (err) {
      console.error('Error fetching bookings:', err);
      setError('Failed to fetch bookings. Please try again later.');
      setLoading(false);
    }
  };

  const handleStatusUpdate = (bookingId, newStatus) => {
    // Update local state
    setBookings(bookings.map(booking => 
      booking.id === bookingId ? { ...booking, status: newStatus } : booking
    ));
    
    // Show success message
    setMessage(newStatus === 'APPROVED' ? 'Booking approved successfully!' : 'Booking rejected successfully!');
    
    // Clear message after 3 seconds
    setTimeout(() => {
      setMessage(null);
    }, 3000);
  };

  if (loading) return <div className="loading">Loading bookings...</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <div className="manage-bookings-container">
      <h1 className="mb-manage-bookings-title">Manage Venue Bookings</h1>
      {message && (
        <div className={`status-message ${message.includes('approved') ? 'success' : 'error'}`}>
          {message}
        </div>
      )}
      <div className="bookings-grid">
        {bookings.map((booking) => (
          <div key={booking.id} className="booking-card">
            <div className="booking-header">
              <span className="booking-id">Booking #{booking.id}</span>
              <span className={`booking-status ${(booking.status || 'PENDING').toLowerCase()}`}>
                {booking.status || 'PENDING'}
              </span>
            </div>
            
            <div className="booking-content">
              <div className="venue-info">
                <h3 className="venue-name">{booking.venue?.name || 'Unnamed Venue'}</h3>
                <p><strong>Location:</strong> {booking.venue?.location || 'N/A'}</p>
                <p><strong>Capacity:</strong> {booking.venue?.capacity || 'N/A'} people</p>
                <p><strong>Price per Hour:</strong> ${booking.venue?.pricePerHour || 'N/A'}</p>
                {booking.venue?.amenities && (
                  <p><strong>Amenities:</strong> {booking.venue.amenities}</p>
                )}
                {booking.venue?.description && (
                  <p><strong>Description:</strong> {booking.venue.description}</p>
                )}
              </div>

              <div className="customer-info">
                <h3 className="customer-name">{booking.customerName || 'Unnamed Customer'}</h3>
                <p><strong>Email:</strong> {booking.customerEmail || 'N/A'}</p>
                <p><strong>Booking Time:</strong> {booking.bookingTime ? new Date(booking.bookingTime).toLocaleString() : 'N/A'}</p>
                <p><strong>Total Price:</strong> ${booking.totalPrice || 'N/A'}</p>
              </div>
            </div>

            {(booking.status === 'PENDING' || !booking.status) && (
              <div className="booking-actions">
                <button 
                  className="approve-btn"
                  onClick={() => handleStatusUpdate(booking.id, 'APPROVED')}
                >
                  Approve
                </button>
                <button 
                  className="reject-btn"
                  onClick={() => handleStatusUpdate(booking.id, 'REJECTED')}
                >
                  Reject
                </button>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default ManageVenueBookings; 