require("dotenv").config();

const express = require("express");
const cors = require("cors");
const path = require("path");

const app = express();
const userRoutes = require("./routes/userRoutes");
const adminRoutes = require("./routes/adminRoutes");
const linkRoutes = require("./routes/linkRoutes");
const resolveRoutes = require("./routes/resolveRoutes");

app.use(cors());
app.use(express.json());

app.use(express.static(path.join(__dirname, "../client")));

app.use("/", userRoutes);
app.use("/admin", adminRoutes);
app.use("/", linkRoutes);
app.use("/", resolveRoutes);

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
