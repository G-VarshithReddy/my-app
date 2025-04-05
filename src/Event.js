import React, { useEffect, useState } from "react";
import axios from "axios";
import "./Event.css";


const Event = () => {
  const [events, setEvents] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchEvents();
  }, []);

  

  const fetchEvents = async () => {
    try {
      const response = await axios.get("http://localhost:5000/event");
      if (Array.isArray(response.data)) {
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

  if (loading) {
    return <div className="event-view-loading">Loading events...</div>;
  }

  return (
    <div className="event-view-wrapper">
      <h1 className="event-view-title">All Events</h1>
      {message && (
        <div className={`event-view-message ${message.includes("Failed") ? "error" : "info"}`}>
          {message}
        </div>
      )}
      <div className="event-view-container">
        {events.length > 0 ? (
          events.map((event) => (
            <div key={event._id} className="event-view-card" onClick={() => setSelectedEvent(event)}>
              <img
                src={event.imageUrl || "/default-image.jpg"}
                alt={event.name}
                className="event-view-image"
              />
              <h3 className="event-view-name">{event.name}</h3>
              <p className="event-view-details">{event.category} - {event.venueType || "N/A"}</p>
              <p className="event-view-details">{event.venue}, {event.location}</p>
              <p className="event-view-details">Tickets: {event.ticketCount}</p>
              <p className="event-view-details">Price: ₹{event.fee}</p>
              <p className="event-view-details">
                {event.eventDate ? new Date(event.eventDate).toLocaleDateString() : "Date not available"}
              </p>
            </div>
          ))
        ) : (
          <p className="event-view-no-events">No events found.</p>
        )}
      </div>

      {selectedEvent && (
        <div className="event-view-modal-overlay" onClick={() => setSelectedEvent(null)}>
          <div className="event-view-modal-content" onClick={(e) => e.stopPropagation()}>
            <button className="event-view-close-btn" onClick={() => setSelectedEvent(null)}>X</button>
            <img
              src={selectedEvent.imageUrl || "/default-image.jpg"}
              alt={selectedEvent.name}
              className="event-view-modal-image"
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

export default Event;
