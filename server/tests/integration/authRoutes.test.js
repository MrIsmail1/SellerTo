import request from 'supertest';
import { v4 as uuidv4 } from 'uuid';
import app from '../../app.js';
import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import { mockUserModel } from '../utils/sequelize.js';

beforeAll(async () => {
  // Setup initial data if needed
});

afterAll(async () => {
  // Cleanup data if needed
});

describe('Auth Routes - Integration Tests', () => {
  let uniqueEmail;

  beforeEach(() => {
    uniqueEmail = `jane.doe+${uuidv4()}@example.com`;
  });

  it('should register a new user', async () => {
    mockUserModel.findOne = vi.fn().mockResolvedValue(null);
    mockUserModel.create = vi.fn().mockResolvedValue({
      id: 1,
      firstname: 'Jane',
      lastname: 'Doe',
      email: uniqueEmail,
      password: 'Coucou00$$$$',
      isVerified: false,
      confirmationToken: 'randomToken',
    });

    const res = await request(app)
      .post('/api/auth/register')
      .send({
        firstname: 'Jane',
        lastname: 'Doe',
        email: uniqueEmail,
        password: 'Coucou00$$$$',
      });

    expect(res.statusCode).toEqual(201);
    expect(res.body).toHaveProperty('message', 'Inscription réussie. Veuillez vérifier votre email pour confirmer votre compte.');
  }, 20000); // Timeout de 20 secondes pour ce test

  it('should login a user', async () => {
    mockUserModel.findOne = vi.fn().mockResolvedValue({
      id: 1,
      email: uniqueEmail,
      password: 'hashedpassword',
      isVerified: true,
      matchPassword: vi.fn().mockResolvedValue(true),
    });

    const res = await request(app)
      .post('/api/auth/login')
      .send({
        email: uniqueEmail,
        password: 'Coucou00$$$$',
      });

    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty('message', 'Connexion réussie');
    expect(res.body).toHaveProperty('user');
  });
});
