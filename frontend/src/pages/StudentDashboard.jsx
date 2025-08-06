import React, { useEffect, useState } from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Container,
  CircularProgress,
  Box,
  Paper,
} from '@mui/material';
import axios from '../api/axios';
import { useNavigate } from 'react-router-dom';

export default function StudentDashboard() {
  const [profile, setProfile] = useState(null);
  const [teacher, setTeacher] = useState(null); 
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.clear();
    navigate('/');
  };

  const fetchProfile = async () => {
    try {
      const res = await axios.get('/me', {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      setProfile(res.data);

      const teacherId = res.data?.student?.assigned_teacher_id;
      if (teacherId) {
        const teacherRes = await axios.get(`/teachers/${teacherId}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        });
        setTeacher(teacherRes.data);
      }
    } catch (err) {
      console.error('Failed to fetch profile or teacher', err);
      alert('Error fetching profile or teacher');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

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
        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
            <CircularProgress />
          </Box>
        ) : profile ? (
          <Paper elevation={3} sx={{ p: 3 }}>
            <Typography variant="h5" gutterBottom>
              Welcome, {profile.first_name} {profile.last_name}
            </Typography>

            <Typography gutterBottom><strong>Email:</strong> {profile.email}</Typography>

            <Typography variant="h6" sx={{ mt: 2 }}>Student Details</Typography>
            <Typography gutterBottom><strong>Roll Number:</strong> {profile.student?.roll_number}</Typography>
            <Typography gutterBottom><strong>Class:</strong> {profile.student?.class}</Typography>
            <Typography gutterBottom><strong>Phone Number:</strong> {profile.student?.phone_number}</Typography>
            <Typography gutterBottom><strong>Date of Birth:</strong> {profile.student?.date_of_birth}</Typography>
            <Typography gutterBottom><strong>Admission Date:</strong> {profile.student?.admission_date}</Typography>
            <Typography gutterBottom><strong>Status:</strong> {profile.student?.status}</Typography>

            <Typography gutterBottom><strong>Assigned Teacher:</strong>{' '}
              {teacher ? `${teacher.user.first_name} ${teacher.user.last_name}` : 'Not Assigned'}
            </Typography>
          </Paper>
        ) : (
          <Typography variant="h6" color="error">
            No profile data found.
          </Typography>
        )}
      </Container>
    </>
  );
}
