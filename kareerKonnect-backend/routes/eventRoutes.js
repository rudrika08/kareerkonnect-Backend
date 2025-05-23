const express = require('express');
const router = express.Router();
const { checkLogin, checkAdmin } = require('../middleware/authMiddleware');
const {
  getUpcomingEvents,
  createEvent,
  getEventById,
} = require('../controllers/eventController');

// GET /events/upcoming - Public route: Fetch upcoming events
router.get('/upcoming', getUpcomingEvents);

// GET /events/:id - Public route: Fetch a specific event by ID
router.get('/:id', getEventById);

// POST /events/create - Admin route: Create new event
router.post('/create', checkLogin, checkAdmin, createEvent);

module.exports = router;
