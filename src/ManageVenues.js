import React, { useState, useEffect } from "react";
import axios from "axios";
import "./ManageVenues.css";

const ManageVenues = () => {
  const [venues, setVenues] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [editingVenue, setEditingVenue] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    location: '',
    capacity: '',
    amenities: '',
    pricePerHour: '',
    imageUrl: '',
    description: ''
  });

  useEffect(() => {
    fetchVenues();
  }, []);

  const fetchVenues = async () => {
    try {
      const adminToken = localStorage.getItem('adminToken');
      if (!adminToken) {
        setError('Admin authentication required');
        setLoading(false);
        return;
      }

      const response = await axios.get("http://localhost:5000/venues", {
        headers: {
          'Authorization': `Bearer ${adminToken}`
        }
      });
      setVenues(response.data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching venues:", error);
      setError("Failed to fetch venues");
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const adminToken = localStorage.getItem('adminToken');
      if (!adminToken) {
        setError('Admin authentication required');
        return;
      }

      if (editingVenue) {
        await axios.put(`http://localhost:5000/venues/${editingVenue.id}`, formData, {
          headers: {
            'Authorization': `Bearer ${adminToken}`
          }
        });
      } else {
        await axios.post("http://localhost:5000/venues", formData, {
          headers: {
            'Authorization': `Bearer ${adminToken}`
          }
        });
      }
      
      setFormData({
        name: '',
        location: '',
        capacity: '',
        amenities: '',
        pricePerHour: '',
        imageUrl: '',
        description: ''
      });
      setEditingVenue(null);
      setShowForm(false);
      fetchVenues();
    } catch (error) {
      console.error('Error saving venue:', error);
      setError(error.response?.data?.message || 'Failed to save venue');
    }
  };

  const handleEdit = (venue) => {
    setEditingVenue(venue);
    setFormData({
      name: venue.name,
      location: venue.location,
      capacity: venue.capacity,
      amenities: venue.amenities || '',
      pricePerHour: venue.pricePerHour,
      imageUrl: venue.imageUrl || '',
      description: venue.description || ''
    });
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this venue?')) {
      try {
        const adminToken = localStorage.getItem('adminToken');
        if (!adminToken) {
          setError('Admin authentication required');
          return;
        }

        await axios.delete(`http://localhost:5000/venues/${id}`, {
          headers: {
            'Authorization': `Bearer ${adminToken}`
          }
        });
        setVenues(venues.filter(venue => venue.id !== id));
        setError('');
      } catch (error) {
        console.error('Error deleting venue:', error);
        setError(error.response?.data?.message || 'Failed to delete venue');
      }
    }
  };

  if (loading) {
    return (
      <div className="manage-venues-container">
        <div className="loading">Loading venues...</div>
      </div>
    );
  }

  return (
    <div className="manage-venues-container">
      <h1 className="manage-venues-title">Manage Venues</h1>
      
      {!showForm ? (
        <button 
          className="add-venue-btn"
          onClick={() => {
            setEditingVenue(null);
            setFormData({
              name: '',
              location: '',
              capacity: '',
              amenities: '',
              pricePerHour: '',
              imageUrl: '',
              description: ''
            });
            setShowForm(true);
          }}
        >
          Add New Venue
        </button>
      ) : (
        <div className="venue-form">
          <h2>{editingVenue ? 'Edit Venue' : 'Add New Venue'}</h2>
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Name:</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className="form-group">
              <label>Location:</label>
              <input
                type="text"
                name="location"
                value={formData.location}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className="form-group">
              <label>Capacity:</label>
              <input
                type="number"
                name="capacity"
                value={formData.capacity}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className="form-group">
              <label>Amenities:</label>
              <input
                type="text"
                name="amenities"
                value={formData.amenities}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className="form-group">
              <label>Price per Hour:</label>
              <input
                type="number"
                name="pricePerHour"
                value={formData.pricePerHour}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className="form-group">
              <label>Image URL:</label>
              <input
                type="url"
                name="imageUrl"
                value={formData.imageUrl}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className="form-group">
              <label>Description:</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className="form-actions">
              <button type="submit" className="submit-btn">
                {editingVenue ? 'Update Venue' : 'Add Venue'}
              </button>
              <button 
                type="button" 
                className="cancel-btn"
                onClick={() => {
                  setShowForm(false);
                  setEditingVenue(null);
                }}
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {error && <div className="error-message">{error}</div>}

      <div className="venues-grid">
        {venues.map((venue) => (
          <div key={venue.id} className="venue-card">
            <div className="venue-header">
              <span className="venue-id">#{venue.id}</span>
              <span className="venue-name">{venue.name}</span>
            </div>
            <div className="venue-content">
              <p><strong>Location:</strong> {venue.location}</p>
              <p><strong>Capacity:</strong> {venue.capacity} people</p>
              <p><strong>Price per Hour:</strong> ₹{venue.pricePerHour}</p>
              <p><strong>Amenities:</strong> {venue.amenities || 'N/A'}</p>
              {venue.description && (
                <p><strong>Description:</strong> {venue.description}</p>
              )}
              {venue.imageUrl && (
                <div className="venue-image">
                  <img src={venue.imageUrl} alt={venue.name} />
                </div>
              )}
            </div>
            <div className="venue-actions">
              <button 
                className="edit-btn"
                onClick={() => handleEdit(venue)}
              >
                UPDATE
              </button>
              <button 
                className="delete-btn"
                onClick={() => handleDelete(venue.id)}
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

export default ManageVenues; 