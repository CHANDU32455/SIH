import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { logout } from '../auth';

function Logout() {
  const navigate = useNavigate();

  useEffect(() => {
    logout();  // Clear session storage
    navigate('/');  // Redirect to login page
  }, [navigate]);

  return null;
}

export default Logout;
