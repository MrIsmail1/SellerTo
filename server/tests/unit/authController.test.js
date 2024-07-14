import { jest } from '@jest/globals';
import { register, login, forgotPassword, resetPassword, logout } from '../../controllers/authController.js';
import { Op, User } from '../__mocks__/sequelize.js'; // Importer les mocks correctement

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

const crypto = await import('crypto');
const nodemailer = await import('nodemailer');

describe('Auth Controller', () => {
  describe('register', () => {
    it('should register a new user', async () => {
      const req = {
        body: { firstname: 'John', lastname: 'Doe', email: 'john.doe@example.com', password: 'password123' }
      };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn()
      };

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

      await register(req, res);

      expect(User.findOne).toHaveBeenCalledWith({ where: { email: 'john.doe@example.com' } });
      expect(User.create).toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith({ message: 'Inscription réussie. Veuillez vérifier votre email pour confirmer votre compte.' });
    });
  });

  describe('login', () => {
    it('should login a verified user', async () => {
      const req = {
        body: { email: 'john.doe@example.com', password: 'password123' }
      };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn()
      };

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

      await login(req, res);

      expect(User.findOne).toHaveBeenCalledWith({ where: { email: 'john.doe@example.com' } });
      expect(res.status).not.toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ message: 'Connexion réussie' }));
    });
  });

  describe('forgotPassword', () => {
    it('should send a password reset email', async () => {
      const req = {
        body: { email: 'john.doe@example.com' }
      };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn()
      };

      User.findOne.mockResolvedValue({
        id: 1,
        email: 'john.doe@example.com',
        save: jest.fn()
      });

      await forgotPassword(req, res);

      expect(User.findOne).toHaveBeenCalledWith({ where: { email: 'john.doe@example.com' } });
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({ message: 'Email envoyé avec le lien de réinitialisation du mot de passe' });
    });
  });

  describe('resetPassword', () => {
    it('should reset the user password', async () => {
      const req = {
        params: { token: 'validtoken' },
        body: { password: 'newpassword123' }
      };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn()
      };

      User.findOne.mockResolvedValue({
        id: 1,
        resetPasswordToken: 'hashedtoken',
        resetPasswordExpire: Date.now() + 3600000,
        save: jest.fn()
      });

      await resetPassword(req, res);

      expect(User.findOne).toHaveBeenCalledWith({
        where: {
          resetPasswordToken: 'hashedtoken',
          resetPasswordExpire: { [Op.gt]: Date.now() }
        }
      });
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({ message: 'Mot de passe réinitialisé avec succès' });
    });
  });

  describe('logout', () => {
    it('should logout the user', async () => {
      const req = {};
      const res = {
        clearCookie: jest.fn(),
        status: jest.fn().mockReturnThis(),
        json: jest.fn()
      };

      await logout(req, res);

      expect(res.clearCookie).toHaveBeenCalledWith('JWT');
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({ message: 'Déconnexion réussie' });
    });
  });
});
