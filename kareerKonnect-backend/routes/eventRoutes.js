const express = require('express');
const router = express.Router();
const { verifyToken } = require('../middleware/verifyToken'); // create this file
const { checkLogin, checkAdmin } = require('../middleware/authMiddleware');
const {
  getUpcomingEvents,
  createEvent,
  getEventById,
  getAllEvents,
} = require('../controllers/eventController');

//GET /events - Public route: Fetch all events
router.get('/getAllEvents',verifyToken, checkLogin,getAllEvents);
// GET /events/upcoming - Public route: Fetch upcoming events
router.get('/upcoming', getUpcomingEvents);

// GET /events/:id - Public route: Fetch a specific event by ID
router.get('/:id', getEventById);

// POST /events/create - Admin route: Create new event
router.post('/create',verifyToken, checkLogin, checkAdmin, createEvent);

module.exports = router;
