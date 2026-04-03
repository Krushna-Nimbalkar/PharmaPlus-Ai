const mongoose = require('mongoose');

const drugSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    description: { type: String, required: true },
    category: { type: String, required: true },
    addedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    targetSpecialization: { type: String, required: true }
  },
  { timestamps: true }
);

module.exports = mongoose.model('Drug', drugSchema);
