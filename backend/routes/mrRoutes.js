const express = require('express');
const Drug = require('../models/Drug');
const User = require('../models/User');
const { protect, allowRoles } = require('../middleware/authMiddleware');
const { sendDrugNotification } = require('../services/emailService');

const router = express.Router();

router.use(protect, allowRoles('mr'));

router.post('/drugs', async (req, res) => {
  try {
    const { name, category, description, targetSpecialization } = req.body;

    const drug = await Drug.create({
      name,
      category,
      description,
      targetSpecialization,
      addedBy: req.user._id
    });

    const doctors = await User.find({
      role: 'doctor',
      specialization: new RegExp(`^${targetSpecialization}$`, 'i')
    });

    await sendDrugNotification({ recipients: doctors, drug });

    res.status(201).json({ drug, notifiedDoctors: doctors.length });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get('/drugs', async (req, res) => {
  const drugs = await Drug.find({ addedBy: req.user._id }).sort({ createdAt: -1 });
  res.json(drugs);
});

module.exports = router;
