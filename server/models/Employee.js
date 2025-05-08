const mongoose = require('mongoose');

const EmployeeSchema = new mongoose.Schema({
  name: String,
  email: String,
  phone: String,
  experience: String,
  position: String,
  doj: { type: String, default: new Date().toISOString().split('T')[0] }
});

module.exports = mongoose.model('Employee', EmployeeSchema);
