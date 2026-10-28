// Registration model: one document per student registering for an event.
const mongoose = require('mongoose');

const registrationSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true, minlength: 3 },
    email: { type: String, required: true, lowercase: true, trim: true, match: /^\S+@\S+\.\S+$/ },
    rollNo: { type: String, required: true, uppercase: true, match: /^[A-Z]\d{3}$/ },
    year: { type: String, required: true, enum: ['FE', 'SE', 'TE', 'BE'] },
    event: { type: mongoose.Schema.Types.ObjectId, ref: 'Event', required: true },
    teamSize: { type: Number, required: true, min: 1, max: 4 },
  },
  { timestamps: true }
);

// A student (email) can register for the same event only once
registrationSchema.index({ email: 1, event: 1 }, { unique: true });

module.exports = mongoose.model('Registration', registrationSchema);
