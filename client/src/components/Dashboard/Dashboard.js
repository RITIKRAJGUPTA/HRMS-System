import React, { useState } from 'react';
import { NavLink, Outlet, useLocation, useNavigate } from 'react-router-dom';
import AddCandidateModal from '../AddCandidateModal/AddCandidateModal';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import '../Sidebar/sidebar.css';
import './dashboard.css';

function Dashboard() {
  const [showModal, setShowModal] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const isCandidatesRoute = location.pathname.includes('/dashboard/candidates');
  const isEmployeesRoute = location.pathname.includes('/dashboard/employees');

  const handleLogout = () => {
    // Clear token or session data
    localStorage.removeItem('token'); // or sessionStorage.removeItem(...)
    toast.success('Logged out successfully!', { autoClose: 2000 });
    
    setTimeout(() => {
      navigate('/login'); // redirect to login
    }, 2000); // wait for toast
  };

  return (
    <div className="main-layout">
      <div className="sidebar">
        <div className="logo">LOGO</div>
        <input className="search" placeholder="Search" />
        <div className="menu">
          <p className="section">Recruitment</p>
          <ul>
            <li>
              <NavLink to="/dashboard/candidates" className={({ isActive }) => isActive ? 'active' : ''}>
                Candidates
              </NavLink>
            </li>
          </ul>
          <p className="section">Organization</p>
          <ul>
            <li>
              <NavLink to="/dashboard/employees" className={({ isActive }) => isActive ? 'active' : ''}>
                Employees
              </NavLink>
            </li>
            <li>
              <NavLink to="/dashboard/attendance" className={({ isActive }) => isActive ? 'active' : ''}>
                Attendance
              </NavLink>
            </li>
            <li><NavLink to="/dashboard/leaves" className={({ isActive }) => isActive ? 'active' : ''}>
            Leaves
              </NavLink></li>
          </ul>
          <p className="section">Others</p>
          <ul>
            <li onClick={handleLogout} style={{ cursor: 'pointer', color: 'red' }}>Logout</li>
          </ul>
        </div>
      </div>

      <div className="dashboard-content">
        <div className="top-bar">
          <h2>
            {isCandidatesRoute ? 'Candidates' : isEmployeesRoute ? 'Employees' : 'Dashboard'}
          </h2>
          {isCandidatesRoute && (
            <button className="add-btn" onClick={() => setShowModal(true)}>
              + Add Candidate
            </button>
          )}
        </div>

        {showModal && <AddCandidateModal onClose={() => setShowModal(false)} />}
        <Outlet />
      </div>

      <ToastContainer position="top-right" />
    </div>
  );
}

export default Dashboard;
