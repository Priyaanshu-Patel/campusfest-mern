// FORM 1: SIGN UP (with validation)
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { postJSON } from '../api';

const emptyForm = { name: '', email: '', phone: '', department: '', password: '', confirmPassword: '', terms: false };

// Checks every field and returns an object of error messages (empty object = all good)
function validate(f) {
  const errors = {};
  if (!/^[A-Za-z ]{3,50}$/.test(f.name.trim())) errors.name = 'Name must be 3-50 letters only';
  if (!/^\S+@\S+\.\S+$/.test(f.email)) errors.email = 'Enter a valid email address';
  if (!/^[6-9]\d{9}$/.test(f.phone)) errors.phone = 'Enter a valid 10-digit mobile number';
  if (!f.department) errors.department = 'Please select your department';
  if (f.password.length < 8 || !/[A-Za-z]/.test(f.password) || !/\d/.test(f.password)) {
    errors.password = 'Password must be at least 8 characters with letters and numbers';
  }
  if (!f.confirmPassword) errors.confirmPassword = 'Please confirm your password';
  else if (f.confirmPassword !== f.password) errors.confirmPassword = 'Passwords do not match';
  if (!f.terms) errors.terms = 'You must accept the terms';
  return errors;
}

export default function Signup() {
  const [form, setForm] = useState(emptyForm);
  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // Update the field the user is typing in, and clear its error
  function handleChange(e) {
    const { name, value, type, checked } = e.target;
    setForm({ ...form, [name]: type === 'checkbox' ? checked : value });
    setErrors({ ...errors, [name]: '' });
  }

  async function handleSubmit(e) {
    e.preventDefault(); // stop the browser from reloading the page
    const errs = validate(form);
    setErrors(errs);
    if (Object.keys(errs).length > 0) return; // stop if there are errors

    setLoading(true);
    setServerError('');
    try {
      await postJSON('/api/signup', form);
      navigate('/login', { state: { message: 'Account created! Please log in.', email: form.email } });
    } catch (err) {
      setServerError(err.message);
    } finally {
      setLoading(false);
    }
  }

  // Helper: Bootstrap shows red border when the field has the "is-invalid" class
  const cls = (field) => `form-control ${errors[field] ? 'is-invalid' : ''}`;

  return (
    <div className="container">
      <div className="card form-card border-0 shadow">
        <div className="card-body p-4">
          <h2 className="mb-1">Create Account</h2>
          <p className="text-muted">Sign up to register for college events.</p>
          {serverError && <div className="alert alert-danger">{serverError}</div>}

          <form onSubmit={handleSubmit} noValidate>
            <div className="mb-3">
              <label htmlFor="name" className="form-label">Full Name</label>
              <input id="name" name="name" type="text" className={cls('name')} value={form.name} onChange={handleChange}
                required minLength={3} maxLength={50} placeholder="e.g. Rahul Sharma" />
              <div className="invalid-feedback">{errors.name}</div>
            </div>

            <div className="mb-3">
              <label htmlFor="email" className="form-label">Email</label>
              <input id="email" name="email" type="email" className={cls('email')} value={form.email} onChange={handleChange}
                required placeholder="you@example.com" />
              <div className="invalid-feedback">{errors.email}</div>
            </div>

            <div className="row">
              <div className="col-md-6 mb-3">
                <label htmlFor="phone" className="form-label">Mobile Number</label>
                <input id="phone" name="phone" type="tel" className={cls('phone')} value={form.phone} onChange={handleChange}
                  required pattern="[6-9][0-9]{9}" maxLength={10} placeholder="9876543210" />
                <div className="invalid-feedback">{errors.phone}</div>
              </div>
              <div className="col-md-6 mb-3">
                <label htmlFor="department" className="form-label">Department</label>
                <select id="department" name="department" className={`form-select ${errors.department ? 'is-invalid' : ''}`}
                  value={form.department} onChange={handleChange} required>
                  <option value="">-- Select --</option>
                  <option>Computer Engineering</option>
                  <option>Information Technology</option>
                  <option>Electronics</option>
                  <option>Mechanical</option>
                  <option>Civil</option>
                </select>
                <div className="invalid-feedback">{errors.department}</div>
              </div>
            </div>

            <div className="mb-3">
              <label htmlFor="password" className="form-label">Password</label>
              <input id="password" name="password" type="password" className={cls('password')} value={form.password}
                onChange={handleChange} required minLength={8} autoComplete="new-password" />
              <div className="form-text">At least 8 characters, with letters and numbers.</div>
              <div className="invalid-feedback">{errors.password}</div>
            </div>

            <div className="mb-3">
              <label htmlFor="confirmPassword" className="form-label">Confirm Password</label>
              <input id="confirmPassword" name="confirmPassword" type="password" className={cls('confirmPassword')}
                value={form.confirmPassword} onChange={handleChange} required autoComplete="new-password" />
              <div className="invalid-feedback">{errors.confirmPassword}</div>
            </div>

            <div className="form-check mb-3">
              <input id="terms" name="terms" type="checkbox" className={`form-check-input ${errors.terms ? 'is-invalid' : ''}`}
                checked={form.terms} onChange={handleChange} required />
              <label htmlFor="terms" className="form-check-label">I agree to follow the event rules</label>
              <div className="invalid-feedback">{errors.terms}</div>
            </div>

            <button type="submit" className="btn btn-brand w-100" disabled={loading}>
              {loading ? 'Creating account...' : 'Sign Up'}
            </button>
          </form>
          <p className="text-center mt-3 mb-0">Already have an account? <Link to="/login">Log in</Link></p>
        </div>
      </div>
    </div>
  );
}
