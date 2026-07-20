const express = require("express");
const router = express.Router();

const { links, responses } = require("../data/store");

router.post("/submit/:id", (req, res) => {
  const { id } = req.params;
  const { answers } = req.body;

  if (!links[id]) {
    return res.status(404).json({
      message: "Invalid or expired link"
    });
  }

  if (!Array.isArray(answers)) {
    return res.status(400).json({
      message: "Invalid answers"
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
