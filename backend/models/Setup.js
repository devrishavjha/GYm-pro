const mongoose = require("mongoose");

const setupSchema = new mongoose.Schema({
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  gymName: {
    type: String,
    required: true,
  },
  logo: {
    type: String, 
  },
  capacity: {
    type: Number,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Setup", setupSchema);
