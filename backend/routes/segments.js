//backend/routes/segments.js
const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Segment = require('../models/Segment');

const SegmentSchema = new mongoose.Schema({
  name: { type: String, required: true },
  rules: [
    {
      field: String,
      operator: String,
      value: mongoose.Schema.Types.Mixed,
      logic: String // AND/OR
    }
  ]
});


// Get all segments
router.get('/', async (req, res) => {
  const segments = await Segment.find();
  res.send(segments);
});

// Get one segment
router.get('/:id', async (req, res) => {
  const segment = await Segment.findById(req.params.id);
  res.send(segment);
});

// Create new segment
router.post('/', async (req, res) => {
  const { name, rules } = req.body;
  const newSegment = new Segment({ name, rules });
  await newSegment.save();
  res.send(newSegment);
});

// Update segment
router.put('/:id', async (req, res) => {
  const updated = await Segment.findByIdAndUpdate(req.params.id, req.body, { new: true });
  res.send(updated);
});

// Delete segment
router.delete('/:id', async (req, res) => {
  await Segment.findByIdAndDelete(req.params.id);
  res.send({ success: true });
});

module.exports = router;
