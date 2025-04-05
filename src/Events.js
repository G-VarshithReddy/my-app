import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./Events.css";


const Events = () => {
  const [events, setEvents] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      const response = await axios.get("http://localhost:5000/event");
      console.log("Events API Response:", response.data);
      
      if (Array.isArray(response.data)) {
        if (response.data.length > 0) {
          console.log("Sample event structure:", response.data[0]);
        }
        setEvents(response.data);
      } else {
        setMessage("No events found.");
      }
    } catch (error) {
      console.error("Error fetching events:", error);
      setMessage("Failed to fetch events. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = (eventId) => {
    console.log("Register clicked for event:", eventId);
    
    // Ensure eventId is valid before navigation
    if (!eventId) {
      console.error("Invalid event ID:", eventId);
      return;
    }

    console.log("Navigating to register event page with ID:", eventId);
    navigate(`/register-event/${eventId}`);
  };

  if (loading) {
    return <div className="events-loading">Loading events...</div>;
  }

  return (
    <div>
      <h1 className="events-title1">All Events</h1>
      {message && (
        <div className={`message ${message.includes("Failed") ? "error" : "info"}`}>
          {message}
        </div>
      )}
      <div className="events-container">
        {events.length > 0 ? (
          events.map((event) => {
            console.log("Rendering event:", event);
            return (
            <div key={event.id} className="events-card" onClick={() => setSelectedEvent(event)}>
              <img
                src={event.imageUrl || "/default-image.jpg"}
                alt={event.name}
                className="events-image"
              />
              <h3 className="events-name">{event.name}</h3>
              <p className="events-details">{event.category} - {event.venueType || "N/A"}</p>
              <p className="events-details">{event.venue}, {event.location}</p>
              <p className="events-details">Tickets: {event.ticketCount}</p>
              <p className="events-details">Price: ₹{event.fee}</p>
              <p className="events-details">
                {event.eventDate ? new Date(event.eventDate).toLocaleDateString() : "Date not available"}
              </p>
              <button 
                className="register-btn"
                onClick={(e) => {
                  e.stopPropagation();
                  console.log("Event object:", event);
                  console.log("Event ID being passed:", event.id);
                  handleRegister(event.id);
                }}
              >
                Register Now
              </button>
            </div>
          )})
        ) : (
          <p className="no-events">No events found.</p>
        )}
      </div>

      {selectedEvent && (
        <div className="events-modal-overlay" onClick={() => setSelectedEvent(null)}>
          <div className="events-modal-content" onClick={(e) => e.stopPropagation()}>
            <button className="events-close-btn" onClick={() => setSelectedEvent(null)}>X</button>
            <img
              src={selectedEvent.imageUrl || "/default-image.jpg"}
              alt={selectedEvent.name}
              className="events-modal-image"
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

export default Events;
