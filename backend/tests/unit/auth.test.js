// ============================================================
// Unit Tests — Auth Controller
// ============================================================
const bcrypt = require('bcrypt');
const { generateToken } = require('../../src/utils/helpers');

describe('Auth Utilities', () => {
  test('generateToken returns a string', () => {
    const token = generateToken(1, 'mentee');
    expect(typeof token).toBe('string');
    expect(token.split('.').length).toBe(3); // JWT has 3 parts
  });

  test('bcrypt hash verifies correctly', async () => {
    const password = 'password123';
    const hash = await bcrypt.hash(password, 10);
    const match = await bcrypt.compare(password, hash);
    expect(match).toBe(true);
  });

  test('bcrypt rejects wrong password', async () => {
    const hash = await bcrypt.hash('correct', 10);
    const match = await bcrypt.compare('wrong', hash);
    expect(match).toBe(false);
  });
});
