import React, { useEffect, useState } from 'react';
import {
  AppBar, Toolbar, Typography, Button, Box, Drawer, List, ListItem,
  ListItemText, Dialog, DialogTitle, DialogContent, DialogActions,
  Table, TableHead, TableBody, TableRow, TableCell, TextField
} from '@mui/material';
import axios from '../api/axios';
import { useNavigate } from 'react-router-dom';

const drawerWidth = 240;

export default function TeacherDashboard() {
  const navigate = useNavigate();
  const [teacherProfile, setTeacherProfile] = useState(null);
  const [students, setStudents] = useState([]);
  const [currentTab, setCurrentTab] = useState('profile');
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [formData, setFormData] = useState({});
  const [currentPage, setCurrentPage] = useState(1);
  const [lastPage, setLastPage] = useState(1);

  const token = localStorage.getItem('token');

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

  const fetchStudents = async (page = 1) => {
    try {
      const res = await axios.get(`/students?page=${page}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setStudents(res.data.data); 
      setCurrentPage(res.data.current_page);
      setLastPage(res.data.last_page);
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
      fetchStudents(currentPage); 
    } catch (err) {
      console.error('Update error:', err);
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`/students/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchStudents(currentPage); 
    } catch (err) {
      console.error('Delete error:', err);
    }
  };

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= lastPage) {
      fetchStudents(newPage);
    }
  };

  return (
    <Box sx={{ display: 'flex' }}>
      {/* AppBar */}
      <AppBar position="fixed" sx={{ zIndex: 1201 }}>
        <Toolbar>
          <Typography variant="h6" noWrap component="div">
            Teacher Dashboard
          </Typography>
        </Toolbar>
      </AppBar>

      {/* Sidebar */}
      <Drawer
        variant="permanent"
        sx={{
          width: drawerWidth,
          [`& .MuiDrawer-paper`]: { width: drawerWidth, boxSizing: 'border-box' },
        }}
      >
        <Toolbar />
        <List>
          <ListItem button onClick={() => setCurrentTab('profile')}>
            <ListItemText primary="My Profile" />
          </ListItem>
          <ListItem button onClick={() => setCurrentTab('students')}>
            <ListItemText primary="Assigned Students" />
          </ListItem>
          <ListItem button onClick={handleLogout}>
            <ListItemText primary="Logout" />
          </ListItem>
        </List>
      </Drawer>

      {/* Main Content */}
      <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
        <Toolbar />

        {currentTab === 'profile' && teacherProfile && (
          <>
            <Typography variant="h5">My Profile</Typography>
            <Typography><strong>Name:</strong> {teacherProfile.first_name} {teacherProfile.last_name}</Typography>
            <Typography><strong>Email:</strong> {teacherProfile.email}</Typography>
            <Typography><strong>Phone No:</strong> {teacherProfile.teacher?.phone_number}</Typography>
            <Typography><strong>Subject:</strong> {teacherProfile.teacher?.subject_specialization}</Typography>
            <Typography><strong>Employee ID:</strong> {teacherProfile.teacher?.employee_id}</Typography>
            <Typography><strong>Date of Joining:</strong> {teacherProfile.teacher?.date_of_joining}</Typography>
          </>
        )}

        {/* Students Table */}
        {currentTab === 'students' && (
          <>
            <Typography variant="h5" gutterBottom>Assigned Students</Typography>
            <Table>
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
                      <Box display="flex" gap={1}>
                        <Button size="small" onClick={() => handleEditClick(stu)}>Edit</Button>
                        <Button size="small" color="error" onClick={() => handleDelete(stu.id)}>Delete</Button>
                      </Box>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>

            {/* Pagination Controls */}
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
              <Button
                variant="outlined"
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                sx={{ mr: 2 }}
              >
                Previous
              </Button>
              <Typography sx={{ pt: 1 }}>
                Page {currentPage} of {lastPage}
              </Typography>
              <Button
                variant="outlined"
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === lastPage}
                sx={{ ml: 2 }}
              >
                Next
              </Button>
            </Box>
          </>
        )}
      </Box>

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
    </Box>
  );
}
