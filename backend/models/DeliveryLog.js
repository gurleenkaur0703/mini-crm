// // backend/models/DeliveryLog.js
// const mongoose = require('mongoose');

// const deliveryLogSchema = new mongoose.Schema({
//   campaignId: { type: mongoose.Schema.Types.ObjectId, ref: 'Campaign', required: true },
//   status: { type: String, required: true }, // e.g. 'sent', 'failed'
//   sentAt: { type: Date, default: Date.now },
//   details: String,
// }, { timestamps: true });

// module.exports = mongoose.model('DeliveryLog', deliveryLogSchema);
