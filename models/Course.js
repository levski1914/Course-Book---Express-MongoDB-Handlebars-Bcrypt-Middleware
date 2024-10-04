const mongoose = require("mongoose");

const courseSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  type: {
    type: String,
    required: true,
  },
  certificate: {
    type: String,
    required: true,
  },
  image: {
    type: String,
    required: true,
    match: /^https?:\/\//,
  },
  description: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  signUpList: [
    { type: mongoose.Schema.Types.ObjectId, ref: "User", default: [] },
  ],
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
});

const Course = mongoose.model("Course", courseSchema);

module.exports = Course;
