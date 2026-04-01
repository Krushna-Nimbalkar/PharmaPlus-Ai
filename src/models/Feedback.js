const mongoose = require('mongoose');

const feedbackSchema = new mongoose.Schema(
  {
    doctorId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    drugId: { type: mongoose.Schema.Types.ObjectId, ref: 'Drug', required: true },
    opinion: {
      type: String,
      enum: ['approve', 'reject', 'comment'],
      required: true,
    },
    message: { type: String, default: '' },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Feedback', feedbackSchema);
