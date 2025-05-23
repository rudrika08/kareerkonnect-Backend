const Question = require('../models/Discussion');

// Create a new question
exports.createQuestion = async (req, res) => {
  try {
    console.log("📥 Incoming body:", req.body);
    const { question, postedBy } = req.body;

    if (!question || !postedBy) {
      return res.status(400).json({ error: "Missing fields: question and postedBy are required" });
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
    const questions = await Question.find().sort({ timestamp: -1 });
    res.status(200).json(questions);
  } catch (error) {
    console.error("Error fetching questions:", error);
    res.status(500).json({ error: 'Failed to fetch questions.' });
  }
};

// Get a single question and increase views
exports.getQuestionById = async (req, res) => {
  try {
    console.log('Fetching question ID:', req.params.id);
    const question = await Question.findById(req.params.id);
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
