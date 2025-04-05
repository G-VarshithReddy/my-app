import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import "./RegisterEvent.css";
import { getToken } from './utils/auth';

const RegisterEvent = () => {
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const [event, setEvent] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    numberOfTickets: 1,
  });
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        console.log("Event ID from params:", id);
        console.log("Full URL:", window.location.href);
        
        if (!id) {
          console.error("No event ID in URL parameters");
          setMessage("No event ID provided");
          setLoading(false);
          return;
        }

        const token = getToken();
        if (!token) {
          setMessage("Please login to view event details");
          setTimeout(() => {
            navigate("/user-signin", {
              state: {
                eventId: id,
                isEventRegistration: true,
                returnUrl: `/register-event/${id}`
              }
            });
          }, 2000);
          return;
        }

        console.log("Using event ID for API call:", id);
        const eventUrl = `http://localhost:5000/event/${id}`;
        console.log("Making request to:", eventUrl);

        const eventResponse = await axios.get(eventUrl, {
          headers: {
            Authorization: token
          }
        });
        
        console.log("Event details response:", eventResponse.data);
        
        if (!eventResponse.data) {
          console.error("No event data received");
          setMessage("Event not found");
          return;
        }

        console.log("Setting event data:", eventResponse.data);
        setEvent(eventResponse.data);

        // Get user data from localStorage
        const userData = JSON.parse(localStorage.getItem("userData"));
        if (userData) {
          setFormData(prev => ({
            ...prev,
            name: userData.name || "",
            email: userData.email || "",
            phone: userData.phone || ""
          }));
        }

      } catch (error) {
        console.error("Error fetching event details:", error);
        console.error("Error response:", error.response);
        if (error.response?.status === 404) {
          setMessage("Event not found");
        } else if (error.response?.status === 401) {
          setMessage("Please login to view event details");
          setTimeout(() => {
            navigate("/user-signin", {
              state: {
                eventId: id,
                isEventRegistration: true,
                returnUrl: `/register-event/${id}`
              }
            });
          }, 2000);
        } else {
          setMessage("Error loading event details. Please try again.");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchEvent();
  }, [id, navigate]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    
    try {
      const token = getToken();
      if (!token) {
        setMessage("Please login to register for events");
        setTimeout(() => {
          navigate("/user-signin", {
            state: {
              eventId: id,
              isEventRegistration: true,
              returnUrl: `/register-event/${id}`
            }
          });
        }, 2000);
        return;
      }

      console.log("Submitting registration form");
      console.log("Sending registration request with data:", formData);
      
      const response = await axios.put(
        `http://localhost:5000/user/event/${id}`,
        formData,
        {
          headers: {
            "Content-Type": "application/json",
            "Authorization": token
          }
        }
      );

      console.log("Registration response:", response.data);

      if (response.status === 200) {
        setMessage("Registration successful!");
        
        // Wait for 2 seconds to show the success message before navigating
        setTimeout(() => {
          // Navigate to payment page with event and registration details
          navigate(`/payment`, {
            state: {
              numberOfTickets: parseInt(formData.numberOfTickets),
              eventDetails: event,
              registrationId: response.data.registrationId,
              eventId: id,
              totalAmount: event.fee * parseInt(formData.numberOfTickets)
            }
          });
        }, 2000);
      }
    } catch (error) {
      console.error("Registration error:", error);
      console.error("Error response:", error.response);
      if (error.response?.status === 401) {
        setMessage("Please login to register for events");
        setTimeout(() => {
          navigate("/user-signin", {
            state: {
              eventId: id,
              isEventRegistration: true,
              returnUrl: `/register-event/${id}`
            }
          });
        }, 2000);
      } else {
        setMessage(error.response?.data?.message || "Registration failed. Please try again.");
      }
    }
  };

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  if (!event) {
    return <div className="error">Event not found</div>;
  }

  return (
    <div className="register-container">
      <div className="registration-form-container">
        <h2>Event Registration</h2>

        {message && (
          <div className={`message ${message.includes("successful") ? "success" : "error"}`}>
            {message}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="name">Name:</label>
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
            <label htmlFor="email">Email:</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="phone">Phone:</label>
            <input
              type="tel"
              id="phone"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="numberOfTickets">Number of Tickets:</label>
            <input
              type="number"
              id="numberOfTickets"
              name="numberOfTickets"
              min="1"
              max={event.ticketCount}
              value={formData.numberOfTickets}
              onChange={handleChange}
              required
            />
          </div>

          <div className="event-details">
            <h3>Event Details</h3>
            <p><strong>Event Name:</strong> {event.name}</p>
            <p><strong>Date:</strong> {new Date(event.eventDate).toLocaleDateString()}</p>
            <p><strong>Venue:</strong> {event.venue}</p>
            <p><strong>Location:</strong> {event.location}</p>
            <p><strong>Price per Ticket:</strong> ₹{event.fee}</p>
            <p><strong>Total Amount:</strong> ₹{event.fee * parseInt(formData.numberOfTickets)}</p>
          </div>

          <button type="submit" className="submit-btn">
            Register
          </button>
        </form>
      </div>
    </div>
  );
};

export default RegisterEvent;