// App: holds the logged-in user and decides which page to show for each URL
import { useState } from 'react';
import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import Signup from './pages/Signup';
import Login from './pages/Login';
import EventRegister from './pages/EventRegister';
import Registrations from './pages/Registrations';
import Contact from './pages/Contact';

export default function App() {
  // Remember the logged-in user even after page refresh (saved in the browser)
  const [user, setUser] = useState(() => JSON.parse(localStorage.getItem('user') || 'null'));

  function login(u) {
    localStorage.setItem('user', JSON.stringify(u));
    setUser(u);
  }
  function logout() {
    localStorage.removeItem('user');
    setUser(null);
  }

  return (
    <div className="d-flex flex-column min-vh-100">
      <Navbar user={user} onLogout={logout} />
      <main className="flex-grow-1">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/login" element={<Login onLogin={login} />} />
          <Route path="/register" element={<EventRegister user={user} />} />
          <Route path="/registrations" element={<Registrations />} />
          <Route path="/contact" element={<Contact user={user} />} />
          <Route path="*" element={<div className="container py-5 text-center"><h2>Page not found</h2></div>} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}
