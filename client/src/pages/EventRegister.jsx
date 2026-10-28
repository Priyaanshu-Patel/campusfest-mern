// FORM 3: EVENT REGISTRATION (with validation)
import { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { getJSON, postJSON } from '../api';

function validate(f, selectedEvent) {
  const errors = {};
  if (!/^[A-Za-z ]{3,50}$/.test(f.name.trim())) errors.name = 'Name must be 3-50 letters only';
  if (!/^\S+@\S+\.\S+$/.test(f.email)) errors.email = 'Enter a valid email address';
  if (!/^[A-Za-z]\d{3}$/.test(f.rollNo)) errors.rollNo = 'Roll number must be 1 letter followed by 3 digits (e.g. C084)';
  if (!f.year) errors.year = 'Please select your year';
  if (!f.eventId) errors.eventId = 'Please select an event';
  const size = Number(f.teamSize);
  const max = selectedEvent ? selectedEvent.maxTeamSize : 4;
  if (!Number.isInteger(size) || size < 1 || size > max) errors.teamSize = `Team size must be between 1 and ${max}`;
  return errors;
}

export default function EventRegister({ user }) {
  const [searchParams] = useSearchParams(); // reads ?event=... from the URL (set by the Home page buttons)
  const [events, setEvents] = useState([]);
  const [form, setForm] = useState({
    name: user?.name || '',
    email: user?.email || '',
    rollNo: '',
    year: '',
    eventId: searchParams.get('event') || '',
    teamSize: 1,
  });
  const [errors, setErrors] = useState({});
  const [status, setStatus] = useState(null); // { type: 'success' | 'danger', text: '...' }
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    getJSON('/api/events').then(setEvents).catch((e) => setStatus({ type: 'danger', text: e.message }));
  }, []);

  const selectedEvent = events.find((ev) => ev._id === form.eventId);

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: '' });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    const errs = validate(form, selectedEvent);
    setErrors(errs);
    if (Object.keys(errs).length > 0) return;

    setLoading(true);
    setStatus(null);
    try {
      const data = await postJSON('/api/registrations', { ...form, rollNo: form.rollNo.toUpperCase(), teamSize: Number(form.teamSize) });
      setStatus({ type: 'success', text: data.message });
      setForm({ ...form, rollNo: '', year: '', eventId: '', teamSize: 1 });
    } catch (err) {
      setStatus({ type: 'danger', text: err.message });
    } finally {
      setLoading(false);
    }
  }

  const cls = (field, base = 'form-control') => `${base} ${errors[field] ? 'is-invalid' : ''}`;

  return (
    <div className="container">
      <div className="card form-card border-0 shadow">
        <div className="card-body p-4">
          <h2 className="mb-1">Event Registration</h2>
          <p className="text-muted">Fill in your details to take part in an event.</p>
          {!user && <div className="alert alert-info py-2 small">Tip: <Link to="/login">log in</Link> to auto-fill your name and email.</div>}
          {status && (
            <div className={`alert alert-${status.type}`}>
              {status.text} {status.type === 'success' && <Link to="/registrations">View all registrations</Link>}
            </div>
          )}

          <form onSubmit={handleSubmit} noValidate>
            <div className="mb-3">
              <label htmlFor="name" className="form-label">Full Name</label>
              <input id="name" name="name" type="text" className={cls('name')} value={form.name} onChange={handleChange} required />
              <div className="invalid-feedback">{errors.name}</div>
            </div>
            <div className="mb-3">
              <label htmlFor="email" className="form-label">Email</label>
              <input id="email" name="email" type="email" className={cls('email')} value={form.email} onChange={handleChange} required />
              <div className="invalid-feedback">{errors.email}</div>
            </div>
            <div className="row">
              <div className="col-md-6 mb-3">
                <label htmlFor="rollNo" className="form-label">Roll Number</label>
                <input id="rollNo" name="rollNo" type="text" className={cls('rollNo')} value={form.rollNo} onChange={handleChange}
                  required pattern="[A-Za-z][0-9]{3}" maxLength={4} placeholder="C084" />
                <div className="invalid-feedback">{errors.rollNo}</div>
              </div>
              <div className="col-md-6 mb-3">
                <label htmlFor="year" className="form-label">Year</label>
                <select id="year" name="year" className={cls('year', 'form-select')} value={form.year} onChange={handleChange} required>
                  <option value="">-- Select --</option>
                  <option value="FE">First Year (FE)</option>
                  <option value="SE">Second Year (SE)</option>
                  <option value="TE">Third Year (TE)</option>
                  <option value="BE">Final Year (BE)</option>
                </select>
                <div className="invalid-feedback">{errors.year}</div>
              </div>
            </div>
            <div className="mb-3">
              <label htmlFor="eventId" className="form-label">Event</label>
              <select id="eventId" name="eventId" className={cls('eventId', 'form-select')} value={form.eventId} onChange={handleChange} required>
                <option value="">-- Select an event --</option>
                {events.map((ev) => (
                  <option key={ev._id} value={ev._id}>{ev.title} ({ev.category})</option>
                ))}
              </select>
              <div className="invalid-feedback">{errors.eventId}</div>
            </div>
            <div className="mb-3">
              <label htmlFor="teamSize" className="form-label">Team Size</label>
              <input id="teamSize" name="teamSize" type="number" className={cls('teamSize')} value={form.teamSize}
                onChange={handleChange} required min={1} max={selectedEvent ? selectedEvent.maxTeamSize : 4} />
              {selectedEvent && <div className="form-text">Maximum {selectedEvent.maxTeamSize} for this event.</div>}
              <div className="invalid-feedback">{errors.teamSize}</div>
            </div>
            <button type="submit" className="btn btn-brand w-100" disabled={loading}>
              {loading ? 'Registering...' : 'Register'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
