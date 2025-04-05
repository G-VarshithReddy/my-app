import React, { useState } from "react";
import "./AddCategory.css";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const AddCategory = () => {
  const [formData, setFormData] = useState({
    name: "",
    description: ""
  });

  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
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

      // Create the data object matching the backend's Category model
      const submitData = {
        name: formData.name.trim(),
        description: formData.description.trim()
      };

      // Log the data being sent
      console.log("Form Data:", formData);
      console.log("Submit Data:", JSON.stringify(submitData, null, 2));

      const response = await axios.post(
        "http://localhost:5000/categories/add",
        submitData, // Send the data object directly
        {
          headers: {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json"
          }
        }
      );

      if (response.status === 200) {
        setMessage("Category added successfully!");
        setFormData({ name: "", description: "" });
        setTimeout(() => {
          navigate("/all-categories");
        }, 2000);
      }
    } catch (error) {
      console.error("Error adding category:", error);
      if (error.response) {
        console.error("Server error details:", error.response.data);
        console.error("Status code:", error.response.status);
        console.error("Response headers:", error.response.headers);
        console.error("Request data:", JSON.stringify(error.config.data, null, 2));
      }
      if (error.response?.status === 401) {
        setMessage("Unauthorized. Please login again.");
        navigate("/admin-sign");
      } else if (error.response?.status === 400) {
        // Show the specific error message from the server
        const errorMessage = error.response.data.message || "Invalid data provided";
        setMessage(`Error: ${errorMessage}`);
        console.error("Server error details:", error.response.data);
      } else {
        setMessage(error.response?.data?.message || "Failed to add category");
      }
    }
  };

  return (
    <div className="category-form-container">
      <h2 className="category-form-title">Add New Category</h2>
      {message && (
        <div className={`message ${message.includes("success") ? "success" : "error"}`}>
          {message}
        </div>
      )}
      <form onSubmit={handleSubmit} className="category-form">
        <div className="form-group">
          <label>Category Name</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="Enter category name"
            required
          />
        </div>

        <div className="form-group">
          <label>Description</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            placeholder="Enter category description"
            required
          />
        </div>

        <button type="submit" className="submit-btn">Add Category</button>
      </form>
    </div>
  );
};

export default AddCategory;
