const express = require("express");
const router = express.Router();

const auth = require("../middleware/auth");
const { links, responses } = require("../data/store");

function generateId(length = 6) {
  const chars = "abcdefghijklmnopqrstuvwxyz0123456789";
  let id = "";

  do {
    id = "";
    for (let i = 0; i < length; i++) {
      id += chars[Math.floor(Math.random() * chars.length)];
    }
  } while (links[id]);

  return id;
}

router.post("/create", auth, (req, res) => {
  const { targetUrl, redirectTime } = req.body;

  if (typeof targetUrl !== "string" || typeof redirectTime !== "number") {
    return res.status(400).json({
      message: "Invalid input"
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
      message: "Redirect time must be between 0 and 1000 seconds"
    });
  }

  const id = generateId();

  links[id] = {
    targetUrl,
    redirectTime,
    createdAt: new Date()
  };

  res.status(201).json({
    message: "Short link created successfully",
    shortUrl: `/s/${id}`
  });
});

router.get("/responses", auth, (req, res) => {
  res.json(responses);
});

module.exports = router;
