// ============================================================
// Mentor Card Component
// ============================================================
import { useAuth } from '../context/AuthContext';

export default function MentorCard({ mentor, onBook }) {
  const { user } = useAuth();

  const stars = (rating) =>
    Array.from({ length: 5 }, (_, i) => (
      <span key={i} className={i < Math.round(rating) ? 'star filled' : 'star'}>★</span>
    ));

  return (
    <div className="mentor-card">
      <div className="mentor-card-header">
        <div className="mentor-avatar">{mentor.name?.charAt(0)}</div>
        <div className="mentor-info">
          <h3 className="mentor-name">{mentor.name}</h3>
          <p className="mentor-dept">{mentor.department} · {mentor.year_of_study}</p>
          <div className="mentor-rating">
            {stars(mentor.avg_rating)}
            <span className="rating-text">{parseFloat(mentor.avg_rating).toFixed(1)} ({mentor.review_count} reviews)</span>
          </div>
        </div>
      </div>

      <p className="mentor-bio">{mentor.bio || 'Passionate about sharing knowledge.'}</p>

      <div className="mentor-expertise">
        {mentor.expertise?.map((tag, i) => (
          <span key={i} className="tag">{tag}</span>
        ))}
      </div>

      <div className="mentor-footer">
        <span className="availability">🕐 {mentor.availability}</span>
        {user?.role === 'mentee' && (
          <button className="btn btn-primary btn-sm" onClick={() => onBook(mentor)}>
            Book Session
          </button>
        )}
      </div>
    </div>
  );
}