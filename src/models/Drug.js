const mongoose = require('mongoose');

const drugSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    description: { type: String, required: true, trim: true },
    category: { type: String, required: true, trim: true },
    addedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    targetSpecialization: { type: String, required: true, trim: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Drug', drugSchema);
