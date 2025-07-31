import React from 'react';
import { AppBar, Toolbar, Typography, Button, Container } from '@mui/material';
import { useNavigate } from 'react-router-dom';

export default function TeacherDashboard() {
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
            Teacher Dashboard
          </Typography>
          <Button color="inherit"onClick={handleLogout}>
            Logout
          </Button>
        </Toolbar>
      </AppBar>

      <Container sx={{ mt: 4 }}>
        <Typography variant="h5">Welcome, Teacher</Typography>
        <Button variant="outlined" sx={{ m: 1 }}>
          My Profile
        </Button>
        <Button variant="outlined" sx={{ m: 1 }}>
          View Assigned Students
        </Button>
      </Container>
    </>
  );
}
