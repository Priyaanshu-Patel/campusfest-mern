// HOME PAGE: banner, live statistics from the database, and the list of events
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getJSON } from '../api';

const categoryColors = { Technical: 'primary', Cultural: 'danger', Sports: 'success' };

export default function Home() {
  const [events, setEvents] = useState([]);
  const [stats, setStats] = useState(null);
  const [error, setError] = useState('');

  // Runs once when the page opens: load events and stats from the backend
  useEffect(() => {
    getJSON('/api/events').then(setEvents).catch((e) => setError(e.message));
    getJSON('/api/stats').then(setStats).catch(() => {});
  }, []);

  return (
    <>
      <section className="hero text-center">
        <div className="container">
          <h1 className="display-4 fw-bold">CampusFest 2026</h1>
          <p className="lead mb-4">One place to discover, register and take part in all college events.</p>
          <Link to="/register" className="btn btn-light btn-lg me-2">Register Now</Link>
          <Link to="/signup" className="btn btn-outline-light btn-lg">Create Account</Link>
        </div>
      </section>

      {stats && (
        <section className="container">
          <div className="row g-3 text-center mt-3">
            {[['Events', stats.events], ['Students', stats.users], ['Registrations', stats.registrations], ['Feedback', stats.feedback]].map(([label, value]) => (
              <div className="col-6 col-md-3" key={label}>
                <div className="card border-0 shadow-sm py-3">
                  <div className="stat-number">{value}</div>
                  <div className="text-muted">{label}</div>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      <section className="container mt-5">
        <h2 className="mb-4 text-center">Upcoming Events</h2>
        {error && <div className="alert alert-danger">{error}</div>}
        <div className="row g-4">
          {events.map((ev) => (
            <div className="col-md-6 col-lg-4" key={ev._id}>
              <article className="card h-100 border-0 shadow-sm event-card">
                <div className="card-body d-flex flex-column">
                  <span className={`badge bg-${categoryColors[ev.category] || 'secondary'} align-self-start mb-2`}>{ev.category}</span>
                  <h5 className="card-title">{ev.title}</h5>
                  <p className="card-text text-muted flex-grow-1">{ev.description}</p>
                  <ul className="list-unstyled small mb-3">
                    <li>📅 {new Date(ev.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}</li>
                    <li>📍 {ev.venue}</li>
                    <li>👥 Team of up to {ev.maxTeamSize}</li>
                  </ul>
                  <Link to={`/register?event=${ev._id}`} className="btn btn-brand">Register</Link>
                </div>
              </article>
            </div>
          ))}
        </div>
      </section>

      <section className="container mt-5">
        <div className="row g-4 text-center">
          <div className="col-md-4"><h5>1. Sign Up</h5><p className="text-muted">Create your free student account.</p></div>
          <div className="col-md-4"><h5>2. Pick an Event</h5><p className="text-muted">Choose from technical, cultural and sports events.</p></div>
          <div className="col-md-4"><h5>3. Participate</h5><p className="text-muted">Show up on the day and have fun!</p></div>
        </div>
      </section>
    </>
  );
}
