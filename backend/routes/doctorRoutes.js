const express = require('express');
const Drug = require('../models/Drug');
const Feedback = require('../models/Feedback');
const { protect, allowRoles } = require('../middleware/authMiddleware');

const router = express.Router();

router.use(protect, allowRoles('doctor'));

router.get('/drugs', async (req, res) => {
  const drugs = await Drug.find({
    targetSpecialization: new RegExp(`^${req.user.specialization}$`, 'i')
  })
    .populate('addedBy', 'name email company')
    .sort({ createdAt: -1 });

  const feedback = await Feedback.find({ doctorId: req.user._id });
  const feedbackMap = new Map(feedback.map((f) => [f.drugId.toString(), f]));

  const response = drugs.map((drug) => ({
    ...drug.toObject(),
    feedback: feedbackMap.get(drug._id.toString()) || null
  }));

  res.json(response);
});

router.post('/feedback', async (req, res) => {
  try {
    const { drugId, opinion, message } = req.body;

    const feedback = await Feedback.findOneAndUpdate(
      { doctorId: req.user._id, drugId },
      { doctorId: req.user._id, drugId, opinion, message },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );

    res.status(201).json(feedback);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
