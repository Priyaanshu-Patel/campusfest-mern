// FORM 2: LOGIN (with validation)
import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { postJSON } from '../api';

function validate(f) {
  const errors = {};
  if (!/^\S+@\S+\.\S+$/.test(f.email)) errors.email = 'Enter a valid email address';
  if (!f.password) errors.password = 'Password is required';
  return errors;
}

export default function Login({ onLogin }) {
  const location = useLocation(); // used to show the "Account created" message after sign up
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: location.state?.email || '', password: '' });
  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState('');
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
    setServerError('');
    try {
      const data = await postJSON('/api/login', form);
      onLogin(data.user);
      navigate('/register');
    } catch (err) {
      setServerError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="container">
      <div className="card form-card border-0 shadow">
        <div className="card-body p-4">
          <h2 className="mb-1">Login</h2>
          <p className="text-muted">Welcome back! Log in to your account.</p>
          {location.state?.message && !serverError && <div className="alert alert-success">{location.state.message}</div>}
          {serverError && <div className="alert alert-danger">{serverError}</div>}

          <form onSubmit={handleSubmit} noValidate>
            <div className="mb-3">
              <label htmlFor="email" className="form-label">Email</label>
              <input id="email" name="email" type="email" className={`form-control ${errors.email ? 'is-invalid' : ''}`}
                value={form.email} onChange={handleChange} required autoComplete="email" />
              <div className="invalid-feedback">{errors.email}</div>
            </div>
            <div className="mb-3">
              <label htmlFor="password" className="form-label">Password</label>
              <input id="password" name="password" type="password" className={`form-control ${errors.password ? 'is-invalid' : ''}`}
                value={form.password} onChange={handleChange} required autoComplete="current-password" />
              <div className="invalid-feedback">{errors.password}</div>
            </div>
            <button type="submit" className="btn btn-brand w-100" disabled={loading}>
              {loading ? 'Logging in...' : 'Login'}
            </button>
          </form>
          <p className="text-center mt-3 mb-0">New here? <Link to="/signup">Create an account</Link></p>
        </div>
      </div>
    </div>
  );
}
