const Question = require('../models/Discussion');

// Add a reply to a question
exports.addReply = async (req, res) => {
  try {
    const { replyText } = req.body;
    if (!replyText) {
      return res.status(400).json({ error: "Reply text is required." });
    }

    const question = await Question.findById(req.params.id);
    if (!question) {
      return res.status(404).json({ error: 'Question not found.' });
    }

    const replyBy = req.user.name;

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
