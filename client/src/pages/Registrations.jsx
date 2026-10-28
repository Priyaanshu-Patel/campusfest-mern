// REGISTRATIONS PAGE: shows data saved in MongoDB, with a search box
import { useEffect, useState } from 'react';
import { getJSON } from '../api';

export default function Registrations() {
  const [registrations, setRegistrations] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    getJSON('/api/registrations')
      .then(setRegistrations)
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, []);

  // Filter rows by name, roll number or event as the user types
  const q = search.toLowerCase();
  const shown = registrations.filter((r) =>
    [r.name, r.rollNo, r.event].some((v) => v.toLowerCase().includes(q))
  );

  return (
    <div className="container mt-5">
      <div className="d-flex flex-wrap justify-content-between align-items-center gap-2 mb-3">
        <h2 className="mb-0">Event Registrations</h2>
        <input type="search" className="form-control" style={{ maxWidth: 280 }} placeholder="Search name, roll no, event..."
          value={search} onChange={(e) => setSearch(e.target.value)} aria-label="Search registrations" />
      </div>
      {error && <div className="alert alert-danger">{error}</div>}
      {loading ? (
        <p>Loading...</p>
      ) : shown.length === 0 ? (
        <div className="alert alert-secondary">No registrations found.</div>
      ) : (
        <div className="table-responsive card border-0 shadow-sm">
          <table className="table table-hover align-middle mb-0">
            <thead className="table-light">
              <tr><th>#</th><th>Name</th><th>Roll No</th><th>Year</th><th>Event</th><th>Team Size</th><th>Registered On</th></tr>
            </thead>
            <tbody>
              {shown.map((r, i) => (
                <tr key={r._id}>
                  <td>{i + 1}</td>
                  <td>{r.name}</td>
                  <td>{r.rollNo}</td>
                  <td>{r.year}</td>
                  <td>{r.event}</td>
                  <td>{r.teamSize}</td>
                  <td>{new Date(r.createdAt).toLocaleDateString('en-IN')}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
