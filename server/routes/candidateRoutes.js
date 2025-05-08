const express = require('express');
const multer = require('multer');
const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const Candidate = require('../models/Candidate');
require('dotenv').config();

const router = express.Router();

// Cloudinary config
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Multer Cloudinary Storage
const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: 'resumes',
    resource_type: 'auto',
  },
});
const upload = multer({ storage });

// ➕ Create Candidate
router.post('/', upload.single('resume'), async (req, res) => {
  try {
    const { name, email, phone, position, experience } = req.body;
    const resumeUrl = req.file.path;

    const candidate = new Candidate({
      name,
      email,
      phone,
      position,
      experience,
      resumeUrl,
    });

    await candidate.save();
    res.status(201).json({ message: 'Candidate added', candidate });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 📥 Get All Candidates
router.get('/', async (req, res) => {
  try {
    const candidates = await Candidate.find();
    res.json(candidates);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 🗑️ Delete Candidate
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    await Candidate.findByIdAndDelete(id);
    res.json({ message: 'Candidate deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ✏️ Update Candidate (with optional resume update)
router.put('/:id', upload.single('resume'), async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    if (req.file) {
      updates.resumeUrl = req.file.path;
    }

    const updatedCandidate = await Candidate.findByIdAndUpdate(id, updates, { new: true });
    res.json({ message: 'Candidate updated', candidate: updatedCandidate });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 📎 Download Resume URL (redirects browser to resume)
router.get('/resume/:id', async (req, res) => {
  try {
    const candidate = await Candidate.findById(req.params.id);
    if (!candidate || !candidate.resumeUrl) {
      return res.status(404).json({ error: 'Resume not found' });
    }
    res.redirect(candidate.resumeUrl); // Redirect to resume URL
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});



module.exports = router;
