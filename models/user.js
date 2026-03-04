const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: String,
  email: {
    type: String,
    unique: true
  },
  password: String,
  role: {
    type: String,
    enum: ["jobseeker", "recruiter", "admin"],
    default: "jobseeker"
  },
  skills: {
    type: String,
    default: ""
  },
  education: {
    type: String,
    default: ""
  },
  about: {
    type: String,
    default: ""
  },
  profileImage: {
    type: String
  },
  resume: {
    type: String
  }
});

module.exports = mongoose.model("User", userSchema);
