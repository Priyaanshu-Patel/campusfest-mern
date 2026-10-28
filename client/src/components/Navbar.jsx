import { Link, NavLink, useNavigate } from 'react-router-dom';

export default function Navbar({ user, onLogout }) {
  const navigate = useNavigate();

  function handleLogout() {
    onLogout();
    navigate('/');
  }

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-primary-custom sticky-top shadow-sm">
      <div className="container">
        <Link className="navbar-brand fw-bold" to="/">🎉 CampusFest</Link>
        <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#mainNav"
          aria-controls="mainNav" aria-expanded="false" aria-label="Toggle navigation">
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="mainNav">
          <ul className="navbar-nav me-auto">
            <li className="nav-item"><NavLink className="nav-link" to="/" end>Home</NavLink></li>
            <li className="nav-item"><NavLink className="nav-link" to="/register">Register for Event</NavLink></li>
            <li className="nav-item"><NavLink className="nav-link" to="/registrations">Registrations</NavLink></li>
            <li className="nav-item"><NavLink className="nav-link" to="/contact">Contact</NavLink></li>
          </ul>
          {user ? (
            <div className="d-flex align-items-center gap-2">
              <span className="text-white">Hi, {user.name}</span>
              <button className="btn btn-light btn-sm" onClick={handleLogout}>Logout</button>
            </div>
          ) : (
            <div className="d-flex gap-2">
              <Link className="btn btn-outline-light btn-sm" to="/login">Login</Link>
              <Link className="btn btn-light btn-sm" to="/signup">Sign Up</Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}
