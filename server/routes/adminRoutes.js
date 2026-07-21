const express = require("express");
const crypto = require("crypto");

const router = express.Router();

const auth = require("../middleware/auth");
const { links, responses } = require("../data/store");

router.post("/create", auth, (req, res) => {
  const {
    targetUrl,
    redirectTime,
    quiz
  } = req.body;

  if (
    typeof targetUrl !== "string" ||
    typeof redirectTime !== "number" ||
    !Array.isArray(quiz)
  ) {
    return res.status(400).json({
      message: "Invalid request"
    });
  }

  try {
    new URL(targetUrl);
  } catch {
    return res.status(400).json({
      message: "Invalid URL"
    });
  }

  if (redirectTime < 0 || redirectTime > 1000) {
    return res.status(400).json({
      message: "Redirect time must be between 0 to 1000 seconds"
    });
  }

  const id = crypto.randomBytes(4).toString("base64url");

  links[id] = {
    id,
    targetUrl,
    redirectTime,
    quiz,
    createdAt: new Date(),
    clickCount: 0
  };

  res.status(201).json({
    message: "Link created successfully!!!",
    shortUrl: `/s/${id}`
  });
});

router.get("/responses", auth, (req, res) => {
  res.json(responses);
});

module.exports = router;
