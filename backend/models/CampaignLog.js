//backend/models/CampaignLog.js
const mongoose = require('mongoose');

const CampaignLogSchema = new mongoose.Schema({
  campaignId: { type: mongoose.Schema.Types.ObjectId, ref: 'Campaign' },
  customerId: { type: mongoose.Schema.Types.ObjectId, ref: 'Customer' },
  message: String,
  status: { type: String, enum: ['sent', 'failed'], default: 'sent' },
  timestamp: { type: Date, default: Date.now }
});

module.exports = mongoose.model('CampaignLog', CampaignLogSchema);
