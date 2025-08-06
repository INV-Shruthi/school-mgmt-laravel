import React, { useEffect, useState } from 'react';
import {
  AppBar, Toolbar, Typography, Button, Container, TextField, MenuItem,
  Collapse, Alert, Dialog, DialogTitle, DialogContent, DialogActions,
  Table, TableHead, TableBody, TableRow, TableCell, Drawer, List, ListItem,
  ListItemText, Box, Fab, Pagination
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import { useNavigate } from 'react-router-dom';
import axios from '../api/axios';

export default function AdminDashboard() {
  const navigate = useNavigate();

  const [currentTab, setCurrentTab] = useState('students'); 
  const [showRegisterForm, setShowRegisterForm] = useState(false);
  
  const [role, setRole] = useState('student');
  const [formData, setFormData] = useState({});
  const [teachers, setTeachers] = useState([]);
  const [students, setStudents] = useState([]);
  const [alert, setAlert] = useState({ type: '', msg: '', open: false });
  const [editData, setEditData] = useState(null);
  const [openEditModal, setOpenEditModal] = useState(false);
  const [teacherPage, setTeacherPage] = useState(1);
  const [teacherTotalPages, setTeacherTotalPages] = useState(1);
  const [studentPage, setStudentPage] = useState(1);
  const [studentTotalPages, setStudentTotalPages] = useState(1);
  const [editStudentData, setEditStudentData] = useState(null);
  const [openEditStudentModal, setOpenEditStudentModal] = useState(false);
  const [allTeachers, setAllTeachers] = useState([]);


  const handleLogout = () => {
    localStorage.clear();
    navigate('/');
  };

  const handleRegisterToggle = () => {
    setShowRegisterForm(true);
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
    setShowRegisterForm(false);

    setTimeout(() => {
      setAlert({ ...alert, open: false });
    }, 3000);

    if (formData.role === 'teacher') fetchTeachers();
    if (formData.role === 'student') fetchStudents();

  } catch (err) {
    setAlert({ type: 'error', msg: err.response?.data?.message || 'Registration failed', open: true });
    setTimeout(() => {
      setAlert({ ...alert, open: false });
    }, 3000);
  }
};
  const fetchAllTeachers = async () => {
  try {
    const token = localStorage.getItem('token');
    const res = await axios.get('/teachers?per_page=1000', {
      headers: { Authorization: `Bearer ${token}` }
    });
    setAllTeachers(res.data.data);
  } catch (error) {
    console.error('Failed to fetch all teachers', error);
  }
};

  const fetchTeachers = async (page = 1) => {
    const token = localStorage.getItem('token');
    const res = await axios.get(`/teachers?page=${page}`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    setTeachers(res.data.data);
    setTeacherPage(res.data.current_page);
    setTeacherTotalPages(res.data.last_page);
  };

  const fetchStudents = async (page = 1) => {
    const token = localStorage.getItem('token');
    const res = await axios.get(`/students?page=${page}`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    setStudents(res.data.data);
    setStudentPage(res.data.current_page);
    setStudentTotalPages(res.data.last_page);
    
  };
  const handleEditStudentClick = (student) => {
    setEditStudentData(student);
    setOpenEditStudentModal(true);
  };

  const handleEditStudentChange = (e) => {
    setEditStudentData({
    ...editStudentData,
    [e.target.name]: e.target.value
  });
  };

  const handleUpdateStudent = async () => {
  try {
    const token = localStorage.getItem('token');
    await axios.put(`/students/${editStudentData.id}`, editStudentData, {
      headers: { Authorization: `Bearer ${token}` }
    });
    setOpenEditStudentModal(false);
    fetchStudents();
    setAlert({ type: 'success', msg: 'Student updated successfully', open: true });
    
    setTimeout(() => {
      setAlert({ type: '', msg: '', open: false });
    }, 3000);

  } catch (err) {
    setAlert({ type: 'error', msg: 'Update failed', open: true });

    setTimeout(() => {
      setAlert({ type: '', msg: '', open: false });
    }, 3000);

  }
};

  const handleDeleteStudent = async (id) => {
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`/students/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchStudents();
      setAlert({ type: 'success', msg: 'Student deleted successfully', open: true });
      
      setTimeout(() => {
        setAlert({ type: '', msg: '', open: false });
      }, 3000);

    } catch (err) {
      setAlert({ type: 'error', msg: 'Delete failed', open: true });

      setTimeout(() => {
        setAlert({ type: '', msg: '', open: false });
      }, 3000);

    }
  };


  const handleDeleteTeacher = async (id) => {
    try {

      const token = localStorage.getItem('token');
      await axios.delete(`/teachers/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchTeachers();
      setAlert({ type: 'success', msg: 'Teacher deleted successfully', open: true });
      
      setTimeout(() => {
        setAlert({ type: '', msg: '', open: false });
      }, 3000);

    } catch (err) {
      setAlert({ type: 'error', msg: 'Delete failed', open: true });

      setTimeout(() => {
        setAlert({ type: '', msg: '', open: false });
      }, 3000);

    }

  };

  const handleEditClick = (teacher) => {
    setEditData(teacher);
    setOpenEditModal(true);
  };

  const handleEditChange = (e) => {
    setEditData({ ...editData, [e.target.name]: e.target.value });
  };

  const handleUpdateTeacher = async () => {
  try {
    const token = localStorage.getItem('token');
    await axios.put(`/teachers/${editData.id}`, editData, {
      headers: { Authorization: `Bearer ${token}` }
    });
    setOpenEditModal(false);
    fetchTeachers();
    setAlert({ type: 'success', msg: 'Teacher updated successfully', open: true });
    
    setTimeout(() => {
      setAlert({ type: '', msg: '', open: false });
    }, 3000);

  } catch (err) {
    setAlert({ type: 'error', msg: 'Update failed', open: true });

    setTimeout(() => {
      setAlert({ type: '', msg: '', open: false });
    }, 3000);

  }

  };

const getTeacherNameById = (teacherId) => {
  const teacher = allTeachers.find(t => t.id === teacherId);
  return teacher ? `${teacher.user.first_name} ${teacher.user.last_name}` : 'Not Assigned';
};

  useEffect(() => {
    if (currentTab === 'teachers') fetchTeachers(teacherPage);
  }, [currentTab, teacherPage]);

  useEffect(() => {
    if (currentTab === 'students') 
      fetchStudents(studentPage);
      fetchAllTeachers(); 

  }, [currentTab, studentPage]);

  return (
    <Box sx={{ display: 'flex' }}>
      <Drawer variant="permanent" anchor="left" sx={{ width: 240, flexShrink: 0 }}>
        <Toolbar />
        <Box sx={{ overflow: 'auto' }}>
          <List>
            <ListItem button onClick={() => { setCurrentTab('students'); setShowRegisterForm(false); }}>
              <ListItemText primary="Students" />
            </ListItem>
            <ListItem button onClick={() => { setCurrentTab('teachers'); setShowRegisterForm(false); }}>
              <ListItemText primary="Teachers" />
            </ListItem>
            <ListItem button onClick={handleLogout}>
              <ListItemText primary="Logout" />
            </ListItem>
          </List>
        </Box>
      </Drawer>

      <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
        <AppBar position="fixed" sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}>
          <Toolbar>
            <Typography variant="h6" noWrap>Admin Dashboard</Typography>
          </Toolbar>
        </AppBar>
        <Toolbar />
        <Typography variant="h5" gutterBottom>Welcome, Admin</Typography>

        <Collapse in={alert.open}>
          <Alert severity={alert.type}>{alert.msg}</Alert>
        </Collapse>

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

        {currentTab === 'students' && !showRegisterForm && (
          <>
            <Typography variant="h6" sx={{ mt: 4 }}>Students List</Typography>
            <Table sx={{ mt: 2 }}>
              <TableHead>
                <TableRow>
                  <TableCell>Name</TableCell><TableCell>Email</TableCell><TableCell>Phone</TableCell>
                  <TableCell>DOB</TableCell><TableCell>Class</TableCell><TableCell>Roll No</TableCell>
                  <TableCell>Admission</TableCell><TableCell>Status</TableCell><TableCell>Assigned Teacher</TableCell><TableCell>Actions</TableCell>
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
                    <TableCell>{getTeacherNameById(s.assigned_teacher_id)}</TableCell> 
                    <TableCell>
                    <Box display="flex" gap={1}>
                      <Button size="small" onClick={() => handleEditStudentClick(s)}>Edit</Button>
                      <Button size="small" color="error" onClick={() => handleDeleteStudent(s.id)}>Delete</Button>
                    </Box>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            <Pagination count={studentTotalPages} page={studentPage} onChange={(e, value) => setStudentPage(value)} sx={{ mt: 2 }} />
          </>
        )}

        {currentTab === 'teachers' && !showRegisterForm && (
          <>
            <Typography variant="h6" sx={{ mt: 4 }}>Teachers List</Typography>
            <Table sx={{ mt: 2 }}>
              <TableHead>
                <TableRow>
                  <TableCell>Name</TableCell><TableCell>Email</TableCell><TableCell>Phone</TableCell>
                  <TableCell>Subject</TableCell><TableCell>Emp ID</TableCell><TableCell>Status</TableCell><TableCell>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {teachers.map((t) => (
                  <TableRow key={t.id}>
                    <TableCell>{t.user.first_name} {t.user.last_name}</TableCell>
                    <TableCell>{t.user.email}</TableCell>
                    <TableCell>{t.phone_number}</TableCell>
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
            <Pagination count={teacherTotalPages} page={teacherPage} onChange={(e, value) => setTeacherPage(value)} sx={{ mt: 2 }} />
          </>
        )}

        {(currentTab === 'students' || currentTab === 'teachers') && (
          <Fab color="primary" aria-label="add" onClick={handleRegisterToggle} sx={{ position: 'fixed', bottom: 30, right: 30 }}>
            <AddIcon />
          </Fab>
        )}

        {/* Edit Modal */}
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
        <Dialog open={openEditStudentModal} onClose={() => setOpenEditStudentModal(false)} fullWidth>
          <DialogTitle>Edit Student</DialogTitle>
          <DialogContent>
            <TextField
              fullWidth margin="normal" name="phone_number" label="Phone Number"
              value={editStudentData?.phone_number || ''} onChange={handleEditStudentChange}
            />
            <TextField
              fullWidth margin="normal" name="date_of_birth" label="Date of Birth" type="date"
              InputLabelProps={{ shrink: true }} value={editStudentData?.date_of_birth || ''}
              onChange={handleEditStudentChange}
            />
            <TextField
              fullWidth margin="normal" name="class" label="Class"
              value={editStudentData?.class || ''}
              onChange={handleEditStudentChange}
            />
            <TextField
              fullWidth margin="normal" name="roll_number" label="Roll No" 
              value={editStudentData?.roll_number || ''}
              onChange={handleEditStudentChange}
            />
            <TextField
              fullWidth margin="normal" name="admission_date" label="Admission" type="date"
              InputLabelProps={{ shrink: true }} value={editStudentData?.admission_date || ''}
              onChange={handleEditStudentChange}
            />
            <TextField
              fullWidth margin="normal" name="status" label="Status"
              value={editStudentData?.status || ''} onChange={handleEditStudentChange}
            />
            <TextField
              fullWidth select name="assigned_teacher_id" label="Assigned Teacher"
              value={editStudentData?.assigned_teacher_id || ''} onChange={handleEditStudentChange} margin="normal"
            >
              <MenuItem value="">None</MenuItem>
              {allTeachers.map((teacher) => (
                <MenuItem key={teacher.id} value={teacher.id}>
                  {teacher.user.first_name} {teacher.user.last_name}
                </MenuItem>
              ))}
            </TextField>    
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setOpenEditStudentModal(false)}>Cancel</Button>
            <Button variant="contained" onClick={handleUpdateStudent}>Update</Button>
          </DialogActions>
        </Dialog>

      </Box>
    </Box>
  );
}
