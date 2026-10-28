// FORM 4: CONTACT / FEEDBACK (with validation)
import { useState } from 'react';
import { postJSON } from '../api';

function validate(f) {
  const errors = {};
  if (!/^[A-Za-z ]{3,50}$/.test(f.name.trim())) errors.name = 'Name must be 3-50 letters only';
  if (!/^\S+@\S+\.\S+$/.test(f.email)) errors.email = 'Enter a valid email address';
  if (f.subject.trim().length < 5) errors.subject = 'Subject must be at least 5 characters';
  if (!f.rating) errors.rating = 'Please give a rating';
  if (f.message.trim().length < 20) errors.message = 'Message must be at least 20 characters';
  return errors;
}

export default function Contact({ user }) {
  const emptyForm = { name: user?.name || '', email: user?.email || '', subject: '', rating: '', message: '' };
  const [form, setForm] = useState(emptyForm);
  const [errors, setErrors] = useState({});
  const [status, setStatus] = useState(null);
  const [loading, setLoading] = useState(false);

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: '' });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    const errs = validate(form);
    setErrors(errs);
    if (Object.keys(errs).length > 0) return;

    setLoading(true);
    setStatus(null);
    try {
      const data = await postJSON('/api/feedback', { ...form, rating: Number(form.rating) });
      setStatus({ type: 'success', text: data.message });
      setForm(emptyForm);
    } catch (err) {
      setStatus({ type: 'danger', text: err.message });
    } finally {
      setLoading(false);
    }
  }

  const cls = (field) => `form-control ${errors[field] ? 'is-invalid' : ''}`;

  return (
    <div className="container">
      <div className="row justify-content-center">
        <div className="col-lg-4 mt-5">
          <h2>Get in Touch</h2>
          <p className="text-muted">Questions about an event, or ideas to make CampusFest better? Send us a message.</p>
          <ul className="list-unstyled">
            <li>📍 Student Council Office, Ground Floor</li>
            <li>✉️ campusfest@college.edu</li>
            <li>🕘 Mon–Fri, 9 AM – 5 PM</li>
          </ul>
        </div>
        <div className="col-lg-6">
          <div className="card form-card border-0 shadow">
            <div className="card-body p-4">
              <h3 className="mb-3">Feedback Form</h3>
              {status && <div className={`alert alert-${status.type}`}>{status.text}</div>}
              <form onSubmit={handleSubmit} noValidate>
                <div className="row">
                  <div className="col-md-6 mb-3">
                    <label htmlFor="name" className="form-label">Name</label>
                    <input id="name" name="name" type="text" className={cls('name')} value={form.name} onChange={handleChange} required />
                    <div className="invalid-feedback">{errors.name}</div>
                  </div>
                  <div className="col-md-6 mb-3">
                    <label htmlFor="email" className="form-label">Email</label>
                    <input id="email" name="email" type="email" className={cls('email')} value={form.email} onChange={handleChange} required />
                    <div className="invalid-feedback">{errors.email}</div>
                  </div>
                </div>
                <div className="mb-3">
                  <label htmlFor="subject" className="form-label">Subject</label>
                  <input id="subject" name="subject" type="text" className={cls('subject')} value={form.subject}
                    onChange={handleChange} required minLength={5} maxLength={100} />
                  <div className="invalid-feedback">{errors.subject}</div>
                </div>
                <div className="mb-3">
                  <label className="form-label d-block">Rate your experience</label>
                  {[1, 2, 3, 4, 5].map((n) => (
                    <div className="form-check form-check-inline" key={n}>
                      <input className={`form-check-input ${errors.rating ? 'is-invalid' : ''}`} type="radio" name="rating"
                        id={`rating${n}`} value={n} checked={form.rating === String(n)} onChange={handleChange} required />
                      <label className="form-check-label" htmlFor={`rating${n}`}>{'★'.repeat(n)}</label>
                    </div>
                  ))}
                  {errors.rating && <div className="text-danger small">{errors.rating}</div>}
                </div>
                <div className="mb-3">
                  <label htmlFor="message" className="form-label">Message</label>
                  <textarea id="message" name="message" rows={4} className={cls('message')} value={form.message}
                    onChange={handleChange} required minLength={20} maxLength={500} />
                  <div className="form-text">{form.message.length}/500 characters</div>
                  <div className="invalid-feedback">{errors.message}</div>
                </div>
                <button type="submit" className="btn btn-brand w-100" disabled={loading}>
                  {loading ? 'Sending...' : 'Send Feedback'}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
