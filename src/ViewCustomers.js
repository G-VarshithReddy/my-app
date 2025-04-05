import React, { useState, useEffect } from "react";
import axios from "axios";
import "./ViewCustomers.css";

const ViewCustomers = () => {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        const token = localStorage.getItem("adminToken");
        if (!token) {
          setError("Please login as admin to view customers");
          setLoading(false);
          return;
        }

        const response = await axios.get("http://localhost:5000/user", {
          headers: {
            "Authorization": `Bearer ${token}`
          }
        });
        setCustomers(response.data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching customers:", error);
        if (error.response?.status === 401) {
          setError("Session expired. Please login again.");
        } else {
          setError("Failed to load customers. Please try again later.");
        }
        setLoading(false);
      }
    };

    fetchCustomers();
  }, []);

  if (loading) {
    return (
      <div className="customers-container">
        <div className="loading">Loading customers...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="customers-container">
        <div className="error-message">{error}</div>
      </div>
    );
  }

  return (
    <div className="customers-container">
      <h2>Customer Details</h2>
      <div className="customers-table-container">
        <table className="customers-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Email</th>
              <th>Password</th>
            </tr>
          </thead>
          <tbody>
            {customers.map((customer) => (
              <tr key={customer.id}>
                <td>{customer.id}</td>
                <td>{customer.name}</td>
                <td>{customer.email}</td>
                <td>{customer.password}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ViewCustomers;
