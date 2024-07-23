import { describe, it, expect, vi, beforeEach } from 'vitest';
import { v4 as uuidv4 } from 'uuid';
import * as authController from '../../controllers/authController.js';
import { mockUserModel, findOneMock, createMock } from '../utils/sequelize.js';
import { mockRequest, mockResponse } from '../utils/mock-req-res.js';
import nodemailer from 'nodemailer';
import crypto from 'crypto';
import jwt from 'jsonwebtoken';

vi.mock('nodemailer');
vi.mock('crypto');
vi.mock('jsonwebtoken');

describe('Auth Controller - Unit Tests', () => {
  let uniqueEmail;

  beforeEach(() => {
    findOneMock.mockReset();
    createMock.mockReset();
    nodemailer.createTransport.mockReset();
    crypto.randomBytes.mockReset();
    jwt.sign.mockReset();
    uniqueEmail = `john.doe+${uuidv4()}@example.com`;
  });

  describe('register', () => {
    it('should create a new user and send a confirmation email', async () => {
      const req = mockRequest({
        body: {
          firstname: 'John',
          lastname: 'Doe',
          email: uniqueEmail,
          password: 'Coucou00$$$$',
        },
      });
      const res = mockResponse();

      findOneMock.mockResolvedValue(null);
      createMock.mockResolvedValue({
        id: 1,
        firstname: 'John',
        lastname: 'Doe',
        email: req.body.email,
        isVerified: false,
        confirmationToken: 'randomToken',
      });

      crypto.randomBytes.mockReturnValue(Buffer.from('randomToken'));
      nodemailer.createTransport.mockReturnValue({
        sendMail: vi.fn().mockResolvedValue(true),
      });

      await authController.register(req, res);

      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith({
        message: 'Inscription réussie. Veuillez vérifier votre email pour confirmer votre compte.',
      });
    });
  });

  describe('login', () => {
    it('should login a user and return a token', async () => {
      const req = mockRequest({
        body: {
          email: uniqueEmail,
          password: 'Coucou00$$$$',
        },
      });
      const res = mockResponse();

      findOneMock.mockResolvedValue({
        id: 1,
        email: req.body.email,
        password: 'hashedpassword',
        isVerified: true,
        matchPassword: vi.fn().mockResolvedValue(true),
      });
      jwt.sign.mockReturnValue('token');

      await authController.login(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        message: 'Connexion réussie',
        user: expect.any(Object),
      });
    });

    it('should return an error if user is not found', async () => {
      const req = mockRequest({
        body: {
          email: uniqueEmail,
          password: 'Coucou00$$$$',
        },
      });
      const res = mockResponse();

      findOneMock.mockResolvedValue(null);

      await authController.login(req, res);

      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith({
        message: 'Utilisateur non trouvé',
      });
    });
  });
});
