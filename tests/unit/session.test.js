// ============================================================
// Unit Tests — Session logic
// ============================================================

describe('Session Status Logic', () => {
  const validTransitions = {
    pending:   ['accepted', 'declined', 'cancelled'],
    accepted:  ['completed', 'cancelled'],
    declined:  [],
    completed: [],
    cancelled: [],
  };

  const canTransition = (from, to) =>
    validTransitions[from]?.includes(to) ?? false;

  test('pending can be accepted', () => {
    expect(canTransition('pending', 'accepted')).toBe(true);
  });

  test('pending can be declined', () => {
    expect(canTransition('pending', 'declined')).toBe(true);
  });

  test('accepted can be completed', () => {
    expect(canTransition('accepted', 'completed')).toBe(true);
  });

  test('completed cannot be changed', () => {
    expect(canTransition('completed', 'accepted')).toBe(false);
    expect(canTransition('completed', 'cancelled')).toBe(false);
  });

  test('declined cannot be changed', () => {
    expect(canTransition('declined', 'accepted')).toBe(false);
  });
});