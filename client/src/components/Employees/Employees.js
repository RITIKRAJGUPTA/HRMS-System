import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './employees.css'; // Make sure to define styles here

const Employees = () => {
  const [employees, setEmployees] = useState([]);
  const [dropdownOpen, setDropdownOpen] = useState(null); // track which dropdown is open

  const fetchSelectedCandidates = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/candidates');
      const selected = res.data.filter(c => c.status === 'Selected');
  
      // Store in employees collection (if not already)
      for (const cand of selected) {
        try {
          await axios.post('http://localhost:5000/api/employees', {
            name: cand.name,
            email: cand.email,
            phone: cand.phone,
            experience: cand.experience,
            position: cand.position,
            doj: cand.doj || new Date().toISOString().split('T')[0],
          });
        } catch (err) {
          console.error(`Failed to add candidate ${cand.name}:`, err);
          // Optionally show an error toast or message
        }
      }
      
  
      // Get from /api/employees (to ensure consistency)
      const empRes = await axios.get('http://localhost:5000/api/employees');
      setEmployees(empRes.data);
    } catch (err) {
      console.error('Error fetching or storing selected candidates:', err);
    }
  };
  

  useEffect(() => {
    fetchSelectedCandidates();
  }, []);

  const handleEdit = (emp) => {
    alert(`Edit ${emp.name}`);
    // You can open a modal here
  };

  const handleRemove = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/api/employees/${id}`);
      setEmployees(prev => prev.filter(emp => emp._id !== id));
    } catch (err) {
      console.error('Error removing employee:', err);
      alert('Failed to remove the employee. Please try again later.');
    }
  };
  

  const toggleDropdown = (id) => {
    setDropdownOpen(prev => (prev === id ? null : id));
  };

  return (
    <div className="employee-container">
      <h2>Selected Candidates (Employees)</h2>
      {employees.length === 0 ? (
        <p>No selected candidates found.</p>
      ) : (
        <table>
          <thead>
            <tr>
              <th>Full Name</th>
              <th>Email</th>
              <th>Phone</th>
              <th>Experience</th>
              <th>Position</th>
              <th>Date of Joining</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {employees.map(emp => (
              <tr key={emp._id}>
                <td>{emp.name}</td>
                <td>{emp.email}</td>
                <td>{emp.phone}</td>
                <td>{emp.experience}</td>
                <td>{emp.position}</td>
                <td>{emp.doj}</td>
                <td className="action-cell">
                  <div className="dots-wrapper" onClick={() => toggleDropdown(emp._id)}>
                    &#x22EE;
                    {dropdownOpen === emp._id && (
                      <div className="dropdown-menu">
                        <button onClick={() => handleEdit(emp)}>Edit</button>
                        <button onClick={() => handleRemove(emp._id)}>Remove</button>
                      </div>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default Employees;
