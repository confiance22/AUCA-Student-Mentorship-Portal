import { useEffect, useState } from 'react';
import { api } from '../services/api';
import SessionCard from '../components/SessionCard';
import { useNavigate } from 'react-router-dom';
// Import Lucide Icons
import { 
  Calendar, 
  Clock, 
  CheckCircle2, 
  XCircle, 
  Filter, 
  Inbox 
} from 'lucide-react';

export default function Sessions() {
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading]   = useState(true);
  const [filter, setFilter]     = useState('all');
  const navigate = useNavigate();

  const load = () => {
    api.getMySessions()
      .then(setSessions)
      .finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, []);

  const handleStatusUpdate = async (id, status) => {
    try {
      await api.updateSessionStatus(id, { status });
      load();
    } catch (err) { alert(err.message); }
  };

  const handleFeedback = (session) => {
    navigate('/feedback', { state: { session } });
  };

  const filtered = filter === 'all' ? sessions : sessions.filter((s) => s.status === filter);

  // Map filters to icons for a better look
  const filterConfig = [
    { id: 'all', label: 'All', icon: <Filter size={14} /> },
    { id: 'pending', label: 'Pending', icon: <Clock size={14} /> },
    { id: 'accepted', label: 'Accepted', icon: <Calendar size={14} /> },
    { id: 'completed', label: 'Completed', icon: <CheckCircle2 size={14} /> },
    { id: 'declined', label: 'Declined', icon: <XCircle size={14} /> },
  ];

  return (
    <div className="page">
      <div className="page-header">
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <Calendar size={32} className="text-primary" />
          <div>
            <h1 className="page-title">My Sessions</h1>
            <p className="page-subtitle">Manage your mentorship sessions</p>
          </div>
        </div>
      </div>

      <div className="filter-tabs">
        {filterConfig.map((f) => (
          <button
            key={f.id}
            className={`filter-tab ${filter === f.id ? 'active' : ''}`}
            onClick={() => setFilter(f.id)}
            style={{ display: 'flex', alignItems: 'center', gap: '6px' }}
          >
            {f.icon}
            {f.label}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="loader-screen"><div className="spinner" /></div>
      ) : filtered.length === 0 ? (
        <div className="empty-state">
          <Inbox size={48} style={{ marginBottom: '16px', color: '#cbd5e1' }} />
          <p>No {filter === 'all' ? '' : filter} sessions found.</p>
        </div>
      ) : (
        <div className="sessions-grid">
          {filtered.map((s) => (
            <SessionCard
              key={s.id}
              session={s}
              onUpdateStatus={handleStatusUpdate}
              onFeedback={handleFeedback}
            />
          ))}
        </div>
      )}
    </div>
  );
}