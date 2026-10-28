// CampusFest backend: Express (Node.js) server + MongoDB (via Mongoose).
// It provides the REST API under /api and also serves the built React website.
require('dotenv').config();
const path = require('path');
const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const User = require('./models/User');
const Event = require('./models/Event');
const Registration = require('./models/Registration');
const Feedback = require('./models/Feedback');

const app = express();
const PORT = process.env.PORT || 5000;
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/campusfest';

app.use(express.json()); // lets us read JSON sent by the React forms

// Turns a Mongoose validation error into a simple message for the user
function errorMessage(err) {
  if (err.name === 'ValidationError') {
    return Object.values(err.errors).map((e) => e.message).join(', ');
  }
  return err.message || 'Something went wrong';
}

// ---------------- EVENTS ----------------
app.get('/api/events', async (req, res) => {
  const events = await Event.find().sort({ date: 1 });
  res.json(events);
});

// ---------------- FORM 1: SIGN UP ----------------
app.post('/api/signup', async (req, res) => {
  try {
    const { name, email, phone, department, password } = req.body;
    // Server-side validation (never trust only the browser)
    if (!password || password.length < 8 || !/[A-Za-z]/.test(password) || !/\d/.test(password)) {
      return res.status(400).json({ error: 'Password must be at least 8 characters with letters and numbers' });
    }
    if (await User.findOne({ email: String(email).toLowerCase() })) {
      return res.status(400).json({ error: 'An account with this email already exists' });
    }
    const hashed = await bcrypt.hash(password, 10);
    const user = await User.create({ name, email, phone, department, password: hashed });
    res.status(201).json({ message: 'Account created successfully', user: { name: user.name, email: user.email } });
  } catch (err) {
    res.status(400).json({ error: errorMessage(err) });
  }
});

// ---------------- FORM 2: LOGIN ----------------
app.post('/api/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ error: 'Email and password are required' });
    const user = await User.findOne({ email: String(email).toLowerCase() });
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }
    res.json({ message: 'Login successful', user: { name: user.name, email: user.email } });
  } catch (err) {
    res.status(400).json({ error: errorMessage(err) });
  }
});

// ---------------- FORM 3: EVENT REGISTRATION ----------------
app.post('/api/registrations', async (req, res) => {
  try {
    const { name, email, rollNo, year, eventId, teamSize } = req.body;
    if (!mongoose.isValidObjectId(eventId)) return res.status(400).json({ error: 'Please select a valid event' });
    const event = await Event.findById(eventId);
    if (!event) return res.status(400).json({ error: 'Event not found' });
    if (Number(teamSize) > event.maxTeamSize) {
      return res.status(400).json({ error: `Maximum team size for ${event.title} is ${event.maxTeamSize}` });
    }
    const reg = await Registration.create({ name, email, rollNo, year, event: eventId, teamSize });
    res.status(201).json({ message: `Registered for ${event.title}!`, registration: reg });
  } catch (err) {
    if (err.code === 11000) return res.status(400).json({ error: 'You have already registered for this event' });
    res.status(400).json({ error: errorMessage(err) });
  }
});

// List of all registrations (shown on the "Registrations" page)
app.get('/api/registrations', async (req, res) => {
  const regs = await Registration.find().populate('event', 'title').sort({ createdAt: -1 });
  res.json(regs.map((r) => ({
    _id: r._id,
    name: r.name,
    rollNo: r.rollNo,
    year: r.year,
    teamSize: r.teamSize,
    event: r.event ? r.event.title : 'Deleted event',
    createdAt: r.createdAt,
  })));
});

// ---------------- FORM 4: CONTACT / FEEDBACK ----------------
app.post('/api/feedback', async (req, res) => {
  try {
    const { name, email, subject, rating, message } = req.body;
    await Feedback.create({ name, email, subject, rating, message });
    res.status(201).json({ message: 'Thank you! Your feedback has been received.' });
  } catch (err) {
    res.status(400).json({ error: errorMessage(err) });
  }
});

// Simple statistics for the home page
app.get('/api/stats', async (req, res) => {
  const [users, events, registrations, feedback] = await Promise.all([
    User.countDocuments(), Event.countDocuments(), Registration.countDocuments(), Feedback.countDocuments(),
  ]);
  res.json({ users, events, registrations, feedback });
});

// ---------------- SERVE THE REACT WEBSITE ----------------
const clientBuild = path.join(__dirname, '..', 'client', 'dist');
app.use(express.static(clientBuild));
// Any other URL (e.g. /signup) returns index.html so React Router can show the right page
app.get('*', (req, res) => res.sendFile(path.join(clientBuild, 'index.html')));

// Adds some sample events the first time the database is empty
async function seedEvents() {
  if ((await Event.countDocuments()) > 0) return;
  await Event.insertMany([
    { title: 'Hackathon 2026', category: 'Technical', date: '2026-11-20', venue: 'Computer Lab 3', maxTeamSize: 4,
      description: '24-hour coding marathon. Build a working project with your team and win exciting prizes.' },
    { title: 'Web Design Challenge', category: 'Technical', date: '2026-11-22', venue: 'Seminar Hall', maxTeamSize: 2,
      description: 'Design and build a responsive website on a theme announced on the spot.' },
    { title: 'Tech Quiz', category: 'Technical', date: '2026-11-25', venue: 'Room 501', maxTeamSize: 2,
      description: 'Test your knowledge of computers, programming and the latest technology.' },
    { title: 'Battle of Bands', category: 'Cultural', date: '2026-12-02', venue: 'Main Auditorium', maxTeamSize: 4,
      description: 'Show off your music skills on the big stage in front of the whole college.' },
    { title: 'Photography Contest', category: 'Cultural', date: '2026-12-05', venue: 'Campus Grounds', maxTeamSize: 1,
      description: 'Capture the spirit of the campus. Best photos will be displayed in the exhibition.' },
    { title: 'Box Cricket', category: 'Sports', date: '2026-12-08', venue: 'College Ground', maxTeamSize: 4,
      description: 'Fast-paced short-format cricket tournament between departments.' },
  ]);
  console.log('Sample events added to the database');
}

mongoose
  .connect(MONGODB_URI)
  .then(async () => {
    console.log('Connected to MongoDB');
    await seedEvents();
    app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
  })
  .catch((err) => {
    console.error('MongoDB connection failed:', err.message);
    process.exit(1);
  });
