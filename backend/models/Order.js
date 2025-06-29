// models/Order.js
const mongoose = require('mongoose');

const OrderSchema = new mongoose.Schema({
  customerId: { type: mongoose.Schema.Types.ObjectId, ref: 'Customer', required: true },
  orderAmount: Number,
  orderDate: Date,
  status: String,
});

module.exports = mongoose.model('Order', OrderSchema);
