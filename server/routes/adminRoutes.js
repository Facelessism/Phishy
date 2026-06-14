const express = require("express");
const router = express.Router();

const auth = require("../middleware/auth");
const { config, responses } = require("../data/store");

router.post("/config", auth, (req, res) => {
  const { redirectUrl, redirectTime } = req.body;

  if (
    typeof redirectUrl !== "string" ||
    typeof redirectTime !== "number"
  ) {
    return res.status(400).json({
      message: "Invalid configuration"
    });
  }

  config.redirectUrl = redirectUrl;
  config.redirectTime = redirectTime;

  res.status(200).json({
    message: "Configuration updated successfully"
  });
});

router.get("/responses", auth, (req, res) => {
  res.status(200).json(responses);
});

module.exports = router;
