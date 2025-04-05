import React, { useState } from 'react';
import './CustomerBookings.css';

const CustomerBookings = () => {
  const [bookings] = useState([
    {
      id: 1,
      venueName: 'Grand Wedding Hall',
      eventType: 'Wedding Ceremony',
      date: '2024-03-15',
      time: '10:00 AM',
      status: 'upcoming',
      amount: 50000
    },
    {
      id: 2,
      venueName: 'Corporate Conference Center',
      eventType: 'Business Meeting',
      date: '2024-02-28',
      time: '2:00 PM',
      status: 'completed',
      amount: 25000
    },
    {
      id: 3,
      venueName: 'Birthday Party Venue',
      eventType: 'Birthday Celebration',
      date: '2024-04-01',
      time: '6:00 PM',
      status: 'upcoming',
      amount: 15000
    }
  ]);

  const getStatusColor = (status) => {
    switch (status) {
      case 'upcoming':
        return '#3498db';
      case 'completed':
        return '#2ecc71';
      case 'cancelled':
        return '#e74c3c';
      default:
        return '#95a5a6';
    }
  };

  return (
    <div className="customer-bookings">
      <div className="bookings-header">
        <h1><i className="fas fa-calendar-check"></i> My Bookings</h1>
        <p>View and manage your event bookings</p>
      </div>

      <div className="bookings-content">
        <div className="bookings-filters">
          <select className="filter-select">
            <option value="all">All Bookings</option>
            <option value="upcoming">Upcoming</option>
            <option value="completed">Completed</option>
            <option value="cancelled">Cancelled</option>
          </select>
          <input
            type="text"
            placeholder="Search bookings..."
            className="search-input"
          />
        </div>

        <div className="bookings-list">
          {bookings.map(booking => (
            <div key={booking.id} className="booking-card">
              <div className="booking-header">
                <h3>{booking.venueName}</h3>
                <span
                  className="status-badge"
                  style={{ backgroundColor: getStatusColor(booking.status) }}
                >
                  {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                </span>
              </div>
              <div className="booking-details">
                <div className="detail-item">
                  <i className="fas fa-calendar"></i>
                  <span>{new Date(booking.date).toLocaleDateString()}</span>
                </div>
                <div className="detail-item">
                  <i className="fas fa-clock"></i>
                  <span>{booking.time}</span>
                </div>
                <div className="detail-item">
                  <i className="fas fa-tag"></i>
                  <span>{booking.eventType}</span>
                </div>
                <div className="detail-item">
                  <i className="fas fa-rupee-sign"></i>
                  <span>{booking.amount.toLocaleString()}</span>
                </div>
              </div>
              <div className="booking-actions">
                <button className="action-button view-button">
                  <i className="fas fa-eye"></i> View Details
                </button>
                {booking.status === 'upcoming' && (
                  <button className="action-button cancel-button">
                    <i className="fas fa-times"></i> Cancel Booking
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CustomerBookings; 