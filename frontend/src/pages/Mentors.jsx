import { useEffect, useState } from 'react';
import { api } from '../services/api';
import MentorCard from '../components/MentorCard';
// Import Lucide Icons
import { Search, UserCircle, X, Info, CalendarCheck } from 'lucide-react';

export default function Mentors() {
  const [mentors, setMentors]     = useState([]);
  const [search, setSearch]       = useState('');
  const [loading, setLoading]     = useState(true);
  const [selected, setSelected]   = useState(null);
  const [bookForm, setBookForm]   = useState({ title: '', description: '', scheduled_at: '', duration_minutes: 60 });
  const [error, setError]         = useState('');
  const [success, setSuccess]     = useState('');

  useEffect(() => {
    api.getMentors()
      .then(setMentors)
      .finally(() => setLoading(false));
  }, []);

  const filtered = mentors.filter(
    (m) => m.name.toLowerCase().includes(search.toLowerCase()) ||
           m.expertise?.some((e) => e.toLowerCase().includes(search.toLowerCase()))
  );

  const handleBook = async (e) => {
    e.preventDefault();
    setError('');
    try {
      await api.bookSession({ ...bookForm, mentor_id: selected.id });
      setSuccess('Session booked successfully!');
      setSelected(null);
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="page">
      <div className="page-header">
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <UserCircle size={40} className="text-primary" />
          <div>
            <h1 className="page-title">Find a Mentor</h1>
            <p className="page-subtitle">Browse approved mentors and book a session</p>
          </div>
        </div>
      </div>

      {success && <div className="alert alert-success">{success}</div>}

      <div className="search-bar" style={{ position: 'relative' }}>
        <Search 
          size={18} 
          style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#64748b' }} 
        />
        <input
          className="form-input search-input"
          placeholder="Search by name or expertise..."
          style={{ paddingLeft: '40px' }} // Make room for the icon
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {loading ? (
        <div className="loader-screen"><div className="spinner" /></div>
      ) : filtered.length === 0 ? (
        <div className="empty-state">
          <Search size={48} style={{ marginBottom: '16px', color: '#cbd5e1' }} />
          <p>No mentors found. Try a different search.</p>
        </div>
      ) : (
        <div className="mentor-grid">
          {filtered.map((m) => (
            <MentorCard key={m.id} mentor={m} onBook={setSelected} />
          ))}
        </div>
      )}

      {/* Book Session Modal */}
      {selected && (
        <div className="modal-overlay" onClick={() => setSelected(null)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <CalendarCheck size={20} />
                <h2 style={{ margin: 0 }}>Book Session with {selected.name}</h2>
              </div>
              <button className="modal-close" onClick={() => setSelected(null)}>
                <X size={20} />
              </button>
            </div>
            
            {error && (
              <div className="alert alert-error" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Info size={16} /> {error}
              </div>
            )}
            
            <form onSubmit={handleBook} className="auth-form">
              <div className="form-group">
                <label className="form-label">Session Title</label>
                <input className="form-input" placeholder="e.g. Python Basics" value={bookForm.title}
                  onChange={(e) => setBookForm({ ...bookForm, title: e.target.value })} required />
              </div>
              <div className="form-group">
                <label className="form-label">Description</label>
                <textarea className="form-input form-textarea" placeholder="What do you want to learn?"
                  value={bookForm.description}
                  onChange={(e) => setBookForm({ ...bookForm, description: e.target.value })} />
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">Date & Time</label>
                  <input type="datetime-local" className="form-input" value={bookForm.scheduled_at}
                    onChange={(e) => setBookForm({ ...bookForm, scheduled_at: e.target.value })} required />
                </div>
                <div className="form-group">
                  <label className="form-label">Duration (minutes)</label>
                  <input type="number" className="form-input" min="30" max="180" value={bookForm.duration_minutes}
                    onChange={(e) => setBookForm({ ...bookForm, duration_minutes: parseInt(e.target.value) })} />
                </div>
              </div>
              <div className="modal-actions">
                <button type="button" className="btn btn-outline" onClick={() => setSelected(null)}>Cancel</button>
                <button type="submit" className="btn btn-primary">Book Session</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}