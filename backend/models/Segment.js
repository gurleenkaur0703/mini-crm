//backend/models/Segment.js
const mongoose = require('mongoose');

const SegmentSchema = new mongoose.Schema({
  name: { type: String, required: true },
  rules: [
    {
      field: String,
      operator: String,
      value: mongoose.Schema.Types.Mixed,
      logic: String
    }
  ]
});

module.exports = mongoose.model('Segment', SegmentSchema);
