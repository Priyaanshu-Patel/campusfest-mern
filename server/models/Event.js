// Event model: the events shown on the website (seeded automatically on first run).
const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema({
  title: { type: String, required: true },
  category: { type: String, required: true },
  date: { type: Date, required: true },
  venue: { type: String, required: true },
  description: { type: String, required: true },
  maxTeamSize: { type: Number, default: 1 },
});

module.exports = mongoose.model('Event', eventSchema);
