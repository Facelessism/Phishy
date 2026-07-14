const express = require("express");
const router = express.Router();

const { links } = require("../data/store");

router.get("/s/:id", (req, res) => {
  const { id } = req.params;

  const data = links[id];

  if (!data) {
    return res.status(404).send("Invalid or expired link");
  }

  res.json({
    id,
    targetUrl: data.targetUrl,
    redirectTime: data.redirectTime
  });
});

module.exports = router;
