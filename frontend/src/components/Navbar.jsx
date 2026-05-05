import { useState, useEffect, useRef } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Bell } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);
  const wrapperRef = useRef(null); // ← wraps nav + drawer together
  const notifRef = useRef(null); // ← handles outside click for notifications
  const [notifications, setNotifications] = useState([]);
  const [showNotifications, setShowNotifications] = useState(false);

  useEffect(() => {
    if (user) {
      api.getNotifications().then(setNotifications).catch(() => {});
    }
  }, [user]);

  const unreadCount = notifications.filter(n => !n.is_read).length;

  const handleMarkRead = async (id) => {
    try {
      await api.markNotificationRead(id);
      setNotifications(prev => prev.map(n => n.id === id ? { ...n, is_read: true } : n));
    } catch (err) {}
  };

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

  useEffect(() => {
    if (!showNotifications) return;
    const handler = (e) => {
      if (notifRef.current && !notifRef.current.contains(e.target)) {
        setShowNotifications(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [showNotifications]);

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

        <div style={{display: 'flex', alignItems: 'center', gap: '1rem'}}>
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

          {user && (
            <div className="notifications-dropdown" ref={notifRef} style={{position: 'relative', display: 'flex', alignItems: 'center'}}>
              <button onClick={() => setShowNotifications(!showNotifications)} style={{background: 'none', border: 'none', cursor: 'pointer', position: 'relative', display: 'flex', alignItems: 'center', transition: 'transform 0.2s'}} onMouseOver={(e) => e.currentTarget.style.transform = 'scale(1.1)'} onMouseOut={(e) => e.currentTarget.style.transform = 'scale(1)'}>
                <Bell size={26} color="#f59e0b" fill={unreadCount > 0 ? "#f59e0b" : "none"} strokeWidth={2} />
                {unreadCount > 0 && <span style={{position: 'absolute', top: -6, right: -6, background: '#ef4444', color: 'white', borderRadius: '50%', padding: '2px 6px', fontSize: '0.75rem', fontWeight: 'bold', border: '2px solid white'}}>{unreadCount}</span>}
              </button>
              {showNotifications && (
                <div style={{
                  position: 'absolute', 
                  right: '-10px', 
                  top: '150%', 
                  background: 'white', 
                  border: '1px solid #ccc', 
                  borderRadius: '8px', 
                  width: '320px', 
                  maxWidth: '90vw',
                  maxHeight: '400px', 
                  overflowY: 'auto', 
                  zIndex: 1000, 
                  boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1), 0 4px 6px -2px rgba(0,0,0,0.05)'
                }}>
                  <div style={{padding: '12px 16px', borderBottom: '1px solid #eee', fontWeight: 'bold', color: '#333', display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
                    <span>Notifications</span>
                    <button onClick={() => setShowNotifications(false)} style={{background: 'none', border: 'none', cursor: 'pointer', fontSize: '1.5rem', lineHeight: '1', color: '#666'}}>&times;</button>
                  </div>
                  {notifications.length === 0 ? <div style={{padding: '10px', color: '#666', textAlign: 'center'}}>No notifications</div> : notifications.map(n => (
                    <div key={n.id} style={{padding: '10px', borderBottom: '1px solid #eee', background: n.is_read ? 'white' : '#f0f8ff', cursor: n.is_read ? 'default' : 'pointer'}} onClick={() => !n.is_read && handleMarkRead(n.id)}>
                      <p style={{margin: 0, fontSize: '0.9rem', color: '#333'}}>{n.message}</p>
                      <small style={{color: '#888', fontSize: '0.75rem'}}>{new Date(n.created_at).toLocaleString()}</small>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

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
        </div>
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