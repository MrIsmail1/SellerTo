import { describe, it, expect, beforeEach, vi } from 'vitest';
import * as promoCodeController from '../../controllers/promoCodeController.js';
import PromoCodes from '../../models/postgres/promoCodeModel.js';
import { mockRequest, mockResponse } from '../utils/mock-req-res.js';

// Mock Sequelize models
vi.mock('../../models/postgres/promoCodeModel.js', () => {
  return {
    __esModule: true,
    default: {
      findOne: vi.fn(),
      create: vi.fn(),
      findByPk: vi.fn(),
      findAll: vi.fn(),
      destroy: vi.fn(),
      update: vi.fn(),
    },
  };
});

describe('PromoCode Controller', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('validatePromoCode', () => {
    it('should validate a promo code successfully', async () => {
      const req = mockRequest({
        body: { code: 'PROMO123' },
      });
      const res = mockResponse();

      const mockPromoCode = { code: 'PROMO123', expiry_date: new Date(Date.now() + 10000) };
      PromoCodes.findOne.mockResolvedValue(mockPromoCode);

      await promoCodeController.validatePromoCode(req, res);

      expect(PromoCodes.findOne).toHaveBeenCalledWith({ where: { code: 'PROMO123' } });
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(mockPromoCode);
    });

    it('should return 404 if promo code not found', async () => {
      const req = mockRequest({
        body: { code: 'PROMO123' },
      });
      const res = mockResponse();

      PromoCodes.findOne.mockResolvedValue(null);

      await promoCodeController.validatePromoCode(req, res);

      expect(PromoCodes.findOne).toHaveBeenCalledWith({ where: { code: 'PROMO123' } });
      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ message: 'Code promo non trouvé.' });
    });

    it('should return 400 if promo code is expired', async () => {
      const req = mockRequest({
        body: { code: 'PROMO123' },
      });
      const res = mockResponse();

      const mockPromoCode = { code: 'PROMO123', expiry_date: new Date(Date.now() - 10000) };
      PromoCodes.findOne.mockResolvedValue(mockPromoCode);

      await promoCodeController.validatePromoCode(req, res);

      expect(PromoCodes.findOne).toHaveBeenCalledWith({ where: { code: 'PROMO123' } });
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ message: 'Le code promo a expiré.' });
    });

    it('should handle internal server error', async () => {
      const req = mockRequest({
        body: { code: 'PROMO123' },
      });
      const res = mockResponse();

      PromoCodes.findOne.mockRejectedValue(new Error('Database error'));

      await promoCodeController.validatePromoCode(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
    });
  });

  describe('createPromoCode', () => {
    it('should create a promo code successfully', async () => {
      const req = mockRequest({
        body: { code: 'PROMO123', discount: 10, expiry_date: new Date(), product_id: 1, category: 'electronics' },
      });
      const res = mockResponse();

      const mockPromoCode = { id: 1, code: 'PROMO123', discount: 10, expiry_date: new Date(), product_id: 1, category: 'electronics' };
      PromoCodes.create.mockResolvedValue(mockPromoCode);

      await promoCodeController.createPromoCode(req, res);

      expect(PromoCodes.create).toHaveBeenCalledWith(req.body);
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith(mockPromoCode);
    });

    it('should handle internal server error', async () => {
      const req = mockRequest({
        body: { code: 'PROMO123', discount: 10, expiry_date: new Date(), product_id: 1, category: 'electronics' },
      });
      const res = mockResponse();

      PromoCodes.create.mockRejectedValue(new Error('Database error'));

      await promoCodeController.createPromoCode(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
    });
  });

  describe('updatePromoCode', () => {
    it('should update a promo code successfully', async () => {
      const req = mockRequest({
        params: { id: 1 },
        body: { code: 'PROMO123', discount: 15, expiry_date: new Date(), product_id: 2, category: 'clothing' },
      });
      const res = mockResponse();

      const mockPromoCode = { id: 1, update: vi.fn().mockResolvedValue(true) };
      PromoCodes.findByPk.mockResolvedValue(mockPromoCode);

      await promoCodeController.updatePromoCode(req, res);

      expect(PromoCodes.findByPk).toHaveBeenCalledWith(1);
      expect(mockPromoCode.update).toHaveBeenCalledWith(req.body);
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(mockPromoCode);
    });

    it('should return 404 if promo code not found', async () => {
      const req = mockRequest({
        params: { id: 1 },
        body: { code: 'PROMO123', discount: 15, expiry_date: new Date(), product_id: 2, category: 'clothing' },
      });
      const res = mockResponse();

      PromoCodes.findByPk.mockResolvedValue(null);

      await promoCodeController.updatePromoCode(req, res);

      expect(PromoCodes.findByPk).toHaveBeenCalledWith(1);
      expect(res.status).toHaveBeenCalledWith(404);
    });

    it('should handle internal server error', async () => {
      const req = mockRequest({
        params: { id: 1 },
        body: { code: 'PROMO123', discount: 15, expiry_date: new Date(), product_id: 2, category: 'clothing' },
      });
      const res = mockResponse();

      PromoCodes.findByPk.mockRejectedValue(new Error('Database error'));

      await promoCodeController.updatePromoCode(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
    });
  });

  describe('deletePromoCode', () => {
    it('should delete a promo code successfully', async () => {
      const req = mockRequest({
        params: { id: 1 },
      });
      const res = mockResponse();

      const mockPromoCode = { id: 1, destroy: vi.fn().mockResolvedValue(true) };
      PromoCodes.findByPk.mockResolvedValue(mockPromoCode);

      await promoCodeController.deletePromoCode(req, res);

      expect(PromoCodes.findByPk).toHaveBeenCalledWith(1);
      expect(mockPromoCode.destroy).toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(204);
    });

    it('should return 404 if promo code not found', async () => {
      const req = mockRequest({
        params: { id: 1 },
      });
      const res = mockResponse();

      PromoCodes.findByPk.mockResolvedValue(null);

      await promoCodeController.deletePromoCode(req, res);

      expect(PromoCodes.findByPk).toHaveBeenCalledWith(1);
      expect(res.status).toHaveBeenCalledWith(404);
    });

    it('should handle internal server error', async () => {
      const req = mockRequest({
        params: { id: 1 },
      });
      const res = mockResponse();

      PromoCodes.findByPk.mockRejectedValue(new Error('Database error'));

      await promoCodeController.deletePromoCode(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
    });
  });

  describe('getAllPromoCodes', () => {
    it('should get all promo codes', async () => {
      const req = mockRequest();
      const res = mockResponse();

      const mockPromoCodes = [
        { id: 1, code: 'PROMO123', discount: 10, expiry_date: new Date(), product_id: 1, category: 'electronics' },
        { id: 2, code: 'PROMO456', discount: 15, expiry_date: new Date(), product_id: 2, category: 'clothing' },
      ];
      PromoCodes.findAll.mockResolvedValue(mockPromoCodes);

      await promoCodeController.getAllPromoCodes(req, res);

      expect(PromoCodes.findAll).toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(mockPromoCodes);
    });

    it('should handle internal server error', async () => {
      const req = mockRequest();
      const res = mockResponse();

      PromoCodes.findAll.mockRejectedValue(new Error('Database error'));

      await promoCodeController.getAllPromoCodes(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
    });
  });
});
