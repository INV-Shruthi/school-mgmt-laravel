import React, { useEffect, useState } from 'react';
import {
  AppBar, Toolbar, Typography, Button, Container,
  Dialog, DialogTitle, DialogContent, DialogActions,
  Table, TableHead, TableBody, TableRow, TableCell,
  Collapse, IconButton, TextField, Box
} from '@mui/material';
import { ExpandMore, ExpandLess } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import axios from '../api/axios';

export default function TeacherDashboard() {
  const navigate = useNavigate();
  const [teacherProfile, setTeacherProfile] = useState(null);
  const [students, setStudents] = useState([]);
  const [profileOpen, setProfileOpen] = useState(false);
  const [studentsOpen, setStudentsOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [formData, setFormData] = useState({});

  const token = localStorage.getItem('token');

  // Fetch teacher profile
  const fetchTeacherProfile = async () => {
    try {
      const res = await axios.get('/me', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setTeacherProfile(res.data);
    } catch (err) {
      console.error('Error fetching profile:', err);
    }
  };

  // Fetch assigned students
  const fetchStudents = async () => {
    try {
      const res = await axios.get('/students', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setStudents(res.data);
    } catch (err) {
      console.error('Error fetching students:', err);
    }
  };

  useEffect(() => {
    fetchTeacherProfile();
    fetchStudents();
  }, []);

  const handleLogout = () => {
    localStorage.clear();
    navigate('/');
  };

  const handleEditClick = (student) => {
    setSelectedStudent(student);
    setFormData({
      phone_number: student.phone_number,
      roll_number: student.roll_number,
      class: student.class,
      date_of_birth: student.date_of_birth,
      admission_date: student.admission_date,
      status: student.status,
    });
    setEditDialogOpen(true);
  };

  const handleUpdateSubmit = async () => {
    try {
      await axios.put(`/students/${selectedStudent.id}`, formData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setEditDialogOpen(false);
      fetchStudents(); // Refresh
    } catch (err) {
      console.error('Update error:', err);
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`/students/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchStudents();
    } catch (err) {
      console.error('Delete error:', err);
    }
  };

  return (
    <>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" sx={{ flexGrow: 1 }}>
            Teacher Dashboard
          </Typography>
          <Button color="inherit" onClick={handleLogout}>
            Logout
          </Button>
        </Toolbar>
      </AppBar>

      <Container sx={{ mt: 4 }}>
        <Typography variant="h5">Welcome, Teacher</Typography>

        <Box sx={{ mt: 2 }}>
          <Button variant="outlined" sx={{ m: 1 }} onClick={() => setProfileOpen(true)}>
            My Profile
          </Button>
          <Button variant="outlined" sx={{ m: 1 }} onClick={() => setStudentsOpen(!studentsOpen)}>
            {studentsOpen ? <ExpandLess /> : <ExpandMore />}
            Assigned Students
          </Button>
        </Box>

        {/* My Profile Dialog */}
        <Dialog open={profileOpen} onClose={() => setProfileOpen(false)}>
          <DialogTitle>My Profile</DialogTitle>
          <DialogContent>
            {teacherProfile ? (
              <>
                <Typography><strong>Name:</strong> {teacherProfile.first_name} {teacherProfile.last_name}</Typography>
                <Typography><strong>Email:</strong> {teacherProfile.email}</Typography>
                <Typography><strong>Role:</strong> {teacherProfile.role}</Typography>
                <Typography><strong>Phone No:</strong> {teacherProfile.teacher?.phone_number}</Typography>
                <Typography><strong>Subject:</strong> {teacherProfile.teacher?.subject_specialization}</Typography>
                <Typography><strong>Employee ID:</strong> {teacherProfile.teacher?.employee_id}</Typography>
                <Typography><strong>Date of Joining:</strong> {teacherProfile.teacher?.date_of_joining}</Typography>
                
              </>
            ) : (
              <Typography>Loading...</Typography>
            )}
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setProfileOpen(false)}>Close</Button>
          </DialogActions>
        </Dialog>

        {/* Assigned Students Table */}
        <Collapse in={studentsOpen}>
          <Table sx={{ mt: 3 }}>
            <TableHead>
              <TableRow>
                <TableCell>Name</TableCell>
                <TableCell>Email</TableCell>
                <TableCell>Phone</TableCell>
                <TableCell>Roll No</TableCell>
                <TableCell>Class</TableCell>
                <TableCell>DOB</TableCell>
                <TableCell>Admission</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {students.map((stu) => (
                <TableRow key={stu.id}>
                  <TableCell>{stu.user.first_name} {stu.user.last_name}</TableCell>
                  <TableCell>{stu.user.email}</TableCell>
                  <TableCell>{stu.phone_number}</TableCell>
                  <TableCell>{stu.roll_number}</TableCell>
                  <TableCell>{stu.class}</TableCell>
                  <TableCell>{stu.date_of_birth}</TableCell>
                  <TableCell>{stu.admission_date}</TableCell>
                  <TableCell>{stu.status}</TableCell>
                  <TableCell>
                    <Button size="small" onClick={() => handleEditClick(stu)}>Edit</Button>
                    <Button size="small" color="error" onClick={() => handleDelete(stu.id)}>Delete</Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Collapse>

        {/* Edit Student Dialog */}
        <Dialog open={editDialogOpen} onClose={() => setEditDialogOpen(false)}>
          <DialogTitle>Edit Student</DialogTitle>
          <DialogContent>
            <TextField
              margin="dense"
              label="Phone"
              fullWidth
              value={formData.phone_number || ''}
              onChange={(e) => setFormData({ ...formData, phone_number: e.target.value })}
            />
            <TextField
              margin="dense"
              label="Roll No"
              fullWidth
              value={formData.roll_number || ''}
              onChange={(e) => setFormData({ ...formData, roll_number: e.target.value })}
            />
            <TextField
              margin="dense"
              label="Class"
              fullWidth
              value={formData.class || ''}
              onChange={(e) => setFormData({ ...formData, class: e.target.value })}
            />
            <TextField
              margin="dense"
              label="Date of Birth"
              type="date"
              fullWidth
              value={formData.date_of_birth || ''}
              onChange={(e) => setFormData({ ...formData, date_of_birth: e.target.value })}
              InputLabelProps={{ shrink: true }}
            />
            <TextField
              margin="dense"
              label="Admission Date"
              type="date"
              fullWidth
              value={formData.admission_date || ''}
              onChange={(e) => setFormData({ ...formData, admission_date: e.target.value })}
              InputLabelProps={{ shrink: true }}
            />
            <TextField
              margin="dense"
              label="Status"
              fullWidth
              value={formData.status || ''}
              onChange={(e) => setFormData({ ...formData, status: e.target.value })}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setEditDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleUpdateSubmit}>Save</Button>
          </DialogActions>
        </Dialog>
      </Container>
    </>
  );
}
