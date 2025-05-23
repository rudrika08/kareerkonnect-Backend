const mongoose = require('mongoose');

const replySchema = new mongoose.Schema({
  replyBy: String,
  replyText: String,
  replyTimestamp: { type: Date, default: Date.now }
});

const questionSchema = new mongoose.Schema({
  question: String,
  postedBy: String,
  timestamp: { type: Date, default: Date.now },
  replies: [replySchema],
  views: { type: Number, default: 0 }
});

exports.createQuestion = async (req, res) => {
  try {
    console.log("📥 Incoming body:", req.body);  // ✅ Debug
    const { question, postedBy } = req.body;

    if (!question || !postedBy) {
      return res.status(400).json({ error: "Missing fields" });
    }

    const newQuestion = new Question({ question, postedBy });
    await newQuestion.save();
    res.status(201).json(newQuestion);
  } catch (error) {
    console.error("Error posting question:", error);  
    res.status(500).json({ error: 'Failed to post question.' });
  }
};
exports.getAllQuestions = async (req, res) => {
  try {
    const questions = await Question.find().sort({ timestamp: -1 });
    res.status(200).json(questions);
  } catch (error) {
    console.error("Error fetching questions:", error); 
    res.status(500).json({ error: 'Failed to fetch questions.' });
  }
};
exports.getQuestionById = async (req, res) => {
  try {
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
exports.addReply = async (req, res) => {
  try {
    const { replyBy, replyText } = req.body;
    const question = await Question.findById(req.params.id);
    if (!question) {
      return res.status(404).json({ error: 'Question not found.' });
    }

    const newReply = {
      replyBy,
      replyText,
      replyTimestamp: new Date()
    };

    question.replies.push(newReply);
    await question.save();
    res.status(200).json(question);
  } catch (error) {
    console.error("Error adding reply:", error);
    res.status(500).json({ error: 'Failed to add reply.' });
  }
};
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


module.exports = mongoose.model('Question', questionSchema);
