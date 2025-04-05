import React, { useState, useEffect } from "react";
import "./AddEvent.css";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const AddEvent = () => {
  const [formData, setFormData] = useState({
    name: "",
    category: "",
    venue: "",
    location: "",
    ticketCount: "",
    fee: "",
    eventDate: "",
    imageUrl: "",
  });

  const [categories, setCategories] = useState([]);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const token = localStorage.getItem("adminToken");
        if (!token) {
          setError("Please login as admin to add events");
          return;
        }

        console.log("Fetching categories...");
        const response = await axios.get("http://localhost:5000/categories", {
          headers: {
            "Authorization": `Bearer ${token}`
          }
        });
        console.log("Categories response:", response.data);
        setCategories(response.data);
      } catch (error) {
        console.error("Error fetching categories:", error.response || error);
        setError("Failed to fetch categories. Please try again later.");
      }
    };

    fetchCategories();
  }, []);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("adminToken");
      if (!token) {
        setError("Please login as admin to add events");
        return;
      }

      // Format the date to match the required format
      const date = new Date(formData.eventDate);
      const formattedDate = date.toLocaleString('en-US', {
        month: '2-digit',
        day: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: true
      }).replace(',', '');

      // Create a new object with the formatted date
      const submitData = {
        ...formData,
        eventDate: formattedDate
      };

      console.log("Submitting data:", submitData);

      await axios.post(
        "http://localhost:5000/event",
        submitData,
        {
          headers: {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      setMessage("Event added successfully!");
      setFormData({
        name: "",
        category: "",
        venue: "",
        location: "",
        ticketCount: "",
        fee: "",
        eventDate: "",
        imageUrl: "",
      });
      setError("");
      
      // Navigate to admin page after successful event creation
      setTimeout(() => {
        navigate("/admin");
      }, 1500);
    } catch (error) {
      console.error("Error adding event:", error);
      setError(error.response?.data?.message || "Failed to add event. Please try again.");
      setMessage("");
    }
  };

  return (
    <div className="add-event-container">
      <h2>Add New Event</h2>
      {message && <div className="success-message">{message}</div>}
      {error && <div className="error-message">{error}</div>}
      <form onSubmit={handleSubmit} className="add-event-form">
        <div className="form-group">
          <label htmlFor="name">Event Name:</label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="category">Category:</label>
          <select
            id="category"
            name="category"
            value={formData.category}
            onChange={handleChange}
            required
          >
            <option value="">Select a category</option>
            {categories && categories.map((category) => (
              <option key={category.id} value={category.name}>
                {category.name}
              </option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="venue">Venue:</label>
          <input
            type="text"
            id="venue"
            name="venue"
            value={formData.venue}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="location">Location:</label>
          <input
            type="text"
            id="location"
            name="location"
            value={formData.location}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="ticketCount">Number of Tickets:</label>
          <input
            type="number"
            id="ticketCount"
            name="ticketCount"
            value={formData.ticketCount}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="fee">Ticket Fee:</label>
          <input
            type="number"
            id="fee"
            name="fee"
            value={formData.fee}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="eventDate">Event Date:</label>
          <input
            type="datetime-local"
            id="eventDate"
            name="eventDate"
            value={formData.eventDate}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="imageUrl">Image URL:</label>
          <input
            type="url"
            id="imageUrl"
            name="imageUrl"
            value={formData.imageUrl}
            onChange={handleChange}
            required
          />
        </div>

        <button type="submit" className="submit-btn">
          Add Event
        </button>
      </form>
    </div>
  );
};

export default AddEvent;
