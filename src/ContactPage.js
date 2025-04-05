import React, { useState } from "react";
import axios from "axios";
import "./ContactPage.css";

const ContactPage = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });

  const [responseMessage, setResponseMessage] = useState("");

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post("http://localhost:5000/contact/submit", formData, {
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (response.status === 200) {
        setResponseMessage("Message sent successfully!");
        setFormData({ name: "", email: "", message: "" }); // Clear form after successful submission
      }
    } catch (error) {
      setResponseMessage("Failed to send message. Please try again.");
    }
  };

  return (
    <div className="contactbody">
      <div className="container">
        <div className="contact-box">
          {/* Left Section */}
          <div className="left">
            <h2 className="contact-title">
              {["C", "O", "N", "T", "A", "C", "T", " ", "U", "S"].map((letter, index) => (
                <span key={index}>{letter}</span>
              ))}
            </h2>
            <form onSubmit={handleSubmit}>
              <input
                type="text"
                name="name"
                placeholder="Name"
                className="input-field"
                value={formData.name}
                onChange={handleChange}
                required
              />
              <input
                type="email"
                name="email"
                placeholder="Email"
                className="input-field"
                value={formData.email}
                onChange={handleChange}
                required
              />
              <textarea
                name="message"
                placeholder="Message"
                className="input-field"
                rows="4"
                value={formData.message}
                onChange={handleChange}
                required
              ></textarea>
              <button type="submit" className="submit-btn">Submit</button>
            </form>
            {responseMessage && <p className="response-message">{responseMessage}</p>}
          </div>

          {/* Right Section - Illustration */}
          <div className="right">
            <img src="contact.png" alt="Illustration" className="illustration" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactPage;
