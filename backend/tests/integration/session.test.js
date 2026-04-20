// ============================================================
// Integration Tests — Sessions API
// ============================================================
const request = require('supertest');
const app = require('../../src/app');

let menteeToken;

beforeAll(async () => {
  // Register and login a mentee
  const email = `msession_${Date.now()}@auca.ac.rw`;
  const reg = await request(app).post('/api/auth/register').send({
    name: 'Session Tester', email, password: 'pass123', role: 'mentee',
  });
  menteeToken = reg.body.data?.token;
});

describe('GET /api/sessions', () => {
  it('should return sessions for authenticated mentee', async () => {
    const res = await request(app)
      .get('/api/sessions')
      .set('Authorization', `Bearer ${menteeToken}`);
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body.data)).toBe(true);
  });

  it('should reject unauthenticated request', async () => {
    const res = await request(app).get('/api/sessions');
    expect(res.statusCode).toBe(401);
  });
});
