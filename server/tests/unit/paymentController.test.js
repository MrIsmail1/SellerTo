import { describe, it, expect, beforeEach, vi } from 'vitest';
import Stripe from 'stripe';
import * as paymentController from '../../controllers/paymentController.js';
import { mockRequest, mockResponse } from '../utils/mock-req-res.js';
import { findOneMock, saveMock } from '../utils/sequelize.js';

// Mock Stripe
vi.mock('stripe', () => {
  return {
    default: vi.fn().mockImplementation(() => ({
      checkout: {
        sessions: {
          create: vi.fn(),
        },
      },
      refunds: {
        create: vi.fn(),
      },
    })),
  };
});

describe('Payment Controller', () => {
  let stripeMock;

  beforeEach(() => {
    stripeMock = new Stripe();
    vi.clearAllMocks();
  });

  describe('createPaymentSession', () => {
    it('should create a new payment session', async () => {
      const req = mockRequest({
        body: {
          userId: 1,
          items: [
            { name: 'Product 1', amount: 1000, quantity: 1, productId: 1 }
          ]
        }
      });
      const res = mockResponse();

      stripeMock.checkout.sessions.create.mockResolvedValue({
        id: 'session_id',
      });

      await paymentController.createPaymentSession(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({ sessionId: 'session_id' });
    });

    it('should handle errors', async () => {
      const req = mockRequest({
        body: {
          userId: 1,
          items: [
            { name: 'Product 1', amount: 1000, quantity: 1, productId: 1 }
          ]
        }
      });
      const res = mockResponse();

      stripeMock.checkout.sessions.create.mockRejectedValue(new Error('Stripe error'));

      await paymentController.createPaymentSession(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ message: 'Stripe error' });
    });
  });

  describe('createRefund', () => {
    it('should create a refund', async () => {
      const req = mockRequest({
        body: {
          paymentId: 1,
          productId: 1,
          quantity: 1
        }
      });
      const res = mockResponse();

      findOneMock.mockResolvedValueOnce({
        amount: 2000,
        quantity: 2,
        save: saveMock,
      });
      findOneMock.mockResolvedValueOnce({
        paymentIntentId: 'pi_1'
      });

      stripeMock.refunds.create.mockResolvedValue({
        id: 'refund_id'
      });

      await paymentController.createRefund(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({ id: 'refund_id' });
    });

    it('should handle errors', async () => {
      const req = mockRequest({
        body: {
          paymentId: 1,
          productId: 1,
          quantity: 1
        }
      });
      const res = mockResponse();

      findOneMock.mockResolvedValueOnce({
        amount: 2000,
        quantity: 2,
        save: saveMock,
      });
      findOneMock.mockResolvedValueOnce({
        paymentIntentId: 'pi_1'
      });

      stripeMock.refunds.create.mockRejectedValue(new Error('Stripe error'));

      await paymentController.createRefund(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ message: 'Stripe error' });
    });

    it('should return 404 if payment product not found', async () => {
      const req = mockRequest({
        body: {
          paymentId: 1,
          productId: 1,
          quantity: 1
        }
      });
      const res = mockResponse();

      findOneMock.mockResolvedValueOnce(null);

      await paymentController.createRefund(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ message: 'Produit non trouvé pour ce paiement' });
    });

    it('should return 404 if payment not found', async () => {
      const req = mockRequest({
        body: {
          paymentId: 1,
          productId: 1,
          quantity: 1
        }
      });
      const res = mockResponse();

      findOneMock.mockResolvedValueOnce({
        amount: 2000,
        quantity: 2,
        save: saveMock,
      });
      findOneMock.mockResolvedValueOnce(null);

      await paymentController.createRefund(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ message: 'Paiement non trouvé' });
    });
  });
});
