import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './attendance.css'; // Style as needed

const Attendance = () => {
  const [employees, setEmployees] = useState([]);

  const fetchSelectedEmployees = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/candidates');
      const selected = res.data
        .filter(emp => emp.status === 'Selected')
        .map(emp => ({
          ...emp,
          task: '',
          attendanceStatus: 'Present', // default
        }));
      setEmployees(selected);
    } catch (error) {
      console.error('Error fetching employees:', error);
    }
  };

  const handleTaskChange = (index, value) => {
    const updated = [...employees];
    updated[index].task = value;
    setEmployees(updated);
  };

  const handleStatusChange = (index, value) => {
    const updated = [...employees];
    updated[index].attendanceStatus = value;
  
    // Filter present employees
    const presentEmployees = updated.filter(emp => emp.attendanceStatus === 'Present');
  
    // Save to localStorage
    localStorage.setItem('presentEmployees', JSON.stringify(presentEmployees));
  
    setEmployees(updated);
  };
  

  useEffect(() => {
    fetchSelectedEmployees();
  }, []);

  return (
    <div className="attendance-container">
      <h2>Employee Attendance</h2>
      {employees.length === 0 ? (
        <p>No selected employees found.</p>
      ) : (
        <table>
          <thead>
            <tr>
              <th>Full Name</th>
              <th>Email</th>
              <th>Phone</th>
              <th>Position</th>
              <th>Task Assigned</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {employees.map((emp, index) => (
              <tr key={emp._id}>
                <td>{emp.name}</td>
                <td>{emp.email}</td>
                <td>{emp.phone}</td>
                <td>{emp.position}</td>
                <td>
                  <input
                    type="text"
                    value={emp.task}
                    onChange={(e) => handleTaskChange(index, e.target.value)}
                    placeholder="Enter task"
                  />
                </td>
                <td>
                  <select
                    value={emp.attendanceStatus}
                    onChange={(e) => handleStatusChange(index, e.target.value)}
                  >
                    <option value="Present">Present</option>
                    <option value="Absent">Absent</option>
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default Attendance;
