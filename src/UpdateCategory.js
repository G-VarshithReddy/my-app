import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import "./UpdateCategory.css";

const UpdateCategory = () => {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
  });
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { id } = useParams();

  useEffect(() => {
    const fetchCategory = async () => {
      try {
        const token = localStorage.getItem("adminToken");
        if (!token) {
          setMessage("Please login as admin to update categories");
          setLoading(false);
          return;
        }

        const response = await axios.get(`http://localhost:5000/categories/${id}`, {
          headers: {
            "Authorization": `Bearer ${token}`
          }
        });
        setFormData({
          name: response.data.name,
          description: response.data.description,
        });
        setLoading(false);
      } catch (error) {
        console.error("Error fetching category:", error);
        setMessage("Failed to load category details. Please try again.");
        setLoading(false);
      }
    };

    fetchCategory();
  }, [id]);

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
      const token = localStorage.getItem("adminToken");
      if (!token) {
        setMessage("Please login as admin to update categories");
        return;
      }

      await axios.put(
        `http://localhost:5000/categories/update/${id}`,
        formData,
        {
          headers: {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      setMessage("Category updated successfully!");
      setTimeout(() => {
        navigate("/categories");
      }, 2000);
    } catch (error) {
      console.error("Error updating category:", error);
      setMessage(
        error.response?.data?.message || "Failed to update category. Please try again."
      );
    }
  };

  if (loading) {
    return (
      <div className="update-category-container">
        <div className="loading">Loading category details...</div>
      </div>
    );
  }

  return (
    <div className="update-category-container">
      <h2>Update Category</h2>
      {message && <div className="message">{message}</div>}
      <form onSubmit={handleSubmit} className="update-category-form">
        <div className="form-group">
          <label htmlFor="name">Category Name</label>
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
          <label htmlFor="description">Description</label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-actions">
          <button type="submit" className="update-btn">
            Update Category
          </button>
          <button
            type="button"
            className="cancel-btn"
            onClick={() => navigate("/categories")}
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default UpdateCategory; 