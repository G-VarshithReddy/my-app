import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./EventManagement.css";

const EventManagement = () => {
  const navigate = useNavigate();
  const [events, setEvents] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [message, setMessage] = useState("");

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      const response = await axios.get("http://localhost:5000/event", {
        headers: {
          "Content-Type": "application/json"
        },
      });
      setEvents(response.data);
    } catch (error) {
      console.error("Error fetching events:", error.response?.data || error.message);
      setMessage("Failed to fetch events");
    }
  };

  const handleDelete = async (eventId) => {
    try {
      const token = localStorage.getItem("adminToken");
      if (!token) {
        setMessage("No authentication token found. Please login again.");
        return;
      }

      const response = await axios.delete(`http://localhost:5000/event/${eventId}`, {
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json"
        }
      });
      
      if (response.status === 204) {
        setMessage("Event deleted successfully");
        fetchEvents(); // Refresh the events list
      }
    } catch (error) {
      if (error.response?.status === 401) {
        setMessage("Unauthorized. Please login again.");
        navigate("/admin-sign");
      } else {
        setMessage(error.response?.data?.message || "Failed to delete event");
      }
    }
  };

  const handleUpdate = async (eventId) => {
    try {
      const token = localStorage.getItem("adminToken");
      if (!token) {
        setMessage("No authentication token found. Please login again.");
        navigate("/admin-sign");
        return;
      }

      const response = await axios.get(`http://localhost:5000/event/${eventId}`, {
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json"
        }
      });
      
      if (response.data) {
        navigate(`/event/${eventId}`);
      } else {
        setMessage("Event not found");
      }
    } catch (error) {
      if (error.response?.status === 401) {
        setMessage("Unauthorized. Please login again.");
        navigate("/admin-sign");
      } else {
        setMessage("Failed to find event");
      }
    }
  };

  return (
    <div className="event-management-container">
      <h1>Event Management</h1>
      
      {message && (
        <div className={`alert ${message.includes("success") ? "alert-success" : "alert-error"}`}>
          {message}
        </div>
      )}

      <div className="events-grid">
        {events.length > 0 ? (
          events.map((event) => (
            <div key={event.id} className="event-card">
              <div className="event-image-container">
                <img
                  src={event.imageUrl || "/default-image.jpg"}
                  alt={event.name}
                  className="event-image"
                  onClick={() => setSelectedEvent(event)}
                />
              </div>
              
              <div className="event-details">
                <h3 className="event-name">{event.name}</h3>
                <p className="event-info">{event.category} - {event.venueType || "N/A"}</p>
                <p className="event-info">{event.venue}, {event.location}</p>
                <p className="event-info">Tickets: {event.ticketCount}</p>
                <p className="event-info">Price: ₹{event.fee}</p>
                <p className="event-info">
                  {event.eventDate ? new Date(event.eventDate).toLocaleDateString() : "Date not available"}
                </p>
              </div>

              <div className="event-actions">
                <button 
                  className="update-btn"
                  onClick={() => handleUpdate(event.id)}
                >
                  Update
                </button>
                <button 
                  className="delete-btn"
                  onClick={() => handleDelete(event.id)}
                >
                  Delete
                </button>
              </div>
            </div>
          ))
        ) : (
          <p className="no-events">No events found.</p>
        )}
      </div>

      {selectedEvent && (
        <div className="modal-overlay" onClick={() => setSelectedEvent(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <button className="close-btn" onClick={() => setSelectedEvent(null)}>×</button>
            <img
              src={selectedEvent.imageUrl || "/default-image.jpg"}
              alt={selectedEvent.name}
              className="modal-image"
            />
            <h2>{selectedEvent.name}</h2>
            <p><strong>Category:</strong> {selectedEvent.category} - {selectedEvent.venueType || "N/A"}</p>
            <p><strong>Location:</strong> {selectedEvent.venue}, {selectedEvent.location}</p>
            <p><strong>Tickets Available:</strong> {selectedEvent.ticketCount}</p>
            <p><strong>Price:</strong> ₹{selectedEvent.fee}</p>
            <p><strong>Date:</strong> {selectedEvent.eventDate ? new Date(selectedEvent.eventDate).toLocaleDateString() : "Date not available"}</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default EventManagement; 