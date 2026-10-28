// User model: stores students who sign up on the website.
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true, minlength: 3, maxlength: 50 },
    email: {
      type: String,
      required: true,
      unique: true, // no two users can have the same email
      lowercase: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, 'Invalid email'],
    },
    phone: { type: String, required: true, match: [/^[6-9]\d{9}$/, 'Invalid phone'] },
    department: { type: String, required: true },
    password: { type: String, required: true }, // stored as a bcrypt hash, never plain text
  },
  { timestamps: true } // adds createdAt and updatedAt automatically
);

module.exports = mongoose.model('User', userSchema);
