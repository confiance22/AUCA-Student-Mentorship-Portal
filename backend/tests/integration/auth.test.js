// ============================================================
// Integration Tests — Auth API endpoints
// ============================================================
const request = require('supertest');
const app = require('../../src/app');

describe('POST /api/auth/register', () => {
  it('should register a new mentee', async () => {
    const res = await request(app).post('/api/auth/register').send({
      name:     'Test Student',
      email:    `test_${Date.now()}@auca.ac.rw`,
      password: 'password123',
      role:     'mentee',
    });
    expect(res.statusCode).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.data).toHaveProperty('token');
  });

  it('should reject duplicate email', async () => {
    const email = `dup_${Date.now()}@auca.ac.rw`;
    await request(app).post('/api/auth/register').send({
      name: 'First', email, password: 'pass123', role: 'mentee',
    });
    const res = await request(app).post('/api/auth/register').send({
      name: 'Second', email, password: 'pass123', role: 'mentee',
    });
    expect(res.statusCode).toBe(409);
  });
});

describe('POST /api/auth/login', () => {
  it('should reject wrong password', async () => {
    const res = await request(app).post('/api/auth/login').send({
      email: 'admin@auca.ac.rw',
      password: 'wrongpassword',
    });
    expect(res.statusCode).toBe(401);
  });
});
