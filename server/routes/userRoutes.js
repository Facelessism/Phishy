const express = require("express");

const router = express.Router();

const { links, responses } = require("../data/store");

router.post("/submit/:id", (req, res) => {
  const { id } = req.params;
  const { answers } = req.body;

  const link = links[id];

  if (!link) {
    return res.status(404).json({
      message: "Invalid or expired link"
    });
  }

  if (!Array.isArray(answers)) {
    return res.status(400).json({
      message: "Invalid answers"
    });
  }

  const questionIds = new Set(
    link.quiz.map((question) => question.id)
  );

  const validAnswers = answers.every((answer) => {
    return (
      answer &&
      typeof answer === "object" &&
      typeof answer.questionId === "string" &&
      questionIds.has(answer.questionId) &&
      typeof answer.answer === "string"
    );
  });

  if (!validAnswers) {
    return res.status(400).json({
      message: "Invalid answer data"
    });
  }

  responses.push({
    linkId: id,
    answers,
    submittedAt: new Date()
  });

  res.status(201).json({
    message: "Response submitted successfully"
  });
});

module.exports = router;
