const Event = require('../models/Event');

// Get all upcoming events
const getUpcomingEvents = async (req, res) => {
  try {
    const currentDate = new Date();
    const events = await Event.find({ dateTime: { $gte: currentDate } }).sort('dateTime');
    res.status(200).json(events);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch events', error: err.message });
  }
};

// Create a new event (admin only)
const createEvent = async (req, res) => {
  const { title, link, dateTime, description, type, reminderEnabled } = req.body;

  // Basic validation
  if (!title || !link || !dateTime || !description || !type) {
    return res.status(400).json({ message: 'All required fields must be provided' });
  }

  try {
    const newEvent = new Event({
      title,
      link,
      dateTime,
      description,
      type,
      reminderEnabled: reminderEnabled || false,
    });

    await newEvent.save();
    res.status(201).json({ message: 'Event created successfully', event: newEvent });
  } catch (err) {
    res.status(400).json({ message: 'Event creation failed', error: err.message });
  }
};

// Get event by ID
const getEventById = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) return res.status(404).json({ message: 'Event not found' });
    res.status(200).json(event);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching event', error: err.message });
  }
};

module.exports = {
  getUpcomingEvents,
  createEvent,
  getEventById,
};
