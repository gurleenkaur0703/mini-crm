// ✅ backend/routes/campaigns.js
const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();
const Campaign = require('../models/Campaign');
const Segment = require('../models/Segment');
const Customer = require('../models/Customer');
const CampaignLog = require('../models/CampaignLog');

function buildSegmentQuery(rules = []) {
  const query = rules.map(rule => {
    const condition = {};
    switch (rule.operator) {
      case 'equals':
        condition[rule.field] = rule.value;
        break;
      case 'not_equals':
        condition[rule.field] = { $ne: rule.value };
        break;
      case 'greater_than':
        condition[rule.field] = { $gt: Number(rule.value) };
        break;
      case 'less_than':
        condition[rule.field] = { $lt: Number(rule.value) };
        break;
    }
    return condition;
  });
  return query.length > 1 ? { $and: query } : query[0] || {};
}

router.post('/', async (req, res) => {
  const { name, message, segmentId } = req.body;
  const campaign = await Campaign.create({ name, message, segmentId });
  res.status(201).json(campaign);
});

router.get('/', async (req, res) => {
  const campaigns = await Campaign.find().populate('segmentId');
  res.json(campaigns);
});

router.get('/:id', async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ error: 'Invalid campaign ID format' });
  }

  try {
    const campaign = await Campaign.findById(id).populate('segmentId');
    if (!campaign) {
      return res.status(404).json({ error: 'Campaign not found' });
    }
    res.json(campaign);
  } catch (err) {
    console.error('Error fetching campaign:', err);
    res.status(500).json({ error: 'Failed to fetch campaign' });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const deleted = await Campaign.findByIdAndDelete(req.params.id);
    if (!deleted) {
      return res.status(404).json({ error: 'Campaign not found' });
    }

    await CampaignLog.deleteMany({ campaignId: req.params.id });

    res.json({ success: true });
  } catch (err) {
    console.error('Error deleting campaign:', err);
    res.status(500).json({ error: 'Failed to delete campaign' });
  }
});

router.post('/:id/send', async (req, res) => {
  try {
    const campaign = await Campaign.findById(req.params.id);
    if (!campaign || campaign.status === 'sent') {
      return res.status(400).json({ error: 'Campaign already sent or not found' });
    }

    const segment = await Segment.findById(campaign.segmentId);
    const customers = await Customer.find(buildSegmentQuery(segment.rules));

    let count = 0;
    for (const customer of customers) {
      const isSuccess = Math.random() < 0.9;
      await CampaignLog.create({
        campaignId: campaign._id,
        customerId: customer._id,
        message: `Hi ${customer.name}, ${campaign.message}`,
        status: isSuccess ? 'sent' : 'failed'
      });
      count++;
    }

    campaign.status = 'sent';
    campaign.sentAt = new Date();
    await campaign.save();

    res.json({ success: true, count });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to send campaign' });
  }
});

router.get('/:id/logs', async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ error: 'Invalid campaign ID format' });
  }

  try {
    const logs = await CampaignLog.find({ campaignId: id }).populate('customerId');
    res.json(logs);
  } catch (err) {
    console.error('Error fetching logs:', err);
    res.status(500).json({ error: 'Failed to fetch logs' });
  }
});

module.exports = router;
