// backend/models/Campaign.js
const mongoose = require('mongoose');

const CampaignSchema = new mongoose.Schema({
  name: String,
  message: String,
  segmentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Segment' },
  status: { type: String, enum: ['draft', 'sent'], default: 'draft' },
  sentAt: Date
}, { timestamps: true }); // ✅ This enables createdAt and updatedAt

module.exports = mongoose.model('Campaign', CampaignSchema);
