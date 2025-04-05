import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import './VenuePayment.css';

const VenuePayment = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const bookingData = location.state?.bookingData;

  const handlePayNow = () => {
    navigate('/venue-paynow', { 
      state: { bookingData }
    });
  };

  // If no booking data is available, redirect to venues page
  if (!bookingData) {
    return (
      <div className="venue-payment-container">
        <div className="error-message">
          No booking information found. Please try booking again.
          <button 
            onClick={() => navigate('/venues')} 
            className="pay-now-button"
            style={{ marginTop: '1rem' }}
          >
            Go to Venues
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="venue-payment-container">
      <div className="booking-details">
        <h2>Booking Details</h2>
        <div className="booking-info">
          <div className="info-row">
            <span className="label">Booking ID:</span>
            <span className="value">{bookingData.bookingId}</span>
          </div>
          <div className="info-row">
            <span className="label">Customer Name:</span>
            <span className="value">{bookingData.customerName}</span>
          </div>
          <div className="info-row">
            <span className="label">Customer Email:</span>
            <span className="value">{bookingData.customerEmail}</span>
          </div>
          <div className="info-row">
            <span className="label">Booking Time:</span>
            <span className="value">{bookingData.bookingTime}</span>
          </div>
          <div className="info-row">
            <span className="label">Total Price:</span>
            <span className="value">₹{bookingData.totalPrice}</span>
          </div>
        </div>
      </div>

      <div className="venue-details">
        <h2>Venue Information</h2>
        <div className="venue-info">
          <div className="info-row">
            <span className="label">Venue Name:</span>
            <span className="value">{bookingData.venueName}</span>
          </div>
          <div className="info-row">
            <span className="label">Location:</span>
            <span className="value">{bookingData.location}</span>
          </div>
          <div className="info-row">
            <span className="label">Capacity:</span>
            <span className="value">{bookingData.capacity} people</span>
          </div>
          <div className="info-row">
            <span className="label">Amenities:</span>
            <span className="value">{bookingData.amenities}</span>
          </div>
          <div className="info-row">
            <span className="label">Price Per Hour:</span>
            <span className="value">₹{bookingData.pricePerHour}</span>
          </div>
        </div>
      </div>

      <button className="pay-now-button" onClick={handlePayNow}>
        Pay Now
      </button>
    </div>
  );
};

export default VenuePayment; 