const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const router = express.Router();

// Register
const isValidPassword = (password) => {
  const regex = /^(?=.*[A-Z])(?=.*[^A-Za-z0-9])(?=.{8,})/;
  return regex.test(password);
};
// Register
router.post('/register', async (req, res) => {
  const { fullName, email, password, phone } = req.body;

  // Validation
  if (!fullName || fullName.length < 3 || fullName.length > 30) {
    return res.status(400).json({ message: 'Full name must be between 3 and 30 characters' });
  }

  if (!email || !email.endsWith('@gmail.com')) {
    return res.status(400).json({ message: 'Email must be a valid @gmail.com address' });
  }

  if (!phone || !/^\d{10}$/.test(phone)) {
    return res.status(400).json({ message: 'Phone number must be exactly 10 digits' });
  }

  if (!password || !isValidPassword(password)) {
    return res.status(400).json({ message: 'Password must be at least 8 characters, include one uppercase letter and one special character' });
  }

  try {
    const existing = await User.findOne({ email });
    if (existing) return res.status(400).json({ message: 'User already exists' });

    const hashed = await bcrypt.hash(password, 10);
    const newUser = new User({ fullName, email, password: hashed, phone });
    await newUser.save();

    res.status(201).json({ message: 'User registered' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


// Login
router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: 'Invalid credentials' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: 'Invalid credentials' });

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '2h' });
    res.json({ token, user: { fullName: user.fullName, email: user.email } });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
