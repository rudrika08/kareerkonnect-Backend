const Question = require('../models/Discussion');

// Create a new question (only for logged-in users)
exports.createQuestion = async (req, res) => {
  try {
    const { question } = req.body;
    const postedBy = req.user.name; // Or use req.user._id if you're saving user IDs

    if (!question) {
      return res.status(400).json({ error: "Question is required" });
    }

    const newQuestion = new Question({ question, postedBy });
    await newQuestion.save();
    res.status(201).json(newQuestion);
  } catch (error) {
    console.error("Error posting question:", error);
    res.status(500).json({ error: 'Failed to post question.' });
  }
};

// Get all questions
exports.getAllQuestions = async (req, res) => {
  try {
    const questions = await Question.find().sort({ timestamp: -1 }).populate('postedBy', 'name');
    res.status(200).json(questions);
  } catch (error) {
    console.error("Error fetching questions:", error);
    res.status(500).json({ error: 'Failed to fetch questions.' });
  }
};

// Get a single question and increment views
exports.getQuestionById = async (req, res) => {
  try {
    const question = await Question.findById(req.params.id).populate('postedBy', 'name');
    if (!question) {
      return res.status(404).json({ error: 'Question not found.' });
    }

    question.views += 1;
    await question.save();
    res.status(200).json(question);
  } catch (error) {
    console.error("Error fetching question:", error);
    res.status(500).json({ error: 'Failed to fetch the question.' });
  }
};

// Delete a question
exports.deleteQuestion = async (req, res) => {
  try {
    const question = await Question.findByIdAndDelete(req.params.id);
    if (!question) {
      return res.status(404).json({ error: 'Question not found.' });
    }
    res.status(200).json({ message: 'Question deleted successfully.' });
  } catch (error) {
    console.error("Error deleting question:", error);
    res.status(500).json({ error: 'Failed to delete question.' });
  }
};
