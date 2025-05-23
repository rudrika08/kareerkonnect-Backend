const express = require('express');
const router = express.Router();
const Event = require('../models/eventModel');
const { checkLogin, checkAdmin } = require('../middleware/authMiddleware');

// GET /events - Public route to fetch all events
router.get('/', async (req, res) => {
  try {
    const events = await Event.find().sort({ dateTime: 1 });
    res.json(events);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST /events - Only admins can add an event
router.post('/', checkLogin, checkAdmin, async (req, res) => {
  const { title, dateTime, description, type, reminderEnabled } = req.body;

  try {
    const newEvent = new Event({
      title,
      dateTime,
      description,
      type,
      reminderEnabled: reminderEnabled || false,
    });

    await newEvent.save();
    res.status(201).json({ message: 'Event created successfully', event: newEvent });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

module.exports = router;
