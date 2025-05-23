const express = require('express');
const router = express.Router();
const replyController = require('../controllers/replyController');

// POST /api/questions/:id/reply  -> add reply to a question
router.post('/:id/reply', questionController.addReply);

module.exports = router;
