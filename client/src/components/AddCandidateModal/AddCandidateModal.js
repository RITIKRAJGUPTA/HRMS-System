import React, { useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import './modal.css';

const AddCandidateModal = ({ onClose }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    position: '',
    experience: '',
    resume: null,
  });

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === 'resume') {
      setFormData({ ...formData, resume: files[0] });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = new FormData();
    Object.entries(formData).forEach(([key, value]) => {
      data.append(key, value);
    });

    try {
      await axios.post('http://localhost:5000/api/candidates', data);
      toast.success('Candidate added successfully!');
      onClose();
    } catch (error) {
      toast.error('Failed to add candidate');
      console.error(error);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal">
        <span className="close" onClick={onClose}>×</span>
        <h2>Add Candidate</h2>
        <form onSubmit={handleSubmit}>
          <input type="text" name="name" placeholder="Full Name" required onChange={handleChange} />
          <input type="email" name="email" placeholder="Email Address" required onChange={handleChange} />
          <input type="text" name="phone" placeholder="Phone Number" required onChange={handleChange} />
          <input type="text" name="position" placeholder="Position" required onChange={handleChange} />
          <input type="text" name="experience" placeholder="Experience" required onChange={handleChange} />
          <input type="file" name="resume" required onChange={handleChange} />
          <button type="submit">Save</button>
        </form>
      </div>
    </div>
  );
};

export default AddCandidateModal;
