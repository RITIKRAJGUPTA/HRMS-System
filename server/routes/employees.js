const express = require('express');
const router = express.Router();
const Employee = require('../models/Employee');

// POST: Add selected employee
router.post('/', async (req, res) => {
  try {
    const existing = await Employee.findOne({ email: req.body.email });
    if (existing) {
      return res.status(400).json({ message: 'Employee already exists' });
    }

    const newEmp = new Employee(req.body);
    const saved = await newEmp.save();
    res.status(201).json(saved);
  } catch (err) {
    res.status(500).json({ error: 'Server error', details: err });
  }
});

// GET: All employees
router.get('/', async (req, res) => {
  try {
    const employees = await Employee.find();
    res.json(employees);
  } catch (err) {
    res.status(500).json({ error: 'Error fetching employees' });
  }
});

// DELETE: Remove employee by ID
router.delete('/:id', async (req, res) => {
  try {
    await Employee.findByIdAndDelete(req.params.id);
    res.json({ message: 'Employee removed' });
  } catch (err) {
    res.status(500).json({ error: 'Error deleting employee' });
  }
});


module.exports = router;
