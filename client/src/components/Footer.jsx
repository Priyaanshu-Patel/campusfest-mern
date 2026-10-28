export default function Footer() {
  return (
    <footer className="bg-dark text-white-50 py-3 mt-5">
      <div className="container text-center small">
        © {new Date().getFullYear()} CampusFest · Web Programming Mini Project · Built with MongoDB, Express, React &amp; Node.js
      </div>
    </footer>
  );
}
