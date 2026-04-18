const express = require('express');
const router = express.Router();
const Member = require('../models/Member');
const authMiddleware = require('../middleware/auth');

// All routes require auth
router.use(authMiddleware);

// GET all members
router.get('/', async (req, res) => {
  try {
    const { search, status } = req.query;
    let query = {};
    if (status) query.status = status;
    if (search) query.name = { $regex: search, $options: 'i' };

    const members = await Member.find(query)
      .populate('membershipPlan', 'name price duration')
      .populate('trainer', 'name specialization')
      .sort({ createdAt: -1 });
    res.json(members);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET single member
router.get('/:id', async (req, res) => {
  try {
    const member = await Member.findById(req.params.id)
      .populate('membershipPlan')
      .populate('trainer');
    if (!member) return res.status(404).json({ message: 'Member not found' });
    res.json(member);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST create member
router.post('/', async (req, res) => {
  try {
    const member = new Member(req.body);
    // Calculate expiry date from plan duration
    if (req.body.membershipPlan) {
      const Plan = require('../models/Plan');
      const plan = await Plan.findById(req.body.membershipPlan);
      if (plan) {
        const expiry = new Date();
        expiry.setMonth(expiry.getMonth() + plan.duration);
        member.expiryDate = expiry;
      }
    }
    await member.save();
    const populated = await member.populate(['membershipPlan', 'trainer']);
    res.status(201).json(populated);
  } catch (err) {
    if (err.code === 11000) return res.status(400).json({ message: 'Email already exists' });
    res.status(500).json({ message: err.message });
  }
});

// PUT update member
router.put('/:id', async (req, res) => {
  try {
    const member = await Member.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    ).populate('membershipPlan').populate('trainer');
    if (!member) return res.status(404).json({ message: 'Member not found' });
    res.json(member);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// DELETE member
router.delete('/:id', async (req, res) => {
  try {
    const member = await Member.findByIdAndDelete(req.params.id);
    if (!member) return res.status(404).json({ message: 'Member not found' });
    res.json({ message: 'Member deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET stats
router.get('/stats/summary', async (req, res) => {
  try {
    const total = await Member.countDocuments();
    const active = await Member.countDocuments({ status: 'Active' });
    const inactive = await Member.countDocuments({ status: 'Inactive' });
    const expired = await Member.countDocuments({ status: 'Expired' });
    res.json({ total, active, inactive, expired });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
