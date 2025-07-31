import { useEffect, useState } from 'react';
import axios from '../api/axios';
import { useNavigate } from 'react-router-dom';

export default function Dashboard() {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    axios.get('/me')
      .then(res => setUser(res.data))
      .catch(() => navigate('/'));
  }, []);

  const handleLogout = async () => {
    await axios.post('/logout');
    localStorage.removeItem('token');
    navigate('/');
  };

  return user ? (
    <div>
      <h2>Welcome, {user.first_name}</h2>
      <p>Role: {user.role}</p>
      <button onClick={handleLogout}>Logout</button>
    </div>
  ) : (
    <p>Loading...</p>
  );
}
