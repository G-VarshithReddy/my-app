import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./Categories.css";

const Categories = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const fetchCategories = useCallback(async () => {
    try {
      const token = localStorage.getItem("adminToken");
      if (!token) {
        setError("Please login as admin to view categories");
        setLoading(false);
        return;
      }

      const response = await axios.get("http://localhost:5000/categories", {
        headers: {
          "Authorization": `Bearer ${token}`
        }
      });
      setCategories(response.data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching categories:", error);
      if (error.response?.status === 401) {
        setError("Session expired. Please login again.");
        localStorage.removeItem("adminToken");
        navigate("/admin-signin");
      } else {
        setError("Failed to load categories. Please try again later.");
      }
      setLoading(false);
    }
  }, [navigate]);

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  const handleDelete = async (categoryId) => {
    if (!window.confirm("Are you sure you want to delete this category?")) {
      return;
    }

    try {
      const token = localStorage.getItem("adminToken");
      await axios.delete(`http://localhost:5000/categories/delete/${categoryId}`, {
        headers: {
          "Authorization": `Bearer ${token}`
        }
      });
      // Refresh categories after deletion
      fetchCategories();
    } catch (error) {
      console.error("Error deleting category:", error);
      alert("Failed to delete category. Please try again.");
    }
  };

  const handleUpdate = (categoryId) => {
    navigate(`/categories/update/${categoryId}`);
  };

  if (loading) {
    return (
      <div className="cat-categories-container">
        <div className="cat-loading">Loading categories...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="cat-categories-container">
        <div className="cat-error-message">{error}</div>
      </div>
    );
  }

  return (
    <div className="cat-categories-container">
      <h2>Event Categories</h2>
      <div className="cat-categories-grid">
        {categories.map((category) => (
          <div key={category.id} className="cat-category-card">
            <div className="cat-category-content">
              <h3>{category.name}</h3>
              <p>{category.description}</p>
            </div>
            <div className="cat-category-actions">
              <button 
                className="cat-update-btn"
                onClick={() => handleUpdate(category.id)}
              >
                Update
              </button>
              <button 
                className="cat-delete-btn"
                onClick={() => handleDelete(category.id)}
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Categories;
