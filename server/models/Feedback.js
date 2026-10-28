// Feedback model: messages sent through the Contact / Feedback form.
const mongoose = require('mongoose');

const feedbackSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true, minlength: 3 },
    email: { type: String, required: true, lowercase: true, trim: true, match: /^\S+@\S+\.\S+$/ },
    subject: { type: String, required: true, trim: true, minlength: 5, maxlength: 100 },
    rating: { type: Number, required: true, min: 1, max: 5 },
    message: { type: String, required: true, trim: true, minlength: 20, maxlength: 500 },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Feedback', feedbackSchema);
