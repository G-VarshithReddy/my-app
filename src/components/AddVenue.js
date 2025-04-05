import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './AddVenue.css';

const AddVenue = () => {
  const [venues, setVenues] = useState([]);
  const [formData, setFormData] = useState({
    name: '',
    location: '',
    capacity: '',
    amenities: '',
    pricePerHour: '',
    imageUrl: '',
    description: ''
  });
  const [editingVenue, setEditingVenue] = useState(null);

  useEffect(() => {
    fetchVenues();
  }, []);

  const fetchVenues = async () => {
    try {
      const response = await axios.get('http://localhost:5000/venues');
      setVenues(response.data);
    } catch (error) {
      console.error('Error fetching venues:', error);
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
      if (editingVenue) {
        await axios.put(`http://localhost:5000/venues/${venueId}`, formData);
      } else {
        await axios.post('http://localhost:5000/venues', formData);
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
      fetchVenues();
    } catch (error) {
      console.error('Error saving venue:', error);
    }
  };

  const handleEdit = (venue) => {
    setEditingVenue(venue);
    setFormData({
      name: venue.name,
      location: venue.location,
      capacity: venue.capacity,
      amenities: venue.amenities,
      pricePerHour: venue.pricePerHour,
      imageUrl: venue.imageUrl,
      description: venue.description
    });
  };

  const handleDelete = async (venueId) => {
    if (window.confirm('Are you sure you want to delete this venue?')) {
      try {
        await axios.delete(`http://localhost:5000/venues/${venueId}`);
        fetchVenues();
      } catch (error) {
        console.error('Error deleting venue:', error);
      }
    }
  };

  return (
    <div className="add-venue-container">
      <h2>{editingVenue ? 'Edit Venue' : 'Add New Venue'}</h2>
      <form onSubmit={handleSubmit} className="venue-form">
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
        <button type="submit" className="submit-btn">
          {editingVenue ? 'Update Venue' : 'Add Venue'}
        </button>
      </form>

      <div className="venues-list">
        <h3>Existing Venues</h3>
        <div className="venues-grid">
          {venues.map((venue) => (
            <div key={venue._id} className="venue-card">
              <img src={venue.imageUrl} alt={venue.name} className="venue-image" />
              <div className="venue-info">
                <h4>{venue.name}</h4>
                <p>Location: {venue.location}</p>
                <p>Capacity: {venue.capacity}</p>
                <p>Price: ${venue.pricePerHour}/hour</p>
              </div>
              <div className="venue-actions">
                <button onClick={() => handleEdit(venue)} className="edit-btn">
                  Edit
                </button>
                <button onClick={() => handleDelete(venue._id)} className="delete-btn">
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AddVenue; 