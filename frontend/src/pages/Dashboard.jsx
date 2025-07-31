import React from 'react';
import { AppBar, Toolbar, Typography, Button, Container } from '@mui/material';
import { useNavigate } from 'react-router-dom';

export default function Dashboard() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.clear();  
    navigate('/');      
  };

  return (
    <>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" sx={{ flexGrow: 1 }}>
            Admin Dashboard
          </Typography>
          <Button color="inherit" onClick={handleLogout}>
            Logout
          </Button>
        </Toolbar>
      </AppBar>

      <Container sx={{ mt: 4 }}>
        <Typography variant="h5">Welcome, Admin</Typography>
        <Button variant="contained" color="primary" sx={{ m: 1 }}>
          Register New User
        </Button>
        <Button variant="outlined" sx={{ m: 1 }}>
          View Teachers
        </Button>
        <Button variant="outlined" sx={{ m: 1 }}>
          View Students
        </Button>
      </Container>
    </>
  );
}
