import React, { useEffect, useState } from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Container,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  CircularProgress,
} from '@mui/material';
import axios from '../api/axios'; 
import { useNavigate } from 'react-router-dom';

export default function StudentDashboard() {
  const [open, setOpen] = useState(false);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.clear();
    navigate('/');
  };

  const fetchProfile = async () => {
    setLoading(true);
    try {
      const res = await axios.get('/me', {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      setProfile(res.data);
      setOpen(true);
    } catch (err) {
      console.error('Failed to fetch profile', err);
      alert('Error fetching profile');
    }
    setLoading(false);
  };

  return (
    <>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" sx={{ flexGrow: 1 }}>
            Student Dashboard
          </Typography>
          <Button color="inherit" onClick={handleLogout}>
            Logout
          </Button>
        </Toolbar>
      </AppBar>

      <Container sx={{ mt: 4 }}>
        <Typography variant="h5" gutterBottom>
          Welcome, Student
        </Typography>
        <Button variant="outlined" onClick={fetchProfile}>
          View My Profile
        </Button>
      </Container>

      {/* Profile Popup */}
      <Dialog open={open} onClose={() => setOpen(false)} fullWidth maxWidth="sm">
        <DialogTitle>My Profile</DialogTitle>
        <DialogContent>
        {loading ? (
            <CircularProgress />
        ) : profile ? (
            <div>
            <Typography gutterBottom><strong>Full Name:</strong> {profile.first_name} {profile.last_name}</Typography>
            <Typography gutterBottom><strong>Email:</strong> {profile.email}</Typography>
            <Typography gutterBottom><strong>Role:</strong> {profile.role}</Typography>

            <Typography variant="h6" sx={{ mt: 2 }}>Student Details</Typography>
            <Typography gutterBottom><strong>Roll Number:</strong> {profile.student?.roll_number}</Typography>
            <Typography gutterBottom><strong>Class:</strong> {profile.student?.class}</Typography>
            <Typography gutterBottom><strong>Phone Number:</strong> {profile.student?.phone_number}</Typography>
            <Typography gutterBottom><strong>Date of Birth:</strong> {profile.student?.date_of_birth}</Typography>
            <Typography gutterBottom><strong>Admission Date:</strong> {profile.student?.admission_date}</Typography>
            <Typography gutterBottom><strong>Status:</strong> {profile.student?.status}</Typography>
            </div>
        ) : (
            <Typography>No profile data found.</Typography>
        )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen(false)}>Close</Button>
        </DialogActions>
      </Dialog>
    </>
  );
}


