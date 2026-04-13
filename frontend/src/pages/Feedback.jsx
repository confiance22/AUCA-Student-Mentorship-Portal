// ============================================================
// Feedback Page — submit and view feedback
// ============================================================
import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { api } from '../services/api';
import { useAuth } from '../context/AuthContext';

export default function Feedback() {
  const { user } = useAuth();
  const location = useLocation();
  const preloaded = location.state?.session;

  const [form, setForm]       = useState({ session_id: preloaded?.id || '', rating: 5, review: '' });
  const [myFeedback, setMyFeedback] = useState([]);
  const [success, setSuccess] = useState('');
  const [error, setError]     = useState('');

  useEffect(() => {
    if (user?.role === 'mentor') {
      api.getMentorFeedback(user.id).then(setMyFeedback).catch(() => {});
    }
  }, [user]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      await api.submitFeedback(form);
      setSuccess('Thank you! Your feedback has been submitted.');
      setForm({ session_id: '', rating: 5, review: '' });
    } catch (err) {
      setError(err.message);
    }
  };

  const stars = (count, interactive = false, onSet) =>
    Array.from({ length: 5 }, (_, i) => (
      <span
        key={i}
        className={`star ${i < count ? 'filled' : ''} ${interactive ? 'interactive' : ''}`}
        onClick={interactive ? () => onSet(i + 1) : undefined}
      >★</span>
    ));

  return (
    <div className="page">
      <div className="page-header">
        <div>
          <h1 className="page-title">Feedback</h1>
          <p className="page-subtitle">
            {user?.role === 'mentee' ? 'Rate your mentorship experience' : 'See what mentees say about you'}
          </p>
        </div>
      </div>

      {/* Mentee: Submit Feedback */}
      {user?.role === 'mentee' && (
        <div className="feedback-form-card">
          <h2 className="section-title">Leave a Review</h2>
          {success && <div className="alert alert-success">{success}</div>}
          {error   && <div className="alert alert-error">{error}</div>}

          <form onSubmit={handleSubmit} className="auth-form">
            <div className="form-group">
              <label className="form-label">Session ID</label>
              <input
                type="number"
                className="form-input"
                placeholder="Enter the session ID"
                value={form.session_id}
                onChange={(e) => setForm({ ...form, session_id: parseInt(e.target.value) })}
                required
              />
              {preloaded && <p className="form-hint">Auto-filled from: <strong>{preloaded.title}</strong></p>}
            </div>
            <div className="form-group">
              <label className="form-label">Rating</label>
              <div className="star-picker">
                {stars(form.rating, true, (r) => setForm({ ...form, rating: r }))}
                <span className="rating-label">{form.rating}/5</span>
              </div>
            </div>
            <div className="form-group">
              <label className="form-label">Written Review</label>
              <textarea
                className="form-input form-textarea"
                placeholder="Share your experience..."
                value={form.review}
                onChange={(e) => setForm({ ...form, review: e.target.value })}
              />
            </div>
            <button type="submit" className="btn btn-primary">Submit Feedback</button>
          </form>
        </div>
      )}

      {/* Mentor: View feedback received */}
      {user?.role === 'mentor' && (
        <div className="section">
          {myFeedback.length === 0 ? (
            <div className="empty-state">
              <span className="empty-icon">⭐</span>
              <p>No feedback yet. Complete sessions to receive reviews.</p>
            </div>
          ) : (
            <div className="feedback-list">
              {myFeedback.map((fb) => (
                <div key={fb.id} className="feedback-item">
                  <div className="feedback-header">
                    <span className="feedback-author">{fb.mentee_name}</span>
                    <div className="star-display">{stars(fb.rating)}</div>
                  </div>
                  <p className="feedback-session">Session: {fb.session_title}</p>
                  <p className="feedback-review">{fb.review}</p>
                  <span className="feedback-date">{new Date(fb.created_at).toLocaleDateString()}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}