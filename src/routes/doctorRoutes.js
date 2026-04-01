const express = require('express');
const Drug = require('../models/Drug');
const Feedback = require('../models/Feedback');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();
router.use(protect, authorize('doctor'));

router.get('/drugs', async (req, res) => {
  const drugs = await Drug.find({ targetSpecialization: req.user.specialization }).sort({ createdAt: -1 });
  res.json(drugs);
});

router.post('/feedback', async (req, res) => {
  const { drugId, opinion, message } = req.body;

  const feedback = await Feedback.findOneAndUpdate(
    { doctorId: req.user._id, drugId },
    { doctorId: req.user._id, drugId, opinion, message },
    { upsert: true, new: true }
  );

  res.status(201).json(feedback);
});

router.get('/feedback', async (req, res) => {
  const feedback = await Feedback.find({ doctorId: req.user._id }).populate('drugId', 'name category');
  res.json(feedback);
});

module.exports = router;
