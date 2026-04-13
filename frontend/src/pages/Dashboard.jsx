// ============================================================
// Dashboard Page — role-based summary
// ============================================================
import { 
  Calendar, 
  CheckCircle, 
  Users, 
  Hourglass, 
  Search, 
  Star, 
  LayoutDashboard 
} from 'lucide-react';
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';

export default function Dashboard() {
  const { user } = useAuth();
  const [sessions, setSessions]   = useState([]);
  const [pending, setPending]     = useState([]);
  const [allUsers, setAllUsers]   = useState([]);
  const [feedback, setFeedback]   = useState([]);

  useEffect(() => {
    api.getMySessions().then(setSessions).catch(() => {});
    if (user?.role === 'admin') {
      api.getPending().then(setPending).catch(() => {});
      api.getAllUsers().then(setAllUsers).catch(() => {});
      api.getAllFeedback().then(setFeedback).catch(() => {});
    }
  }, [user]);

  const upcoming = sessions.filter((s) => ['pending', 'accepted'].includes(s.status));
  const completed = sessions.filter((s) => s.status === 'completed');

  const handleApprove = async (id, status) => {
    try {
      await api.approveMentor(id, { status });
      setPending((prev) => prev.filter((p) => p.user_id !== id));
    } catch (err) { alert(err.message); }
  };

  return (
    <div className="page">
      <div className="page-header">
        <div>
          <h1 className="page-title">Hello, {user?.name}</h1>
          <p className="page-subtitle">
            {user?.role === 'admin' ? 'System Overview' :
             user?.role === 'mentor' ? 'Manage your mentorship sessions' :
             'Track your learning journey'}
          </p>
        </div>
      </div>

{/* Stats Row */}
<div className="stats-grid">
  <div className="stat-card">
    <span className="stat-icon"><Calendar size={24} color="#3b82f6" /></span>
    <div>
      <p className="stat-value">{upcoming.length}</p>
      <p className="stat-label">Upcoming Sessions</p>
    </div>
  </div>
  
  <div className="stat-card">
    <span className="stat-icon"><CheckCircle size={24} color="#10b981" /></span>
    <div>
      <p className="stat-value">{completed.length}</p>
      <p className="stat-label">Completed Sessions</p>
    </div>
  </div>

  {user?.role === 'admin' && (
    <>
      <div className="stat-card">
        <span className="stat-icon"><Users size={24} color="#8b5cf6" /></span>
        <div>
          <p className="stat-value">{allUsers.length}</p>
          <p className="stat-label">Total Users</p>
        </div>
      </div>
      <div className="stat-card">
        <span className="stat-icon"><Hourglass size={24} color="#f59e0b" /></span>
        <div>
          <p className="stat-value">{pending.length}</p>
          <p className="stat-label">Pending Approvals</p>
        </div>
      </div>
    </>
  )}
</div>

{/* Quick links */}
<div className="quick-links">
  <Link to="/sessions" className="quick-link-card">
    <span className="ql-icon"><LayoutDashboard size={20} /></span>
    <span>My Sessions</span>
  </Link>
  
  {user?.role === 'mentee' && (
    <Link to="/mentors" className="quick-link-card">
      <span className="ql-icon"><Search size={20} /></span>
      <span>Browse Mentors</span>
    </Link>
  )}
  
  <Link to="/feedback" className="quick-link-card">
    <span className="ql-icon"><Star size={20} /></span>
    <span>Feedback</span>
  </Link>
</div>

      {/* Admin: Pending mentor approvals */}
      {user?.role === 'admin' && pending.length > 0 && (
        <div className="section">
          <h2 className="section-title">Pending Mentor Applications</h2>
          <div className="table-wrapper">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Name</th><th>Email</th><th>Department</th><th>Expertise</th><th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {pending.map((p) => (
                  <tr key={p.user_id}>
                    <td>{p.name}</td>
                    <td>{p.email}</td>
                    <td>{p.department}</td>
                    <td>{p.expertise?.join(', ')}</td>
                    <td>
                      <button className="btn btn-success btn-xs" onClick={() => handleApprove(p.user_id, 'approved')}>Approve</button>
                      <button className="btn btn-danger btn-xs ml-1"  onClick={() => handleApprove(p.user_id, 'rejected')}>Reject</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}