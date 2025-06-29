// // backend/routes/logs.js

// const express = require('express');
// const router = express.Router();
// const DeliveryLog = require('../models/DeliveryLog'); // Adjust the path if needed

// // GET /api/logs → return all delivery logs
// router.get('/', async (req, res) => {
//   try {
//     const logs = await DeliveryLog.find()
//       .populate('customerId', 'name email') // Optional: populate customer details
//       .populate('campaignId', 'name');       // Optional: populate campaign name
//     res.json(logs);
//   } catch (err) {
//     console.error('Error fetching logs:', err);
//     res.status(500).json({ error: 'Failed to fetch logs' });
//   }
// });

// module.exports = router;
