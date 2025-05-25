const express = require('express');
const router = express.Router();
const questionController = require('../controllers/questionController');
const { verifyToken } = require('../middleware/verifyToken'); // Middleware to verify JWT token
const { checkLogin } = require('../middleware/authMiddleware');

// POST /api/questions/       -> create a new question
router.post('/',verifyToken, checkLogin, questionController.createQuestion);

// GET /api/questions/        -> get all questions
router.get('/',verifyToken, checkLogin, questionController.getAllQuestions);

// GET /api/questions/:id     -> get question by id and increase views
router.get('/:id',checkLogin, questionController.getQuestionById);

// DELETE /api/questions/:id  -> delete a question
router.delete('/:id',checkLogin, questionController.deleteQuestion);

module.exports = router;
