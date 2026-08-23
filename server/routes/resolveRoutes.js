const express = require("express");
const path = require("path");

const router = express.Router();

const { links, visits } = require("../data/store");

router.get("/s/:id", (req, res) => {
  const { id } = req.params;

  const link = links[id];

  if (!link) {
    return res.status(404).send("Invalid or expired link");
  }

  const ip =
    req.headers["x-forwarded-for"]?.split(",")[0].trim() ||
    req.socket.remoteAddress ||
    null;

  visits.push({
    linkId: id,
    ip,
    userAgent: req.get("user-agent") || null,
    referer: req.get("referer") || null,
    timestamp: new Date()
  });

  res.sendFile(
    path.join(__dirname, "../../client/index.html")
  );
});

router.get("/api/link/:id", (req, res) => {
  const { id } = req.params;

  const link = links[id];

  if (!link) {
    return res.status(404).json({
      message: "Invalid or expired link"
    });
  }

  res.status(200).json({
    id: link.id,
    targetUrl: link.targetUrl,
    redirectTime: link.redirectTime,
    quiz: link.quiz
  });
});

module.exports = router;
