// ============================================================
// Registration Page
// ============================================================
import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: '', email: '', password: '', role: 'mentee',
    bio: '', expertise: '', department: '', year_of_study: '', availability: '',
  });
  const [error, setError]   = useState('');
  const [loading, setLoading] = useState(false);

  const set = (field) => (e) => setForm({ ...form, [field]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const payload = {
        ...form,
        expertise: form.expertise ? form.expertise.split(',').map((s) => s.trim()) : [],
      };
      await register(payload);
      navigate('/dashboard');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card auth-card-wide">
        <div className="auth-header">
          <span className="auth-icon">◈</span>
          <h1 className="auth-title">Create Account</h1>
          <p className="auth-subtitle">Join the AUCA Mentorship community</p>
        </div>

        {error && <div className="alert alert-error">{error}</div>}

        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Full Name</label>
              <input className="form-input" placeholder="Your full name" value={form.name} onChange={set('name')} required />
            </div>
            <div className="form-group">
              <label className="form-label">Email</label>
              <input type="email" className="form-input" placeholder="you@auca.ac.rw" value={form.email} onChange={set('email')} required />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Password</label>
              <input type="password" className="form-input" placeholder="Min 6 characters" value={form.password} onChange={set('password')} required />
            </div>
            <div className="form-group">
              <label className="form-label">Role</label>
              <select className="form-input" value={form.role} onChange={set('role')}>
                <option value="mentee">Mentee (Student seeking guidance)</option>
                <option value="mentor">Mentor (Senior / Lecturer)</option>
              </select>
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Bio (optional)</label>
            <textarea className="form-input form-textarea" placeholder="Tell us about yourself..." value={form.bio} onChange={set('bio')} />
          </div>

          {form.role === 'mentor' && (
            <div className="mentor-fields">
              <p className="fields-notice">Mentor Application Details</p>
              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">Expertise (comma-separated)</label>
                  <input className="form-input" placeholder="Python, React, Machine Learning" value={form.expertise} onChange={set('expertise')} />
                </div>
                <div className="form-group">
                  <label className="form-label">Department</label>
                  <input className="form-input" placeholder="Computer Science" value={form.department} onChange={set('department')} />
                </div>
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">Year / Position</label>
                  <input className="form-input" placeholder="Year 4 / Lecturer" value={form.year_of_study} onChange={set('year_of_study')} />
                </div>
                <div className="form-group">
                  <label className="form-label">Availability</label>
                  <input className="form-input" placeholder="Mon-Fri 2pm-5pm" value={form.availability} onChange={set('availability')} />
                </div>
              </div>
            </div>
          )}

          <button type="submit" className="btn btn-primary btn-full" disabled={loading}>
            {loading ? 'Creating account...' : 'Create Account'}
          </button>
        </form>

        <p className="auth-footer">
          Already have an account? <Link to="/login" className="auth-link">Sign in</Link>
        </p>
      </div>
    </div>
  );
}