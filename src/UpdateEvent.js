import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import "./UpdateEvent.css";

const UpdateEvent = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [event, setEvent] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    category: "",
    venueType: "",
    venue: "",
    location: "",
    ticketCount: "",
    fee: "",
    eventDate: "",
    imageUrl: "",
    description: ""
  });
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const token = localStorage.getItem("adminToken");
        if (!token) {
          setMessage("No authentication token found. Please login again.");
          navigate("/admin-sign");
          return;
        }

        const response = await axios.get(`http://localhost:5000/event/${id}`, {
          headers: {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json"
          }
        });
        
        if (!response.data) {
          setMessage("Event not found");
          setLoading(false);
          return;
        }

        const eventData = response.data;
        setEvent(eventData);
        setFormData({
          name: eventData.name || "",
          category: eventData.category || "",
          venueType: eventData.venueType || "",
          venue: eventData.venue || "",
          location: eventData.location || "",
          ticketCount: eventData.ticketCount || "",
          fee: eventData.fee || "",
          eventDate: eventData.eventDate || "",
          imageUrl: eventData.imageUrl || "",
          description: eventData.description || ""
        });
      } catch (error) {
        console.error("Error fetching event:", error);
        if (error.response?.status === 401) {
          setMessage("Unauthorized. Please login again.");
          navigate("/admin-sign");
        } else if (error.response) {
          setMessage(`Error: ${error.response.data.message || "Failed to fetch event details"}`);
        } else {
          setMessage("Failed to fetch event details");
        }
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchEvent();
    } else {
      setMessage("No event ID provided");
      setLoading(false);
    }
  }, [id, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    
    try {
      const token = localStorage.getItem("adminToken");
      if (!token) {
        setMessage("No authentication token found. Please login again.");
        navigate("/admin-sign");
        return;
      }

      // Format the date to match exactly "MM/dd/yyyy hh:mm:ss a"
      const date = new Date(formData.eventDate);
      const formattedDate = `${String(date.getMonth() + 1).padStart(2, '0')}/${String(date.getDate()).padStart(2, '0')}/${date.getFullYear()} ${String(date.getHours() % 12 || 12).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}:${String(date.getSeconds()).padStart(2, '0')} ${date.getHours() >= 12 ? 'PM' : 'AM'}`;

      // Create a copy of formData with formatted date
      const submitData = {
        ...formData,
        eventDate: formattedDate
      };

      console.log("Submitting data:", submitData);

      const response = await axios.put(`http://localhost:5000/event/${id}`, submitData, {
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json"
        }
      });

      if (response.status === 200) {
        setMessage("Event updated successfully!");
        setTimeout(() => {
          navigate("/admin");
        }, 1500);
      }
    } catch (error) {
      console.error("Error updating event:", error);
      if (error.response?.status === 401) {
        setMessage("Unauthorized. Please login again.");
        navigate("/admin-sign");
      } else {
        setMessage(error.response?.data?.message || "Failed to update event");
      }
    }
  };

  if (loading) {
    return <div className="update-event-container">Loading...</div>;
  }

  if (!event) {
    return <div className="update-event-container">Event not found</div>;
  }

  return (
    <div className="update-event-container">
      <h1 className="update-event-title">Update Event</h1>
      {message && (
        <p className={`update-message ${message.includes("success") ? "success" : "error"}`}>
          {message}
        </p>
      )}
      <form onSubmit={handleSubmit} className="update-event-form">
        <div className="form-group">
          <label>Event Name</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label>Category</label>
          <input
            type="text"
            name="category"
            value={formData.category}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label>Venue Type</label>
          <input
            type="text"
            name="venueType"
            value={formData.venueType}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label>Venue</label>
          <input
            type="text"
            name="venue"
            value={formData.venue}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label>Location</label>
          <input
            type="text"
            name="location"
            value={formData.location}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label>Number of Tickets</label>
          <input
            type="number"
            name="ticketCount"
            value={formData.ticketCount}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label>Price ($)</label>
          <input
            type="number"
            name="fee"
            value={formData.fee}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label>Event Date</label>
          <input
            type="datetime-local"
            name="eventDate"
            value={formData.eventDate}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label>Image URL</label>
          <input
            type="url"
            name="imageUrl"
            value={formData.imageUrl}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label>Description</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            required
          />
        </div>

        <div className="button-group">
          <button type="submit" className="update-btn">
            Update Event
          </button>
          <button 
            type="button" 
            className="cancel-btn"
            onClick={() => navigate("/admin")}
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default UpdateEvent; 