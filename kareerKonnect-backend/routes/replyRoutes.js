const express = require('express');
const router = express.Router();
const replyController = require('../controllers/replyController');
const { checkLogin } = require('../middleware/authMiddleware');
const { verifyToken } = require('../middleware/verifyToken'); // Middleware to verify JWT token

// POST /api/questions/:id/reply  -> add reply to a question
router.post('/:id/reply', verifyToken, checkLogin, replyController.addReply);

module.exports = router;
