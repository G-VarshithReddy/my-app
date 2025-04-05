import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './MyProfile.css';

const MyProfile = () => {
  const navigate = useNavigate();
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadUserData = () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          navigate('/user-signin', { 
            state: { 
              from: '/customer/profile'
            }
          });
          return;
        }

        const storedUserData = localStorage.getItem('userData');
        if (!storedUserData) {
          navigate('/user-signin', { 
            state: { 
              from: '/customer/profile'
            }
          });
          return;
        }

        const parsedData = JSON.parse(storedUserData);
        setUserData(parsedData);
        setLoading(false);
      } catch (error) {
        console.error('Error loading user data:', error);
        navigate('/user-signin', { 
          state: { 
            from: '/customer/profile'
          }
        });
      }
    };

    loadUserData();
  }, [navigate]);

  const handleBackToDashboard = () => {
    navigate('/customer-dashboard');
  };

  if (loading) {
    return (
      <div className="profile-container">
        <div className="profile-card">
          <h2>Loading profile...</h2>
        </div>
      </div>
    );
  }

  return (
    <div className="profile-container">
      <div className="profile-card">
        <button className="back-button" onClick={handleBackToDashboard}>
          <i className="fas fa-arrow-left"></i> Back to Dashboard
        </button>

        <div className="profile-image-container">
          <div className="profile-image-placeholder">
            {userData?.name ? userData.name[0].toUpperCase() : '?'}
          </div>
        </div>
        
        <h1 className="profile-title">My Profile</h1>

        <div className="profile-fields">
          <div className="profile-field">
            <label>NAME</label>
            <div className="field-value">{userData?.name || 'Not provided'}</div>
          </div>

          <div className="profile-field">
            <label>EMAIL</label>
            <div className="field-value">{userData?.email || 'Not provided'}</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MyProfile; 