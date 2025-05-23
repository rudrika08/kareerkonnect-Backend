const Question = require('../models/Discussion');

// Add a reply to a question
exports.addReply = async (req, res) => {
  try {
    console.log('Add reply called with ID:', req.params.id);
    const { replyBy, replyText } = req.body;

    if (!replyBy || !replyText) {
      return res.status(400).json({ error: "Missing fields: replyBy and replyText are required" });
    }

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
