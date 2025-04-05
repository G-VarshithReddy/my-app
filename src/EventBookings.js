import React, { useState, useEffect } from "react";
import axios from "axios";
import "./EventBookings.css";

const EventBookings = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const token = localStorage.getItem("adminToken");
        if (!token) {
          setError("Please login as admin to view events");
          setLoading(false);
          return;
        }

        const response = await axios.get("http://localhost:5000/event", {
          headers: {
            "Authorization": `Bearer ${token}`
          }
        });
        setEvents(response.data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching events:", error);
        if (error.response?.status === 401) {
          setError("Session expired. Please login again.");
        } else {
          setError("Failed to load events. Please try again later.");
        }
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);

  if (loading) {
    return (
      <div className="bookings-container">
        <div className="loading">Loading events...</div>
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

  return (
    <div className="bookings-container">
      <h2>Event Details</h2>
      <div className="bookings-table-container">
        <table className="bookings-table">
          <thead>
            <tr>
              <th>Event ID</th>
              <th>Event Name</th>
              <th>Category</th>
              <th>Venue</th>
              <th>Location</th>
              <th>Ticket Count</th>
              <th>Fee</th>
              <th>Event Date</th>
              <th>Registered Users</th>
            </tr>
          </thead>
          <tbody>
            {events.map((event) => (
              <tr key={event.id}>
                <td>{event.id}</td>
                <td>{event.name}</td>
                <td>{event.category}</td>
                <td>{event.venue}</td>
                <td>{event.location}</td>
                <td>{event.ticketCount}</td>
                <td>₹{event.fee}</td>
                <td>{event.eventDate}</td>
                <td>
                  <ul className="users-list">
                    {event.users.map((user) => (
                      <li key={user.id}>
                        {user.name} ({user.email})
                        {user.roles.includes("ADMIN") && " - Admin"}
                      </li>
                    ))}
                  </ul>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default EventBookings;
