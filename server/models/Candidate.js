const mongoose = require('mongoose');

const candidateSchema = new mongoose.Schema({
  name: String,
  email: String,
  phone: String,
  position: String,
  status: { type: String, default: 'New' },
  experience: String,
  resumeUrl: String
});

module.exports = mongoose.model('Candidate', candidateSchema);
