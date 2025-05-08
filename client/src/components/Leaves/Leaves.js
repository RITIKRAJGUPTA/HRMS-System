import React, { useEffect, useState } from 'react';
import './leaves.css'; // Style as needed

const Leave = () => {
  const [presentEmployees, setPresentEmployees] = useState([]);

  const loadPresentEmployees = () => {
    const data = JSON.parse(localStorage.getItem('presentEmployees')) || [];
    setPresentEmployees(data);
  };

  useEffect(() => {
    loadPresentEmployees(); // Initial load

    // Listen for changes to localStorage
    const handleStorageChange = (e) => {
      if (e.key === 'presentEmployees') {
        loadPresentEmployees();
      }
    };

    window.addEventListener('storage', handleStorageChange);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  return (
    <div className="leave-container">
      <h2>Leave Requests</h2>
      {presentEmployees.length === 0 ? (
        <p>No present employees available for leave request.</p>
      ) : (
        <table>
          <thead>
            <tr>
              <th>Full Name</th>
              <th>Email</th>
              <th>Phone</th>
              <th>Position</th>
              <th>Leave Status</th>
              <th>Documents</th>
            </tr>
          </thead>
          <tbody>
            {presentEmployees.map(emp => (
              <tr key={emp._id}>
                <td>{emp.name}</td>
                <td>{emp.email}</td>
                <td>{emp.phone}</td>
                <td>{emp.position}</td>
                <td>
                  <select>
                    <option value="Pending">Pending</option>
                    <option value="Approved">Approved</option>
                    <option value="Rejected">Rejected</option>
                  </select>
                </td>
                <td>
                  <input type="file" accept="image/*,.pdf" />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default Leave;
