// ============================================================
// Unit Tests — Feedback validation
// ============================================================

describe('Feedback Validation', () => {
  const validateFeedback = ({ session_id, rating, review }) => {
    const errors = [];
    if (!session_id)            errors.push('session_id required');
    if (!rating)                errors.push('rating required');
    if (rating < 1 || rating > 5) errors.push('rating must be 1-5');
    return errors;
  };

  test('valid feedback passes', () => {
    const errs = validateFeedback({ session_id: 1, rating: 4, review: 'Great!' });
    expect(errs.length).toBe(0);
  });

  test('missing session_id fails', () => {
    const errs = validateFeedback({ rating: 3 });
    expect(errs).toContain('session_id required');
  });

  test('rating out of range fails', () => {
    const errs = validateFeedback({ session_id: 1, rating: 6 });
    expect(errs).toContain('rating must be 1-5');
  });

  test('missing rating fails', () => {
    const errs = validateFeedback({ session_id: 1 });
    expect(errs).toContain('rating required');
  });
});