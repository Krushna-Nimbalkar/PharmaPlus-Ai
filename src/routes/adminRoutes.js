const express = require('express');
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

router.use(protect, authorize('admin'));

router.get('/users', async (req, res) => {
  const users = await User.find().select('-password').sort({ createdAt: -1 });
  res.json(users);
});

router.post('/doctor', async (req, res) => {
  try {
    const { name, email, specialization, password } = req.body;
    const exists = await User.findOne({ email: email.toLowerCase() });
    if (exists) return res.status(400).json({ message: 'User already exists' });

    const hashedPassword = await bcrypt.hash(password, 10);
    const doctor = await User.create({
      name,
      email: email.toLowerCase(),
      specialization,
      password: hashedPassword,
      role: 'doctor',
    });

    res.status(201).json({ id: doctor._id, name: doctor.name, email: doctor.email });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.post('/mr', async (req, res) => {
  try {
    const { name, email, company, password } = req.body;
    const exists = await User.findOne({ email: email.toLowerCase() });
    if (exists) return res.status(400).json({ message: 'User already exists' });

    const hashedPassword = await bcrypt.hash(password, 10);
    const mr = await User.create({
      name,
      email: email.toLowerCase(),
      company,
      password: hashedPassword,
      role: 'mr',
    });

    res.status(201).json({ id: mr._id, name: mr.name, email: mr.email });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.delete('/user/:id', async (req, res) => {
  const user = await User.findById(req.params.id);
  if (!user) return res.status(404).json({ message: 'User not found' });
  if (user.role === 'admin') return res.status(403).json({ message: 'Cannot delete admin' });

  await user.deleteOne();
  res.json({ message: 'User deleted successfully' });
});

module.exports = router;
