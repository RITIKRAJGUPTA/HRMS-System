import React, { useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import './modal.css';

const EditCandidateModal = ({ candidate, onClose, onUpdated }) => {
  const [formData, setFormData] = useState({
    name: candidate.name,
    email: candidate.email,
    phone: candidate.phone,
    position: candidate.position,
    experience: candidate.experience
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`http://localhost:5000/api/candidates/${candidate._id}`, formData);
      toast.success('Candidate updated successfully!');
      onUpdated();
      onClose();
    } catch (error) {
      toast.error('Failed to update candidate');
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal">
        <span className="close" onClick={onClose}>×</span>
        <h2>Edit Candidate</h2>
        <form onSubmit={handleSubmit}>
          <input type="text" name="name" value={formData.name} required onChange={handleChange} />
          <input type="email" name="email" value={formData.email} required onChange={handleChange} />
          <input type="text" name="phone" value={formData.phone} required onChange={handleChange} />
          <input type="text" name="position" value={formData.position} required onChange={handleChange} />
          <input type="text" name="experience" value={formData.experience} required onChange={handleChange} />
          <button type="submit">Update</button>
        </form>
      </div>
    </div>
  );
};

export default EditCandidateModal;
