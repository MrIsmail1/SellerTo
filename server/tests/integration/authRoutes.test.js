import request from 'supertest';
import app from '../../app.js';
import { User } from '../__mocks__/sequelize.js'; // Importer les mocks correctement

jest.unstable_mockModule('jsonwebtoken', () => ({
  sign: jest.fn().mockReturnValue('validtoken')
}));

jest.unstable_mockModule('crypto', () => ({
  randomBytes: jest.fn().mockReturnValue(Buffer.from('1234567890abcdef', 'hex')),
  createHash: jest.fn().mockReturnValue({
    update: jest.fn().mockReturnThis(),
    digest: jest.fn().mockReturnValue('hashedtoken')
  })
}));

jest.unstable_mockModule('nodemailer', () => ({
  createTransport: jest.fn().mockReturnValue({
    sendMail: jest.fn()
  })
}));

const jwt = await import('jsonwebtoken');
const crypto = await import('crypto');
const nodemailer = await import('nodemailer');

describe('Auth Routes', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('POST /api/auth/register', () => {
    it('should register a new user', async () => {
      User.findOne.mockResolvedValue(null);
      User.create.mockResolvedValue({
        id: 1,
        firstname: 'John',
        lastname: 'Doe',
        email: 'john.doe@example.com',
        password: 'hashedpassword',
        confirmationToken: '1234567890abcdef',
        confirmationTokenExpires: Date.now() + 3600000,
        isVerified: false
      });

      const response = await request(app)
        .post('/api/auth/register')
        .send({ firstname: 'John', lastname: 'Doe', email: 'john.doe@example.com', password: 'password123' });

      expect(response.status).toBe(201);
      expect(response.body).toEqual({ message: 'Inscription réussie. Veuillez vérifier votre email pour confirmer votre compte.' });
    });
  });

  describe('POST /api/auth/login', () => {
    it('should login a verified user', async () => {
      User.findOne.mockResolvedValue({
        id: 1,
        firstname: 'John',
        lastname: 'Doe',
        email: 'john.doe@example.com',
        password: 'hashedpassword',
        isVerified: true,
        matchPassword: jest.fn().mockResolvedValue(true),
        save: jest.fn()
      });

      const response = await request(app)
        .post('/api/auth/login')
        .send({ email: 'john.doe@example.com', password: 'password123' });

      expect(response.status).toBe(200);
      expect(response.body).toEqual(expect.objectContaining({ message: 'Connexion réussie' }));
    });
  });

  describe('POST /api/auth/forgotpassword', () => {
    it('should send a password reset email', async () => {
      User.findOne.mockResolvedValue({
        id: 1,
        email: 'john.doe@example.com',
        save: jest.fn()
      });

      const response = await request(app)
        .post('/api/auth/forgotpassword')
        .send({ email: 'john.doe@example.com' });

      expect(response.status).toBe(200);
      expect(response.body).toEqual({ message: 'Email envoyé avec le lien de réinitialisation du mot de passe' });
    });
  });

  describe('PUT /api/auth/resetpassword/:token', () => {
    it('should reset the user password', async () => {
      User.findOne.mockResolvedValue({
        id: 1,
        resetPasswordToken: 'hashedtoken',
        resetPasswordExpire: Date.now() + 3600000,
        save: jest.fn()
      });

      const response = await request(app)
        .put('/api/auth/resetpassword/validtoken')
        .send({ password: 'newpassword123' });

      expect(response.status).toBe(200);
      expect(response.body).toEqual({ message: 'Mot de passe réinitialisé avec succès' });
    });
  });

  describe('GET /api/auth/logout', () => {
    it('should logout the user', async () => {
      const response = await request(app)
        .get('/api/auth/logout');

      expect(response.status).toBe(200);
      expect(response.body).toEqual({ message: 'Déconnexion réussie' });
    });
  });
});
