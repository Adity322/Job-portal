const mongoose = require("mongoose");

const jobSchema = new mongoose.Schema({
  title: String,
  description: String,
  company: String,
  location: String,
  postedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  },
  approved: {
    type: Boolean,
    default: false
  }
}, { timestamps: true });

module.exports = mongoose.model("Job", jobSchema);