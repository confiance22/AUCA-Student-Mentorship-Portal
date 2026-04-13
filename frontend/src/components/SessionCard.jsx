import { Calendar, Clock, User, MessageSquare, Check, X, Star } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function SessionCard({ session, onUpdateStatus, onFeedback }) {
  const { user } = useAuth();
  const isMentor = user?.role === 'mentor';

  // Format date nicely
  const dateLabel = new Date(session.scheduled_at).toLocaleDateString('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });

  return (
    <div className="session-card">
      <div className="session-card-header">
        <span className={`status-badge status-${session.status}`}>
          {session.status.charAt(0).toUpperCase() + session.status.slice(1)}
        </span>
        <h3 className="session-title">{session.title}</h3>
      </div>

      <div className="session-details">
        <div className="detail-item">
          <Calendar size={16} className="detail-icon" />
          <span>{dateLabel}</span>
        </div>
        
        <div className="detail-item">
          <Clock size={16} className="detail-icon" />
          <span> {session.duration_minutes} min</span>
        </div>

        <div className="detail-item">
          <User size={16} className="detail-icon" />
          <span>
            {isMentor ? ` Mentee : ${session.mentee_name}` : `Mentor : ${session.mentor_name}`}
          </span>
        </div>
      </div>

      <p className="session-description">{session.description}</p>

      <div className="session-actions">
        {/* Actions for Mentors on Pending Sessions */}
        {isMentor && session.status === 'pending' && (
          <>
            <button 
              className="btn btn-success btn-sm" 
              onClick={() => onUpdateStatus(session.id, 'accepted')}
            >
              <Check size={14} /> Accept
            </button>
            <button 
              className="btn btn-danger btn-sm" 
              onClick={() => onUpdateStatus(session.id, 'declined')}
            >
              <X size={14} /> Decline
            </button>
          </>
        )}

        {/* Action for completing a session */}
        {session.status === 'accepted' && (
          <button 
            className="btn btn-primary btn-sm" 
            onClick={() => onUpdateStatus(session.id, 'completed')}
          >
            <Check size={14} /> Mark Completed
          </button>
        )}

        {/* Feedback button for Mentees on Completed Sessions */}
        {!isMentor && session.status === 'completed' && (
          <button 
            className="btn btn-outline btn-sm" 
            onClick={() => onFeedback(session)}
          >
            <Star size={14} /> Leave Feedback
          </button>
        )}
      </div>
    </div>
  );
}