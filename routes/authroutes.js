const express = require("express");
const bcrypt = require("bcryptjs");
const User = require("../models/user");
const authMiddleware=require("../middleware/authMiddleware");
const router = express.Router();

const jwt = require("jsonwebtoken");
router.post("/register", async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    const allowedRoles = ["candidate", "recruiter", "admin"];

    const userRole = allowedRoles.includes(role)
      ? role
      : "candidate";

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      role: userRole
    });

    res.status(201).json({
      message: "User registered successfully"
    });

  } catch (error) {
    res.status(400).json({
      error: error.message
    });
  }
});
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    console.log("Email entered:", email);

    const user = await User.findOne({ email });

    console.log("User found:", user);

    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }

    console.log("Entered password:", password);
    console.log("Stored password:", user.password);

    const isMatch = await bcrypt.compare(password, user.password);

    console.log("Password match result:", isMatch);

    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );
    console.log("Generated Token:",token);

    res.json({
      message: "Login successful",
      token
    });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.put("/profile", authMiddleware, async (req, res) => {
  try {
    const { skills, education, about } = req.body;

    const user = await User.findByIdAndUpdate(
      req.user.id,
      { skills, education, about },
      { new: true }
    );

    res.json(user);

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
module.exports = router;