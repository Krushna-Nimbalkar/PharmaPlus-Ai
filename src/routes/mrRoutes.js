const express = require('express');
const Drug = require('../models/Drug');
const User = require('../models/User');
const { sendDrugNotification } = require('../services/emailService');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();
router.use(protect, authorize('mr'));

const createDrugOrPr = async (req, res) => {
  try {
    const { name, description, category, targetSpecialization } = req.body;

    const drug = await Drug.create({
      name,
      description,
      category,
      targetSpecialization,
      addedBy: req.user._id,
    });

    const doctors = await User.find({ role: 'doctor', specialization: targetSpecialization });

    await Promise.all(
      doctors.map(async (doctor) => {
        try {
          await sendDrugNotification(doctor, drug);
        } catch (error) {
          console.error(`Email failed for ${doctor.email}:`, error.message);
        }
      })
    );

    res.status(201).json({
      message: `Drug/PR created successfully. Notifications attempted for ${doctors.length} doctor(s).`,
      drug,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

router.post('/drug', createDrugOrPr);
router.post('/pr', createDrugOrPr);

router.get('/drugs', async (req, res) => {
  const drugs = await Drug.find({ addedBy: req.user._id }).sort({ createdAt: -1 });
  res.json(drugs);
});

module.exports = router;
