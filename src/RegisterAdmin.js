import React, { useState } from "react";
import "./RegisterAdmin.css";

const AdminRegister = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    const adminData = { email, password };

    try {
      const response = await fetch("http://localhost:5000/admin/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(adminData),
      });

      const result = await response.text(); // Get response text

      if (response.ok) {
        setMessage("✅ Admin registered successfully!");
      } else {
        setMessage(result || "❌ Failed to register admin.");
      }
    } catch (error) {
      console.error("Error registering admin:", error);
      setMessage("⚠️ Error connecting to the server.");
    }
  };

  return (
    <div className="admin-register-container">
      <h1 className="title">Welcome to Event Management System</h1>
      <div className="admin-register-box">
        <div className="admin-register-title">ADMIN REGISTER</div>

        <form onSubmit={handleSubmit}>
          <div className="input-group">
            <label htmlFor="email">Email Id</label>
            <input
              type="email"
              id="email"
              className="admin-register-input"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="input-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              className="admin-register-input"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button type="submit" className="admin-register-btn">
            REGISTER
          </button>
        </form>

        {message && <p className="message">{message}</p>}
      </div>
    </div>
  );
};

export default AdminRegister;
