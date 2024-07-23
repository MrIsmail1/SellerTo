import request from 'supertest';
import express from 'express';
import promoCodeRoutes from '../../routes/promoCodeRoutes';
import PromoCodes from '../../models/postgres/promoCodeModel';
import { beforeAll, afterAll, describe, it, expect, vi } from 'vitest';
import { setupDatabase, teardownDatabase } from '../utils/database';

const app = express();
app.use(express.json());
app.use('/api/promocodes', promoCodeRoutes);

vi.mock('../../models/postgres/promoCodeModel');

describe('PromoCode Integration Tests', () => {
  beforeAll(async () => {
    await setupDatabase();
  });

  afterAll(async () => {
    await teardownDatabase();
  });

  describe('POST /api/promocodes/validate', () => {
    it('should validate a promo code successfully', async () => {
      const promoCode = { code: 'PROMO123', expiry_date: new Date(Date.now() + 10000) };
      PromoCodes.findOne.mockResolvedValue(promoCode);

      const res = await request(app)
        .post('/api/promocodes/validate')
        .send({ code: 'PROMO123' });

      expect(res.statusCode).toBe(200);
      expect(res.body).toEqual({
        ...promoCode,
        expiry_date: promoCode.expiry_date.toISOString()
      });
    });

    it('should return 404 if promo code not found', async () => {
      PromoCodes.findOne.mockResolvedValue(null);

      const res = await request(app)
        .post('/api/promocodes/validate')
        .send({ code: 'PROMO123' });

      expect(res.statusCode).toBe(404);
      expect(res.body).toEqual({ message: 'Code promo non trouvé.' });
    });

    it('should return 400 if promo code is expired', async () => {
      const promoCode = { code: 'PROMO123', expiry_date: new Date(Date.now() - 10000) };
      PromoCodes.findOne.mockResolvedValue(promoCode);

      const res = await request(app)
        .post('/api/promocodes/validate')
        .send({ code: 'PROMO123' });

      expect(res.statusCode).toBe(400);
      expect(res.body).toEqual({ message: 'Le code promo a expiré.' });
    });
  });

  describe('POST /api/promocodes', () => {
    it('should create a promo code successfully', async () => {
      const promoCode = { code: 'PROMO123', discount: 10, expiry_date: new Date(), product_id: 1, category: 'electronics' };
      PromoCodes.create.mockResolvedValue(promoCode);

      const res = await request(app)
        .post('/api/promocodes')
        .send(promoCode);

      expect(res.statusCode).toBe(201);
      expect(res.body).toEqual({
        ...promoCode,
        expiry_date: promoCode.expiry_date.toISOString()
      });
    });

    it('should handle internal server error', async () => {
      PromoCodes.create.mockRejectedValue(new Error('Database error'));

      const res = await request(app)
        .post('/api/promocodes')
        .send({ code: 'PROMO123', discount: 10, expiry_date: new Date(), product_id: 1, category: 'electronics' });

      expect(res.statusCode).toBe(500);
    });
  });

  describe('PUT /api/promocodes/:id', () => {
    it('should update a promo code successfully', async () => {
      const promoCode = { id: 1, code: 'PROMO123', discount: 15, expiry_date: new Date(), product_id: 2, category: 'clothing' };
      PromoCodes.findByPk.mockResolvedValue({
        ...promoCode,
        update: vi.fn().mockResolvedValue(promoCode)
      });

      const res = await request(app)
        .put('/api/promocodes/1')
        .send(promoCode);

      expect(res.statusCode).toBe(200);
      expect(res.body).toEqual({
        ...promoCode,
        expiry_date: promoCode.expiry_date.toISOString()
      });
    });

    it('should return 404 if promo code not found', async () => {
      PromoCodes.findByPk.mockResolvedValue(null);

      const res = await request(app)
        .put('/api/promocodes/1')
        .send({ code: 'PROMO123', discount: 15, expiry_date: new Date(), product_id: 2, category: 'clothing' });

      expect(res.statusCode).toBe(404);
    });

    it('should handle internal server error', async () => {
      PromoCodes.findByPk.mockRejectedValue(new Error('Database error'));

      const res = await request(app)
        .put('/api/promocodes/1')
        .send({ code: 'PROMO123', discount: 15, expiry_date: new Date(), product_id: 2, category: 'clothing' });

      expect(res.statusCode).toBe(500);
    });
  });

  describe('DELETE /api/promocodes/:id', () => {
    it('should delete a promo code successfully', async () => {
      const promoCode = { id: 1, destroy: vi.fn().mockResolvedValue(true) };
      PromoCodes.findByPk.mockResolvedValue(promoCode);

      const res = await request(app)
        .delete('/api/promocodes/1');

      expect(res.statusCode).toBe(204);
    });

    it('should return 404 if promo code not found', async () => {
      PromoCodes.findByPk.mockResolvedValue(null);

      const res = await request(app)
        .delete('/api/promocodes/1');

      expect(res.statusCode).toBe(404);
    });

    it('should handle internal server error', async () => {
      PromoCodes.findByPk.mockRejectedValue(new Error('Database error'));

      const res = await request(app)
        .delete('/api/promocodes/1');

      expect(res.statusCode).toBe(500);
    });
  });

  describe('GET /api/promocodes', () => {
    it('should get all promo codes', async () => {
      const promoCodes = [
        { id: 1, code: 'PROMO123', discount: 10, expiry_date: new Date(), product_id: 1, category: 'electronics' },
        { id: 2, code: 'PROMO456', discount: 15, expiry_date: new Date(), product_id: 2, category: 'clothing' },
      ];
      PromoCodes.findAll.mockResolvedValue(promoCodes);

      const res = await request(app)
        .get('/api/promocodes');

      expect(res.statusCode).toBe(200);
      expect(res.body).toEqual(promoCodes.map(promoCode => ({
        ...promoCode,
        expiry_date: promoCode.expiry_date.toISOString()
      })));
    });

    it('should handle internal server error', async () => {
      PromoCodes.findAll.mockRejectedValue(new Error('Database error'));

      const res = await request(app)
        .get('/api/promocodes');

      expect(res.statusCode).toBe(500);
    });
  });
});
