const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const connectDB = require("./config/db");
const authRoutes = require("./routes/auth");
const userRoutes = require("./routes/user");
const requestRoutes = require("./routes/request");
const matchRoutes = require("./routes/match");


dotenv.config();
connectDB();

const app = express();

app.use(express.json());
app.use(cors());

app.use("/api/user", userRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/request", requestRoutes);
app.use("/api/match", matchRoutes);
app.get("/", (req, res) => {
  res.send("API running...");
});

app.listen(5000, () => {
  console.log("Server running on port 5000");
});
