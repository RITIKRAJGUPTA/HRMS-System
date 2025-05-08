import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import Registration from './components/Registration';
import Login from './components/Login';
import Dashboard from './components/Dashboard/Dashboard';
import ShowAllCandidates from './components/ShowAllCandidates/ShowAllCandidates';
import Employees from './components/Employees/Employees';
import Attendance from './components/Attendance/Attendance';
import Leaves from './components/Leaves/Leaves';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to="/login" />} />
        <Route path="/register" element={<Registration />} />
        <Route path="/login" element={<Login />} />
        
        {/* Parent Dashboard with nested children */}
        <Route path="/dashboard" element={<Dashboard />}>
          <Route path="candidates" element={<ShowAllCandidates />} />
          <Route path="employees" element={<Employees />} />
          <Route path="attendance" element={<Attendance />} />
          <Route path="leaves" element={<Leaves />} />
        </Route>
      </Routes>
      <ToastContainer position="top-right" autoClose={3000} />
    </Router>
  );
}

export default App;
