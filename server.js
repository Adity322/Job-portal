require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");


const app = express();

// ===================
// Middleware
// ===================
app.use(cors());
app.use(express.json());

// ✅ Add THIS LINE HERE
app.use("/uploads", express.static("uploads"));


// ===================
// Test route
// ===================
app.get("/", (req, res) => {
  res.send("Server Running Successfully 🚀");
});

// Connect MongoDB
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB Connected ✅"))
  .catch((err) => console.log("Mongo Error:", err));

app.post("/debug", (req, res) => {
  res.send("Debug route working");
});


// ===================
// Routes
// ===================
const authRoutes = require("./routes/authroutes");
app.use("/api/auth", authRoutes);

const jobRoutes = require("./routes/jobRoutes");
app.use("/api/jobs", jobRoutes);

const applicationRoutes = require("./routes/applicationRoutes");
app.use("/api/applications", applicationRoutes);


// Protected route
const authMiddleware = require("./middleware/authMiddleware");
app.get("/protected", authMiddleware, (req, res) => {
  res.json({
    message: "Protected route accessed",
    user: req.user
  });
});


// ===================
// Server
// ===================
app.listen(8000, () => {
  console.log("Server started on port 8000 🚀");
});
console.log("JWT_SECRET:",process.env.JWT_SECRET);