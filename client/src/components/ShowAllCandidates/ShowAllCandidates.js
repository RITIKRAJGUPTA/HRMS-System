import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './showAllCandidates.css';
import AddCandidateModal from '../AddCandidateModal/AddCandidateModal';
import EditCandidateModal from '../EditCandidateModal/EditCandidateModal';

const ShowAllCandidates = () => {
  const [candidates, setCandidates] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
const [selectedCandidate, setSelectedCandidate] = useState(null);


  const fetchCandidates = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/candidates');
      setCandidates(res.data);
    } catch (err) {
      toast.error('Error fetching candidates');
    }
  };

  useEffect(() => {
    fetchCandidates();
  }, []);

  const handleDownload = (id) => {
    window.open(`http://localhost:5000/api/candidates/resume/${id}`, '_blank');
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/api/candidates/${id}`);
      setCandidates(prev => prev.filter(c => c._id !== id));
      toast.success('Candidate removed successfully');
    } catch (err) {
      toast.error('Failed to delete candidate');
    }
  };

  const handleStatusChange = async (id, newStatus) => {
    try {
      await axios.put(`http://localhost:5000/api/candidates/${id}`, { status: newStatus });
      setCandidates(prev =>
        prev.map(c => (c._id === id ? { ...c, status: newStatus } : c))
      );
      toast.success('Status updated');
    } catch (err) {
      toast.error('Failed to update status');
    }
  };

  const handleModalCloseAndRefresh = () => {
    setShowModal(false);
    fetchCandidates();
  };

  return (
    <div className="candidate-table-container">
        {editModalOpen && selectedCandidate && (
  <EditCandidateModal
    candidate={selectedCandidate}
    onClose={() => setEditModalOpen(false)}
    onUpdated={fetchCandidates}
  />
)}


      {showModal && (
        <AddCandidateModal onClose={handleModalCloseAndRefresh} />
      )}

      <table>
        <thead>
          <tr>
            <th>Full Name</th>
            <th>Email</th>
            <th>Phone</th>
            <th>Experience</th>
            <th>Position</th>
            <th>Resume</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {candidates.map((c) => (
            <tr key={c._id}>
              <td>{c.name}</td>
              <td>{c.email}</td>
              <td>{c.phone}</td>
              <td>{c.experience}</td>
              <td>{c.position}</td>
              <td>
                <button onClick={() => handleDownload(c._id)}>Download</button>
              </td>
              <td>
                <select
                  value={c.status || 'New'}
                  onChange={(e) => handleStatusChange(c._id, e.target.value)}
                >
                  <option value="New">New</option>
                  <option value="Selected">Selected</option>
                  <option value="Rejected">Rejected</option>
                </select>
              </td>
              <td>
              <button onClick={() => {
  setSelectedCandidate(c);
  setEditModalOpen(true);
}}>
  Edit
</button>

                <button onClick={() => handleDelete(c._id)}>Remove</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ShowAllCandidates;
