const express = require("express");
const cors = require("cors");
const path = require("path");

const app = express();

app.use(cors());
app.use(express.json());

app.use(express.static(path.join(__dirname, "../client")));

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "../client/index.html"));
});

app.get("/admin", (req, res) => {
  res.sendFile(path.join(__dirname, "../client/admin.html"));
});

const PORT = 3000;

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
