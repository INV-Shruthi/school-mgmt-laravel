import { createContext, useContext, useState, useEffect } from 'react';
import axios from '../api/axios';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  const fetchUser = async () => {
    try {
      const res = await axios.get('/me');
      setUser(res.data);
    } catch {
      setUser(null);
    }
  };

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) fetchUser();
  }, []);

  const login = async (credentials) => {
    const res = await axios.post('/login', credentials);
    localStorage.setItem('token', res.data.token);
    await fetchUser();
  };

  const logout = async () => {
    await axios.post('/logout');
    localStorage.removeItem('token');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
