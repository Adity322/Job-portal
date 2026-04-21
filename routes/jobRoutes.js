const express = require("express");
const Job = require("../models/Job");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

console.log("Job Routes Loaded");

// TEST ROUTE
router.get("/test", (req, res) => {
  res.send("Job route working");
});

// =============================
// Recruiter posts job
// =============================
router.post("/post", authMiddleware, async (req, res) => {
  try {
    if (req.user.role !== "recruiter") {
      return res.status(403).json({ message: "Only recruiters can post jobs" });
    }

    const { title, description, company, location } = req.body;

    const job = await Job.create({
      title,
      description,
      company,
      location,
      postedBy: req.user.id
    });

    res.status(201).json({
      message: "Job posted successfully (awaiting admin approval)",
      job
    });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// =============================
// Admin approves job
// =============================
router.put("/approve/:id", authMiddleware, async (req, res) => {
  try {
    if (req.user.role !== "admin") {
      return res.status(403).json({ message: "Only admin can approve jobs" });
    }

    const job = await Job.findByIdAndUpdate(
      req.params.id,
      { approved: true },
      { new: true }
    );

    if (!job) {
      return res.status(404).json({ message: "Job not found" });
    }

    res.json({
      message: "Job approved successfully",
      job
    });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
// =============================
// Get jobs posted by logged-in recruiter
// =============================
router.get("/my", authMiddleware, async (req, res) => {
  try {
    if (req.user.role !== "recruiter") {
      return res.status(403).json({ message: "Only recruiters allowed" });
    }

    const jobs = await Job.find({
      postedBy: req.user.id
    });

    res.json(jobs);

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
// Get approved jobs (public)
router.get("/", async (req, res) => {
  const jobs = await Job.find({ approved: true }).populate("postedBy", "name email");
  res.json(jobs);
});
// Get all unapproved jobs (admin only)
router.get("/pending", authMiddleware, async (req, res) => {
  try {
    if (req.user.role !== "admin") {
      return res.status(403).json({ message: "Only admin allowed" });
    }

    const jobs = await Job.find({ approved: false });

    res.json(jobs);

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
// =============================
// Admin Stats
// =============================
const User = require("../models/user");

router.get("/stats", authMiddleware, async (req, res) => {
  try {
    if (req.user.role !== "admin") {
      return res.status(403).json({ message: "Only admin allowed" });
    }

    const users = await User.countDocuments();
    const recruiters = await User.countDocuments({ role: "recruiter" });
    const jobs = await Job.countDocuments();

    res.json({ users, recruiters, jobs });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;