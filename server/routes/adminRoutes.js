const express = require("express");
const crypto = require("crypto");

const router = express.Router();

const auth = require("../middleware/auth");
const { links, responses } = require("../data/store");

function generateId() {
  let id;

  do {
    id = crypto.randomBytes(4).toString("base64url");
  } while (links[id]);

  return id;
}

function isValidUrl(value) {
  try {
    const url = new URL(value);
    return url.protocol === "http:" || url.protocol === "https:";
  } catch {
    return false;
  }
}

function isValidQuiz(quiz) {
  return quiz.every((question) => {
    if (
      !question ||
      typeof question !== "object" ||
      typeof question.id !== "string" ||
      typeof question.type !== "string" ||
      typeof question.question !== "string" ||
      !question.question.trim()
    ) {
      return false;
    }

    if (question.type === "text") {
      return true;
    }

    if (question.type === "mcq") {
      return (
        Array.isArray(question.options) &&
        question.options.length >= 2 &&
        question.options.every(
          (option) =>
            typeof option === "string" &&
            option.trim()
        )
      );
    }

    return false;
  });
}

router.post("/create", auth, (req, res) => {
  const {
    targetUrl,
    redirectTime,
    quiz
  } = req.body;

  if (
    typeof targetUrl !== "string" ||
    !targetUrl.trim() ||
    typeof redirectTime !== "number" ||
    !Number.isFinite(redirectTime) ||
    !Array.isArray(quiz)
  ) {
    return res.status(400).json({
      message: "Invalid request"
    });
  }

  if (!isValidUrl(targetUrl)) {
    return res.status(400).json({
      message: "Invalid destination URL"
    });
  }

  if (redirectTime < 0 || redirectTime > 1000) {
    return res.status(400).json({
      message: "Redirect time must be between 0 and 1000 seconds"
    });
  }

  if (!isValidQuiz(quiz)) {
    return res.status(400).json({
      message: "Invalid quiz"
    });
  }

  const id = generateId();

  links[id] = {
    id,
    targetUrl: targetUrl.trim(),
    redirectTime,
    quiz,
    createdAt: new Date()
  };

  res.status(201).json({
    message: "Link created successfully",
    shortUrl: `/s/${id}`
  });
});

router.get("/responses", auth, (req, res) => {
  res.status(200).json(responses);
});

module.exports = router;
