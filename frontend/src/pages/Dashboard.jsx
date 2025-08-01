import React, { useEffect, useState } from 'react';
import {
  AppBar, Toolbar, Typography, Button, Container, TextField, MenuItem,
  Collapse, Alert, Dialog, DialogTitle, DialogContent, DialogActions,
  Table, TableHead, TableBody, TableRow, TableCell
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import axios from '../api/axios';

export default function AdminDashboard() {
  const navigate = useNavigate();

  const [showRegisterForm, setShowRegisterForm] = useState(false);
  const [role, setRole] = useState('student');
  const [formData, setFormData] = useState({});
  const [teachers, setTeachers] = useState([]);
  const [students, setStudents] = useState([]);
  const [showTeachers, setShowTeachers] = useState(false);
  const [showStudents, setShowStudents] = useState(false);
  const [alert, setAlert] = useState({ type: '', msg: '', open: false });

  // Edit modal state
  const [editData, setEditData] = useState(null);
  const [openEditModal, setOpenEditModal] = useState(false);

  const handleLogout = () => {
    localStorage.clear();
    navigate('/');
  };

  const handleRegisterToggle = () => {
    setShowRegisterForm(!showRegisterForm);
    setAlert({ ...alert, open: false });
    setFormData({});
  };

  const handleRoleChange = (e) => {
    setRole(e.target.value);
    setFormData({ ...formData, role: e.target.value });
  };

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleRegister = async () => {
    try {
      const token = localStorage.getItem('token');
      await axios.post('/register', formData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setAlert({ type: 'success', msg: 'New user registered successfully', open: true });
      setFormData({});
    } catch (err) {
      setAlert({ type: 'error', msg: err.response?.data?.error || 'Registration failed', open: true });
    }
  };

  const fetchTeachers = async () => {
    const token = localStorage.getItem('token');
    const res = await axios.get('/teachers', {
      headers: { Authorization: `Bearer ${token}` }
    });
    setTeachers(res.data);
  };

  const fetchStudents = async () => {
    const token = localStorage.getItem('token');
    const res = await axios.get('/students', {
      headers: { Authorization: `Bearer ${token}` }
    });
    setStudents(res.data);
  };

  const handleDeleteTeacher = async (id) => {
    const token = localStorage.getItem('token');
    await axios.delete(`/teachers/${id}`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    fetchTeachers();
  };

  const handleEditClick = (teacher) => {
    setEditData(teacher);
    setOpenEditModal(true);
  };

  const handleEditChange = (e) => {
    setEditData({ ...editData, [e.target.name]: e.target.value });
  };

  const handleUpdateTeacher = async () => {
    const token = localStorage.getItem('token');
    await axios.put(`/teachers/${editData.id}`, editData, {
      headers: { Authorization: `Bearer ${token}` }
    });
    setOpenEditModal(false);
    fetchTeachers();
  };

  useEffect(() => {
    if (showTeachers) fetchTeachers();
    if (showStudents) fetchStudents();
  }, [showTeachers, showStudents]);

  return (
    <>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" sx={{ flexGrow: 1 }}>Admin Dashboard</Typography>
          <Button color="inherit" onClick={handleLogout}>Logout</Button>
        </Toolbar>
      </AppBar>

      <Container sx={{ mt: 4 }}>
        <Typography variant="h5" gutterBottom>Welcome, Admin</Typography>

        <Button variant="contained" color="primary" sx={{ m: 1 }} onClick={handleRegisterToggle}>
          {showRegisterForm ? 'Cancel Registration' : 'Register New User'}
        </Button>

        <Button variant="outlined" sx={{ m: 1 }} onClick={() => setShowTeachers(!showTeachers)}>
          {showTeachers ? 'Hide Teachers' : 'View Teachers'}
        </Button>

        <Button variant="outlined" sx={{ m: 1 }} onClick={() => setShowStudents(!showStudents)}>
          {showStudents ? 'Hide Students' : 'View Students'}
        </Button>

        {/* ALERT */}
        <Collapse in={alert.open}>
          <Alert severity={alert.type} sx={{ mt: 2 }}>{alert.msg}</Alert>
        </Collapse>

        {/* REGISTER FORM */}
        <Collapse in={showRegisterForm}>
          <Container sx={{ mt: 3 }}>
            <Typography variant="h6">New User Registration</Typography>
            <TextField fullWidth margin="normal" name="first_name" label="First Name" onChange={handleInputChange} />
            <TextField fullWidth margin="normal" name="last_name" label="Last Name" onChange={handleInputChange} />
            <TextField fullWidth margin="normal" name="email" label="Email" onChange={handleInputChange} />
            <TextField fullWidth margin="normal" name="password" label="Password" type="password" onChange={handleInputChange} />
            <TextField fullWidth margin="normal" select name="role" label="Role" value={role} onChange={handleRoleChange}>
              <MenuItem value="student">Student</MenuItem>
              <MenuItem value="teacher">Teacher</MenuItem>
            </TextField>

            {role === 'student' && (
              <>
                <TextField fullWidth name="phone_number" margin="normal" label="Phone Number" onChange={handleInputChange} />
                <TextField fullWidth name="roll_number" margin="normal" label="Roll Number" onChange={handleInputChange} />
                <TextField fullWidth name="class" margin="normal" label="Class" onChange={handleInputChange} />
                <TextField fullWidth name="date_of_birth" margin="normal" type="date" label="DOB" InputLabelProps={{ shrink: true }} onChange={handleInputChange} />
                <TextField fullWidth name="admission_date" margin="normal" type="date" label="Admission Date" InputLabelProps={{ shrink: true }} onChange={handleInputChange} />
                <TextField fullWidth name="status" margin="normal" label="Status" onChange={handleInputChange} />
                <TextField fullWidth name="assigned_teacher_id" margin="normal" label="Assigned Teacher ID" onChange={handleInputChange} />
              </>
            )}

            {role === 'teacher' && (
              <>
                <TextField fullWidth name="phone_number" margin="normal" label="Phone Number" onChange={handleInputChange} />
                <TextField fullWidth name="subject_specialization" margin="normal" label="Subject Specialization" onChange={handleInputChange} />
                <TextField fullWidth name="employee_id" margin="normal" label="Employee ID" onChange={handleInputChange} />
                <TextField fullWidth name="date_of_joining" type="date" margin="normal" label="Joining Date" InputLabelProps={{ shrink: true }} onChange={handleInputChange} />
                <TextField fullWidth name="status" margin="normal" label="Status" onChange={handleInputChange} />
              </>
            )}

            <Button variant="contained" color="success" sx={{ mt: 2 }} onClick={handleRegister}>Register</Button>
          </Container>
        </Collapse>

        {/* TEACHER LIST */}
        <Collapse in={showTeachers}>
          <Typography variant="h6" sx={{ mt: 4 }}>Teachers List</Typography>
          <Table sx={{ mt: 2 }}>
            <TableHead>
              <TableRow>
                <TableCell>Name</TableCell><TableCell>Email</TableCell><TableCell>Phone Number</TableCell><TableCell>Subject</TableCell>
                <TableCell>Employee Id</TableCell><TableCell>Status</TableCell><TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {teachers.map((t) => (
                <TableRow key={t.id}>
                  <TableCell>{t.user.first_name} {t.user.last_name}</TableCell>
                  <TableCell>{t.user.email}</TableCell>
                  <TableCell>{t.user.phone_number}</TableCell>
                  <TableCell>{t.subject_specialization}</TableCell>
                  <TableCell>{t.employee_id}</TableCell>
                  <TableCell>{t.status}</TableCell>
                  <TableCell>
                    <Button size="small" onClick={() => handleEditClick(t)}>Edit</Button>
                    <Button size="small" color="error" onClick={() => handleDeleteTeacher(t.id)}>Delete</Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Collapse>

        {/* STUDENT LIST */}
        <Collapse in={showStudents}>
          <Typography variant="h6" sx={{ mt: 4 }}>Students List</Typography>
          <Table sx={{ mt: 2 }}>
            <TableHead>
              <TableRow>
                <TableCell>Name</TableCell>
                <TableCell>Email</TableCell>
                <TableCell>Phone Number</TableCell>
                <TableCell>DOB</TableCell>
                <TableCell>Class</TableCell>
                <TableCell>Roll No</TableCell>
                <TableCell>Admission Date</TableCell>
                <TableCell>Status</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {students.map((s) => (
                <TableRow key={s.id}>
                  <TableCell>{s.user.first_name} {s.user.last_name}</TableCell>
                  <TableCell>{s.user.email}</TableCell>
                  <TableCell>{s.phone_number}</TableCell>
                  <TableCell>{s.date_of_birth}</TableCell>
                  <TableCell>{s.class}</TableCell>
                  <TableCell>{s.roll_number}</TableCell>
                  <TableCell>{s.admission_date}</TableCell>
                  <TableCell>{s.status}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Collapse>

        {/* EDIT MODAL */}
        <Dialog open={openEditModal} onClose={() => setOpenEditModal(false)} fullWidth>
          <DialogTitle>Edit Teacher</DialogTitle>
          <DialogContent>
            <TextField fullWidth margin="normal" name="phone_number" label="Phone Number" value={editData?.phone_number || ''} onChange={handleEditChange} />
            <TextField fullWidth margin="normal" name="subject_specialization" label="Subject" value={editData?.subject_specialization || ''} onChange={handleEditChange} />
            <TextField fullWidth margin="normal" name="employee_id" label="Employee ID" value={editData?.employee_id || ''} onChange={handleEditChange} />
            <TextField fullWidth margin="normal" name="status" label="Status" value={editData?.status || ''} onChange={handleEditChange} />
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setOpenEditModal(false)}>Cancel</Button>
            <Button variant="contained" onClick={handleUpdateTeacher}>Update</Button>
          </DialogActions>
        </Dialog>
      </Container>
    </>
  );
}
