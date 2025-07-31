// pages/Login.jsx
import { useState } from 'react';
import {
  Container, TextField, Button, Typography, Box, Alert
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import axios from '../api/axios';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const res = await axios.post('/login', { email, password });
      const token = res.data.token;
      localStorage.setItem('token', token);

      const userRes = await axios.get('/me', {
        headers: { Authorization: `Bearer ${token}` },
      });

      const role = userRes.data.role;
      if (role === 'admin') navigate('/dashboard');
      else if (role === 'teacher') navigate('/teacher-dashboard');
      else if (role === 'student') navigate('/student-dashboard');
      else setError('Unknown role');
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed');
    }
  };

  return (
    <Container maxWidth="sm">
      <Box
        sx={{
          mt: 10,
          p: 4,
          boxShadow: 3,
          borderRadius: 2,
          bgcolor: 'white',
        }}
      >
        <Typography variant="h5" gutterBottom textAlign="center">
          Login
        </Typography>

        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

        <form onSubmit={handleLogin}>
          <TextField
            fullWidth
            label="Email"
            type="email"
            value={email}
            required
            margin="normal"
            onChange={(e) => setEmail(e.target.value)}
          />

          <TextField
            fullWidth
            label="Password"
            type="password"
            value={password}
            required
            margin="normal"
            onChange={(e) => setPassword(e.target.value)}
          />

          <Button
            type="submit"
            variant="contained"
            fullWidth
            sx={{ mt: 2 }}
          >
            Login
          </Button>
        </form>
      </Box>
    </Container>
  );
}
