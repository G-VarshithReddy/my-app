import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const Logout = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Clear the admin token from localStorage
    localStorage.removeItem('adminToken');
    
    // Redirect to the main page
    navigate('/');
  }, [navigate]);

  return null;
};

export default Logout;
