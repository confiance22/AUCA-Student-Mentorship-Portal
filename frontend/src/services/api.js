// ============================================================
// Centralized API service using fetch
// ============================================================
const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const getHeaders = () => {
  const token = localStorage.getItem('token');
  return {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
};

const request = async (method, path, body = null) => {
  const res = await fetch(`${BASE_URL}${path}`, {
    method,
    headers: getHeaders(),
    ...(body ? { body: JSON.stringify(body) } : {}),
  });
  const data = await res.json();
  if (!data.success) throw new Error(data.message || 'Request failed');
  return data.data;
};

export const api = {
  // Auth
  register:  (body) => request('POST', '/auth/register', body),
  login:     (body) => request('POST', '/auth/login', body),
  getMe:     ()     => request('GET',  '/auth/me'),

  // Users / Mentors
  getMentors:       ()         => request('GET',   '/users/mentors'),
  getPending:       ()         => request('GET',   '/users/pending'),
  getAllUsers:       ()         => request('GET',   '/users'),
  approveMentor:    (id, body) => request('PATCH', `/users/${id}/approve`, body),
  updateProfile:    (body)     => request('PUT',   '/users/profile', body),

  // Sessions
  bookSession:        (body)     => request('POST',  '/sessions', body),
  getMySessions:      ()         => request('GET',   '/sessions'),
  updateSessionStatus:(id, body) => request('PATCH', `/sessions/${id}/status`, body),

  // Feedback
  submitFeedback:    (body) => request('POST', '/feedback', body),
  getMentorFeedback: (id)   => request('GET',  `/feedback/mentor/${id}`),
  getAllFeedback:    ()      => request('GET',  '/feedback'),
};