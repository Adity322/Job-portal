const express = require("express");
const Application = require("../models/Application");
const Job = require("../models/Job");
const authMiddleware = require("../middleware/authMiddleware");
const multer = require("multer");
const path = require("path");

const router = express.Router();


// =======================
// 1️⃣ Multer Configuration
// =======================

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/");
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

const upload = multer({
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
  fileFilter: function (req, file, cb) {
    if (file.mimetype === "application/pdf") {
      cb(null, true);
    } else {
      cb(new Error("Only PDF files allowed"), false);
    }
  },
});


// =======================
// 2️⃣ Apply to Job
// =======================

router.post(
  "/apply/:jobId",
  authMiddleware,
  upload.single("resume"),
  async (req, res) => {
    try {
      if (req.user.role !== "jobseeker") {
        return res.status(403).json({ message: "Only jobseekers can apply" });
      }

      // Check duplicate application
      const existingApplication = await Application.findOne({
        job: req.params.jobId,
        applicant: req.user.id,
      });

      if (existingApplication) {
        return res.status(400).json({
          message: "You already applied to this job",
        });
      }

      // Check if job exists & approved
      const job = await Job.findById(req.params.jobId);
      if (!job || !job.approved) {
        return res.status(404).json({
          message: "Job not found or not approved",
        });
      }

      // Create application
      const application = await Application.create({
        job: req.params.jobId,
        applicant: req.user.id,
        resume: req.file ? req.file.filename : null,
      });

      res.status(201).json({
        message: "Applied successfully",
        application,
      });

    } catch (error) {
      console.error("APPLY ERROR:",error);
      res.status(500).json({ error: error.message });
    }
  }
);


// =======================
// 3️⃣ Withdraw Application
// =======================

router.delete("/withdraw/:jobId", authMiddleware, async (req, res) => {
  try {
    const application = await Application.findOneAndDelete({
      job: req.params.jobId,
      applicant: req.user.id,
    });

    if (!application) {
      return res.status(404).json({ message: "Application not found" });
    }

    res.json({ message: "Application withdrawn successfully" });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});


// =======================
// 4️⃣ Get My Applications
// =======================

router.get("/my", authMiddleware, async (req, res) => {
  try {
    const applications = await Application.find({
      applicant: req.user.id,
    }).populate("job");

    res.json(applications);

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});


// =======================
// 5️⃣ Recruiter: Get Applicants
// =======================

router.get("/job/:jobId", authMiddleware, async (req, res) => {
  try {
    if (req.user.role !== "recruiter") {
      return res.status(403).json({ message: "Only recruiters allowed" });
    }

    const applications = await Application.find({
      job: req.params.jobId,
    }).populate("applicant", "name email");

    res.json(applications);

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
// Approve application
router.put("/approve/:id", authMiddleware, async (req, res) => {
  try {
    const application = await Application.findById(req.params.id);

    if (!application) {
      return res.status(404).json({ message: "Application not found" });
    }

    application.status = "approved";
    await application.save();

    res.json({ message: "Application approved ✅" });

  } catch (err) {
    res.status(500).json({ message: "Error approving application" });
  }
});


// Reject application
router.put("/reject/:id", authMiddleware, async (req, res) => {
  try {
    const application = await Application.findById(req.params.id);

    if (!application) {
      return res.status(404).json({ message: "Application not found" });
    }

    application.status = "rejected";
    await application.save();

    res.json({ message: "Application rejected ❌" });

  } catch (err) {
    res.status(500).json({ message: "Error rejecting application" });
  }
});


router.get("/my", authMiddleware, async (req, res) => {
  try {
    const applications = await Application.find({
      applicant: req.user.id
    })
    .populate("job");

    res.json(applications);

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;