const express = require("express");
const router = express.Router();

const { links } = require("../data/store");

function generateId(length = 6) {
  const chars = "abcdefghijklmnopqrstuvwxyz0123456789";
  let id = "";
  for (let i = 0; i < length; i++) {
    id += chars[Math.floor(Math.random() * chars.length)];
  }
  return id;
}

router.post("/create", (req, res) => {
  const { targetUrl, redirectTime } = req.body;

  if (typeof targetUrl !== "string" || typeof redirectTime !== "number") {
    return res.status(400).json({ message: "Invalid input" });
  }

  try {
    new URL(targetUrl);
  } catch {
    return res.status(400).json({ message: "Invalid URL" });
  }

  if (redirectTime < 0 || redirectTime > 1000) {
    return res.status(400).json({ message: "Invalid time range" });
  }

  const id = generateId();

  links[id] = {
    targetUrl,
    redirectTime,
    createdAt: Date.now()
  };

  res.json({
    shortUrl: `/s/${id}`,
    id
  });
});

module.exports = router;
