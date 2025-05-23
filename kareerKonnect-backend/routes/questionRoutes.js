const express = require('express');
const router = express.Router();
const questionController = require('../controllers/questionController');

// POST /api/questions/       -> create a new question
router.post('/', questionController.createQuestion);

// GET /api/questions/        -> get all questions
router.get('/', questionController.getAllQuestions);

// GET /api/questions/:id     -> get question by id and increase views
router.get('/:id', questionController.getQuestionById);

// DELETE /api/questions/:id  -> delete a question
router.delete('/:id', questionController.deleteQuestion);

module.exports = router;
