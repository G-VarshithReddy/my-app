import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import './Payment.css';

const Payment = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Get payment details from location state
  const paymentDetails = location.state;
  console.log("Payment page received details:", paymentDetails); // Debug log

  if (!paymentDetails) {
    return (
      <div className="payment-container">
        <div className="error-message">
          No payment details found. Please try booking again.
        </div>
        <button onClick={() => navigate('/')} className="back-button">
          Back to Home
        </button>
      </div>
    );
  }

  const handlePayment = () => {
    setLoading(true);
    setError('');
    
    // Navigate to PayNow page with payment details
    navigate("/paynow", {
      state: {
        amount: paymentDetails.totalAmount || paymentDetails.amount,
        // For events
        eventId: paymentDetails.eventId,
        eventDetails: paymentDetails.eventDetails,
        numberOfTickets: paymentDetails.numberOfTickets,
        registrationId: paymentDetails.registrationId,
        // For venues
        bookingId: paymentDetails.bookingId,
        venueId: paymentDetails.venueId,
        venueName: paymentDetails.venueName,
        customerName: paymentDetails.bookingDetails?.customerName,
        customerEmail: paymentDetails.bookingDetails?.customerEmail,
        bookingTime: paymentDetails.bookingDetails?.bookingTime,
        paymentType: paymentDetails.eventId ? 'event' : 'venue'
      }
    });
  };

  const renderEventPaymentDetails = () => (
    <div className="booking-summary">
      <h3>Event Booking Summary</h3>
      <p><strong>Event:</strong> {paymentDetails.eventDetails?.name || 'N/A'}</p>
      <p><strong>Number of Tickets:</strong> {paymentDetails.numberOfTickets}</p>
      <p><strong>Amount per Ticket:</strong> ${paymentDetails.eventDetails?.fee || 0}</p>
      <p><strong>Total Amount:</strong> ${paymentDetails.totalAmount}</p>
    </div>
  );

  const renderVenuePaymentDetails = () => (
    <div className="booking-summary">
      <h3>Venue Booking Summary</h3>
      <p><strong>Venue:</strong> {paymentDetails.venueName}</p>
      <p><strong>Customer Name:</strong> {paymentDetails.bookingDetails?.customerName}</p>
      <p><strong>Email:</strong> {paymentDetails.bookingDetails?.customerEmail}</p>
      <p><strong>Booking Time:</strong> {paymentDetails.bookingDetails?.bookingTime ? 
        new Date(paymentDetails.bookingDetails.bookingTime).toLocaleString() : 'N/A'}</p>
      <p><strong>Amount to Pay:</strong> ${paymentDetails.amount}</p>
    </div>
  );

  return (
    <div className="payment-container">
      <h2>Payment Details</h2>
      {error && <div className="error-message">{error}</div>}
      {success && <div className="success-message">{success}</div>}

      {paymentDetails.eventId ? renderEventPaymentDetails() : renderVenuePaymentDetails()}

      <div className="payment-methods">
        <h3>Select Payment Method</h3>
        <div className="payment-options">
          <button 
            className="payment-button"
            onClick={handlePayment}
            disabled={loading}
          >
            {loading ? 'Processing...' : 'Pay Now'}
          </button>
        </div>
      </div>

      <button 
        onClick={() => navigate(paymentDetails.eventId ? '/events' : '/venues')} 
        className="cancel-button"
        disabled={loading}
      >
        Cancel Payment
      </button>
    </div>
  );
};

export default Payment; 