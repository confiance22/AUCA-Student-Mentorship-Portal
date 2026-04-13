import { useState, useEffect, useRef } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);
  const wrapperRef = useRef(null); // ← wraps nav + drawer together

  const handleLogout = () => {
    logout();
    setMenuOpen(false);
    navigate('/login');
  };

  const isActive = (path) =>
    location.pathname === path ? 'nav-link active' : 'nav-link';

  useEffect(() => {
    setMenuOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    if (!menuOpen) return;
    const handler = (e) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target)) {
        setMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [menuOpen]);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [menuOpen]);

  return (
    <div ref={wrapperRef}> {/* ← ref lives here, contains both */}
      <nav className="navbar">
        <Link to="/" className="nav-brand">
          <span className="brand-icon">◈</span>
          <span className="brand-text">
            AUCA<span className="brand-accent"> MentorShip</span>
          </span>
        </Link>

        {user && (
          <div className="nav-links">
            <Link to="/dashboard" className={isActive('/dashboard')}>Dashboard</Link>
            <Link to="/mentors"   className={isActive('/mentors')}>Mentors</Link>
            <Link to="/sessions"  className={isActive('/sessions')}>Sessions</Link>
            <Link to="/feedback"  className={isActive('/feedback')}>Feedback</Link>
          </div>
        )}

        <div className="nav-actions nav-actions--desktop">
          {user ? (
            <>
              <span className="nav-user">
                <span className="user-avatar">{user.name?.charAt(0)}</span>
                <span className="user-name">{user.name}</span>
                <span className={`role-badge role-${user.role}`}>{user.role}</span>
              </span>
              <button onClick={handleLogout} className="btn btn-outline btn-sm">
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login"    className="btn btn-ghost btn-sm">Login</Link>
              <Link to="/register" className="btn btn-primary btn-sm">Register</Link>
            </>
          )}
        </div>

        <button
          className={`hamburger${menuOpen ? ' hamburger--open' : ''}`}
          onClick={() => setMenuOpen((o) => !o)}
          aria-label={menuOpen ? 'Close menu' : 'Open menu'}
          aria-expanded={menuOpen}
        >
          <span />
          <span />
          <span />
        </button>
      </nav>

      {/* Drawer is inside the same ref wrapper, so outside-click ignores it */}
      {menuOpen && (
        <div className="mobile-drawer">
          {user && (
            <nav className="drawer-links">
              <Link to="/dashboard" className={isActive('/dashboard')}>Dashboard</Link>
              <Link to="/mentors"   className={isActive('/mentors')}>Mentors</Link>
              <Link to="/sessions"  className={isActive('/sessions')}>Sessions</Link>
              <Link to="/feedback"  className={isActive('/feedback')}>Feedback</Link>
            </nav>
          )}

          <div className="drawer-divider" />

          {user && (
            <div className="drawer-user-row">
              <span className="user-avatar">{user.name?.charAt(0)}</span>
              <span className="user-name">{user.name}</span>
              <span className={`role-badge role-${user.role}`}>{user.role}</span>
            </div>
          )}

          <div className="drawer-actions">
            {user ? (
              <button onClick={handleLogout} className="btn btn-outline btn-sm btn-full">
                Logout
              </button>
            ) : (
              <>
                <Link to="/login"    className="btn btn-ghost btn-sm btn-full" onClick={() => setMenuOpen(false)}>Login</Link>
                <Link to="/register" className="btn btn-primary btn-sm btn-full" onClick={() => setMenuOpen(false)}>Register</Link>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}