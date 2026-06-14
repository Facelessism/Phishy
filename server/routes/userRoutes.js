const express = require("express");
const router = express.Router();

const { config, responses } = require("../data/store");

router.get("/config", (req, res) => {
  res.json(config);
});

router.post("/submit", (req, res) => {
  const { answers } = req.body;

  if (!answers || !Array.isArray(answers)) {
    return res.status(400).json({
      message: "Invalid answers"
    });
  }

  responses.push({
    answers,
    submittedAt: new Date()
  });

  res.status(201).json({
    message: "Response submitted successfully"
  });
});

module.exports = router;
